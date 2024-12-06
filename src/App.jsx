import { useState, useRef, useEffect } from "react";
import { Bot, Minus, X, Send, Check } from "lucide-react";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInitialState, setShowInitialState] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState(""); // For storing session ID
  const messagesEndRef = useRef(null);

  const initialQuestions = [
    "How we can get access to InfusionBall Membership?",
    "What are the benefits of InfusionBall Membership?",
    "How much does InfusionBall Membership cost?",
  ];

  useEffect(() => {
    // Generate a unique session ID on component mount
    const generateSessionId = () =>
      `session_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(generateSessionId());
  }, []);

  function formatTime(date) {
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toLowerCase();
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleSendMessage = async (text) => {
  //   setShowInitialState(false);

  //   const newUserMessage = {
  //     text,
  //     isUser: true,
  //     timestamp: formatTime(new Date()),
  //   };

  //   setMessages((prev) => [...prev, newUserMessage]);

  //   try {
  //     // API call
  //     const response = await fetch(
  //       "https://pharmacybali-medical-chatbot-937077168251.asia-south1.run.app/v1/ask",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           query: text,
  //           session_id: sessionId,
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("API Response:", data); // Log the response

  //     if (response.ok) {
  //       const botResponse = {
  //         text: data.response || "No response from the bot.",
  //         isUser: false,
  //         timestamp: formatTime(new Date()),
  //       };
  //       setMessages((prev) => [...prev, botResponse]);
  //     } else {
  //       throw new Error(data.message || "Something went wrong");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     const errorResponse = {
  //       text: "Something went wrong. Please try again later.",
  //       isUser: false,
  //       timestamp: formatTime(new Date()),
  //     };
  //     setMessages((prev) => [...prev, errorResponse]);
  //   }
  // };

  const handleSendMessage = async (text) => {
    setShowInitialState(false);

    const newUserMessage = {
      text,
      isUser: true,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch(
        "https://pharmacybali-medical-chatbot-937077168251.asia-south1.run.app/v1/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: text,
            session_id: sessionId,
            stream: true, // Include stream as required by the API
          }),
        }
      );

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("API Response:", data); // Log the response

      if (response.ok) {
        const botResponse = {
          text:
            typeof data === "string"
              ? data
              : data.response || "No response from the bot.",
          isUser: false,
          timestamp: formatTime(new Date()),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.message);
      const errorResponse = {
        text: "Something went wrong. Please try again later.",
        isUser: false,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-appGreen text-white p-4 rounded-full shadow-lg hover:bg-appGreen transition-all"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed right-4 transition-all duration-300 shadow-xl rounded-lg w-80 ${
        false ? "bottom-4 h-14" : "bottom-10 h-[80vh]"
      }`}
    >
      {/* Header */}
      <div className="bg-appGreen text-white px-4 py-6 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span className="font-medium">ChatBot</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-appGreen p-1 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {isOpen && (
        <div className="bg-[#E7F4F3] rounded-b-lg h-[calc(100%-3.5rem)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {showInitialState ? (
              <>
                <h2 className="text-3xl w-[80%] mx-auto font-semibold text-center mb-8 mt-4">
                  How can we help you today?
                </h2>
                <div className="space-y-2">
                  {initialQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="w-full px-4 py-3 text-sm text-left text-[#374151] bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.isUser ? (
                    <div className="flex flex-col items-end w-[80%]">
                      <div className="p-3 rounded-lg bg-[#00BCBD] text-white">
                        <p className="whitespace-pre-line text-sm">
                          {message.text}
                        </p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Check className="w-3 h-3 mr-1" />
                        {message.timestamp}
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-appGreen flex items-center justify-center text-white mr-2">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="max-w-[80%]">
                        <div className="p-3 rounded-lg bg-white text-gray-800 shadow-sm">
                          <p className="whitespace-pre-line text-sm text-[#374151]">
                            {message.text}
                          </p>
                        </div>
                        {/* <div className="text-xs mt-1 text-gray-500">
                          {message.timestamp}
                        </div> */}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-[#F2FBFB]">
            <div className="px-2 rounded-lg flex gap-2 bg-white">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 p-2 rounded-lg focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputMessage.trim()) {
                    handleSendMessage(inputMessage);
                    setInputMessage("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (inputMessage.trim()) {
                    handleSendMessage(inputMessage);
                    setInputMessage("");
                  }
                }}
                className="p-2 bg-appGreen text-white rounded-lg hover:bg-appGreen transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
