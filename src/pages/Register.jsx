import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nimo from "../components/Nimo";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact1: "",
    contact2: "",
    contact3: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!formData.contact1 || !formData.contact2 || !formData.contact3) {
      alert("Please provide 3 emergency contacts");
      return;
    }

    localStorage.setItem("userData", JSON.stringify(formData));

    alert("Registration Successful 🚀");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl text-white text-center mb-6">
          Create Account
        </h2>

        {["name", "email", "password", "contact1", "contact2", "contact3"].map(
          (field) => (
            <input
              key={field}
              type={
                field === "password"
                  ? "password"
                  : field.includes("contact")
                  ? "tel"
                  : "text"
              }
              name={field}
              placeholder={
                field.includes("contact")
                  ? `Emergency Contact ${field.slice(-1)}`
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none"
            />
          )
        )}

        <button
          onClick={handleRegister}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition"
        >
          Register & Activate Protection
        </button>
      </motion.div>

      <Nimo />
    </div>
  );
}




