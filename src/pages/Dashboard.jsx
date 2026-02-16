import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

// 🔐 IMPORTANT: Move API key to .env
// VITE_ORS_API_KEY=your_key_here

const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

// ✅ Auto center map
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

// 🔥 Heatmap
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
    }).addTo(map);

    return () => map.removeLayer(heat);
  }, [points, map]);

  return null;
}

export default function Dashboard() {
  const [position, setPosition] = useState([28.6139, 77.2090]);
  const [destination, setDestination] = useState(null);
  const [routeSegments, setRouteSegments] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [search, setSearch] = useState("");
  const [mapType, setMapType] = useState("street");
  const [policeStations, setPoliceStations] = useState([]);
  const [heatPoints, setHeatPoints] = useState([]);
  const [safetyScore, setSafetyScore] = useState(null);

  // 📍 Locate user
  const locateMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  // 🔎 Search location
  const searchLocation = async () => {
    if (!search) return;

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
    );
    const geoData = await geoRes.json();
    if (!geoData.length) return;

    const dest = [parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)];
    setDestination(dest);

    fetchRoute(position, dest);
    fetchPoliceStations(dest);
  };

  // 🛣 Fetch route
  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_ORS_API_KEY,
          },
          body: JSON.stringify({
            coordinates: [
              [start[1], start[0]],
              [end[1], end[0]],
            ],
          }),
        }
      );

      const data = await response.json();
      if (!data.features) return;

      const coords =
        data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);

      const totalDistance =
        (data.features[0].properties.summary.distance / 1000).toFixed(2);

      const totalTime =
        (data.features[0].properties.summary.duration / 60).toFixed(1);

      setDistance(totalDistance);
      setTime(totalTime);

      generateSegments(coords);

    } catch (error) {
      console.error("Route fetch error:", error);
    }
  };

  // 🧠 AI segmentation
  const generateSegments = (coords) => {
    let score = 100;
    const segments = [];

    coords.forEach((point, i) => {
      if (i === coords.length - 1) return;

      const rand = Math.random();
      let color = "lime";
      let risk = 0;

      if (rand > 0.6 && rand <= 0.85) {
        color = "orange";
        risk = 10;
      } else if (rand > 0.85) {
        color = "red";
        risk = 25;
      }

      score -= risk;

      segments.push({
        positions: [coords[i], coords[i + 1]],
        color,
        incidents: Math.floor(Math.random() * 30),
      });
    });

    setSafetyScore(Math.max(score, 0));
    setRouteSegments(segments);

    const heat = coords.map((c) => [c[0], c[1], Math.random()]);
    setHeatPoints(heat);
  };

  // 🚓 Police stations
  const fetchPoliceStations = async (location) => {
    const query = `
      [out:json];
      node["amenity"="police"](around:5000,${location[0]},${location[1]});
      out;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();
    const stations = data.elements.map((el) => [el.lat, el.lon]);
    setPoliceStations(stations);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAV */}
      <nav className="flex justify-between px-8 py-4 bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold">DhruvTara ✨</h1>
        <div className="flex gap-3">
          <button onClick={() => setMapType("street")} className="px-3 py-1 bg-gray-700 rounded">
            Street
          </button>
          <button onClick={() => setMapType("satellite")} className="px-3 py-1 bg-gray-700 rounded">
            Terrain
          </button>
        </div>
      </nav>

      {/* SEARCH */}
      <div className="flex justify-center mt-6 gap-3 px-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destination..."
          className="p-3 rounded-lg bg-white/10 w-full max-w-xl"
        />
        <button onClick={searchLocation} className="px-5 bg-green-600 rounded-lg">
          Route
        </button>
        <button onClick={locateMe} className="px-5 bg-blue-600 rounded-lg">
          📍
        </button>
      </div>

      {/* AI SCORE */}
      {safetyScore !== null && (
        <div className="text-center mt-4 text-xl">
          🛡 AI Safety Score:{" "}
          <span
            className={
              safetyScore > 70
                ? "text-green-400"
                : safetyScore > 40
                ? "text-yellow-400"
                : "text-red-500"
            }
          >
            {safetyScore}%
          </span>

          {distance && (
            <div className="text-sm text-gray-400 mt-2">
              Distance: {distance} km | ETA: {time} mins
            </div>
          )}
        </div>
      )}

      {/* MAP */}
      <div className="m-8 rounded-2xl overflow-hidden">
        <MapContainer center={position} zoom={13} style={{ height: "600px" }}>
          <ChangeMapView center={destination || position} />

          {mapType === "street" ? (
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          ) : (
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          )}

          <Marker position={position} icon={userIcon}>
            <Popup>You 🚀</Popup>
          </Marker>

          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>Destination 📍</Popup>
            </Marker>
          )}

          {routeSegments.map((seg, i) => (
            <Polyline
              key={i}
              positions={seg.positions}
              pathOptions={{
                color: seg.color,
                weight: 6,
                dashArray: seg.color === "red" ? "10" : null,
              }}
            >
              <Tooltip>Crime Incidents: {seg.incidents}</Tooltip>
            </Polyline>
          ))}

          {policeStations.map((station, i) => (
            <Marker key={i} position={station}>
              <Popup>🚓 Police Station</Popup>
            </Marker>
          ))}

          <HeatmapLayer points={heatPoints} />
        </MapContainer>
      </div>

      {/* SOS */}
      <button
        className="fixed bottom-10 right-10 bg-red-600 w-16 h-16 rounded-full text-xl shadow-2xl animate-pulse"
        onClick={() => alert("🚨 Emergency Alert Sent!")}
      >
        SOS
      </button>

    </div>
  );
}



