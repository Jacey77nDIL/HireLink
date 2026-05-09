"use client";

import {
  Home,
  Briefcase,
  Bookmark,
  Settings,
  Bell,
  UserCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10">HireLink</h2>

        <nav className="space-y-6">
          <a href="#" className="flex items-center gap-3">
            <Home size={18} />
            <span>Overview</span>
          </a>

          <a href="#" className="flex items-center gap-3">
            <Briefcase size={18} />
            <span>Jobs</span>
          </a>

          <a href="#" className="flex items-center gap-3">
            <Bookmark size={18} />
            <span>Saved</span>
          </a>

          <a href="#" className="flex items-center gap-3">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">
              Track jobs and applications
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="cursor-pointer" />

            <UserCircle
              size={32}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Dashboard Title */}
        <h2 className="text-2xl font-bold mb-6">
          Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          
          {/* Applications Sent */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Applications Sent
            </h3>

            <p className="text-3xl font-bold mt-2">
              24
            </p>
          </div>

          {/* Interviews */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Interviews
            </h3>

            <p className="text-3xl font-bold mt-2">
              8
            </p>
          </div>

          {/* Saved Jobs */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Saved Jobs
            </h3>

            <p className="text-3xl font-bold mt-2">
              12
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}