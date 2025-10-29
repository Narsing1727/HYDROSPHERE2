import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { motion as m, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { BASE_URL } from "../../util";

const SettingsDialog = ({ show, onClose, refreshUser }) => {
  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };
  const token = localStorage.getItem("token");

const {userInfo} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: userInfo?.username || "",
    email: userInfo?.email || "",
    phoneNumber: userInfo?.phoneNumber || "",
  });

  const [loading, setLoading] = useState(false);
const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
     
      const payload = {
        nUsername: formData.username,
        nEmail: formData.email,
        nPhoneNumber: formData.phoneNumber,
      };

   
    const res = await axios.put(
  `${BASE_URL}/api/v1/hydrosphere/auth/update`,
  payload,
 
  
);

      if (res.data.success) {
      dispatch(setUser(res.data.user));

        console.log(res.data);
        
        toast.success("Profile updated successfully!");
        refreshUser?.(); 
        onClose();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
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
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40"
        >
          <div className="bg-white w-[90%] sm:w-[45%] rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                👤 Update Profile
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 w-full flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : "Save Changes"}
                {!loading && <Send size={16} />}
              </button>
            </form>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsDialog;
