import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, { radius: 25, blur: 20 });
    heat.addTo(map);
    return () => map.removeLayer(heat);
  }, [points, map]);

  return null;
}

export default function Dashboard() {
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSegments, setRouteSegments] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [search, setSearch] = useState("");
  const [mapType, setMapType] = useState("street");
  const [loading, setLoading] = useState(false);
  const [movingIndex, setMovingIndex] = useState(0);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [crimePoints, setCrimePoints] = useState([]);
  const [threatLevel, setThreatLevel] = useState(null);
  const [shareLink, setShareLink] = useState("");

  const intervalRef = useRef(null);

  // 🔥 Simulated Crime Zones
  useEffect(() => {
    const simulatedCrime = [
      [28.61, 77.20, 0.9],
      [28.62, 77.21, 0.7],
      [28.60, 77.22, 0.8],
      [28.615, 77.19, 0.6],
    ];
    setCrimePoints(simulatedCrime);
  }, []);

  // 🚗 Animated Marker
  useEffect(() => {
    if (routeCoords.length > 0) {
      setMovingIndex(0);
      intervalRef.current = setInterval(() => {
        setMovingIndex((prev) => {
          if (prev >= routeCoords.length - 1) {
            clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => clearInterval(intervalRef.current);
  }, [routeCoords]);

  // 🧠 AI Threat Engine
  const calculateThreat = (coords) => {
    let riskScore = 0;

    coords.forEach((point) => {
      crimePoints.forEach((crime) => {
        const dist =
          Math.abs(point[0] - crime[0]) +
          Math.abs(point[1] - crime[1]);
        if (dist < 0.01) riskScore += crime[2] * 10;
      });
    });

    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 5) riskScore *= 1.5;

    if (riskScore < 15) return "Low";
    if (riskScore < 35) return "Medium";
    return "High";
  };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location permission denied")
    );
  };

  const searchLocation = async () => {
    if (!search) return;
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) {
        alert("Location not found");
        setLoading(false);
        return;
      }

      const dest = [
        parseFloat(geoData[0].lat),
        parseFloat(geoData[0].lon),
      ];

      setDestination(dest);
      await fetchRoute(position, dest);
    } catch {
      alert("Search error");
    }

    setLoading(false);
  };

  const fetchRoute = async (start, end) => {
    try {
      const apiKey = import.meta.env.VITE_ORS_API_KEY;

      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.features?.length) {
        alert("No route found");
        return;
      }

      const coords = data.features[0].geometry.coordinates.map(
        (c) => [c[1], c[0]]
      );

      setRouteCoords(coords);

      // 🎨 Color-coded Segments
      const segments = coords.map((point) => {
        let color = "green";

        crimePoints.forEach((crime) => {
          const dist =
            Math.abs(point[0] - crime[0]) +
            Math.abs(point[1] - crime[1]);

          if (dist < 0.005) color = "red";
          else if (dist < 0.01 && color !== "red") color = "yellow";
        });

        return { point, color };
      });

      setRouteSegments(segments);
      setThreatLevel(calculateThreat(coords));

      setShareLink(
        `${window.location.origin}?lat=${end[0]}&lng=${end[1]}`
      );

      const summary = data.features[0].properties.summary;
      setDistance((summary.distance / 1000).toFixed(2));
      setTime((summary.duration / 60).toFixed(1));
    } catch {
      alert("Route fetch failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="flex justify-between px-8 py-4 bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold">DhruvTara ✨</h1>
        <div className="flex gap-3">
          <button onClick={() => setMapType("street")} className="px-3 py-1 bg-gray-700 rounded">Street</button>
          <button onClick={() => setMapType("dark")} className="px-3 py-1 bg-gray-700 rounded">Dark</button>
        </div>
      </nav>

      <div className="flex justify-center mt-6 gap-3 px-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destination..."
          className="p-3 rounded-lg bg-white/10 w-full max-w-xl"
        />
        <button onClick={searchLocation} className="px-5 bg-green-600 rounded-lg">Route</button>
        <button onClick={locateMe} className="px-5 bg-blue-600 rounded-lg">📍</button>
      </div>

      {distance && (
        <div className="text-center mt-4">
          Distance: {distance} km | ETA: {time} mins
        </div>
      )}

      {threatLevel && (
        <div className="text-center mt-2">
          AI Threat Level:{" "}
          <span className={
            threatLevel === "Low"
              ? "text-green-400"
              : threatLevel === "Medium"
              ? "text-yellow-400"
              : "text-red-500"
          }>
            {threatLevel}
          </span>
        </div>
      )}

      {shareLink && (
        <div className="text-center text-blue-400 break-all mt-2">
          🔗 Live Share: {shareLink}
        </div>
      )}

      <div className="m-8 rounded-2xl overflow-hidden">
        <MapContainer center={position} zoom={13} style={{ height: "600px" }}>
          <ChangeMapView center={destination || position} />
          {mapType === "street" && (
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          )}
          {mapType === "dark" && (
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          )}

          <HeatmapLayer points={crimePoints} />

          <Marker position={position} icon={userIcon}>
            <Popup>You 🚀</Popup>
          </Marker>

          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>Destination 📍</Popup>
            </Marker>
          )}

          {routeSegments.length > 0 &&
            routeSegments.map((seg, index) =>
              routeSegments[index + 1] ? (
                <Polyline
                  key={index}
                  positions={[
                    seg.point,
                    routeSegments[index + 1].point,
                  ]}
                  pathOptions={{ color: seg.color, weight: 6 }}
                />
              ) : null
            )}

          {routeCoords.length > 0 && (
            <Marker position={routeCoords[movingIndex]} icon={userIcon}>
              <Popup>Travelling...</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <button
        className="fixed bottom-10 right-10 bg-red-600 w-16 h-16 rounded-full text-xl shadow-2xl animate-pulse"
        onClick={() => setShowSOSModal(true)}
      >
        SOS
      </button>

      {showSOSModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-96 text-center space-y-4">
            <h2 className="text-xl font-bold text-red-500">Emergency Alert</h2>
            <button
              className="bg-red-600 px-4 py-2 rounded"
              onClick={() => {
                alert("🚨 Live location sent!");
                setShowSOSModal(false);
              }}
            >
              Send Alert
            </button>
            <button
              className="text-gray-400"
              onClick={() => setShowSOSModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}







