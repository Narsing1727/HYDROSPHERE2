import React, { useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  Cloud,
  FileText,
  FileTextIcon,
  LayoutDashboard,
  LogOutIcon,
  User,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Locate,
} from "lucide-react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Activity, label: "City Prediction", path: "/prediction" },
    { icon: FileText, label: "Risk Zoning", path: "/zoning" },
    { icon: Cloud, label: "Weather Overview", path: "/weather" },
    { icon: BookOpen, label: "Educational Resources", path: "/education" },
    { icon: Bell, label: "Posts", path: "/news" },
    { icon: Locate, label: "Resource Locator", path: "/contacts" },
    { icon: FileTextIcon, label: "Zone Report", path: "/report" },
  ];
    
  const activePath = location.pathname;
     const logOutHandler = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/v1/hydrosphere/auth/logout');
          if(res.data.success){
            navigate('/');
            toast.success("Log Out Successfully");
          }
        } catch (error) {
          console.log(error);
          
        }
      }

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-xl flex flex-col transition-all duration-500`}
    >
      
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src="/logo3.png"
            alt="HydroSphere Logo"
            className="h-8 transition-transform duration-500 hover:scale-105"
          />
          {!collapsed && (
            <h1 className="font-extrabold text-xl text-gray-800 transition-all duration-500">
              Hydro<span className="text-[#1A60B4]">Sphere</span>
            </h1>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

  
      <nav className="flex-1 overflow-y-auto py-3">
        {menuItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative w-full flex items-center ${
                collapsed ? "justify-center px-0" : "justify-between px-5"
              } py-2.5 my-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-500 shadow-inner"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={19}
                  className={`${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-500"
                  } transition-colors duration-200`}
                />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && isActive && (
                <div className="absolute right-3 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

    
      <div className="border-t border-gray-100 px-4 py-4 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 hover:text-cyan-500 cursor-pointer transition">
          <Droplet size={18} />
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-700">
              Hydro AI
            </span>
          )}
        </div>
        <button onClick={logOutHandler} className="text-gray-500 hover:text-red-500 transition hover:cursor-pointer">
          <LogOutIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
