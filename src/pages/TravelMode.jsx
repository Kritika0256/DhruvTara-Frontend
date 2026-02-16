export default function TravelMode() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-2xl text-center">
        <h2 className="text-2xl mb-6">How are you travelling today?</h2>
        <div className="space-y-4">
          <button className="w-64 py-3 bg-white/10 rounded-lg">🚶 Walking</button>
          <button className="w-64 py-3 bg-white/10 rounded-lg">🚲 Bike</button>
          <button className="w-64 py-3 bg-white/10 rounded-lg">🚗 Car</button>
        </div>
      </div>
    </div>
  );
}
