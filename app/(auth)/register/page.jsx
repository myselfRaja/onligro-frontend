"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Check } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = (formData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (phone.length < 10) {
      return "Please enter a valid phone number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.target);

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Start managing your salon business
          </p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Account created successfully!</p>
                  <p className="text-blue-600 text-sm">Redirecting to login...</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && !success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  required
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="owner@example.com"
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <div className="relative">
                <input
                  name="phone"
                  required
                  maxLength="10"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="9876543210"
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength="6"
                  className="w-full px-4 py-3 pl-11 pr-11 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="At least 6 characters"
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Account Created!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </div>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-gray-500 text-sm">Already have an account?</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-6 py-2.5 rounded-xl hover:border-gray-400 transition-all"
            >
              <User className="w-4 h-4" />
              Sign in to existing account
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            By registering, you agree to our terms and conditions
          </p>
        </motion.div>
      </div>
    </div>
  );
}