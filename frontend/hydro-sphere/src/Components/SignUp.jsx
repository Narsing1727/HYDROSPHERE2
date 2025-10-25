import React, { useState } from "react";
import { User, Lock, Mail, CheckCircle } from "lucide-react";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion as m } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../util";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOTP = async (action) => {
    try {
      if (!form.email) {
        toast.error("Please enter your email first!");
        return;
      }

      setLoading(true);

      if (action === "send") {
        const res = await axios.post(
          `${BASE_URL}/api/v1/hydrosphere/auth/send-otp`,
          { email: form.email }
        );
        if (res.data.success) {
          toast.success("OTP sent to your email!");
          setOtpSent(true);
        } else {
          toast.error(res.data.message || "Failed to send OTP");
        }
      } else if (action === "resend") {
        const res = await axios.post(
          `${BASE_URL}/api/v1/hydrosphere/auth/resend-otp`,
          { email: form.email }
        );
        if (res.data.success) {
          toast.success("New OTP sent successfully!");
        } else {
          toast.error(res.data.message || "Failed to resend OTP");
        }
      } else if (action === "verify") {
        if (!otp) {
          toast.error("Enter OTP first!");
          return;
        }
        const res = await axios.post(
          "http://localhost:5000/api/v1/hydrosphere/auth/verify-otp",
          { email: form.email, otp }
        );
        if (res.data.success) {
          toast.success("Email verified successfully ✅");
          setIsVerified(true);
          setOtpSent(false); 
          setOtp("");
        } else {
          toast.error(res.data.message || "Invalid OTP");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      toast.error("Please verify your email first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/hydrosphere/auth/signup",
        form
      );

      if (res.data.success) {
        toast.success("Sign Up Successfully!", {
          style: {
            border: "1px solid #1A60B4",
            padding: "16px",
            color: "#1A60B4",
          },
          iconTheme: {
            primary: "#1A60B4",
            secondary: "#FFFAEE",
          },
        });
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Server error occurred!");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background glows */}
      <m.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-3xl"
      />
      <m.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl"
      />

      {/* Left Side */}
      <m.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-100 to-white"
      >
        <div className="text-center">
          <m.img
            src="/logo3.png"
            alt="HydroSphere Logo"
            className="mx-auto h-56 mb-4 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]"
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <h1 className="text-4xl font-bold text-blue-800">
            Hydro<span className="text-cyan-500">Sphere</span>
          </h1>
          <p className="text-gray-600 mt-2">
            AI-Driven Flood Monitoring & Prediction System
          </p>
        </div>
      </m.div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <m.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter Your Name"
                name="username"
                onChange={changeHandler}
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Mobile Number"
                name="phoneNumber"
                onChange={changeHandler}
                className="w-full pl-3 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            {/* Email + OTP Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                  disabled={isVerified}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 ${
                    isVerified
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:ring-cyan-400"
                  } focus:outline-none`}
                />
                {isVerified && (
                  <CheckCircle
                    className="absolute top-3 right-3 text-green-600"
                    size={20}
                  />
                )}
              </div>

              {!isVerified && (
                <>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => handleOTP("send")}
                      disabled={loading}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOTP("resend")}
                      disabled={loading}
                      className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                    >
                      Resend
                    </button>
                  )}
                </>
              )}
            </div>

            {otpSent && !isVerified && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 pl-3 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleOTP("verify")}
                  disabled={loading}
                  className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Verify
                </button>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Create Password"
                name="password"
                onChange={changeHandler}
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md font-semibold shadow-md hover:cursor-pointer"
            >
              Sign Up
            </m.button>
          </form>

          <Divider sx={{ my: 2 }} />
          <p className="text-gray-500 text-sm mt-3 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>

          <p className="text-gray-400 text-xs mt-6 text-center">© 2025 HydroSphere</p>
        </m.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-cyan-400 via-sky-200 via-blue-500 to-cyan-400 animate-glow opacity-95 blur-[3px]"></div>
    </div>
  );
};

export default SignUp;
