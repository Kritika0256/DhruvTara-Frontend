import React, { useRef, useState } from "react";

export default function Nimo() {
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [status, setStatus] = useState("Click to Activate");
  const [isEnabled, setIsEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const dangerKeywords = ["help me", "save me", "protect me", "emergency"];

  // 🎙 Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();
      mediaRecorderRef.current = recorder;
      console.log("Recording started...");
    } catch (err) {
      console.log("Mic permission denied");
    }
  };

  // ⏹ Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      console.log("Recording stopped.");
    }
  };

  // 🚨 Trigger Emergency
  const triggerEmergency = () => {
    alert("🚨 Danger Detected! SOS Activated!");
    startRecording();
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) return;
    const message = encodeURIComponent(
      "🚨 EMERGENCY ALERT! I need immediate help. Track my location."
    );
    [userData.contact1, userData.contact2, userData.contact3].forEach(
      (number) => {
        if (number) {
          window.open(`sms:${number}?body=${message}`);
        }
      }
    );
  };

  // 🎧 Start Listening
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Heard:", transcript);
      dangerKeywords.forEach((word) => {
        if (transcript.includes(word)) {
          triggerEmergency();
        }
      });
    };
    recognition.start();
    recognitionRef.current = recognition;
    setStatus("AI Protection Active");
  };

  // ⏹ Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    stopRecording();
    window.speechSynthesis.cancel();
    setStatus("Protection Paused");
  };

  // 🔘 Toggle Handler
  const handleToggle = () => {
    if (!isEnabled) {
      setIsEnabled(true);
      setStatus("AI Protection Active");
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(
          !started
            ? "Hi, I am Nimo, your AI Guardian. How are you today?"
            : "Nimo activated. I am now protecting you."
        );
        msg.lang = "en-US";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }, 300);
      setStarted(true);
      startListening();
    } else {
      setIsEnabled(false);
      stopListening();
      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance("Nimo deactivated. Stay safe.");
        msg.lang = "en-US";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }, 300);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "32px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: isEnabled
          ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
          : "linear-gradient(135deg, #4b5563, #374151)",
        padding: "12px 20px",
        borderRadius: "9999px",
        boxShadow: isEnabled
          ? "0 0 20px rgba(124, 58, 237, 0.6)"
          : "0 4px 15px rgba(0,0,0,0.3)",
        color: "white",
        fontFamily: "sans-serif",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.4s ease",
        animation: isEnabled ? "nimoBloom 2s infinite" : "none",
      }}
    >
      <style>{`
        @keyframes nimoBloom {
          0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.6); }
          50% { box-shadow: 0 0 35px rgba(124, 58, 237, 0.95); }
        }
        .nimo-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: ${isEnabled ? "#22c55e" : "#6b7280"};
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.3s ease;
          flex-shrink: 0;
          border: none;
          outline: none;
        }
        .nimo-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: ${isEnabled ? "23px" : "3px"};
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: left 0.3s ease;
        }
      `}</style>

      <span>{isEnabled ? "🎙" : "🔇"} Nimo</span>
      <span style={{ opacity: 0.8, fontSize: "12px" }}>— {status}</span>

      <button
        className="nimo-toggle"
        onClick={handleToggle}
        title={isEnabled ? "Disable Nimo" : "Enable Nimo"}
      />
    </div>
  );
}

