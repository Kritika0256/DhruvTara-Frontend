import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const SOSButton = () => {
  const handleSOS = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      alert("No emergency contacts found!");
      return;
    }

    const message = encodeURIComponent(
      "🚨 EMERGENCY ALERT! I need help immediately. Please reach me as soon as possible."
    );

    const contacts = [userData.contact1, userData.contact2, userData.contact3];

    contacts.forEach((number) => {
      if (number) {
        window.open(`sms:${number}?body=${message}`);
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={handleSOS}
        className="bg-red-600 hover:bg-red-700 text-white w-40 h-40 rounded-full shadow-2xl flex flex-col items-center justify-center text-xl font-bold"
      >
        <AlertTriangle size={40} />
        SOS
      </motion.button>
    </div>
  );
};

export default SOSButton;






