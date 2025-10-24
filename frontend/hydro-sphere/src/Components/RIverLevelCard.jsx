import React, { useEffect, useState } from "react";
import axios from "axios";
import { Activity } from "lucide-react";

const RiverLevelCard = () => {
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.data.gov.in/resource/1fc2148c-fc41-46f5-a364-bdc03f77053f",
          {
            params: {
              "api-key":
                "579b464db66ec23bdd0000019c01afb51514423b56e02c790cb3eb0a",
              format: "json",
              limit: 10,
              "filters[Agency_name]": "CWC",
            },
          }
        );
        // Example: pick the latest Uttarakhand reservoir
        const uttarakhand = res.data.records.find((r) =>
          r.Basin.toLowerCase().includes("ganga")
        );
        setLevelData(uttarakhand);
      } catch (err) {
        console.error(err);
        setError("Could not fetch live river level data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500">Loading River Data...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-600 font-medium">River Level – {levelData?.Reservoir_name}</h2>
        <Activity className="text-blue-600" />
      </div>

      <p className="text-3xl font-bold text-gray-800">
        {levelData?.Level || "—"} <span className="text-lg font-medium">m</span>
      </p>

      <p className="text-sm text-gray-600 mt-1">
        Basin: {levelData?.Basin || "N/A"}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        Updated on: {levelData?.Date || "—"}
      </p>
    </div>
  );
};

export default RiverLevelCard;
