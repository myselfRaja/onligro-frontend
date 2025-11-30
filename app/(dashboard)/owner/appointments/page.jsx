"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Phone,
  Loader,
  XCircle,
  Search
} from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [canceling, setCanceling] = useState(null);

  async function loadAppointments() {
    setLoading(true);

    const base = process.env.NEXT_PUBLIC_API_URL;

    const url = filterDate
      ? `${base}/appointments/by-date?date=${filterDate}`
      : `${base}/appointments/all`;

    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();

    if (data.appointments) {
      setAppointments(data.appointments);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, [filterDate]);

  async function cancelAppointment(id) {
    setCanceling(id);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${id}`;

    const res = await fetch(url, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      loadAppointments();
    }

    setCanceling(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  const filtered = appointments.filter((a) =>
    a.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Manage all customer bookings</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 px-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="mt-12 text-center text-gray-500">
          No appointments found.
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      <div className="space-y-5">
        <AnimatePresence>
          {filtered.map((a, index) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-xl border shadow-sm p-4 sm:p-6"
            >
              {/* TOP ROW */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={22} />
                  <div>
                    <p className="font-semibold">
                      {new Date(a.startAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(a.startAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      {" - "}
                      {new Date(a.endAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                <StatusBadge status={a.status} />
              </div>

              {/* CUSTOMER INFO */}
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div className="flex items-center gap-3">
                  <User className="text-purple-600" />
                  <div>
                    <p className="font-medium">{a.customerName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone size={14} /> {a.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Scissors className="text-green-600" />
                  <div>
                    <p className="font-medium">
                      Staff: {a.staffId?.name ?? "Auto-assigned"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: {a.totalDuration} mins
                    </p>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-5">
                <p className="font-semibold text-lg">₹{a.totalPrice}</p>

                {a.status !== "cancelled" ? (
                  <button
                    onClick={() => cancelAppointment(a._id)}
                    disabled={canceling === a._id}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:bg-gray-400 transition"
                  >
                    {canceling === a._id ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    Cancel
                  </button>
                ) : (
                  <span className="text-sm text-red-500 italic">
                    Already cancelled
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    confirmed: "bg-green-100 text-green-700",
    booked: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    complete: "bg-purple-100 text-purple-700"
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-sm font-medium ${colors[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
