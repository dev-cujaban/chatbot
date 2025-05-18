import type { BotMessageContent } from "./types";

/**
 * Attempts to parse a JSON string as a bot message.
 * If the string is valid JSON and matches the BotMessageContent shape,
 * it returns the parsed object. Otherwise, it returns null.
 *
 * @param text - The raw text string to parse (typically from the bot).
 * @returns A BotMessageContent object if valid, or null if parsing fails or structure is invalid.
 */
export function tryParseBotMessage(text: string): BotMessageContent | null {
  try {
    // Attempt to parse the JSON string into a JavaScript object
    const parsed = JSON.parse(text);
    // Check that the parsed object has the expected structure
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "explanation" in parsed &&
      Array.isArray(parsed.products) // "products" must be an array
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse bot message:", error);
  }

  // Return null if the structure is invalid or parsing fails
  return null;
}
