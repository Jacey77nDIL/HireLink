"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-gray-800">
      <nav className="flex justify-between items-center px-8 py-5">
  <h1 className="text-2xl font-bold tracking-tight">HireLink</h1>
  <div className="space-x-6 hidden md:flex">
    <a href="#">Jobs</a>
    <a href="#">Companies</a>
    <a href="#">About</a>
  </div>
  <button className="bg-black text-white px-4 py-2 rounded-xl">
    Sign In
  </button>
</nav>
    </div>
  );
}