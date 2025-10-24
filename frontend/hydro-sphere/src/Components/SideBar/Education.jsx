import React from "react";
import Navigation from "../Navigation";
import SideBar from "../SideBar";
import { motion as m } from "framer-motion";
import { Shield, AlertTriangle, Info, BookOpen } from "lucide-react";

const Education = () => {
  const awarenessCards = [
    {
      icon: <Shield className="text-blue-500" size={24} />,
      title: "Before a Flood",
      points: [
        "Know your area's flood-prone zones and evacuation routes.",
        "Keep an emergency kit ready — food, torch, first aid, power bank.",
        "Store documents and valuables in waterproof containers.",
      ],
    },
    {
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
      title: "During a Flood",
      points: [
        "Move to higher ground immediately.",
        "Avoid walking or driving through floodwaters.",
        "Stay tuned to alerts and follow official advisories.",
      ],
    },
    {
      icon: <Info className="text-green-600" size={24} />,
      title: "After a Flood",
      points: [
        "Avoid contact with contaminated water.",
        "Check for gas leaks before turning electricity on.",
        "Clean and disinfect everything that got wet.",
      ],
    },
  ];

  const helplines = [
    { name: "NDMA (India)", number: "1078" },
    { name: "NDRF Control Room", number: "011-24363260" },
    { name: "Uttarakhand Disaster Helpline", number: "1070" },
    { name: "Police Emergency", number: "100" },
    { name: "Ambulance", number: "108" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navigation />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 space-y-10">
         
          <m.div
            initial="visible"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 flex items-center gap-2"
          >
            <BookOpen className="text-blue-500" />
            Educational Resources
          </m.div>

          <m.section
            initial="visible"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Flood Awareness & Safety
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {awarenessCards.map((card, i) => (
                <m.div
                  key={i}
                  variants={fadeUp}
                  initial="visible"
                  animate="visible"
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {card.icon}
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {card.title}
                    </h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    {card.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </m.div>
              ))}
            </div>
          </m.section>

          <m.section
            initial="visible"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Important Helpline Numbers
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm font-semibold">
                    <th className="text-left px-4 py-2">Organization</th>
                    <th className="text-left px-4 py-2">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {helplines.map((h, idx) => (
                    <tr
                      key={idx}
                      className="border-t text-gray-600 text-sm hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{h.name}</td>
                      <td className="px-4 py-2 font-medium text-blue-600">
                        {h.number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </m.section>

          <m.section
            initial="visible"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Visual Learning Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <m.div
                variants={fadeUp}
                initial="visible"
                animate="visible"
                transition={{ delay: 0.5 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
              >
                <video
                  src="v3.mp4"
                  controls
                  className="w-full h-64 rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Flood Awareness Guide
                </p>
              </m.div>

              <m.div
                variants={fadeUp}
                initial="visible"
                animate="visible"
                transition={{ delay: 0.6 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
              >
                <video
                  src="v2.mp4" // 🔹 replace with your actual file
                  controls
                  className="w-full h-64 rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Flood Safety Instructions
                </p>
              </m.div>

              <m.div
                variants={fadeUp}
                initial="visible"
                animate="visible"
                transition={{ delay: 0.7 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
              >
                <video
                  src="v1.mp4" // 🔹 replace with your actual file
                  controls
                  className="w-full h-64 rounded-lg shadow-sm"
                />
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Emergency Response Demo
                </p>
              </m.div>
            </div>
          </m.section>

         
          <m.section
            initial="visible"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-gray-700"
          >
            <h2 className="text-lg font-semibold mb-2">
              Why Flood Awareness Matters
            </h2>
            <p className="text-sm leading-relaxed">
              Floods are one of the most common and devastating natural disasters.
              Awareness and preparedness can significantly reduce their impact.
              HydroSphere helps you stay informed, plan better, and respond faster
              during emergencies.
            </p>
          </m.section>
        </main>
      </div>
    </div>
  );
};

export default Education;
