import { useState, useRef, useEffect } from "react";
import ringtone from "../assets/ringtone.mp3";
import dadVideo from "../assets/dad.mp4";
import dadImage from "../assets/dad.jpg";

function FakeCall() {
  const [incoming, setIncoming] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [shake, setShake] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const autoRejectRef = useRef(null);
  const longPressRef = useRef(null);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(autoRejectRef.current);
      clearTimeout(longPressRef.current);
      clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startFakeCall = () => {
    setIncoming(true);
    setShake(true);
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play();
    }
    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500]);
    }
    autoRejectRef.current = setTimeout(() => {
      endCall();
    }, 20000);
  };

  const pickCall = () => {
    clearTimeout(autoRejectRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIncoming(false);
    setShake(false);
    setInCall(true);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    clearTimeout(autoRejectRef.current);
    clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIncoming(false);
    setInCall(false);
    setShake(false);
    setSeconds(0);
  };

  const handleMouseDown = () => {
    longPressRef.current = setTimeout(() => {
      alert("🚨 SOS Alert Triggered!");
    }, 2000);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressRef.current);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      {/* ✅ Shake keyframes fix */}
      <style>{`
        @keyframes shake {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-8deg); }
          50%  { transform: rotate(8deg); }
          75%  { transform: rotate(-8deg); }
          100% { transform: rotate(0deg); }
        }
        .shake-phone {
          animation: shake 0.5s infinite;
        }
      `}</style>

      {/* Fake Call Button */}
      <button
        onClick={startFakeCall}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={{
          position: "fixed",
          bottom: "120px",
          right: "30px",
          padding: "12px 18px",
          background: "#25D366",
          color: "white",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          zIndex: 1000,
          fontSize: "16px",
          fontWeight: "600",
          boxShadow: "0 4px 15px rgba(37,211,102,0.4)"
        }}
      >
        📞 Fake Call
      </button>

      {/* Incoming Screen */}
      {incoming && (
        <div style={styles.screen}>
          <div className={shake ? "shake-phone" : ""}>
            <img src={dadImage} alt="Dad" style={styles.avatar} />
          </div>
          <h2 style={{ color: "white", marginTop: "10px" }}>Dad</h2>
          <p style={{ color: "lightgray" }}>Incoming Video Call...</p>

          <div style={styles.buttonRow}>
            <button onClick={endCall} style={styles.reject}>❌</button>
            <button onClick={pickCall} style={styles.accept}>✅</button>
          </div>
        </div>
      )}

      {/* Video Call Screen */}
      {inCall && (
        <div style={styles.screen}>
          <h2 style={{ color: "white" }}>Dad</h2>
          <p style={{ color: "lightgray" }}>{formatTime()}</p>
          <video
            src={dadVideo}
            autoPlay
            style={{ width: "300px", borderRadius: "20px", marginTop: "20px" }}
          />
          <button onClick={endCall} style={styles.rejectBottom}>
            📵 End Call
          </button>
        </div>
      )}

      <audio ref={audioRef} src={ringtone} />
    </>
  );
}

const styles = {
  screen: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, #111, #000)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "200px",
    marginTop: "40px"
  },
  accept: {
    background: "green",
    border: "none",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    fontSize: "20px",
    color: "white",
    cursor: "pointer"
  },
  reject: {
    background: "red",
    border: "none",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    fontSize: "20px",
    color: "white",
    cursor: "pointer"
  },
  rejectBottom: {
    marginTop: "30px",
    padding: "12px 30px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default FakeCall;