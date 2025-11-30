"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ---- MAIN MENU ITEMS ----
const menuItems = [
  { name: "Dashboard", href: "/owner/dashboard", icon: "🏠" },
  { name: "Salon Setup", href: "/owner/salon", icon: "🏢" },
  { name: "Staff", href: "/owner/staff", icon: "👥" },
{ name: "Services", href: "/owner/services", icon: "✂️" },
  { name: "Working Hours", href: "/owner/hours", icon: "⏱️" },
  { name: "Appointments", href: "/owner/appointments", icon: "📅" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}
      <motion.aside
        animate={{ width: collapsed ? 70 : 240 }}
        transition={{ duration: 0.25 }}
      // ❌ PROBLEM - Multi-line template literal
className="hidden md:flex h-screen bg-[#0D1025] text-white flex-col py-5 px-3 sticky top-0 border-r border-white/5 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          {!collapsed && (
            <h2 className="text-2xl font-bold tracking-wide text-white/90">
              Onligro
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
            const active = pathname.startsWith(item.href);

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
      </motion.aside>

      {/* ========================= */}
      {/* MOBILE BOTTOM NAVBAR */}
      {/* ========================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0D1025] border-t border-white/10 py-2 flex justify-around text-white z-50">

        {menuItems.slice(0, 4).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex flex-col items-center text-xs ${
                  active ? "text-purple-400" : "text-white/70"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name.split(" ")[0]}
              </div>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center text-xs text-white/70"
        >
          <span className="text-xl">⋮</span>
          More
        </button>
      </div>

      {/* ========================= */}
      {/* MOBILE FULL MENU DRAWER */}
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
          </div>
        </motion.div>
      )}
    </>
  );
}
