"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, Scissors, Phone, Loader, XCircle } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  async function loadAppointments() {
    setLoading(true);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/appointments/all`, { 
        credentials: "include" 
      });
      
      const data = await res.json();
      
      if (data.appointments) {
        setAppointments(data.appointments);
        setTotalCount(data.total || data.appointments.length);
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function deleteAppointment(id) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    
    setCanceling(id);
    
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/appointments/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        // Instant removal from UI
        setAppointments(prev => prev.filter(appt => appt._id !== id));
        setTotalCount(prev => prev - 1);
      }
    } catch (err) {
      console.error("Error deleting appointment:", err);
    } finally {
      setCanceling(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER WITH TOTAL COUNT */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-gray-600">
          Total: <span className="font-bold text-blue-600">{totalCount}</span> appointments
        </p>
      </div>

      {/* EMPTY STATE */}
      {appointments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No appointments found.
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div 
            key={appointment._id} 
            className="bg-white rounded-xl border p-4 sm:p-6 shadow-sm"
          >
            {/* TOP ROW */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={22} />
                <div>
                  <p className="font-semibold">
                    {new Date(appointment.startAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <Clock size={16} />
                    {new Date(appointment.startAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                appointment.status === "cancelled" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {appointment.status.toUpperCase()}
              </span>
            </div>

            {/* CUSTOMER INFO */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <User className="text-purple-600" />
                <div>
                  <p className="font-medium">{appointment.customerName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone size={14} /> {appointment.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Scissors className="text-green-600" />
                <div>
                  <p className="font-medium">
                    Staff: {appointment.staffId?.name || "Auto-assigned"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {appointment.totalDuration} mins
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER WITH DELETE BUTTON */}
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="font-semibold text-lg">₹{appointment.totalPrice}</p>
              
              <button
                onClick={() => deleteAppointment(appointment._id)}
                disabled={canceling === appointment._id}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 disabled:opacity-50 transition"
              >
                {canceling === appointment._id ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}