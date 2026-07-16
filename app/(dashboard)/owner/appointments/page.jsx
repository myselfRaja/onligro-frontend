"use client";

import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { 
  Search, Phone, X, Receipt, PhoneCall, Clock, User, 
  Calendar, CheckCircle2, Clock3, XCircle, FileText,
  Eye, Share2, Ban
} from "lucide-react";

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [search, setSearch] = useState("");
  const [customDate, setCustomDate] = useState("");

  async function loadAppointments() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/appointments/all`, { credentials: "include" });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    loadAppointments();
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
    socket.on("appointment_updated", () => loadAppointments());
    socket.on("new_appointment", () => loadAppointments());
    socket.on("appointment_cancelled", () => loadAppointments());
    return () => socket.disconnect();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (!confirm("Cancel this appointment? This action cannot be undone.")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/cancel/${appointmentId}`, {
        method: "POST", credentials: "include",
      });
      loadAppointments();
    } catch (err) { alert("Network error"); }
  };

  const handleViewBill = () => {
  router.push("/owner/billing-history");
};

  const handleCreateBill = (appointment) => {
    const services = appointment.services || [];
    const params = new URLSearchParams({
      appointmentId: appointment._id,
      customerName: appointment.customerName || '',
      customerPhone: appointment.customerPhone || '',
      staffId: appointment.staffId?._id || '',
      staffName: appointment.staffId?.name || '',
      services: services.map(s => s._id || s).join(','),
      servicePrices: services.map(s => s.price || 0).join(','),
    });
    router.push(`/owner/billing?${params.toString()}`);
  };

  const isSameDay = (d1, d2) => new Date(d1).toDateString() === new Date(d2).toDateString();

  const getStatus = (appt) => {
    if (appt.status === "cancelled") return "cancelled";
    const isPast = new Date(appt.startAt) < new Date();
    if (isPast && !appt.billGenerated) return "pending_billing";
    if (isPast) return "completed";
    return "upcoming";
  };

  const statusConfig = {
    upcoming: { 
      label: "Upcoming", 
      bg: "bg-blue-50/80 text-blue-700 border-blue-200", 
      dot: "bg-blue-500",
      icon: Clock3 
    },
    completed: { 
      label: "Billed", 
      bg: "bg-green-50/80 text-green-700 border-green-200", 
      dot: "bg-green-500",
      icon: CheckCircle2 
    },
    pending_billing: { 
      label: "Pending Billing", 
      bg: "bg-orange-50/80 text-orange-700 border-orange-200", 
      dot: "bg-orange-500",
      icon: FileText 
    },
    cancelled: { 
      label: "Cancelled", 
      bg: "bg-red-50/60 text-red-500 border-red-200", 
      dot: "bg-red-400",
      icon: XCircle 
    },
  };

  const filtered = useMemo(() => {
    let data = [...appointments];
    const now = new Date();
    if (filter === "today") data = data.filter(a => isSameDay(a.startAt, now));
    else if (filter === "tomorrow") { const t = new Date(); t.setDate(t.getDate()+1); data = data.filter(a => isSameDay(a.startAt, t)); }
    else if (filter === "week") { const e = new Date(); e.setDate(e.getDate()+7); data = data.filter(a => new Date(a.startAt) >= now && new Date(a.startAt) <= e); }
    else if (filter === "custom" && customDate) data = data.filter(a => isSameDay(a.startAt, customDate));
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(a => a.customerName?.toLowerCase().includes(s) || a.customerPhone?.includes(s) || a.staffId?.name?.toLowerCase().includes(s));
    }
    return data.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [appointments, filter, search, customDate]);

  const grouped = { today: [], upcoming: [], past: [] };
  const now = new Date();
  filtered.forEach(a => {
    if (isSameDay(a.startAt, now)) grouped.today.push(a);
    else if (new Date(a.startAt) > now) grouped.upcoming.push(a);
    else grouped.past.push(a);
  });

  const todayAppts = useMemo(() => appointments.filter(a => isSameDay(a.startAt, new Date())), [appointments]);
  const todayStats = {
    total: todayAppts.length,
    upcoming: todayAppts.filter(a => getStatus(a) === "upcoming").length,
    pending: todayAppts.filter(a => getStatus(a) === "pending_billing").length,
    billed: todayAppts.filter(a => getStatus(a) === "completed").length,
    cancelled: todayAppts.filter(a => getStatus(a) === "cancelled").length,
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading appointments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage bookings & walk-ins</p>
        </div>

        {/* Today's Summary */}
        {filter === "today" && todayStats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <StatCard label="Today" value={todayStats.total} icon={Calendar} color="bg-slate-700" />
            <StatCard label="Upcoming" value={todayStats.upcoming} icon={Clock3} color="bg-blue-500" />
            <StatCard label="Pending" value={todayStats.pending} icon={FileText} color="bg-orange-500" />
            <StatCard label="Billed" value={todayStats.billed} icon={CheckCircle2} color="bg-green-500" />
            <StatCard label="Cancelled" value={todayStats.cancelled} icon={XCircle} color="bg-red-400" />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {["today", "tomorrow", "week", "custom"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {f === "today" ? "Today" : f === "tomorrow" ? "Tomorrow" : f === "week" ? "This Week" : "Custom"}
            </button>
          ))}
          {filter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
              className="border border-gray-200 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone or staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold text-lg">No appointments found</p>
            <p className="text-sm text-gray-500 mt-1">Try changing filters or date range</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {grouped.today.length > 0 && <Section title="Today" data={grouped.today} statusConfig={statusConfig} getStatus={getStatus} onCreateBill={handleCreateBill} onCancel={handleCancel}   onViewBill={handleViewBill}/>}
          {grouped.upcoming.length > 0 && <Section title="Upcoming" data={grouped.upcoming} statusConfig={statusConfig} getStatus={getStatus} onCreateBill={handleCreateBill} onCancel={handleCancel} onViewBill={handleViewBill} />}
          {grouped.past.length > 0 && <Section title="Past" data={grouped.past} statusConfig={statusConfig} getStatus={getStatus} onCreateBill={handleCreateBill} onCancel={handleCancel} onViewBill={handleViewBill} />}
        </div>
      </div>
    </div>
  );
}

// Stat Card
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
}

// Section
function Section({ title, data, statusConfig, getStatus, onCreateBill, onCancel ,  onViewBill,}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">{data.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(appt => {
          const status = getStatus(appt);
          const config = statusConfig[status];
          const time = new Date(appt.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const services = appt.services || [];
          const totalMins = appt.totalDuration || services.reduce((s, sv) => s + (sv.duration || 0), 0);
          const isCancelled = status === "cancelled";
          const isBilled = status === "completed";
          const isPending = status === "pending_billing";
          const isUpcoming = status === "upcoming";

          return (
            <div 
              key={appt._id} 
              className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 flex flex-col ${
                isCancelled 
                  ? "border-red-200 bg-red-50/20" 
                  : isPending
                  ? "border-orange-200 bg-orange-50/10"
                  : "border-gray-100 hover:shadow-md hover:border-gray-200"
              }`}
            >
              <div className="p-5 pb-0">
                {/* Time & Status */}
                <div className="flex items-start justify-between mb-4">
                  <p className={`text-3xl font-bold tracking-tight ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}>
                    {time}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border ${config.bg}`}>
                    <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`} />
                    {config.label}
                  </span>
                </div>

                {/* Customer Name */}
                <h3 className={`text-base font-semibold truncate ${isCancelled ? "text-gray-400" : "text-gray-900"}`}>
                  {appt.customerName}
                </h3>

                {/* Phone */}
                {appt.customerPhone && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={12} className="text-gray-400 flex-shrink-0" />
                    <p className={`text-sm truncate ${isCancelled ? "text-gray-400" : "text-gray-500"}`}>
                      {appt.customerPhone}
                    </p>
                  </div>
                )}

                {/* Staff */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <User size={12} className="text-gray-400 flex-shrink-0" />
                  <p className={`text-sm truncate ${isCancelled ? "text-gray-400" : "text-gray-600"}`}>
                    {appt.staffId?.name || "Auto-assigned"}
                  </p>
                </div>

                {/* Duration */}
                {totalMins > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={12} className="text-gray-400 flex-shrink-0" />
                    <p className={`text-xs ${isCancelled ? "text-gray-400" : "text-gray-500"}`}>
                      {totalMins} mins
                    </p>
                  </div>
                )}

                {/* Services */}
                {services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {services.slice(0, 3).map((s, i) => (
                      <span 
                        key={i} 
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          isCancelled 
                            ? "bg-white/50 text-gray-400 border-gray-200" 
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {s.name}
                      </span>
                    ))}
                    {services.length > 3 && (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${isCancelled ? "text-gray-400" : "text-gray-500"}`}>
                        +{services.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-[8px]" />

              {/* Actions */}
              <div className="p-4 pt-3 mt-auto">
                {isCancelled ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-100/50 text-red-500 text-sm font-medium">
                    <XCircle size={16} />
                    Cancelled
                  </div>
                ) : isPending ? (
                  <button
                    onClick={() => onCreateBill(appt)}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-orange-200 hover:shadow-md active:scale-[0.98]"
                  >
                    <Receipt size={16} />
                    Generate Bill
                  </button>
                ) : isBilled ? (
                  <div className="flex items-center gap-2">
                    <button
  onClick={() => onViewBill(appt.billId)}
  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
>
  <Eye size={15} />
  View Bill
</button>
                    {appt.customerPhone && (
                      <a
                        href={`tel:${appt.customerPhone}`}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-colors flex-shrink-0"
                      >
                        <PhoneCall size={15} />
                      </a>
                    )}
                  </div>
                ) : isUpcoming ? (
                  <div className="flex items-center gap-2">
                    {appt.customerPhone && (
                      <a
                        href={`tel:${appt.customerPhone}`}
                        className="flex-[2] flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-gray-600 hover:text-green-600 border border-gray-200 hover:border-green-200 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      >
                        <PhoneCall size={15} />
                        Call
                      </a>
                    )}
                    <button
                      onClick={() => onCancel(appt._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    >
                      <Ban size={15} />
                      Cancel
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}