
import React, { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { motion as m, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../util";

const FeedbackDialog = ({ show, onClose }) => {
     const { userInfo } = useSelector((state) => state.user);
 const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState(
{
    message : "",
    username :userInfo?.username  ,
    email : userInfo?.email,
    rating : 0
}

  );
 
const changeHandler = (e) => {
    e.preventDefault();
    setFeedback({...feedback , [e.target.name] : e.target.value});
}

  const submitFeedback = async () => {
    if (!feedback.message.trim()) {
      toast.error("Please write some feedback first!");
      return;
    }
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/hydrosphere/feedback/send-feedback` , {...feedback , rating});
        if(res.data.success){
            console.log(feedback);
            
            toast.success("Feedback sent successfully");
            onClose();
        }
    } catch (error) {
        console.log(error);
        
    }
 
  };



  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {show && (
        <m.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40"

        >
          <div className="bg-white w-[90%] sm:w-[45%] rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">💬 Feedback</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Your Feedback
                </label>
                <textarea
                  rows="4"
                  name = "message"
                  onChange={changeHandler}
                  placeholder="Write your feedback here..."
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <button
                onClick={submitFeedback}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={16} /> Submit
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );

};
export default FeedbackDialog;
