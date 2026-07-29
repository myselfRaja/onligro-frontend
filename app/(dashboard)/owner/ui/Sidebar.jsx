"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ---- ALL MENU ITEMS ----
const allMenuItems = [
  { name: "Dashboard", href: "/owner/dashboard", icon: "🏠" },
  { name: "Billing", href: "/owner/billing", icon: "💳" },
  { name: "Billing History", href: "/owner/billing-history", icon: "📋" },
  { name: "Customers", href: "/owner/customers", icon: "👤" },
  { name: "Inventory", href: "/owner/inventory", icon: "📦" },
  { name: "Reports", href: "/owner/reports", icon: "📊" },
  { name: "Salon Setup", href: "/owner/salon", icon: "🏢" },
  { name: "Staff", href: "/owner/staff", icon: "👥" },
  { name: "Services", href: "/owner/services", icon: "✂️" },
  { name: "Working Hours", href: "/owner/hours", icon: "⏱️" },
  { name: "Appointments", href: "/owner/appointments", icon: "📅" },
];

// ---- STAFF MENU ITEMS ----
const staffMenuItems = [
  { name: "Billing", href: "/owner/billing", icon: "💳" },
  { name: "Appointments", href: "/owner/appointments", icon: "📅" },  // ✅ ADD THIS LINE
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("owner");  // ✅ Default owner
  const [loading, setLoading] = useState(true);

  // ✅ Check user role
  useEffect(() => {
    async function getRole() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.user || data.owner;
          setUserRole(user?.role || "owner");
        } else {
          setUserRole("owner");
        }
      } catch (error) {
        console.error("Error getting role:", error);
        setUserRole("owner");
      } finally {
        setLoading(false);
      }
    }
    getRole();
  }, []);

  // ✅ Decide menu based on role
  const menuItems = userRole === "staff" ? staffMenuItems : allMenuItems;

  // ---- Active link detection ----
  const isActive = (href) => {
    if (href === '/owner/billing') {
      return pathname === '/owner/billing';
    }
    if (href === '/owner/billing-history') {
      return pathname === '/owner/billing-history';
    }
    if (href !== '/owner/billing' && href !== '/owner/billing-history') {
      return pathname.startsWith(href);
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  // ✅ Loading state - Sirf spinner dikhao, menu mat dikhao
  if (loading) {
    return (
      <div className="hidden md:flex h-screen bg-[#0D1025] text-white flex-col py-5 px-3 items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}
      <motion.aside
        animate={{ width: collapsed ? 70 : 240 }}
        transition={{ duration: 0.25 }}
        className="hidden md:flex h-screen bg-[#0D1025] text-white flex-col py-5 px-3 sticky top-0 border-r border-white/5 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          {!collapsed && (
            <h2 className="text-2xl font-bold tracking-wide text-white/90">
              {userRole === "staff" ? "💳 Billing" : "Onligro"}
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-white/10"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.div>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 6, scale: 1.03 }}
                  className={`
                    flex items-center gap-3
                    px-3 py-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#6D28D9] text-white shadow-lg shadow-purple-900/20"
                        : "hover:bg-[#6D28D9]/20 text-white/80"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Staff Label */}
        {userRole === "staff" && !collapsed && (
          <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-300 text-center">
              🔒 Staff Access<br />
              <span className="text-[10px] text-purple-400/70">Billing Only</span>
            </p>
          </div>
        )}

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ========================= */}
      {/* MOBILE BOTTOM NAVBAR */}
      {/* ========================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D1025] border-t border-white/10 text-white z-50 overflow-x-auto">
        <div className="flex min-w-max px-2 py-2 gap-4">
          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col items-center min-w-[70px] text-xs ${
                    active ? "text-purple-400" : "text-white/70"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center min-w-[70px] text-xs text-red-400"
          >
            <span className="text-xl">🚪</span>
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* MOBILE DRAWER */}
      {/* ========================= */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="fixed bottom-0 left-0 w-full bg-[#0D1025] text-white p-6 rounded-t-2xl z-50 shadow-2xl"
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">More Options</h2>
            <button onClick={() => setMobileMenuOpen(false)}>✖</button>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
            >
              <span className="text-xl">🚪</span>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}