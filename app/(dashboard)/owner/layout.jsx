"use client";

import { useState } from "react";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";
import BottomNav from "./ui/BottomNav";

export default function OwnerDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 bg-[var(--color-bg)]">
        {/* Topbar */}
        <Topbar ownerName="Ahmad" />

        {/* Page Content */}
        <div className="mt-4 pb-20 md:pb-4">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
