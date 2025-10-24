import React, { useState } from "react";
import axios from "axios";

const FloodTest = () => {
  const [lat, setLat] = useState(30.1583);
  const [lon, setLon] = useState(78.8203);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const response = await axios.post(
        "http://localhost:5000/api/v1/hydrosphere/flood-risk",
        { lat, lon },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ API Response:", response.data);
      setData(response.data);
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to fetch data. Check backend or CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef6ff",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        🌊 Flood Risk API Test
      </h1>

      <input
        type="number"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "250px",
        }}
      />
      <input
        type="number"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        placeholder="Longitude"
        style={{
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "250px",
        }}
      />

      <button
        onClick={handleFetch}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0078ff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Check Flood Risk"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>⚠️ {error}</p>
      )}

      {data && (
        <div
          style={{
            marginTop: "20px",
            background: "#fff",
            padding: "15px 25px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p>📍 <b>Location:</b> {data.location.lat}, {data.location.lon}</p>
          <p>💧 <b>Flood Risk Index:</b> {data.floodRiskIndex}</p>

        </div>
      )}
    </div>
  );
};

export default FloodTest;
