"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);
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

  // ✅ Owner Tabs (All)
  const ownerTabs = [
    { name: "Dashboard", href: "/owner/dashboard", icon: "🏠" },
    { name: "Billing", href: "/owner/billing", icon: "💳" },
    { name: "Billing History", href: "/owner/billing-history", icon: "📋" },
    { name: "Customers", href: "/owner/customers", icon: "👤" },
    { name: "Inventory", href: "/owner/inventory", icon: "📦" },
    { name: "Reports", href: "/owner/reports", icon: "📊" },
    { name: "Salon Setup", href: "/owner/salon", icon: "🏢" },  // ✅ ADDED
    { name: "Staff", href: "/owner/staff", icon: "👥" },
    { name: "Services", href: "/owner/services", icon: "💈" },
    { name: "Hours", href: "/owner/hours", icon: "⏱️" },
    { name: "Appts", href: "/owner/appointments", icon: "📅" },
  ];

  // ✅ Staff Tabs (Sirf Billing)
  const staffTabs = [
    { name: "Billing", href: "/owner/billing", icon: "💳" },
  ];

  const tabs = userRole === "staff" ? staffTabs : ownerTabs;

  // Loading state
  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-center py-3">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
      <nav className="flex items-center gap-5 px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-shrink-0 min-w-[65px]"
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span
                  className={`text-xl ${
                    active ? "text-[var(--color-primary)]" : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-xs ${
                    active
                      ? "text-[var(--color-primary)] font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}