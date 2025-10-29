import React, { useState, useEffect, useRef } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";


import {
  Building2,
  CirclePlus,
  Search,
  Send,
  Droplet,
  User,
  LogOut,
  Settings,
  Info,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import { motion as m, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AboutDialog from "./AboutDialog";
import ViewProfile from "./ViewProfile";
import HydroAi from "./HydroAi";
import SettingsDialog from "./SettingDialog";
import FeedbackDialog from "./FeedbackDialog";
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../util";
const Navigation = ({ onCitySelect }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [showAI, setShowAI] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSetting , setShowSetting] = useState(false);
  const [showFeedback , setShowFeedback] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem("token"); 

  const dropdownRef = useRef();
  const navigate = useNavigate();
const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);


  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=6`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("City search error:", err);
      } finally {
        setLoading(false);
        setShowSuggestions(true);
      }
    }, 500);
  };

  const handleSelectCity = (city) => {
    setQuery(city.display_name);
    setSuggestions([]);
    setShowSuggestions(false);

    toast.success(`📍 ${city.display_name.split(",")[0]}`);
    if (onCitySelect)
      onCitySelect({
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lon),
        name: city.display_name,
      });
  };

  useEffect(() => {
    const clickHandler = (e) => {
      if (!e.target.closest(".city-search-wrapper")) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  const [post, setPost] = useState({
    title: "",
    description: "",
    image: null,
  });

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setPost({ ...post, image: files[0] });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const PublishHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    if (post.image) formData.append("image", post.image);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/hydrosphere/post/add-post`,
        formData,
        
          {
          headers: { "Content-Type": "multipart/form-data"  ,  Authorization: `Bearer ${token}`},
          } 
  
     
    
  
        
      );

      if (res.data.success) {
        setPost({ title: "", description: "", image: null });
        toast.success("Post Created Successfully", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#1A60B4",
          },
          iconTheme: {
            primary: "#1A60B4",
            secondary: "#FFFAEE",
          },
        });
      }
      setShowPost(false);
    } catch (error) {
      console.log(error);
    }
  };

const logOutHandler = async () => {
  try {
    
    localStorage.removeItem("token");

    
    dispatch(clearUser());

    navigate("/");

    toast.success("Log Out Successfully");
  } catch (error) {
    console.log("Logout error:", error);
    toast.error("Something went wrong during logout!");
  }
};

  const slideRight = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  };

  const popCenter = {
    hidden: { scale: 0.8, opacity: 0, y: 40 },
    visible: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 40 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="flex text-[13px] font-semibold">Hello!!</h1>
            <h1 className="text-[23px] font-semibold">{userInfo?.username}</h1>
          </div>

          {/* 🔹 City Search with Suggestions */}
          <div className="pl-8 relative city-search-wrapper">
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
                borderRadius: 10,
                position: "relative",
                zIndex: 50,
              }}
            >
              <div className="pl-3 pr-3">
                <Building2 />
              </div>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search your city, town or district"
                inputProps={{ "aria-label": "search city" }}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <IconButton type="button" sx={{ p: "10px" }}>
                <Search />
              </IconButton>
            </Paper>

            {showSuggestions && (
              <div className="absolute bg-white border border-gray-200 rounded-lg mt-1 w-[400px] shadow-lg z-50 max-h-56 overflow-y-auto">
                {loading && (
                  <div className="p-3 text-gray-500 text-sm text-center">
                    Searching...
                  </div>
                )}
                {!loading && suggestions.length === 0 && query.length >= 2 && (
                  <div className="p-3 text-gray-500 text-sm text-center">
                    No results found
                  </div>
                )}
                {suggestions.map((city, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectCity(city)}
                    className="p-2 hover:bg-blue-100 cursor-pointer text-sm border-b last:border-0 border-gray-100 transition-colors"
                  >
                    {city.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          <button
            onClick={() => setShowAI(true)}
            className="px-4 py-1.5 bg-cyan-500 text-white text-sm rounded-[5px] hover:bg-cyan-600 font-medium flex gap-2 items-center"
          >
            Hydro AI <Droplet size={16} />
          </button>

          <button
            onClick={() => setShowPost(true)}
            className="px-4 py-1.5 bg-[#1A60B4] text-white text-sm rounded-[5px] hover:bg-cyan-600 font-medium flex gap-2 items-center"
          >
            Add Post <CirclePlus size={16} />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center"
            >
              <User size={16} className="text-white" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <m.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {[
                    {
                      label: "View Profile",
                      icon: <UserRound size={16} />,
                      action: () => setShowProfile(true),
                    },
                    { label: "Settings", icon: <Settings size={16} /> , action : () => setShowSetting(true)},
                    {
                      label: "About",
                      icon: <Info size={16} />,
                      action: () => setShowAbout(true),
                    },
                    { label: "Feedback", icon: <MessageSquare size={16} /> , action : () => setShowFeedback(true) },
                    { label: "Log Out", icon: <LogOut size={16} />, danger: true },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (item.danger) logOutHandler();
                        if (item.action) item.action();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-all ${
                        item.danger
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

   
   
      <AnimatePresence>
        {showPost && (
          <m.div
            variants={popCenter}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90%] sm:w-[60%] md:w-[40%] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CirclePlus className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-700">
                    Create a New Post
                  </h2>
                </div>
                <button
                  onClick={() => setShowPost(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  onChange={changeHandler}
                  placeholder="Post Title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
                <textarea
                  rows="4"
                  placeholder="Description"
                  name="description"
                  onChange={changeHandler}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
                ></textarea>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-500 cursor-pointer">
                    📸 Upload Image
                    <input
                      type="file"
                      name="image"
                      onChange={changeHandler}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={PublishHandler}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send size={16} /> Publish
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <AboutDialog show={showAbout} onClose={() => setShowAbout(false)} />
      <ViewProfile show={showProfile} onClose={() => setShowProfile(false)} />
        <SettingsDialog show = {showSetting} onClose={() => setShowSetting(false)} />
        <HydroAi show={showAI} onClose={() => setShowAI(false)} />
<FeedbackDialog show={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
};

export default Navigation;
