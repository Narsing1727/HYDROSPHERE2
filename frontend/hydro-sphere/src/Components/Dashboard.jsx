import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Droplets,
  Satellite,
  AlertTriangle,
  MoreVertical,
  Earth,
} from "lucide-react";
import {
  LayersControl,
  useMap,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { useDispatch } from "react-redux";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import { setLocation } from "../redux/locationSlice";
import { setExact } from "../redux/exactSlice";
import { BASE_URL } from "../../util";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Dashboard = () => {
  const [latLng, setLatLng] = useState(null);
  const [sea, setSea] = useState("—");
  const [grd, setGrd] = useState("—");
  const [loc, setLoc] = useState();
  const [weatherData, setWeatherData] = useState([]);
  const dispatch = useDispatch();
  const [data , setData] = useState();
  const FlyToLocation = ({ latLng }) => {
    const map = useMap();
    useEffect(() => {
      if (latLng) map.flyTo([latLng.lat, latLng.lng], 13, { duration: 2 });
    }, [latLng, map]);
    return null;
  };



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!latLng?.lat || !latLng?.lng) return;
      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat: latLng.lat, lon: latLng.lng, format: "json" },
          headers: {
            "Accept-Language": "en",
            "User-Agent": "HydroSphereDashboard/1.0",
          },
        });
        setLoc(res.data);
      } catch (err) {
        console.error("Reverse geocoding failed:", err.message);
      }
    };
    fetchLocation();
  }, [latLng]);

  
  useEffect(() => {
    if (latLng && loc?.display_name) {
      dispatch(setLocation(latLng));
      dispatch(setExact(loc.display_name));
    }
  }, [latLng, loc, dispatch]);

  useEffect(() => {
    const seaFetch = async () => {
      if (!latLng?.lat || !latLng?.lng) return;
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latLng.lat}&lon=${latLng.lng}&appid=6f3b022e5eedfd83f4813c407d2428c9&units=metric`
        );
        setSea(res.data.main.sea_level ?? "N/A");
        setGrd(res.data.main.grnd_level ?? "N/A");
      } catch (error) {
        console.log("OpenWeather error:", error.message);
      }
    };
    seaFetch();
  }, [latLng]);


  useEffect(() => {
    if (!latLng?.lat || !latLng?.lng) return;

    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latLng.lat}&longitude=${latLng.lng}&hourly=temperature_2m,wind_speed_10m&forecast_days=1&timezone=auto`
        );

        const temps = res.data?.hourly?.temperature_2m || [];
        const winds = res.data?.hourly?.wind_speed_10m || [];
        const times = res.data?.hourly?.time || [];

        if (!temps.length || !winds.length) {
          console.warn("No hourly weather data for", latLng);
          setWeatherData([]);
          return;
        }

        const todayLocal = new Date().getDate();
        const todayData = times
          .map((t, i) => {
            const d = new Date(t);
            if (d.getDate() === todayLocal) {
              return {
                time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                temperature: temps[i],
                wind: winds[i],
              };
            }
            return null;
          })
          .filter(Boolean);

        setWeatherData(todayData);
      } catch (error) {
        console.error("Open-Meteo fetch error:", error.message);
      }
    };

 
    const timeout = setTimeout(fetchWeather, 1500);
    return () => clearTimeout(timeout);
  }, [latLng]);
useEffect(() => {
  const handleFetch = async () => {
       if (!latLng?.lat || !latLng?.lng) return;
    try {
  

      const response = await axios.post(
        `${BASE_URL}/api/v1/hydrosphere/flood-risk`,
        { lat : latLng?.lat, lon : latLng?.lng},
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ API Response:", response.data);
      console.log("response" , response.data);
      
      setData(response.data);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to fetch data. Check backend or CORS.");
    } 
  };
   handleFetch();
} 
 , [latLng])
useEffect(() => {
       console.log();
       
} , [])

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <Navigation onCitySelect={(city) => setLatLng({ lat: city.lat, lng: city.lng })} />

        {/* Stats Cards */}
        <div className="pt-7 pl-4 grid grid-cols-4 gap-6 mb-8">
          {/* Sea & Ground Level */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Sea Level</span>
              <Droplets className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {sea} <span className="text-lg text-gray-500">m</span>
            </div>
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <Earth size={14} className="mr-1" />
              <span>Ground Level {grd}</span>
            </div>
          </div>

          {/* Flood Risk */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Flood Risk Index</span>
              <AlertTriangle className="text-orange-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">72</div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: "72%" }}></div>
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Flood Index</span>
              <AlertTriangle className="text-orange-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{data?.floodRiskIndex}</div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: "72%" }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Satellite Sync</span>
              <Satellite className="text-green-500" size={20} />
            </div>
            <div className="flex items-center mt-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-2xl font-bold text-gray-900">Online</span>
            </div>
          </div>
        </div>

        {/* Graphs and Map */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* 🌡️ Temperature Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Temperature (°C) — Today
                  </h3>
                  <MoreVertical size={16} className="text-gray-400" />
                </div>

                {weatherData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500">No temperature data available.</p>
                )}

                <h1 className="text-2xl font-bold text-center mt-2">
                  {loc?.display_name || "Fetching location..."}
                </h1>
              </div>

              {/* 🗺️ Map */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                {latLng ? (
                  <MapContainer
                    center={[latLng.lat, latLng.lng]}
                    zoom={7}
                    scrollWheelZoom={true}
                    style={{ height: "350px", width: "100%" }}
                  >
                    <LayersControl position="topright">
                      <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                          attribution='&copy; OpenStreetMap contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                      </LayersControl.BaseLayer>

                      <LayersControl.Overlay name="Temperature">
                        <TileLayer
                          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=6f3b022e5eedfd83f4813c407d2428c9`}
                          opacity={0.7}
                          attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                        />
                      </LayersControl.Overlay>
                    </LayersControl>

                    <FlyToLocation latLng={latLng} />

                    <Marker
                      position={[latLng.lat, latLng.lng]}
                      icon={L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                      })}
                    >
                      <Popup>You are here</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <p>Loading map...</p>
                )}
              </div>
            </div>

            {/* 🌬️ Wind Speed Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Wind Speed (m/s) — Today
                </h3>
                <MoreVertical size={16} className="text-gray-400" />
              </div>

              {weatherData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="wind"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No wind data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
