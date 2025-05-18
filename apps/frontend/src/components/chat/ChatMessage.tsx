import type { Message } from "../../utils/types";
import ProductList from "./ProductList";

/**
 * A component that renders a single chat message.
 * Handles different rendering based on whether the sender is the bot or the user.
 *
 * @param msg - The message object to render (either from the user or the bot).
 */
export default function ChatMessage({ msg }: { msg: Message }) {
  // If the message is from the bot and contains structured content
  if (msg.sender === "bot" && msg.parsedContent) {
    const { explanation, products } = msg.parsedContent;
    return (
      <div className="bg-gray-100 dark:bg-gray-700 dark:text-white p-4 rounded-md max-w-full self-start">
        {/* Explanation text from the bot */}
        <p className="mb-4">{explanation}</p>

        {/* List of recommended products, if present */}
        <ProductList products={products} />
      </div>
    );
  }

  // Default rendering for plain user or bot messages
  return (
    <div
      className={`p-2 rounded-md overflow-x-hidden max-w-[80%] ${
        msg.sender === "user"
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-100 dark:bg-gray-700 self-start dark:text-white"
      }`}
      style={{
        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
      }}
    >
      {msg.text}
    </div>
  );
}
