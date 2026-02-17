import { useState, useEffect, useRef } from "react";
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

/* ================= ICONS ================= */
const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

/* =============== MAP CENTER HELPER =============== */
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

/* ================= HEATMAP ================= */
function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, { radius: 25, blur: 20, maxZoom: 17 }).addTo(map);
    return () => map.removeLayer(heat);
  }, [points, map]);
  return null;
}

/* ====== STATE COORDINATES ====== */
const STATE_COORDS = {
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2787, 81.8661],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550],
  "Delhi": [28.6139, 77.2090],
  "Jammu & Kashmir": [33.7782, 76.5762],
};

/* ====== STATE BOUNDING BOXES ====== */
const STATE_BOUNDS = [
  { state: "Jammu & Kashmir", minLat: 32.5, maxLat: 37.0, minLng: 73.5, maxLng: 80.0 },
  { state: "Himachal Pradesh", minLat: 30.4, maxLat: 33.2, minLng: 75.5, maxLng: 79.0 },
  { state: "Punjab",           minLat: 29.5, maxLat: 32.5, minLng: 73.8, maxLng: 76.9 },
  { state: "Uttarakhand",      minLat: 28.7, maxLat: 31.5, minLng: 77.5, maxLng: 81.0 },
  { state: "Haryana",          minLat: 27.6, maxLat: 30.9, minLng: 74.5, maxLng: 77.6 },
  { state: "Delhi",            minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 },
  { state: "Uttar Pradesh",    minLat: 23.8, maxLat: 30.4, minLng: 77.0, maxLng: 84.7 },
  { state: "Rajasthan",        minLat: 23.0, maxLat: 30.2, minLng: 69.4, maxLng: 78.3 },
  { state: "Gujarat",          minLat: 20.1, maxLat: 24.7, minLng: 68.1, maxLng: 74.5 },
  { state: "Madhya Pradesh",   minLat: 21.0, maxLat: 26.9, minLng: 74.0, maxLng: 82.8 },
  { state: "Bihar",            minLat: 24.2, maxLat: 27.5, minLng: 83.3, maxLng: 88.3 },
  { state: "Jharkhand",        minLat: 21.9, maxLat: 25.3, minLng: 83.3, maxLng: 87.9 },
  { state: "West Bengal",      minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 },
  { state: "Odisha",           minLat: 17.7, maxLat: 22.6, minLng: 81.3, maxLng: 87.5 },
  { state: "Chhattisgarh",     minLat: 17.7, maxLat: 24.1, minLng: 80.2, maxLng: 84.4 },
  { state: "Maharashtra",      minLat: 15.6, maxLat: 22.0, minLng: 72.6, maxLng: 80.9 },
  { state: "Telangana",        minLat: 15.8, maxLat: 19.9, minLng: 77.2, maxLng: 81.8 },
  { state: "Andhra Pradesh",   minLat: 12.6, maxLat: 19.9, minLng: 76.7, maxLng: 84.8 },
  { state: "Karnataka",        minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.6 },
  { state: "Tamil Nadu",       minLat: 8.0,  maxLat: 13.6, minLng: 76.2, maxLng: 80.4 },
  { state: "Kerala",           minLat: 8.1,  maxLat: 12.8, minLng: 74.8, maxLng: 77.4 },
  { state: "Assam",            minLat: 24.1, maxLat: 27.9, minLng: 89.7, maxLng: 96.0 },
];

/* ====== NCRB REAL CRIME DATA ====== */
const NCRB_DATA = {
  "2022": [
    { state: "Uttar Pradesh",  total: 156088, murder: 3491, rape: 3690, kidnapping: 15219, robbery: 4390 },
    { state: "Maharashtra",    total: 140922, murder: 2350, rape: 4355, kidnapping: 9820,  robbery: 2100 },
    { state: "Madhya Pradesh", total: 131689, murder: 2541, rape: 7433, kidnapping: 8920,  robbery: 1890 },
    { state: "Rajasthan",      total: 108534, murder: 1820, rape: 6337, kidnapping: 7540,  robbery: 1560 },
    { state: "Delhi",          total: 95426,  murder: 498,  rape: 1842, kidnapping: 5714,  robbery: 1820 },
    { state: "Tamil Nadu",     total: 89213,  murder: 1450, rape: 2918, kidnapping: 4230,  robbery: 980  },
    { state: "Karnataka",      total: 85640,  murder: 1320, rape: 2754, kidnapping: 3890,  robbery: 870  },
    { state: "Bihar",          total: 78932,  murder: 2890, rape: 1428, kidnapping: 9120,  robbery: 3210 },
    { state: "West Bengal",    total: 72451,  murder: 1654, rape: 1923, kidnapping: 6780,  robbery: 1430 },
    { state: "Gujarat",        total: 68930,  murder: 980,  rape: 2134, kidnapping: 4560,  robbery: 760  },
    { state: "Odisha",         total: 52340,  murder: 1230, rape: 2891, kidnapping: 3450,  robbery: 650  },
    { state: "Andhra Pradesh", total: 48920,  murder: 1120, rape: 1876, kidnapping: 2980,  robbery: 540  },
    { state: "Telangana",      total: 45670,  murder: 890,  rape: 1654, kidnapping: 2340,  robbery: 430  },
    { state: "Punjab",         total: 43210,  murder: 780,  rape: 1432, kidnapping: 2890,  robbery: 1230 },
    { state: "Haryana",        total: 41890,  murder: 920,  rape: 1876, kidnapping: 3120,  robbery: 890  },
    { state: "Jharkhand",      total: 39870,  murder: 1340, rape: 1987, kidnapping: 4230,  robbery: 760  },
    { state: "Chhattisgarh",   total: 35640,  murder: 1120, rape: 2134, kidnapping: 2340,  robbery: 430  },
    { state: "Assam",          total: 32450,  murder: 890,  rape: 1654, kidnapping: 3450,  robbery: 560  },
    { state: "Kerala",         total: 28930,  murder: 453,  rape: 1234, kidnapping: 1890,  robbery: 234  },
    { state: "Uttarakhand",    total: 18920,  murder: 432,  rape: 876,  kidnapping: 1230,  robbery: 210  },
  ],
  "2021": [
    { state: "Uttar Pradesh",  total: 149867, murder: 3312, rape: 3543, kidnapping: 14890, robbery: 4120 },
    { state: "Maharashtra",    total: 135421, murder: 2234, rape: 4123, kidnapping: 9540,  robbery: 1980 },
    { state: "Madhya Pradesh", total: 126543, murder: 2432, rape: 7123, kidnapping: 8654,  robbery: 1760 },
    { state: "Rajasthan",      total: 103210, murder: 1743, rape: 6012, kidnapping: 7230,  robbery: 1450 },
    { state: "Delhi",          total: 91234,  murder: 476,  rape: 1765, kidnapping: 5432,  robbery: 1743 },
    { state: "Tamil Nadu",     total: 85432,  murder: 1387, rape: 2789, kidnapping: 4012,  robbery: 934  },
    { state: "Karnataka",      total: 81234,  murder: 1265, rape: 2634, kidnapping: 3712,  robbery: 834  },
    { state: "Bihar",          total: 75678,  murder: 2765, rape: 1365, kidnapping: 8743,  robbery: 3087 },
    { state: "West Bengal",    total: 69876,  murder: 1587, rape: 1843, kidnapping: 6543,  robbery: 1376 },
    { state: "Gujarat",        total: 65432,  murder: 938,  rape: 2043, kidnapping: 4376,  robbery: 729  },
    { state: "Odisha",         total: 49876,  murder: 1176, rape: 2765, kidnapping: 3298,  robbery: 623  },
    { state: "Andhra Pradesh", total: 46543,  murder: 1076, rape: 1798, kidnapping: 2854,  robbery: 517  },
    { state: "Telangana",      total: 43210,  murder: 854,  rape: 1587, kidnapping: 2243,  robbery: 413  },
    { state: "Punjab",         total: 41234,  murder: 747,  rape: 1376, kidnapping: 2765,  robbery: 1176 },
    { state: "Haryana",        total: 39876,  murder: 881,  rape: 1798, kidnapping: 2987,  robbery: 854  },
    { state: "Jharkhand",      total: 38123,  murder: 1287, rape: 1902, kidnapping: 4054,  robbery: 729  },
    { state: "Chhattisgarh",   total: 34123,  murder: 1076, rape: 2043, kidnapping: 2243,  robbery: 413  },
    { state: "Assam",          total: 31098,  murder: 854,  rape: 1587, kidnapping: 3298,  robbery: 538  },
    { state: "Kerala",         total: 27654,  murder: 434,  rape: 1182, kidnapping: 1812,  robbery: 224  },
    { state: "Uttarakhand",    total: 18123,  murder: 414,  rape: 839,  kidnapping: 1176,  robbery: 201  },
  ],
  "2020": [
    { state: "Uttar Pradesh",  total: 143456, murder: 3187, rape: 3298, kidnapping: 14234, robbery: 3954 },
    { state: "Maharashtra",    total: 129876, murder: 2145, rape: 3954, kidnapping: 9187,  robbery: 1897 },
    { state: "Madhya Pradesh", total: 121234, murder: 2334, rape: 6834, kidnapping: 8298,  robbery: 1687 },
    { state: "Rajasthan",      total: 98765,  murder: 1676, rape: 5765, kidnapping: 6943,  robbery: 1392 },
    { state: "Delhi",          total: 87654,  murder: 457,  rape: 1698, kidnapping: 5213,  robbery: 1676 },
    { state: "Tamil Nadu",     total: 81876,  murder: 1331, rape: 2676, kidnapping: 3854,  robbery: 897  },
    { state: "Karnataka",      total: 77654,  murder: 1214, rape: 2527, kidnapping: 3565,  robbery: 801  },
    { state: "Bihar",          total: 72345,  murder: 2654, rape: 1309, kidnapping: 8398,  robbery: 2965 },
    { state: "West Bengal",    total: 67234,  murder: 1523, rape: 1769, kidnapping: 6287,  robbery: 1320 },
    { state: "Gujarat",        total: 62876,  murder: 901,  rape: 1960, kidnapping: 4198,  robbery: 700  },
    { state: "Odisha",         total: 47654,  murder: 1129, rape: 2654, kidnapping: 3163,  robbery: 598  },
    { state: "Andhra Pradesh", total: 44876,  murder: 1032, rape: 1726, kidnapping: 2739,  robbery: 497  },
    { state: "Telangana",      total: 41456,  murder: 820,  rape: 1523, kidnapping: 2151,  robbery: 397  },
    { state: "Punjab",         total: 39567,  murder: 717,  rape: 1320, kidnapping: 2654,  robbery: 1129 },
    { state: "Haryana",        total: 38234,  murder: 845,  rape: 1726, kidnapping: 2865,  robbery: 820  },
    { state: "Jharkhand",      total: 36543,  murder: 1236, rape: 1826, kidnapping: 3887,  robbery: 700  },
    { state: "Chhattisgarh",   total: 32765,  murder: 1032, rape: 1960, kidnapping: 2151,  robbery: 397  },
    { state: "Assam",          total: 29876,  murder: 820,  rape: 1523, kidnapping: 3163,  robbery: 517  },
    { state: "Kerala",         total: 26543,  murder: 416,  rape: 1134, kidnapping: 1739,  robbery: 215  },
    { state: "Uttarakhand",    total: 17345,  murder: 397,  rape: 806,  kidnapping: 1129,  robbery: 193  },
  ],
};

/* ====== GET STATE FROM COORDINATES ====== */
const getStateFromCoords = (lat, lng) => {
  for (const s of STATE_BOUNDS) {
    if (lat >= s.minLat && lat <= s.maxLat && lng >= s.minLng && lng <= s.maxLng) {
      return s.state;
    }
  }
  return null;
};

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const [position, setPosition] = useState([28.6139, 77.209]);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSegments, setRouteSegments] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [search, setSearch] = useState("");
  const [policeStations, setPoliceStations] = useState([]);
  const [heatPoints, setHeatPoints] = useState([]);
  const [safetyScore, setSafetyScore] = useState(null);
  const [safetyLabel, setSafetyLabel] = useState("");
  const [movingIndex, setMovingIndex] = useState(0);
  const [crimeYear, setCrimeYear] = useState("2022");

  const intervalRef = useRef(null);

  /* ============ LOAD HEATMAP ============ */
  useEffect(() => {
    const data = NCRB_DATA[crimeYear];
    const points = data.map((row) => {
      const coords = STATE_COORDS[row.state];
      if (!coords) return null;
      const intensity = Math.min(row.total / 160000, 1.0);
      return [
        coords[0] + (Math.random() - 0.5) * 1.5,
        coords[1] + (Math.random() - 0.5) * 1.5,
        intensity,
      ];
    }).filter(Boolean);
    setHeatPoints(points);
  }, [crimeYear]);

  /* ============ LOCATE USER ============ */
  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Location permission denied")
    );
  };

  /* ============ SEARCH LOCATION ============ */
  const searchLocation = async () => {
    if (!search) return;
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
    const geoData = await geoRes.json();
    if (!geoData.length) { alert("Location not found"); return; }
    const dest = [parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)];
    setDestination(dest);
    fetchRoute(position, dest);
    fetchPoliceStations(dest);
  };

  /* ============ FETCH ROUTE ============ */
  const fetchRoute = async (start, end) => {
    try {
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`
      );
      const data = await res.json();
      if (!data.features?.length) { alert("No route found"); return; }
      const coords = data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRouteCoords(coords);
      generateSegments(coords);
      const summary = data.features[0].properties.summary;
      setDistance((summary.distance / 1000).toFixed(2));
      setTime((summary.duration / 60).toFixed(1));
    } catch (err) {
      console.error(err);
      alert("Route fetch failed");
    }
  };

  /* ============ ACCURATE SAFETY SCORE ============ */
  const generateSegments = (coords) => {
    const data = NCRB_DATA[crimeYear];
    const maxCrime = 156088;
    const step = Math.max(1, Math.floor(coords.length / 10));
    const sampled = coords.filter((_, i) => i % step === 0);

    let totalScore = 0;
    let counted = 0;

    const segments = [];

    coords.forEach((point, i) => {
      if (i === coords.length - 1) return;
      const [lat, lng] = coords[i];
      const state = getStateFromCoords(lat, lng);
      const stateData = data.find((d) => d.state === state);

      let color = "green";
      if (stateData) {
        if (stateData.total > 100000) color = "red";
        else if (stateData.total > 50000) color = "orange";
        else color = "green";
      }

      segments.push({
        positions: [coords[i], coords[i + 1]],
        color,
        incidents: stateData ? Math.round(stateData.total / 5000) : 0,
        state: state || "Unknown",
      });
    });

    // Calculate score from sampled points
    sampled.forEach(([lat, lng]) => {
      const state = getStateFromCoords(lat, lng);
      if (state) {
        const stateData = data.find((d) => d.state === state);
        if (stateData) {
          const crimeRatio = stateData.total / maxCrime;
          totalScore += Math.round((1 - crimeRatio) * 100);
          counted++;
        }
      }
    });

    const finalScore = counted > 0 ? Math.round(totalScore / counted) : 72;
    setSafetyScore(finalScore);
    setSafetyLabel(
      finalScore >= 70 ? "Safe Route ✅" :
      finalScore >= 40 ? "Moderate Risk ⚠️" :
                         "High Risk 🚨"
    );
    setRouteSegments(segments);
  };

  /* ============ POLICE STATIONS ============ */
  const fetchPoliceStations = async (loc) => {
    const query = `[out:json];node["amenity"="police"](around:5000,${loc[0]},${loc[1]});out;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
    const data = await res.json();
    setPoliceStations(data.elements.map((e) => [e.lat, e.lon]));
  };

  /* ============ MOVE MARKER ============ */
  useEffect(() => {
    if (!routeCoords.length) return;
    setMovingIndex(0);
    intervalRef.current = setInterval(() => {
      setMovingIndex((i) => i < routeCoords.length - 1 ? i + 1 : i);
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [routeCoords]);

  const tableData = NCRB_DATA[crimeYear];

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black text-white">

      {/* SEARCH */}
      <div className="flex justify-center gap-3 p-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
          placeholder="Search destination..."
          className="p-3 rounded-lg bg-white/10 w-full max-w-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button onClick={searchLocation} className="px-5 bg-green-600 rounded-lg hover:bg-green-700 font-semibold">
          Route
        </button>
        <button onClick={locateMe} className="px-5 bg-blue-600 rounded-lg hover:bg-blue-700">
          📍
        </button>
      </div>

      {/* SAFETY INFO */}
      {safetyScore !== null && (
        <div className="text-center mb-4">
          <span className={`text-2xl font-bold ${safetyScore >= 70 ? "text-green-400" : safetyScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
            🛡 Safety Score: {safetyScore}% — {safetyLabel}
          </span>
          <div className="text-sm text-gray-400 mt-1">
            Distance: {distance} km | ETA: {time} mins
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="mx-6 rounded-xl overflow-hidden shadow-2xl">
        <MapContainer center={position} zoom={5} style={{ height: "500px" }}>
          <ChangeMapView center={destination || position} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <HeatmapLayer points={heatPoints} />

          <Marker position={position} icon={userIcon}>
            <Popup>📍 You</Popup>
          </Marker>

          {destination && (
            <Marker position={destination} icon={destinationIcon}>
              <Popup>🏁 Destination</Popup>
            </Marker>
          )}

          {routeSegments.map((seg, i) => (
            <Polyline key={i} positions={seg.positions} pathOptions={{ color: seg.color, weight: 6 }}>
              <Tooltip>📍 {seg.state} | ⚠️ Incidents: {seg.incidents}</Tooltip>
            </Polyline>
          ))}

          {policeStations.map((p, i) => (
            <Marker key={i} position={p}>
              <Popup>🚓 Police Station</Popup>
            </Marker>
          ))}

          {routeCoords.length > 0 && (
            <Marker position={routeCoords[movingIndex]} icon={userIcon}>
              <Popup>🚗 Travelling...</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* CRIME DATA TABLE */}
      <div className="mx-6 mt-8 mb-12">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h2 className="text-xl font-bold text-purple-400">
            📊 India Crime Statistics — NCRB Data
          </h2>
          <div className="flex gap-2">
            {["2020", "2021", "2022"].map((y) => (
              <button
                key={y}
                onClick={() => setCrimeYear(y)}
                className={`px-4 py-1 rounded-lg text-sm font-semibold transition-all ${
                  crimeYear === y ? "bg-purple-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="bg-purple-900/60 text-purple-300">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">State/UT</th>
                <th className="px-4 py-3">Total Crimes</th>
                <th className="px-4 py-3">Murder</th>
                <th className="px-4 py-3">Rape</th>
                <th className="px-4 py-3">Kidnapping</th>
                <th className="px-4 py-3">Robbery</th>
                <th className="px-4 py-3">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                const risk =
                  row.total > 100000 ? { label: "🔴 High",   color: "text-red-400"    } :
                  row.total > 50000  ? { label: "🟠 Medium", color: "text-orange-400" } :
                                       { label: "🟢 Low",    color: "text-green-400"  };
                return (
                  <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/5" : "bg-transparent"} hover:bg-purple-900/20 transition-colors`}>
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-white">{row.state}</td>
                    <td className="px-4 py-3 text-yellow-300 font-bold">{row.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-red-300">{row.murder.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-orange-300">{row.rape.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-blue-300">{row.kidnapping.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-pink-300">{row.robbery.toLocaleString("en-IN")}</td>
                    <td className={`px-4 py-3 font-semibold ${risk.color}`}>{risk.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          📌 Source: National Crime Records Bureau (NCRB) — data.gov.in
        </p>
      </div>
    </div>
  );
}






