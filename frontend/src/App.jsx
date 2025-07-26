// File: frontend/src/App.jsx
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input
      });
      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong." }]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">E-commerce Chatbot</h1>
        <div className="h-96 overflow-y-auto space-y-2 mb-4 border p-2 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-100 self-end ml-auto"
                  : "bg-gray-200 self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
