import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { X, Mail, ShieldCheck, ScrollText, Users } from "lucide-react";

const LearnMoreDialog = ({ show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
        
          <m.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></m.div>

        
          <m.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200 rounded-2xl w-[90%] sm:w-[600px] p-8 relative overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={22} />
              </button>

              <div className="text-center mb-6">
                <m.h2
                  className="text-2xl font-bold text-blue-800 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  About <span className="text-cyan-500">HydroSphere</span>
                </m.h2>
                <p className="text-gray-600 text-sm">
                  Empowering smarter, safer, and sustainable water management.
                </p>
              </div>

          
              <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
               
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100 shadow-sm">
                  <Users className="text-blue-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-700">
                      Hosted By:
                    </h3>
                    <p>IIT ROORKEE STUDENTS</p>
                  </div>
                </div>

          
                <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border border-cyan-100 shadow-sm">
                  <Mail className="text-cyan-500" size={20} />
                  <div>
                    <h3 className="font-semibold text-cyan-700">
                      Business Contact:
                    </h3>
                    <p className="text-gray-600">
                      newtongaming36@gmail.com
                    </p>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100 shadow-sm">
                  <ShieldCheck className="text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-700">
                      Privacy Policy:
                    </h3>
                    <p>
                      HydroSphere values your privacy. We only collect necessary
                      environmental data and user analytics to improve flood risk
                      predictions. Your information is never shared with third
                      parties without consent.
                    </p>
                  </div>
                </div>

           
                <div className="flex items-start gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border border-cyan-100 shadow-sm">
                  <ScrollText className="text-cyan-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-cyan-700">
                      Terms & Conditions:
                    </h3>
                    <p>
                      By using HydroSphere, you agree to use this platform solely
                      for educational and predictive purposes. HydroSphere is not
                      liable for natural events or external data inaccuracies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 shadow-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LearnMoreDialog;
