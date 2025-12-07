"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";
import BottomNav from "./ui/BottomNav";

export default function OwnerDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(null);
  const router = useRouter();

  // ✅ CRITICAL: Authentication check
  useEffect(() => {
    checkAuth();
    
    // ✅ Also check when page becomes visible (back button case)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log("🟡 Checking authentication...");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        credentials: "include", // Send cookies
      });

      console.log("🟢 Auth response status:", res.status);

      if (!res.ok) {
        throw new Error("Not authenticated");
      }

      const data = await res.json();
      setOwner(data.owner);
      console.log("✅ Authenticated as:", data.owner.name);
      
    } catch (error) {
      console.error("🔴 Auth error:", error);
      
      // Clear all client data
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login
      router.push("/login");
      router.refresh(); // Force Next.js refresh
      
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Don't render layout if not authenticated
  if (!owner) {
    return null; // Will redirect from checkAuth
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 bg-[var(--color-bg)]">
        {/* ✅ Pass actual owner name from auth */}
        <Topbar ownerName={owner.name || "Owner"} />

        {/* Page Content */}
        <div className="mt-4 pb-20 md:pb-4">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}