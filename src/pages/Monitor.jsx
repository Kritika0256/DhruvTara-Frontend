import { useEffect, useState } from "react";

function Monitor() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setMessage("🎙️ LIMO AI is now recording audio for safety monitoring...");
    }, 1000);
  }, []);

  return (
    <div style={{
      height: "100vh",
      background: "#111",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1>🔒 Safety Monitoring Mode</h1>
      <p>{message}</p>
    </div>
  );
}

export default Monitor;
