import React from "react";
import { motion as m } from "framer-motion";



const Background = ({
  children,
  from = "#e9f3ff", 
  via = "#f9fbff", 
  to = "#d7e8ff", 
  glow1 = "bg-blue-200",
  glow2 = "bg-cyan-200",
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className={`absolute inset-0 bg-gradient-to-b from-[${from}] via-[${via}] to-[${to}]`}
      />

      {/* Floating glowing blur orbs */}
      <div
        className={`absolute -top-20 -left-20 w-72 h-72 ${glow1} rounded-full blur-3xl opacity-30 animate-pulse`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-96 h-96 ${glow2} rounded-full blur-3xl opacity-25 animate-pulse`}
      ></div>

      {/* Main Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
