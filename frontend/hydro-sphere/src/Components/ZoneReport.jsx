import React, { useEffect, useState, useRef } from "react";
import Navigation from "./Navigation";
import SideBar from "./SideBar";
import Background from "./BackGround";
import { motion as m } from "framer-motion";
import { Download, CloudRain, Sun, Cloud, Waves } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Pdf from "./Pdf"; 
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ZoneReport = () => {
  const reportRef = useRef(null);
  const pdfRef = useRef(null); 
  const [rainfallData, setRainfallData] = useState([]);
  const [solarData, setSolarData] = useState([]);
  const [cloudData, setCloudData] = useState([]);
const {latLng} = useSelector((state) => state.location)
  const latitude = latLng?.lat;
  const longitude = latLng?.lng;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];

        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum,shortwave_radiation_sum,cloud_cover_mean&timezone=Asia/Kolkata`;

        const res = await axios.get(url);
        const daily = res.data.daily;

        if (!daily || !daily.time) {
          toast.error("No climate data found for this location.");
          return;
        }

        setRainfallData(
          daily.time.map((date, i) => ({
            date,
            rainfall: daily.precipitation_sum[i],
          }))
        );
        setSolarData(
          daily.time.map((date, i) => ({
            date,
            solar: daily.shortwave_radiation_sum[i],
          }))
        );
        setCloudData(
          daily.time.map((date, i) => ({
            date,
            cloud: daily.cloud_cover_mean[i],
          }))
        );
      } catch (error) {
        console.error("Error fetching climate data:", error);
        toast.error("Failed to fetch climate data");
      }
    };

    fetchWeatherData();
  }, []);

  // ✅ Handle download by calling the Pdf component's method
  const handleDownloadPDF = () => {
    if (pdfRef.current && pdfRef.current.downloadPDF) {
      pdfRef.current.downloadPDF();
    } else {
      toast.error("PDF generator not ready yet.");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Background from="#e9f3ff" via="#f9fbff" to="#d7e8ff">
      <div className="flex h-screen font-sans">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />

          <main className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Header */}
            <m.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Waves className="text-blue-600" />
                Zone Risk Assessment Report
              </h1>

              <button
                onClick={handleDownloadPDF} // ✅ now triggers Pdf.jsx
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                <Download size={18} /> Download Report
              </button>
            </m.div>

            {/* 🌍 Climate Graph Section */}
            <div
              ref={reportRef}
              className="bg-white rounded-xl p-8 space-y-8 w-full max-w-5xl mx-auto border border-gray-100"
            >
              {/* 🌧️ Rainfall */}
              <section>
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <CloudRain className="text-blue-500" /> Rainfall Analysis (mm)
                </h2>
                <div className="w-full h-64 bg-white p-3 rounded-lg">
                  {rainfallData.length > 0 ? (
                    <ResponsiveContainer>
                      <AreaChart data={rainfallData}>
                        <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="rainfall"
                          stroke="#2563eb"
                          fill="#93c5fd"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500">
                      Loading rainfall data...
                    </p>
                  )}
                </div>
              </section>

              {/* ☀️ Solar Radiation */}
              <section>
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <Sun className="text-yellow-500" /> Solar Radiation (MJ/m²)
                </h2>
                <div className="w-full h-64 bg-white p-3 rounded-lg">
                  {solarData.length > 0 ? (
                    <ResponsiveContainer>
                      <AreaChart data={solarData}>
                        <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="solar"
                          stroke="#fbbf24"
                          fill="#fde68a"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500">
                      Loading solar radiation data...
                    </p>
                  )}
                </div>
              </section>

              {/* ☁️ Cloud Cover */}
              <section>
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                  <Cloud className="text-gray-500" /> Cloud Cover (%)
                </h2>
                <div className="w-full h-64 bg-white p-3 rounded-lg">
                  {cloudData.length > 0 ? (
                    <ResponsiveContainer>
                      <AreaChart data={cloudData}>
                        <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="cloud"
                          stroke="#9ca3af"
                          fill="#e5e7eb"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-500">
                      Loading cloud cover data...
                    </p>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* ✅ Hidden Pdf component for download */}
      <Pdf ref={pdfRef} />
    </Background>
  );
};

export default ZoneReport;
