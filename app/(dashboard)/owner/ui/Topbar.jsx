"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  LogOut, 
  Bell, 
  Settings, 
  User, 
  Search, 
  ChevronDown
} from "lucide-react";

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // ✅ Empty array
  const [ownerData, setOwnerData] = useState(null);
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch owner profile data
  useEffect(() => {
    async function fetchOwnerProfile() {
      try {
       const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/owner/profile`,
  {
    method: "GET",
    credentials: "include",
  }
);


        const data = await res.json();

        if (res.ok && data.owner) {
          setOwnerData(data.owner);
          setSalonData(data.salon);
        }
      } catch (err) {
        console.log("Owner profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnerProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ No fake notifications - Empty state only

  // Shorten salon name
  const getShortSalonName = (name) => {
    if (!name) return "Salon";
    
    // Remove "family salon" and similar words, keep only first word + "Salon"
    const shortName = name.split(' ')[0] + " Salon";
    return shortName.length > 20 ? name.substring(0, 20) + "..." : shortName;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden sm:block">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40"
    >
      {/* Left Section - Salon Info & Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        {/* Salon Name/Brand - Responsive */}
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            {getShortSalonName(salonData?.name)}
          </h1>
        </div>

        {/* Search Bar - Hidden on small mobile, visible from sm */}
        <div className="hidden sm:block relative max-w-md flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search appointments, customers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        {/* Mobile Search Icon - Visible only on small screens */}
        <button className="sm:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsDropdownOpen(false);
            }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* ✅ No notification badge - Clean */}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-10 sm:top-12 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {/* Notifications Header */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                </div>

                {/* ✅ Empty Notifications State */}
                <div className="px-4 py-6 text-center">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs sm:text-sm">No notifications</p>
                  <p className="text-gray-400 text-xs mt-1">Real-time updates coming soon</p>
                </div>

                {/* Notifications Footer - Hidden for now */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors group min-w-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm border border-white shadow-sm">
                  {ownerData?.name?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border border-white rounded-full"></div>
              </div>

              {/* User Info - Hidden on mobile, visible from sm */}
              <div className="hidden sm:block text-left min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 truncate max-w-[120px]">
                  {ownerData?.name || "Owner"}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate max-w-[120px]">
                  {ownerData?.email || "salon@example.com"}
                </p>
              </div>

              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform flex-shrink-0 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </div>
          </button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-10 sm:top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {/* User Info in Dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{ownerData?.name || "Owner"}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{ownerData?.email || "salon@example.com"}</p>
                  {ownerData?.phone && (
                    <p className="text-xs text-gray-500 mt-1">{ownerData.phone}</p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                </div>

                {/* Salon Info */}
                {salonData && (
                  <div className="border-t border-gray-100 pt-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Salon</p>
                      <p className="text-sm text-gray-900 font-semibold">{getShortSalonName(salonData.name)}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {salonData.address && `${salonData.address}, `}{salonData.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Logout Section */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}