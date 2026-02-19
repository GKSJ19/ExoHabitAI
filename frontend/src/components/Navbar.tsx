import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-white">

        <h1 className="text-xl font-bold tracking-wide">
          ExoHabit AI
        </h1>

        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/predict" className="hover:text-blue-400 transition">Predict</Link>
          <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About</Link>
        </div>

      </div>
    </nav>
  );
}
