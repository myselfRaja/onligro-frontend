"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayRevenue: 0,
    nextAppointment: null,
  });

  useEffect(() => {
    async function load() {
   const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/appointments/all`,
  {
    credentials: "include",
  }
);


      const data = await res.json();
      if (!res.ok) return;

      const all = data.appointments || [];

      // ---------- FIX 1: TODAY FILTER (timezone safe) ----------
      const startDay = new Date();
      startDay.setHours(0, 0, 0, 0);

      const endDay = new Date();
      endDay.setHours(23, 59, 59, 999);

      let todayAppointments = 0;
      let todayRevenue = 0;

      const todayList = all.filter((a) => {
        const t = new Date(a.startAt);
        return t >= startDay && t <= endDay;
      });

      todayAppointments = todayList.length;
      todayRevenue = todayList.reduce(
        (sum, a) => sum + (a.totalPrice || 0),
        0
      );

      // ---------- FIX 2: NEXT UPCOMING APPOINTMENT ----------
      const now = new Date();

      const nextAppointment = all
        .filter((a) => new Date(a.startAt) > now)
        .sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        )[0] || null;

      setStats({
        todayAppointments,
        todayRevenue,
        nextAppointment,
      });
    }

    load();
  }, []);

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">
        Dashboard Overview
      </h1>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 bg-gradient-to-br from-purple-600 to-purple-500 text-white"
        >
          <p className="text-sm opacity-80">Today's Appointments</p>
          <p className="text-3xl font-bold mt-1">{stats.todayAppointments}</p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500">Today's Revenue</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            ₹{stats.todayRevenue}
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500">Next Appointment</p>

          {stats.nextAppointment ? (
            <div className="mt-1">
              <p className="font-semibold">
                {stats.nextAppointment.customerName}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(stats.nextAppointment.startAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Staff: {stats.nextAppointment.staffId?.name || "Not Assigned"}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-400">No upcoming bookings</p>
          )}
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionButton
          href="/owner/appointments"
          label="View Appointments"
          icon="📅"
        />
        <ActionButton
          href="/owner/services"
          label="Manage Services"
          icon="💈"
        />
        <ActionButton href="/owner/staff" label="Add Staff" icon="👥" />
        <ActionButton href="/owner/salon" label="Salon Setup" icon= "🏢" />
      </div>
    </div>
  );
}

/* --- Mini Component --- */
function ActionButton({ href, icon, label }) {
  return (
    <a
      href={href}
      className="card p-4 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition"
    >
      <span className="text-3xl">{icon}</span>
      <p className="text-sm font-medium">{label}</p>
    </a>
  );
}
