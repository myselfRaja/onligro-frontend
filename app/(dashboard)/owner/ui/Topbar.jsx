"use client";
import { io } from "socket.io-client";

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
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
   const [userRole, setUserRole] = useState(null);  
  const dropdownRef = useRef(null);

  // ✅ Fetch user data from localStorage first
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser && storedUser.name) {
      setUserData(storedUser);
      setUserRole(storedUser.role || "owner");
      setLoading(false);
    }
  }, []);

  // ✅ Fetch owner profile ONLY if user is owner
  useEffect(() => {
    // Agar staff hai toh owner profile fetch mat karo
    if (userRole === "staff") {
      setLoading(false);
      return;
    }

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
          setUserData(data.owner);
          setSalonData(data.salon);
        }
      } catch (err) {
        console.log("Owner profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    // Agar owner hai toh fetch karo
    if (userRole === "owner") {
      fetchOwnerProfile();
    }
  }, [userRole]);

  // 🔥 Socket.io - Real-time notifications (Only for owner)
 useEffect(() => {
  // Staff ke liye socket mat chalao
  if (userRole === "staff") return;

  const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("new_appointment", (data) => {
    console.log("📅 New appointment:", data);
    const newNotif = {
      id: Date.now(),
      message: `📅 New booking: ${data.appointment?.customerName || "Customer"}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 10000);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err);
  });

  return () => {
    socket.disconnect();
  };
}, [userRole]);

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
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("owner");
      localStorage.removeItem("user");
      sessionStorage.clear();

      window.location.href = "/login";

    } catch (error) {
      console.log("Logout error:", error);
      window.location.href = "/login";
    }
  };

  // ✅ Display name - staff ya owner
  const getDisplayName = () => {
    if (userData?.name) return userData.name;
    return userRole === "staff" ? "Staff" : "Owner";
  };

  const getShortSalonName = (name) => {
    if (!name) return userRole === "staff" ? "Staff Billing" : "Salon";
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
      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            {userRole === "staff" ? "💳 Billing" : getShortSalonName(salonData?.name)}
          </h1>
        </div>

        <div className="hidden sm:block relative max-w-md flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={userRole === "staff" ? "Search bills..." : "Search appointments, customers..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        <button className="sm:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - Only for Owner */}
        {userRole === "owner" && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsDropdownOpen(false);
              }}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 sm:top-12 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                          <div className="flex items-start gap-3">
                            <span className="text-lg mt-0.5">📅</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
              <div className="relative flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm border border-white shadow-sm">
                  {getDisplayName()?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border border-white rounded-full"></div>
              </div>

              <div className="hidden sm:block text-left min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 truncate max-w-[120px]">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate max-w-[120px]">
                  {userRole === "staff" ? "Staff" : (userData?.email || "Owner")}
                </p>
              </div>

              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform flex-shrink-0 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-10 sm:top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{getDisplayName()}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {userRole === "staff" ? "Staff Member" : (userData?.email || "salon@example.com")}
                  </p>
                  {userRole === "staff" && (
                    <p className="text-xs text-blue-600 mt-1">💳 Billing Access Only</p>
                  )}
                  {userData?.phone && userRole === "owner" && (
                    <p className="text-xs text-gray-500 mt-1">{userData.phone}</p>
                  )}
                </div>

                {userRole === "owner" && (
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
                )}

                {salonData && userRole === "owner" && (
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