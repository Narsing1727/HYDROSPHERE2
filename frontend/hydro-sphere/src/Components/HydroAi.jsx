import React, { useState, useRef, useEffect } from "react";
import { X, Send, Droplet } from "lucide-react";
import { motion as m, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../util";

const HydroAi = ({ show, onClose }) => {
  const {userInfo} = useSelector((state) => state.user);
  const {latLng} = useSelector((state) => state.location);
  const {exact} = useSelector((state) => state.loc);
  const aiLoc = {
    lat : latLng?.lat,
    lng : latLng?.lng,
    name : exact
  }
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `💧 Hello!  ${userInfo?.username} ,  I'm Hydro AI. I can help you analyze rainfall, predict floods, or suggest water safety tips. How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      
      const res = await axios.post(
        `${BASE_URL}/api/v1/hydrosphere/ai/chat`,
        { message: input ,
          location : aiLoc
        },
        { withCredentials: true }
      );

      const aiReply =
        res.data?.reply ||
        "I'm having trouble accessing the model. Please try again later.";

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("AI request failed:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Unable to connect to Hydro AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <m.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-50  flex items-center justify-center backdrop-blur-md bg-white/30"
        >
          <div className="bg-white w-[90%] sm:w-[45%] md:w-[40%] rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col max-h-[80vh]">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Droplet className="text-cyan-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Hydro AI Assistant
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

        
            <div className="flex-1 overflow-y-auto mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex mb-3 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 max-w-[80%] rounded-2xl text-sm shadow-sm ${
                      m.sender === "user"
                        ? "bg-cyan-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center border-t border-gray-200 pt-3 gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  loading
                    ? "Hydro AI is thinking..."
                    : "Ask Hydro AI about rainfall, floods..."
                }
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                <Send size={16} />
                {!loading && <span>Send</span>}
              </button>
            </form>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default HydroAi;
