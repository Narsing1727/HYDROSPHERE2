import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-100 via-white to-sky-200 relative overflow-hidden">
     
      <motion.div
        className="absolute w-[500px] h-[500px] bg-cyan-300 rounded-full blur-3xl opacity-40"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

    
      <motion.img
        src="/logo3.png"
        alt="HydroSphere Logo"
        className="h-50 drop-shadow-[0_0_35px_rgba(56,189,248,0.6)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      
      <motion.h1
        className="text-4xl font-bold text-blue-800 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Hydro<span className="text-cyan-500">Sphere</span>
      </motion.h1>

     
      <motion.div
        className="mt-8 w-20 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.7)]"
        animate={{
          width: ["2rem", "6rem", "2rem"],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Loader;
