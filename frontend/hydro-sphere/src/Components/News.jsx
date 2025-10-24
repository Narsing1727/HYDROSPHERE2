import React, { useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Globe,
  AlertTriangle,
  Droplet,
  Cloud,
  Flame,
  X,
  User,
} from "lucide-react";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import Background from "./BackGround"; 
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const News = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsData , setNewsData] = useState([]);
  const navigate = useNavigate();
useEffect( () => {
const fetchPost = async () => {


   try {

    const res = await axios.get("http://localhost:5000/api/v1/hydrosphere/post/get-post");
       const sorted = res.data.allPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    
    setNewsData(res.data.allPosts);

    
   } catch (error) {
    console.log(error);
    
   }
  }
  fetchPost();
} , [])

useEffect(() => {
  if (newsData.length > 0) {
    console.log("newsData updated:", newsData);
  }
}, [newsData]);
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
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
     
      
              <Newspaper className="text-blue-600" />
              Latest News & Updates
            

     
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {newsData?.map((item, i) => (
                <m.div
                  key={i}
                  variants={fadeUp}
                  initial="visible"
                  animate="visible"
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt = {item.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User/>
                      <span>{item.user.username}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="mt-3 text-blue-600 font-medium text-sm hover:underline hover : cursor-pointer"
                    >
                      Read more →
                    </button>
                  </div>
                </m.div>
              ))} 
            </div>

            <m.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-14 bg-blue-600 text-white rounded-xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Stay Updated with HydroSphere News
                </h2>
                <p className="text-sm text-blue-100 max-w-xl">
                  Get the latest updates about environmental changes, climate
                  reports, and disaster alerts — all in one place.
                </p>
              </div>

              <button onClick={()=>{
                navigate("/")
              }} className="mt-5 md:mt-0 bg-white text-blue-600 px-5 py-2 rounded-full font-medium shadow-md hover:bg-blue-50 transition-all">
                
   Visit HydroSphere
                
             
              </button>
            </m.section>

            <AnimatePresence>
              {selectedArticle && (
                <>
                  <m.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedArticle(null)}
                  />

                  <m.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  >
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
                      <div className="relative">
                        <img
                          src = {`http://localhost:5000/${selectedArticle.image}`}
                          alt={selectedArticle.title}
                          className="w-full h-60 object-cover"
                        />
                        <button
                          onClick={() => setSelectedArticle(null)}
                          className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all hover : cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          {selectedArticle.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          {selectedArticle.icon}
                          <span>{selectedArticle.date}</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {selectedArticle.title}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {selectedArticle.description}
                        </p>
                      </div>
                    </div>
                  </m.div>
                </>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Background>
  );
};

export default News;
