"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/owner/dashboard", icon: "🏠" },
    { name: "Staff", href: "/owner/staff", icon: "👥" },
    { name: "Services", href: "/owner/services", icon: "💈" },
    { name: "Hours", href: "/owner/hours", icon: "⏱️" },
    { name: "Appts", href: "/owner/appointments", icon: "📅" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
      <nav className="flex justify-between items-center px-3 py-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <Link key={tab.href} href={tab.href} className="flex-1">
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
