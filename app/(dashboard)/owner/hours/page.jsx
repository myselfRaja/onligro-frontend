"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react";

export default function WorkingHoursPage() {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  // Load hours
  async function loadHours() {
    setLoading(true);
   const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/hours/get`,
  {
    credentials: "include",
  }
);

    const data = await res.json();

    if (Array.isArray(data.hours) && data.hours.length > 0) {
      setHours(data.hours);
    } else {
      // create default
      const defaults = days.map((d) => ({
        dayOfWeek: d.key,
        openTime: "09:00",
        closeTime: "20:00",
        isClosed: false,
      }));
      setHours(defaults);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHours();
  }, []);

  function updateHour(i, key, value) {
    const updated = [...hours];
    updated[i][key] = value;

    if (key === "isClosed" && value === true) {
      updated[i].openTime = "09:00";
      updated[i].closeTime = "20:00";
    }

    setHours(updated);
  }

  const hasOpenDays = hours.some((d) => !d.isClosed);

  async function saveHours() {
    setSaving(true);
    setSaveStatus(null);

   const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/hours/set`,
  {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hours }),
  }
);


    if (res.ok) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus("error");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Working Hours</h1>
          <p className="text-gray-600">Set your salon’s weekly schedule</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <AnimatePresence>
            {saveStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-lg"
              >
                <CheckCircle size={16} /> Saved
              </motion.div>
            )}

            {saveStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-2 rounded-lg"
              >
                <AlertCircle size={16} /> Failed
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={saveHours}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg shadow hover:bg-gray-900 transition disabled:bg-gray-400"
          >
            {saving ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* WARNING */}
      {!hasOpenDays && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6">
          No open days — customers won’t be able to book.
        </div>
      )}

      {/* WORKING HOURS LIST */}
      <div className="space-y-4">

        {hours.map((day, index) => {
          const config = days.find((d) => d.key === day.dayOfWeek);

          return (
            <motion.div
              key={day.dayOfWeek}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm"
            >

              {/* DAY NAME + STATUS */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">

                {/* Day Icon + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
                    <Calendar size={18} />
                  </div>
                  <span className="text-lg font-semibold capitalize">
                    {config?.label}
                  </span>
                </div>

                {/* Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!day.isClosed}
                    onChange={(e) =>
                      updateHour(index, "isClosed", !e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full relative transition ${
                      !day.isClosed ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                        !day.isClosed
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      !day.isClosed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {!day.isClosed ? "Open" : "Closed"}
                  </span>
                </label>
              </div>

              {/* TIME INPUTS — MOBILE STACK / DESKTOP INLINE */}
              {!day.isClosed ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Opens at
                    </label>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) =>
                        updateHour(index, "openTime", e.target.value)
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Closes at
                    </label>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) =>
                        updateHour(index, "closeTime", e.target.value)
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Clock size={16} />
                      {duration(day.openTime, day.closeTime)}
                    </div>
                  </div>

                </div>
              ) : (
                <p className="text-gray-500 italic">Closed on this day</p>
              )}
            </motion.div>
          );
        })}

      </div>

    </div>
  );
}

// Helper: Duration
function duration(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let total = eh * 60 + em - (sh * 60 + sm);
  if (total < 0) total += 1440;

  const h = Math.floor(total / 60);
  const m = total % 60;

  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
