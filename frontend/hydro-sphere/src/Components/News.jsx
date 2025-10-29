import React, { useState, useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Newspaper, User, X } from "lucide-react";
import SideBar from "./SideBar";
import Navigation from "./Navigation";
import Background from "./BackGround";
import axios from "axios";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../util";

const News = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`${BASE_URL}/api/v1/hydrosphere/post/get-post`);
      setNewsData(res.data.allPosts);
    };
    fetchPost();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Background
      from="#d5eaff"
      via="#f7fbff"
      to="#c5dcff"
      glow1="bg-blue-200"
      glow2="bg-cyan-200"
    >
      <div className="flex h-screen font-sans">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
            <div className="flex gap-3 items-center text-3xl font-semibold text-gray-800">
              <Newspaper className="text-blue-600" />
              News & Community Posts
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {newsData?.map((item, i) => (
                <m.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all"
                >
                  <div className="relative">
                    <img
                      src={`${BASE_URL}/${item.image}`}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      Post
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <User size={15} />
                      {item.user.username}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {item.description}
                    </p>

                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="text-blue-600 font-medium text-sm hover:text-blue-800 transition"
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
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h2 className="text-2xl font-semibold">
                  Stay Updated with HydroSphere
                </h2>
                <p className="text-blue-100 text-sm max-w-lg mt-1">
                  Climate awareness and flood alerts to protect our world.
                </p>
              </div>

              <button
                onClick={() => navigate("/") }
                className="bg-white text-blue-700 px-6 py-2 rounded-full font-medium shadow hover:bg-blue-50"
              >
                Visit Home →
              </button>
            </m.section>

            <AnimatePresence>
              {selectedArticle && (
                <m.div
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <m.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
                  >
                    <img
                      src={`${BASE_URL}/${selectedArticle.image}`}
                      alt={selectedArticle.title}
                      className="w-full h-64 object-cover"
                    />

                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <X size={18} />
                    </button>

                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      <h2 className="text-2xl font-semibold text-gray-800 leading-snug">
                        {selectedArticle.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedArticle.description}
                      </p>
                    </div>
                  </m.div>
                </m.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Background>
  );
};

export default News;
