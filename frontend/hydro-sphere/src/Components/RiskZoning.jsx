import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import Background from "./BackGround";
import { motion as m } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { CloudRain, Calendar, MapPin, Droplet } from "lucide-react";
import { useSelector } from "react-redux";
import Data from "./Data";
import ViewInGEE from "./ViewInGEE";

const RiskZoning = () => {
  const mapRef = useRef(null);
  const overlayRef = useRef(null);

  const { latLng } = useSelector((state) => state.location);
  const latitude = latLng?.lat || 30.3;
  const longitude = latLng?.lng || 79.1;

  const [loading, setLoading] = useState(false);
  const [tileUrl, setTileUrl] = useState(null);
  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-08-16");
  const [overlayOpacity, setOverlayOpacity] = useState(0.7); 

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };


  const fetchMap = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/hydrosphere/risk/zoning",
        {
          lat: latitude,
          lon: longitude,
          startDate,
          endDate,
        }
      );

      const { tileUrl } = res.data;
      if (!tileUrl) throw new Error("No tile URL received");

    
      if (mapRef.current) mapRef.current.remove();

     
      const map = L.map("riskMap").setView([latitude, longitude], 9);
      mapRef.current = map;

     
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

     
      const eeOverlay = L.tileLayer(tileUrl, {
        attribution: "Hydrosphere | Earth Engine",
        maxZoom: 13,
        opacity: overlayOpacity, 
      }).addTo(map);

      overlayRef.current = eeOverlay;

    
      L.circleMarker([latitude, longitude], {
        radius: 6,
        color: "#00ffcc",
        weight: 2,
        fillColor: "#00ffcc",
        fillOpacity: 0.8,
      })
        .bindTooltip("ROI Center", { permanent: false })
        .addTo(map);

      setTileUrl(tileUrl);
    } catch (err) {
      console.error("Error loading map:", err);
      alert("Failed to load risk zoning map. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setOpacity(overlayOpacity);
    }
  }, [overlayOpacity]);

  useEffect(() => {
    fetchMap();
  }, []);

  return (
    <Background from="#e9f3ff" via="#f9fbff" to="#d7e8ff">
      <div className="flex h-screen font-sans">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />

          <main className="flex-1 overflow-y-auto p-8">
           
            <m.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-6"
            >
              <CloudRain className="text-blue-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-gray-800">
                Dynamic Flood Risk Zoning
              </h1>
            </m.div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-500" />
                <label className="font-medium text-gray-700">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded-md"
                />
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-blue-500" />
                <label className="font-medium text-gray-700">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded-md"
                />
              </div>

              <button
                onClick={fetchMap}
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 transition-all"
              >
                {loading ? "Loading..." : "Update Map"}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Droplet className="text-blue-500" />
                <label className="font-medium text-gray-700">
                  Overlay Opacity:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) =>
                    setOverlayOpacity(parseFloat(e.target.value))
                  }
                  className="w-44"
                />
                <span className="text-gray-600 text-sm font-medium">
                  {Math.round(overlayOpacity * 100)}%
                </span>
              </div>
            </div>

           
            <div
              id="riskMap"
              className="rounded-2xl shadow-lg border border-gray-200"
              style={{ height: "70vh", width: "100%" }}
            ></div>

         
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-3 text-gray-700">
              <MapPin className="text-green-500" />
              <span>
                Showing flood-risk overlay for region near{" "}
                <strong>
                  {latitude.toFixed(2)}, {longitude.toFixed(2)}
                </strong>{" "}
                from <strong>{startDate}</strong> to <strong>{endDate}</strong>.
              </span>
            </div>

            <Data startDate={startDate} endDate={endDate} />
            <ViewInGEE latitude={latitude} longitude={longitude} />

          </main>
        </div>
      </div>
    </Background>
  );
};

export default RiskZoning;
