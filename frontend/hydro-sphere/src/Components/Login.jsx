import React, { useRef } from "react";
import { User, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { motion as m } from "framer-motion";
import { useState } from "react";
import axios from "axios"
import { setUser } from "../redux/userSlice";
import { BASE_URL } from "../../util";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
const [form , setForm] = useState({email : "" , password : ""});
const [loading , setLoading] = useState(false);
const changeHandler = (e) => {
  e.preventDefault();
  setForm({...form ,[e.target.name] : e.target.value});
}


const handleForget = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (!form.email) {
  toast.error("Please enter your email first!");
  return;
}

    const res = await axios.post(`${BASE_URL}/api/v1/hydrosphere/auth/forget` , {email : form.email});
    if(res.data.success){
         toast.success(`${res.data.message}`, {
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
  else {

  
      toast.error("Email is required");
  }  
  } catch (error) {
    console.log(error);
      toast.error(error.response?.data?.message || "Network or server error!", {
      position: "bottom-center",
    });
  }
finally{
  setLoading(false);
}
}
  const handleSubmit = async (e) => {
    e.preventDefault();

try{


const res = await axios.post(`${BASE_URL}/api/v1/hydrosphere/auth/login` , form ,
  {withCredentials : true}
 );
console.log(res.data);
if(res.data.success){
  console.log("userdata",res.data.userData);
  
  dispatch(setUser(res.data.userData));
   toast.success(`${res.data.message}`, {
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

    navigate("/dashboard");
}
}
catch(error){
     console.error("Signup error:", error);
    toast.error(error.response?.data?.message || "Network or server error!", {
      position: "bottom-center",
    });
} 
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden">
    
      <m.div
        initial="visible"
        animate = "visible"
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute -top-24 -left-20 w-[450px] h-[450px] bg-cyan-300 rounded-full blur-3xl"
      />
      <m.div
        initial="visible"
        animate="visible"
        transition={{
          duration: 3,
          delay: 1.2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-blue-300 rounded-full blur-3xl"
      />

      <m.div
        initial="visible"
        animate="visible"
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-100 to-white"
      >
        <div className="text-center">
          <m.img
            src="/logo3.png"
            alt="HydroSphere Logo"
            className="mx-auto h-56 mb-4 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]"
            initial="visible"
            animate="visible"
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <h1 className="text-4xl font-bold text-blue-800">
            Hydro<span className="text-cyan-500">Sphere</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back to your flood awareness dashboard
          </p>
        </div>
      </m.div>

      
      <div className="flex-1 flex items-center justify-center relative z-10">
        <m.div
          initial="visible"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Email"
                name = "email"
                onChange={changeHandler}
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                 name = "password"
                onChange={changeHandler}
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                required
              />
            </div>

       

            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md font-semibold shadow-md hover : cursor-pointer"
            >
              Login
            </m.button>
          </form>
          {!loading ? <button onClick = {handleForget}className="text-blue-700 text-sm cursor-pointer hover:underline ">Forget Password</button> : <h1 className="text-blue-600 text-sm">Sending...</h1>}

          <p className="text-gray-500 text-sm mt-5 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>

          <p className="text-gray-400 text-xs mt-6 text-center">
            © 2025 HydroSphere
          </p>
        </m.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-cyan-400 via-sky-200 via-blue-500 to-cyan-400 animate-glow opacity-95 blur-[3px]"></div>
    </div>
  );
};

export default Login;
