import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SafetyToggle() {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);

    if (newState) {
      navigate("/monitor");
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        backgroundColor: enabled ? "green" : "gray",
        color: "white",
        border: "none",
        borderRadius: "30px",
        padding: "15px 25px",
        fontSize: "16px",
        cursor: "pointer",
        zIndex: 1000
      }}
    >
      {enabled ? "Safety Mode ON" : "Safety Mode OFF"}
    </button>
  );
}

export default SafetyToggle;

