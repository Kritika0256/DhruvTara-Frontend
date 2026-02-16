import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Nimo from "../components/Nimo"; // ✅ CORRECT IMPORT

export default function Home() {
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const handleModeSelect = (travelMode) => {
    setMode(travelMode);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // 🚨 Manual SOS Function
  const handleSOS = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      alert("No emergency contacts found.");
      return;
    }

    const message = encodeURIComponent(
      "🚨 EMERGENCY ALERT! I need immediate help. Please track my location."
    );

    [userData.contact1, userData.contact2, userData.contact3].forEach(
      (number) => {
        if (number) {
          window.open(`sms:${number}?body=${message}`);
        }
      }
    );

    alert("🚨 Emergency Alert Sent Successfully!");
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Floating Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-20 top-[-200px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-600 rounded-full blur-3xl opacity-20 bottom-[-200px] right-0"></div>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-8xl font-semibold tracking-tight"
        >
          Dhruv<span className="text-purple-500">Tara</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-2xl text-gray-400 max-w-2xl"
        >
          Your Guiding Star for Safety.  
          AI-powered real-time protection for fearless journeys.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center gap-3 text-green-400"
        >
          <span className="w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          Live AI Protection Active
        </motion.div>

      </section>

      {/* AI FEATURES SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-semibold"
        >
          Intelligent Safety System
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            "📡 Live Location Tracking",
            "🎙 Voice Trigger SOS",
            "🧠 AI Threat Detection"
          ].map((feature) => (
            <div
              key={feature}
              className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300"
            >
              {feature}
            </div>
          ))}
        </motion.div>

      </section>

      {/* TRAVEL MODE SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6">

        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl mb-12"
        >
          How are you travelling today?
        </motion.h2>

        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

          <div className="flex flex-col gap-4">
            {["Walking", "Bike", "Car"].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModeSelect(item)}
                className={`py-4 rounded-2xl border transition ${
                  mode === item
                    ? "bg-purple-600 border-purple-400"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
              >
                {item === "Walking" && "🚶 Walking"}
                {item === "Bike" && "🏍 Bike"}
                {item === "Car" && "🚗 Car"}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {mode && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center text-purple-400"
              >
                ✨ Safe journey activated for {mode}
              </motion.p>
            )}
          </AnimatePresence>

        </div>

      </section>

      {/* FOOTER */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-semibold"
        >
          Travel Fearless.
        </motion.h2>

        <p className="mt-6 text-gray-400 max-w-xl">
          With DhruvTara, your safety is never left to chance.
        </p>
      </section>

      {/* SOS BUTTON */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSOS}
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-red-600 shadow-2xl text-white text-lg font-bold flex items-center justify-center animate-pulse"
      >
        SOS
      </motion.button>

      {/* 🎙 NIMO AI */}
      <Nimo />

    </div>
  );
}












