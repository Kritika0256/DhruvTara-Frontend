import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-indigo-900 p-6">
      
      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md"
      >
        <h2 className="text-4xl font-bold text-white text-center mb-6">
          Welcome Back ✨
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Login to continue your journey
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm">Email</label>
          <div className="flex items-center bg-white/20 rounded-xl px-3 mt-1">
            <Mail className="text-gray-300 mr-2" size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent w-full p-3 text-white outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm">Password</label>
          <div className="flex items-center bg-white/20 rounded-xl px-3 mt-1">
            <Lock className="text-gray-300 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="bg-transparent w-full p-3 text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-indigo-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Button */}
        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg">
          Login
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account? 
          <span className="text-indigo-400 cursor-pointer ml-1 hover:underline">
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;




