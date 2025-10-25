import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Pdf from "./Pdf"; 

const PdfDialog = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
         
          <m.div
            className="fixed  inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

        
          <m.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed z-50  right-6 bottom-6 md:right-100 md:bottom-19 w-[90%] md:w-[50%] lg:w-[50%] h-[70%] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-3 border-b bg-blue-600 text-white ">
              <h2 className="font-semibold text-lg">Download Hydro Report</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-full p-4 bg-gradient-to-b from-blue-50 to-cyan-50">
              <Pdf />
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PdfDialog;
