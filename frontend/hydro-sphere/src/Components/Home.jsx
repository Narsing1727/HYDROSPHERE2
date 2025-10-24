import React, { useState } from "react";
import { motion as m } from "framer-motion";
import {
  Droplet,
  CloudRain,
  Globe,
  ArrowRight,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import LearnMoreDialog from "./LearnMoreDialog";
import { clearUser } from "../redux/userSlice";

const Home = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuth, userInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    if (window.confirm("Logout from HydroSphere?")) {
      dispatch(clearUser());
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-cyan-50 to-white text-gray-800 font-sans overflow-hidden scroll-smooth">

      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <img src="/logo3.png" alt="logo" className="h-8" />
            <h1 className="font-bold text-xl text-[#1A60B4]">HydroSphere</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuth ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all">
                  <User className="text-blue-600" size={18} />
                  <span className="font-medium text-gray-800">
                    {userInfo?.username || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-500 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 transition hover:cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-md hover:cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>


      <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-40 mt-10 relative">
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7 }}
          className="max-w-xl space-y-6 z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Understand Water.{" "}
            <span className="text-blue-600">Predict Floods.</span> Protect Lives.
          </h1>
          <p className="text-gray-600 text-lg">
            HydroSphere is an AI-powered platform for flood prediction, risk
            zoning, and environmental awareness — helping cities stay one step
            ahead of disasters.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() =>
                isAuth ? navigate("/dashboard") : navigate("/signup")
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 flex items-center gap-2 hover:cursor-pointer"
            >
              {isAuth ? "Go to Dashboard" : "Get Started"} <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setShowDialog(true)}
              className="bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium hover:shadow-md flex items-center gap-2 text-gray-700 hover:cursor-pointer"
            >
              Learn More <Sparkles size={18} className="text-yellow-400" />
            </button>
          </div>
        </m.div>

        <LearnMoreDialog
          show={showDialog}
          onClose={() => setShowDialog(false)}
        />

        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative mt-10 lg:mt-0"
        >
          <img
            src="/Earth.png"
            alt="Hydrosphere Visualization"
            className="w-90 drop-shadow-[0_0_15px_rgba(0,130,246,0.3)]"
          />
        </m.div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-3xl -z-10"></div>
      </section>

      <section
        id="features"
        className="py-24 px-6 lg:px-20 bg-gradient-to-b from-white to-blue-50"
      >
        <m.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-800 mb-14"
        >
          Powerful Features for a Safer Tomorrow
        </m.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[ 
            { icon: <CloudRain className="text-blue-600" size={32} />, title: "Smart Flood Prediction", desc: "AI models analyze rainfall and terrain data to forecast flood-prone areas with high accuracy." },
            { icon: <Globe className="text-cyan-600" size={32} />, title: "Interactive Risk Zoning", desc: "View live risk maps for your city, updated dynamically with climate and topographic data." },
            { icon: <Droplet className="text-blue-400" size={32} />, title: "Environmental Awareness", desc: "Educational modules, safety guidelines, and live alerts to spread disaster awareness." },
          ].map((f, i) => (
            <m.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 0.1 * i }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </m.div>
          ))}
        </div>
      </section>

  
{[
  {
    id: "pricing",
    title: "Pricing Plans",
    desc: "HydroSphere offers free access during beta and transparent pricing tiers for organizations post-launch.",
    gradient: "from-cyan-50 to-blue-100",
    box: {
      title: "Subscription Overview",
      content:
        "For now we do not provide any type of subscription, in future may be some paid features will come ",
    },
  },
  {
    id: "updates",
    title: "Latest Updates",
    desc: "Get the newest features including live data layers, real-time weather integration, and performance improvements.",
    gradient: "from-blue-50 to-white",
    box: {
      title: "Version 1.0 Highlights",
      content:
        "• This is the first version of website there is no latest update",
    },
  },
  {
    id: "about",
    title: "About HydroSphere",
    desc: "Founded by Civil and Geospatial Engineers, HydroSphere aims to make climate resilience technology accessible to all.",
    gradient: "from-cyan-100 to-blue-50",
    box: {
      title: "Our Vision",
      content:
        "We combine AI, geospatial data, and predictive modeling to empower local communities against natural disasters.",
    },
  },
  {
    id: "careers",
    title: "Join Our Mission",
    desc: "We’re hiring passionate developers, GIS specialists, and AI researchers to push climate tech forward.",
    gradient: "from-blue-50 to-cyan-100",
    box: {
      title: "Open Positions",
      content:
        "Join our remote-first team. Roles in frontend (React), backend (Node.js, Rust), and ML (TensorFlow). Work that actually matters.",
    },
  },
  {
    id: "community",
    title: "Our Community",
    desc: "Collaborate with researchers, share datasets, and build a resilient tomorrow together with HydroSphere’s open network.",
    gradient: "from-cyan-50 to-white",
    box: {
      title: "Developer Hub",
      content:
        `Access our GitHub repo, contribute new data models, or host local HydroSphere awareness workshops `,
    },
    action : true,
  },
].map((sec, i) => (
  <section
    key={sec.id}
    id={sec.id}
    className={`py-24 px-6 lg:px-20 bg-gradient-to-r ${sec.gradient}`}
  >
    <div
      className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 ${
        i % 2 === 0 ? "" : "md:flex-row-reverse"
      }`}
    >
     
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6 }}
        className="md:w-1/2 space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800">{sec.title}</h2>
        <p className="text-gray-600 leading-relaxed text-lg">{sec.desc}</p>
      </m.div>

      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        transition={{ delay: 0.2, duration: 0.6 }}
        className="md:w-1/2 bg-white/60 backdrop-blur-xl border border-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
      >
        <h3 className="text-xl font-semibold text-blue-700 mb-3">
          {sec.box.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {sec.box.content}
        </p>
        {sec.action && (
          <a className="text-blue-500" href="https://github.com/Narsing1727/HydroSphere.git" target="_blank">Github Repository</a>
        )}
        <div className="mt-5 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-2/3"></div>
      </m.div>
    </div>
  </section>
))}


 
      <footer className="bg-blue-900 text-blue-100 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">HydroSphere</h3>
            <p className="text-sm max-w-sm text-blue-200">
              Empowering cities through AI-powered flood forecasting, real-time
              water intelligence, and disaster preparedness.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Product</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#updates" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Company</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#careers" className="hover:text-white">Careers</a></li>
                <li><a href="#community" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Support</h4>
              <ul className="space-y-1 text-blue-200">
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#community" className="hover:text-white">Community</a></li>
                <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-10 pt-6 text-center text-sm text-blue-300">
          © {new Date().getFullYear()} HydroSphere • All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Home;
