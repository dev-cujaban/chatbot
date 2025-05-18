import axios from 'axios';
import { OpenAI } from 'openai';
import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ChatCompletionTool } from 'openai/resources/chat';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ChatService {
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        private productsService: ProductsService,
    ) {
        // Retrieve the OpenAI API key from .env
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY missing in .env file');
        }
        // Initialize OpenAI client using the API key to make requests to AI
        this.openai = new OpenAI({ apiKey });
    }

    // Define the "tools" (functions) available for the LLM to call.
    // These describe the function and parameters the model can use.
    private tools: ChatCompletionTool[] = [
        {
            type: 'function',  // Indicates this is a callable function tool
            function: {
                name: 'searchProducts',  // Tool name called by the model
                description: 'Search for products by query', // Description for model understanding
                parameters: {
                    type: 'object',   // Parameters are passed as an object
                    properties: {
                        query: { type: 'string', description: 'Search term' }, // The search string
                    },
                    required: ['query'],  // 'query' parameter is required
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'convertCurrencies',
                description: 'Converts currencies',
                parameters: {
                    type: 'object',
                    properties: {
                        amount: { type: 'number' },  // Amount to convert
                        from: { type: 'string' },    // Source currency code
                        to: { type: 'string' },      // Target currency code
                    },
                    required: ['amount', 'from', 'to'], // All parameters required
                },
            },
        },
    ];

    /**
     * Converts currencies using the Open Exchange Rates API.
     * @param amount The numeric amount to convert
     * @param from Source currency code (e.g. 'USD')
     * @param to Target currency code (e.g. 'EUR')
     * @returns A string describing the converted amount
     */
    private async convertCurrencies({
        amount,
        from,
        to,
    }: {
        amount: number;
        from: string;
        to: string;
    }): Promise<string> {
        // Read Open Exchange Rates API key from env variable
        const exchangeId = this.configService.get<string>('OPEN_EXCHANGE_APP_ID');
        if (!exchangeId) {
            throw new Error('OPEN_EXCHANGE_APP_ID missing, please set it in .env file');
        }

        try {
            // Fetch latest exchange rates JSON from Open Exchange Rates API
            const url = `https://openexchangerates.org/api/latest.json?app_id=${exchangeId}`;
            const response = await axios.get(url);
            const rates = response.data.rates;

            // Converts key currency from usd to USD
            const rateFrom = rates[from.toUpperCase()];
            const rateTo = rates[to.toUpperCase()];

            if (!rateFrom || !rateTo) {
                throw new Error(`Invalid currency code(s): ${from}, ${to}`);
            }

            // Convert the amount to USD base and then to target currency
            const amountInUSD = amount / rateFrom;
            const convertedAmount = amountInUSD * rateTo;

            // Return a user-friendly conversion string
            return `${amount} ${from.toUpperCase()} = ${convertedAmount.toFixed(2)} ${to.toUpperCase()}`;
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            throw new Error('Failed to convert currencies');
        }
    }

    /**
     * Main chat function, sends user message to the LLM
     * allowing it to optionally call tools like searchProducts or convertCurrencies.
     * Handles the tool call, executes the corresponding function, and returns the final combined response.
     * @param message The user message string
     * @returns The chat response string
     */
    async chatWithTools(message: string): Promise<string> {
        // Create a chat completion request to OpenAI with tools enabled
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: message }],
            tools: this.tools,
            tool_choice: 'auto', // Let the model decide which tool to call
        });

        // Extract the first message from the model's response
        const messageWithToolCall = response.choices[0].message;

        // Check if the model decided to call a tool function
        if (messageWithToolCall.tool_calls && messageWithToolCall.tool_calls.length > 0) {
            const toolCall = messageWithToolCall.tool_calls[0];
            const { name, arguments: argsJSON } = toolCall.function;
            const args = JSON.parse(argsJSON);

            let result: any;

            // Search products using Products Service and limit to top 2 results
            if (name === 'searchProducts') {
                const products = this.productsService.searchProducts(args.query);
                result = products.slice(0, 2).map((p) => ({
                    title: p.displayTitle,
                    url: p.url,
                    imageUrl: p.imageUrl,
                    price: p.price,
                    discount: p.discount,
                    productType: p.productType,
                }));
            } else if (name === 'convertCurrencies') {
                // Converts currencies
                result = await this.convertCurrencies(args);
            } else {
                result = "I'm sorry, this tool is not implemented.";
            }

            // Send the tool result back to the LLM to generate a final user-facing response
            const finalResponse = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'user', content: message },
                    messageWithToolCall,
                    {
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(result),
                    },
                    {
                        /* Formats the data sent to the user */
                        role: 'system',
                        content: `
                            You are a helpful assistant that can respond to two types of user requests:
                            Product search queries — respond in JSON format.
                            Currency conversion queries — respond in plain text.
                            Instructions:
                            If the request involves searching for products, respond ONLY with a JSON object in the following format:
                            {
                                "explanation": "A brief explanation of the product search result.",
                                "products": 
                                [
                                    {
                                        "title": "Product title",
                                        "url": "Product URL",
                                        "imageUrl": "Product image URL",
                                        "price": "Price with currency",
                                        "discount": "Discount value (if any)",
                                        "productType": "Type of product"
                                    },
                                ...
                                ]
                            }
                            Important rules for product search responses:
                            Do not include any text outside the JSON.
                            Use exact JSON syntax with double quotes.
                            If the request is about currency conversion, respond ONLY with plain text in the format:
                            "100 USD = 92.34 EUR"
                            Important rules for currency conversion responses:
                            Do not add any explanation, context, or extra text.
                            Only output the conversion result as a single sentence.
                            `
                    }
                ],
            });

            return finalResponse.choices[0].message.content ?? "Sorry, I couldn't process your request.";
        }

        // If no tool call was made, check the LLM's direct response
        const directReply = messageWithToolCall.content ?? '';

        // Return a friendly fallback message if the response is empty or unhelpful
        if (!directReply.trim()) {
            return "Sorry, I couldn't understand or process your request with the available tools.";
        }

        // Otherwise, return the model's normal response
        return directReply;
    }
}
