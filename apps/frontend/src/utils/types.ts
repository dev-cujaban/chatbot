export type Product = {
  title: string;
  url: string;
  imageUrl: string;
  price: string;
  discount?: string;
  productType: string;
};

export type BotMessageContent = {
  explanation: string;
  products: Product[];
};

export type Message = {
  text: string;
  sender: "user" | "bot";
  parsedContent?: BotMessageContent | null;
};
