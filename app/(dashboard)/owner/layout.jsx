"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";
import BottomNav from "./ui/BottomNav";
import { Loader } from "lucide-react";

export default function OwnerDashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);  // ✅ owner → user
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    
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
      credentials: "include",
    });

    console.log("🟢 Auth response status:", res.status);

    if (!res.ok) {
      throw new Error("Not authenticated");
    }

    const data = await res.json();
    
    // ✅ Support both 'user' and 'owner' keys
    const userData = data.user || data.owner;
    setUser(userData);
    
    // ✅ STORE USER IN LOCALSTORAGE (SIRF YEH LINE ADD KARO)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    console.log("✅ Authenticated as:", userData?.name);
    
  } catch (error) {
    console.error("🔴 Auth error:", error);
    
    localStorage.clear();
    sessionStorage.clear();
    
    router.push("/login");
    router.refresh();
    
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)] z-50">
        <div className="text-center">
          <Loader className="animate-spin text-gray-500 mx-auto" size={32} />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        <div className="p-4 md:p-6">
          <Topbar ownerName={user?.name || "Staff"} />
        </div>

        {/* Page Content */}
        <div className="flex-1 px-4 md:px-6 pb-20 md:pb-4">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}