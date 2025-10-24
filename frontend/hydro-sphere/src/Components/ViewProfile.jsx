import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Droplet, Mail, Phone, User, Calendar, MapPin, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
const ViewProfileDialog = ({ show, onClose, user }) => {
   const { userInfo } = useSelector((state) => state.user);
const { exact } = useSelector((state) => state.loc);
const date = userInfo?.signupDate.split("T")[0];
const navigate = useNavigate();
  const currentUser = user || {
    username: userInfo?.username,
    email: userInfo?.email,
    phoneNumber: userInfo?.phoneNumber,
    joinDate: date,
   
    profileImage: "/profile2.jpg",
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          
          <m.div
           className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

      
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="relative  max-w-3xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              
             
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm z-10"
              >
                <X size={18} />
              </button>


              <div className="relative bg-gradient-to-r from-[#1A60B4] via-cyan-500 to-blue-400 h-40">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
              </div>

           
              <div className="flex flex-col items-center -mt-16 px-8 pb-8 text-center">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  <img
                    src={currentUser.profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>

                <h1 className="mt-4 text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                  <User className="text-blue-600" /> {currentUser.username}
                </h1>

                <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
                  <Mail className="text-blue-500" size={16} /> {currentUser.email}
                </p>

                <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
                  <Phone className="text-blue-500" size={16} /> {currentUser.phoneNumber}
                </p>


                <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
                  <Calendar className="text-blue-500" size={16} /> Joined {currentUser.joinDate}
                </p>

           
                <div className="grid grid-cols-3 gap-4 mt-8 w-full">
                  {[
                    { label: "Total Posts", value: 14 },
                    { label: "Flood Reports", value: 5 },
                    { label: "AI Interactions", value: 32 },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm"
                    >
                      <p className="text-gray-600 text-xs">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-[#1A60B4] mt-1">
                        {stat.value}
                      </h3>
                    </div>
                  ))}
                </div>

           
                <div className="text-left mt-8 w-full">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Droplet className="text-blue-600" /> About Me
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Passionate about environmental sustainability and flood
                    resilience. Working towards smarter flood forecasting using
                    geospatial data and Google Earth Engine. HydroSphere helps
                    visualize and predict floods effectively.
                  </p>
                </div>

           
                <div className="bg-gradient-to-r from-[#1A60B4] via-cyan-500 to-blue-400 text-white w-full mt-10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between">
                  <p className="text-sm text-blue-50">
                    Stay connected and make a difference with HydroSphere 🌧️
                  </p>
                  <button className="mt-3 md:mt-0 bg-white text-[#1A60B4] px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition">
                    <a href="https://earthengine.google.com/" target="_blank">
 Explore Google Earth Engine
                    </a>
                   
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewProfileDialog;
