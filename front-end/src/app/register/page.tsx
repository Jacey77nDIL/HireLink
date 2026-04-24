"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // update the form states
  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // check if passwords match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 my-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-3xl font-black tracking-tighter text-black mb-2">
            Hire<span className="text-blue-600">Link</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Create an Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">Join our professional community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-slate-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-slate-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-slate-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
