import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import SideBar from "./SideBar";
import { motion as m } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin,
  Navigation2,
  Filter,
  LocateFixed,
  Loader2,
  Building2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Contacts = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const {latLng} = useSelector((state) => state.location);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("hospital");

 
  useEffect(() => {
    if (!latLng?.lat || !latLng?.lng) return;

    const fetchResources = async () => {
      setLoading(true);
      try {
        const query = `[out:json];node["amenity"="${type}"](around:100000,${latLng?.lat},${latLng?.lng});out;`;
        const res = await axios.get("https://overpass-api.de/api/interpreter", {
          params: { data: query },
        });
        setResources(res.data.elements || []);
      } catch (err) {
        console.error("Overpass API error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [latLng, type]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navigation />

        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-50 to-blue-50">
   
          <m.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8"
          >
            <MapPin className="text-blue-600" />
            Resource Locator
          </m.div>

 
          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Filter className="text-blue-500" size={18} />
              Filter Resources:
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="hospital">🏥 Hospitals</option>
              <option value="police">🚓 Police Stations</option>
              <option value="fire_station">🚒 Fire Stations</option>
              <option value="shelter">🏫 Relief Shelters</option>
            </select>
            <div className="ml-auto flex items-center gap-2 text-gray-500 text-sm">
              <LocateFixed className="text-blue-500" size={18} />
              Your Location:{" "}
              <span className="font-medium text-gray-800">
                {latLng?.lat?.toFixed(3)}, {latLng?.lng?.toFixed(3)}
              </span>
            </div>
          </m.div>

         
          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : latLng ? (
              <MapContainer
                center={[latLng?.lat, latLng?.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "70vh", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

              
                <Marker
                  position={[latLng?.lat, latLng?.lng]}
                  icon={L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                  })}
                >
                  <Popup>You are here</Popup>
                </Marker>

                
                {resources.length > 0 ? (
                  resources.map((res) => (
                    <Marker
                      key={res.id}
                      position={[res.lat, res.lon]}
                      icon={L.icon({
                        iconUrl:
                          type === "hospital"
                            ? "https://cdn-icons-png.flaticon.com/512/2966/2966488.png"
                            : type === "police"
                            ? "https://cdn-icons-png.flaticon.com/512/252/252025.png"
                            : type === "fire_station"
                            ? "https://cdn-icons-png.flaticon.com/512/1022/1022263.png"
                            : "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
                        iconSize: [28, 28],
                      })}
                    >
                      <Popup>
                        <div className="font-semibold text-gray-800">
                          {res.tags.name || "Unnamed Facility"}
                        </div>
                        <div className="text-gray-600 text-sm mb-2 capitalize">
                          Type: {type.replace("_", " ")}
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${res.lat},${res.lon}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline"
                        >
                          <Navigation2 size={14} />
                          Get Directions
                        </a>
                      </Popup>
                    </Marker>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-[70vh] text-gray-500">
                    No {type.replace("_", " ")} found nearby.
                  </div>
                )}
              </MapContainer>
            ) : (
              <div className="text-center text-gray-600 py-20">
                Fetching your location...
              </div>
            )}
          </m.div>

          <m.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Building2 className="text-blue-500" />
              <h2 className="text-lg font-semibold">
                {resources.length} {type.replace("_", " ")} found nearby
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.slice(0, 6).map((res) => (
                <div
                  key={res.id}
                  className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <h3 className="text-gray-800 font-medium text-sm mb-1">
                    {res.tags.name || "Unnamed Facility"}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2 capitalize">
                    Type: {type.replace("_", " ")}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${res.lat},${res.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                  >
                    <Navigation2 size={12} />
                    Directions
                  </a>
                </div>
              ))}
            </div>
          </m.div>

          
          <m.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center text-sm text-gray-500 mt-10"
          >
            🌍 HydroSphere — Empowering Climate Resilience with Smart Data.
          </m.div>
        </main>
      </div>
    </div>
  );
};

export default Contacts;
