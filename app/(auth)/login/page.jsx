"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // Call backend login
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      window.location.href = "/owner/dashboard";
    } else {
      alert(data.message);
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center px-4">

      {/* Animated Glow Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-[450px] h-[450px] rounded-full bg-white blur-[150px]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Owner Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg outline-none placeholder-gray-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-1 px-4 py-2 bg-white/20 text-white rounded-lg outline-none placeholder-gray-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-white/80 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="underline hover:text-white">
            Create one
          </a>
        </p>
      </motion.div>
    </div>
  );
}
