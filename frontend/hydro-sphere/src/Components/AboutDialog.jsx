import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

const AboutDialog = ({ show, onClose }) => {
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

          {/* Dialog box */}
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <Info className="text-blue-600" /> About HydroSphere
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

            
              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                
                <section>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    🌊 What is HydroSphere?
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    HydroSphere is a geospatial flood analysis dashboard that
                    integrates rainfall, water level, and satellite data for
                    flood risk monitoring and prediction. It leverages the power
                    of <span className="font-medium">Google Earth Engine (GEE)</span> 
                    for real-time geospatial computation and visualization.
                  </p>
                </section>

               
                <section>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    🧠 Methodology Used
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    The methodology follows a multi-parametric model combining
                    rainfall intensity, slope, drainage density, soil moisture,
                    and land use data derived from Sentinel-1 SAR and DEM. 
                    NDWI and MNDWI indices are computed in GEE to identify flood-prone areas, 
                    which are then cross-referenced with rainfall statistics and river gauge data.
                  </p>
                </section>

                {/* Privacy Policy */}
                <section>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    🔒 Privacy & Terms
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    HydroSphere respects your privacy and ensures your data is 
                    used solely for analytical and educational purposes. 
                    We do not share, sell, or store personal or location data 
                    beyond what is necessary for flood risk visualization.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm mt-2">
                    By using HydroSphere, you agree to utilize the platform 
                    responsibly for environmental awareness and disaster 
                    preparedness.
                  </p>
                </section>

                {/* GEE Section */}
                <section>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    🌍 Google Earth Engine (GEE)
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    HydroSphere’s backend computations are powered by GEE.
                    Here are the key scripts used in flood monitoring:
                  </p>

                  {/* GEE dropdowns */}
                  <details className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <summary className="cursor-pointer text-blue-600 font-medium">
                      🌧️ Rainfall Data Analysis
                    </summary>
                    <div className="mt-2 text-sm text-gray-600">
                      <a
                        href="https://code.earthengine.google.com/?scriptPath=users/example/rainfall_monitor"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View GEE Script ↗
                      </a>
                    </div>
                  </details>

                  <details className="bg-gray-50 rounded-xl border border-gray-200 p-4 mt-3">
                    <summary className="cursor-pointer text-blue-600 font-medium">
                      🛰️ Flood Mapping (Sentinel-1 SAR)
                    </summary>
                    <div className="mt-2 text-sm text-gray-600">
                      <a
                        href="https://code.earthengine.google.com/?scriptPath=users/example/flood_mapping"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View GEE Script ↗
                      </a>
                    </div>
                  </details>

                  <details className="bg-gray-50 rounded-xl border border-gray-200 p-4 mt-3">
                    <summary className="cursor-pointer text-blue-600 font-medium">
                      🗺️ Flood Risk Index Visualization
                    </summary>
                    <div className="mt-2 text-sm text-gray-600">
                      <a
                        href="https://code.earthengine.google.com/?scriptPath=users/example/flood_risk_index"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View GEE Script ↗
                      </a>
                    </div>
                  </details>
                </section>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AboutDialog;
