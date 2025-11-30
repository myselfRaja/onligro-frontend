"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Account created. Please login.");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center px-4">

      {/* Glow Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute w-[500px] h-[500px] rounded-full bg-white blur-[150px]"
      />

      {/* Register Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Owner Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-white text-sm">Full Name</label>
            <input
              name="name"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg placeholder-gray-200 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg placeholder-gray-200 outline-none"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="text-white text-sm">Phone</label>
            <input
              name="phone"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg placeholder-gray-200 outline-none"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg placeholder-gray-200 outline-none"
              placeholder="Create password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-white/80 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-white">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
