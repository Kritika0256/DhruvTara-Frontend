export default function SOS() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <button
        className="w-24 h-24 rounded-full bg-red-600 text-xl font-bold animate-pulse"
        onClick={() => alert("🚨 SOS Triggered")}
      >
        SOS
      </button>
    </div>
  );
}

