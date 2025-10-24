import React, { useEffect, useRef } from "react";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import Background from "./BackGround";
import { motion as m } from "framer-motion";
import gsap from "gsap";
  import axios from "axios";
import {
  Cloud,
  Thermometer,
  Droplet,
  Wind,
  Gauge,
  SunMedium,
  Eye,
  CloudRain,
  CloudSnow,
  CloudSunIcon,
  Locate,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useSelector } from "react-redux";

const Weather = () => {
  const [weather , setWeather] = useState();
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };



const [tempData , setTempData] = useState();
  const [humidityData , setHumidityData] = useState();
const [windData, setWindData] = useState([]);
const {latLng} = useSelector((state) => state.location);
const latitude = latLng?.lat;
const longitude = latLng?.lng;

  const headerRef = useRef(null);
  
useEffect(() => {
  const weatherHandler  = async () => {
    const API_KEY = "6f3b022e5eedfd83f4813c407d2428c9";
    try {
      const lat = latitude;
      const lon = longitude;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      console.log(res.data)
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  weatherHandler();   
}, []);                
useEffect(() => {
  const lat = latitude;
  const lon = longitude;
  const today = new Date().toISOString().split("T")[0];

  const fetchHourlyWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&timezone=auto&start_date=${today}&end_date=${today}`
      );

      const hours = response.data.hourly.time;
      const temps = response.data.hourly.temperature_2m;
      const humidity = response.data.hourly.relative_humidity_2m;

      const formattedTemp = hours.map((t, i) => ({
        time: new Date(t).getHours() + ":00",
        temp: temps[i],
      }));

      const formattedHumidity = hours.map((t, i) => ({
        time: new Date(t).getHours() + ":00",
        humidity: humidity[i],
      }));

      setTempData(formattedTemp);
      setHumidityData(formattedHumidity);

      console.log("Temperature Data:", formattedTemp);
      console.log("Humidity Data:", formattedHumidity);
    } catch (error) {
      console.error("Open-Meteo API error (temp/humidity):", error);
    }
  };

  const fetchLiveWind = async () => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&timezone=auto`
      );

      const speed = res.data.current.wind_speed_10m;
      const dir = res.data.current.wind_direction_10m;
   const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const directionText = directions[Math.round(dir / 45) % 8];

 
    const newWind = {
      time: new Date().toLocaleTimeString().slice(0, 8),
      speed: speed,
      direction: directionText,
    };


    setWindData(prev => [...prev.slice(-19), newWind]);

    console.log("Wind Data:", newWind);

    
    } catch (err) {
      console.error("Open-Meteo wind fetch error:", err);
    }
  };

 
  fetchHourlyWeather();
  fetchLiveWind();


  const interval = setInterval(fetchLiveWind, 2000);

  return () => clearInterval(interval); 
}, []);

  return (
    <Background
      from="#e9f3ff"
      via="#f9fbff"
      to="#d7e8ff"
      glow1="bg-blue-200"
      glow2="bg-cyan-200"
    >
      <div className="flex h-screen font-sans">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />

          <main className="flex-1 overflow-y-auto p-8">
          
         
      
              <Cloud className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-10">
                
                Weather Overview
                </h1>
           

         
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { icon: <Thermometer />, label: "Temperature", value: weather?.main?.temp },
                { icon: <Droplet />, label: "Humidity", value: weather?.main?.humidity },
                { icon: <Wind />, label: "Wind Speed", value: weather?.wind?.speed },
                { icon: <Gauge />, label: "Pressure", value : `${weather?.main?.pressure}Pa`},
                { icon: <Eye />, label: "Visibility", value: `${weather?.visibility}m` },
                { icon: <Locate />, label: "Your Location", value: weather?.name},
                { icon: <CloudSunIcon />, label: "Weather", value: weather?.weather[0]?.description},
              ].map((item, i) => (
                <m.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition-all"
                >
                  <div className="text-blue-600 mb-2">{item.icon}</div>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.value}
                  </h3>
                </m.div>
              ))}
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Thermometer className="text-blue-500" />
                  Temperature Trend (°C)
                </h2>
                <div className="h-72">
                  <ResponsiveContainer>
                    <LineChart data={tempData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#3b82f6"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </m.div>

              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Droplet className="text-cyan-500" />
                  Humidity Variation (%)
                </h2>
                <div className="h-72">
                  <ResponsiveContainer>
                    <AreaChart data={humidityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="humidity"
                        stroke="#06b6d4"
                        fill="#a5f3fc"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </m.div>

              <m.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 col-span-1 lg:col-span-2"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Wind className="text-blue-500" />
                  Wind Speed Per 2 Sec
                </h2>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="80%" height="100%">
                    <AreaChart data={windData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="speed"
                        stroke="#2563eb"
                        fill="#bfdbfe"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </m.div>
            </div>

        
            <m.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-14 bg-blue-600 text-white rounded-xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Real-time Weather Tracking
                </h2>
                <p className="text-sm text-blue-100 max-w-xl">
                  Monitor temperature, humidity, wind speed, and rainfall with
                  precision. Hoster - OpenMeteo API — powered by
                  HydroSphere AI.
                </p>
              </div>

              <button className="mt-5 md:mt-0 bg-white text-blue-600 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transition-all">
                <a href="https://open-meteo.com/" target="_blank">
    Learn More
                </a>
            
              </button>
            </m.section>
          </main>
        </div>
      
      </div>
    </Background>
  );
};

export default Weather;
