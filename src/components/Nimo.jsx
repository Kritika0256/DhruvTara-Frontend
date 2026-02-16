import React, { useEffect, useRef, useState } from "react";

export default function Nimo() {
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");

  const dangerKeywords = ["help me", "save me", "protect me", "emergency"];

  // 🔊 Speak
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

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

  useEffect(() => {
    speak("Hi, I am Nimo, your AI Guardian. How are you today?");
    startListening();
  }, []);

  return (
    <div className="fixed bottom-8 left-8 bg-purple-600 px-6 py-3 rounded-full shadow-xl text-white animate-pulse z-50">
      🎙 Nimo - {status}
    </div>
  );
}

