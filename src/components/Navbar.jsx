import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#1f1c2c] to-[#2c3e50] text-white px-8 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">DhruvTara ✨</div>
      <div className="flex gap-6 text-sm">
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}




