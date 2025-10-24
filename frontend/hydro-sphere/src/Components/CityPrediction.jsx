import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import {
  Droplet,
  MapPin,
  Activity,
  AlertTriangle,
  CloudRain,
} from "lucide-react";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import Background from "./BackGround";
import axios from "axios";

const CityPrediction = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [formData, setFormData] = useState({
    elevation: "",
    slope: "",
    rainfall: "",
    dist_river: "",
    NDVI: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/hydrosphere/rudraPrayag"
        );
        setVillages(res.data);
      } catch (err) {
        console.error("Error fetching villages:", err);
      }
    };
    fetchVillages();
  }, []);

  const handleVillageSelect = async (e) => {
    const selected = villages.find((v) => v.name === e.target.value);
    setSelectedVillage(selected?.name || "");

    if (selected) {
      try {
        setFetching(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/hydrosphere/fetch?lat=${selected.lat}&lon=${selected.lon}`
        );
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setFetching(false);
      }
    }
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/hydrosphere/prediction",
        formData
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (prob) => {
    if (prob < 0.3) return "text-green-600";
    if (prob < 0.7) return "text-yellow-500";
    return "text-red-600";
  };

  const getRiskLabel = (prob) => {
    if (prob < 0.3) return "Safe";
    if (prob < 0.7) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <Background
      from="#eaf5ff"
      via="#f9fcff"
      to="#cfe3ff"
      glow1="bg-blue-300"
      glow2="bg-cyan-300"
    >
      <div className="flex h-screen font-sans">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-y-auto p-8 relative space-y-10">
            {/* HEADER */}
            <div className="flex items-center gap-3 text-2xl font-semibold text-blue-700">
              <Droplet className="text-blue-600" />
              Flood Susceptibility Prediction
            </div>

            <m.div
              variants={fadeUp}
              initial="visible"
              animate="visible"
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200 max-w-3xl mx-auto"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <MapPin className="text-blue-500" /> Select Village / Town (Currently We Have Only Rudraprayag Data)
              </h3>

              <select
                onChange={handleVillageSelect}
                className="w-full border rounded-lg p-2 mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">-- Select location in Rudraprayag --</option>
                {villages.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>

              {fetching ? (
                <p className="text-center text-blue-500 font-medium">
                  Fetching environmental data...
                </p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(formData).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-600 capitalize">
                          {key.replace("_", " ")}
                        </label>
                        <input
                          type="number"
                          name={key}
                          value={value}
                          readOnly
                          className="mt-1 w-full p-2 border rounded-lg bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={handlePredict}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all font-medium"
                    >
                      {loading ? "Predicting..." : "Predict Flood Risk"}
                    </button>
                  </div>
                </>
              )}
            </m.div>

            <m.div
              variants={fadeUp}
              initial="hidden"
              animate={result ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
            >
              {result && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Activity size={42} className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Prediction Result for {selectedVillage}
                    </h3>
                    <p
                      className={`text-2xl font-bold ${getRiskColor(
                        result.probability
                      )}`}
                    >
                      {getRiskLabel(result.probability)} (
                      {(result.probability * 100).toFixed(1)}%)
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Model predicts this location has a{" "}
                      <span className="font-semibold">
                        {(result.probability * 100).toFixed(1)}%
                      </span>{" "}
                      chance of flooding.
                    </p>
                    {result.probability > 0.7 ? (
                      <AlertTriangle className="text-red-500 mt-4" size={28} />
                    ) : (
                      <CloudRain className="text-blue-400 mt-4" size={28} />
                    )}
                  </div>
                </div>
              )}
            </m.div>
          </main>
        </div>
      </div>
    </Background>
  );
};

export default CityPrediction;
