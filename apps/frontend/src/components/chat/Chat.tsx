import { useEffect, useRef, useState } from "react";
import { Loader, MessageCircle, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import ChatMessage from "./ChatMessage";
import { tryParseBotMessage } from "../../utils/parseBotMessage";
import type { Message } from "../../utils/types";
import axiosClient from "../../utils/axiosClient";

export default function Chat() {
  const { t } = useTranslation(); // Translation hook
  const [isOpen, setIsOpen] = useState(false); // State to toggle chat window visibility
  const [messages, setMessages] = useState<Message[]>([]); // State to store the list of chat messages (user and bot)
  const [input, setInput] = useState(""); // Controlled input state for the chat text input field
  const [cooldown, setCooldown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to the bottom of the messages container for auto-scrolling

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message to the bot
  const sendMessage = async () => {
    if (cooldown) return;
    if (input.trim() === "") return; // Do nothing if input is empty or only whitespace

    setCooldown(true);
    // Add the user's message to the chat messages state
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    const messageToSend = input;
    setInput(""); // Save the message text and clear the input box

    try {
      // Send the message to the server via POST request
      const axiosResponse = await axiosClient.post<{ response: string }>(
        "/chat",
        { message: messageToSend },
      );

      // Extract the bot's reply text from the response
      const replyText = axiosResponse.response;
      // Attempt to parse bot message JSON content, if any
      const parsedContent = tryParseBotMessage(replyText);

      // Add the bot's reply to the chat messages state, including parsed content
      setMessages((prev) => [
        ...prev,
        { text: replyText, sender: "bot", parsedContent },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    // Disable sending messages for 10 seconds
    setTimeout(() => {
      setCooldown(false);
    }, 3000);
  };

  return (
    <div className="dark:bg-black">
      {/* Chat window - only rendered if isOpen is true */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 m-0 w-screen bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between h-[65vh]
          md:m-6 md:w-96 dark:bg-black border border-gray-400 dark:border dark:border-white z-20"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold dark:text-white">Chatbot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="dark:text-white cursor-pointer"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mb-2 border-t dark:border-t-white pt-2 relative">
            {messages.length === 0 && (
              <p className="absolute bottom-2 w-xs left-1/2 -translate-x-1/2 text-xs text-gray-400 text-center">
                ⚠️ {t("chat_memory_warning")}
              </p>
            )}
            <div className="flex flex-col space-y-2">
              {/* Render each message using ChatMessage component */}
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-md p-2 bg-transparent dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t("placeholder_input_msg")}
              maxLength={150}
            />
            <button
              onClick={sendMessage}
              disabled={cooldown}
              className={`flex justify-center items-center bg-blue-500 text-white p-2 rounded-md ${
                cooldown ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {cooldown ? (
                <Loader className="animate-spin text-gray-300" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="hover-animate text-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border rounded-sm p-2 hover-animate hover:text-blue-500 inline-flex justify-center items-center dark:text-white cursor-pointer"
        >
          <MessageCircle />
          <span className="font-bold ml-5">Chatbot</span>
        </button>
      </div>
    </div>
  );
}
