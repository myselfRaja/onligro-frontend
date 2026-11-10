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
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ Subscription alert states
  const [subscriptionAlert, setSubscriptionAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    checkAuth();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      const userData = data.user || data.owner;

      // ✅ STAFF — BILLING + APPOINTMENTS ALLOW
      if (userData?.role === "staff") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/owner/billing" && currentPath !== "/owner/appointments") {
          router.replace("/owner/billing");
          return;
        }
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Check subscription for owners only
      if (userData?.role === "owner") {
        checkSubscription();
      }
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check subscription status
  const checkSubscription = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/subscription-status`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (
        data.success &&
        ["expires-today", "urgent", "due-soon", "expired"].includes(data.status)
      ) {
        // Check if user dismissed in last 24 hours
        const dismissedAt = localStorage.getItem("subscription_dismissed_at");
        if (dismissedAt) {
          const hoursSinceDismiss =
            (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60);
          if (hoursSinceDismiss < 24) return;
        }

        setSubscriptionAlert(data);
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Subscription check failed:", err);
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
        <div className="flex-1 px-4 md:px-6 pb-20 md:pb-4">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* ✅ SUBSCRIPTION ALERT POPUP */}
      {showAlert && subscriptionAlert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div
            className={`bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl ${
              subscriptionAlert.status === "expired" ||
              subscriptionAlert.status === "expires-today"
                ? "border-4 border-red-500"
                : "border-4 border-orange-400"
            }`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse ${
                  subscriptionAlert.status === "expired" ||
                  subscriptionAlert.status === "expires-today"
                    ? "bg-red-100"
                    : "bg-orange-100"
                }`}
              >
                <span className="text-5xl">
                  {subscriptionAlert.status === "expired"
                    ? "🚫"
                    : subscriptionAlert.status === "expires-today"
                    ? "⚠️"
                    : "⏰"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2
              className={`text-2xl font-bold text-center mb-2 ${
                subscriptionAlert.status === "expired" ||
                subscriptionAlert.status === "expires-today"
                  ? "text-red-600"
                  : "text-orange-600"
              }`}
            >
              {subscriptionAlert.status === "expired"
                ? "Account Expired!"
                : subscriptionAlert.status === "expires-today"
                ? "Expires TODAY!"
                : subscriptionAlert.status === "urgent"
                ? "Urgent!"
                : "Subscription Due"}
            </h2>

            {/* Message */}
            <p className="text-center text-gray-700 mb-4 font-medium">
              {subscriptionAlert.message}
            </p>

            {/* Days Left Badge */}
            {subscriptionAlert.daysLeft !== null &&
              subscriptionAlert.daysLeft >= 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Days Remaining
                  </p>
                  <p
                    className={`text-4xl font-bold ${
                      subscriptionAlert.daysLeft <= 3
                        ? "text-red-600"
                        : "text-orange-600"
                    }`}
                  >
                    {subscriptionAlert.daysLeft}
                  </p>
                </div>
              )}

            {/* Renewal Price */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Annual Renewal</span>
                <span className="text-lg font-bold text-blue-700">₹10,000</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Save ₹2,000 with annual plan
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  window.location.href = "/owner/subscription/renew";
                }}
                className={`w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg transition ${
                  subscriptionAlert.status === "expired" ||
                  subscriptionAlert.status === "expires-today"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                💳 Pay Now - ₹10,000
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(
                    "subscription_dismissed_at",
                    Date.now().toString()
                  );
                  setShowAlert(false);
                }}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Remind me tomorrow
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Need help? Contact support
            </p>
          </div>
        </div>
      )}
    </div>
  );
}