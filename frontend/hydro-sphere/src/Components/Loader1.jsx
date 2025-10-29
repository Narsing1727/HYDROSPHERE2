import React from "react";
import { motion } from "framer-motion";

const Loader1 = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-[9999]">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1.2,
        }}
        className="relative w-16 h-16 border-[4px] border-t-transparent border-cyan-500 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.5)]"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.8, 1, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 blur-[2px]"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default Loader1;
