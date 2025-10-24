import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader"; 

const Transition = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
 
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loader />}    
      {!loading && <Outlet />}  
    </>
  );
};

export default Transition;
