"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Calendar, Clock, User, DollarSign, ChevronRight, Phone } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("week");
  const [search, setSearch] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${base}/appointments/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getStatus = (appt) => {
    if (appt.status === "cancelled") return "cancelled";
    return new Date(appt.startAt) < new Date() ? "completed" : "upcoming";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "upcoming": return "⏳";
      case "completed": return "✅";
      case "cancelled": return "❌";
      default: return "⏳";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "upcoming": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filtered = useMemo(() => {
    let data = [...appointments];
    const now = new Date();

    if (filter === "today") {
      data = data.filter((a) => isSameDay(a.startAt, now));
    } else if (filter === "tomorrow") {
      const t = new Date();
      t.setDate(t.getDate() + 1);
      data = data.filter((a) => isSameDay(a.startAt, t));
    } else if (filter === "week") {
      const end = new Date();
      end.setDate(end.getDate() + 7);
      data = data.filter((a) => {
        const d = new Date(a.startAt);
        return d >= now && d <= end;
      });
    } else if (filter === "custom" && customDate) {
      data = data.filter((a) => isSameDay(a.startAt, customDate));
    }

    if (search) {
      data = data.filter(
        (a) =>
          a.customerName.toLowerCase().includes(search.toLowerCase()) ||
          a.customerPhone?.includes(search)
      );
    }

    return data.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [appointments, filter, search, customDate]);

  const grouped = { today: [], upcoming: [], past: [] };
  const now = new Date();

  filtered.forEach((a) => {
    const d = new Date(a.startAt);
    if (isSameDay(d, now)) grouped.today.push(a);
    else if (d > now) grouped.upcoming.push(a);
    else grouped.past.push(a);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {filtered.length} appointment{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Mobile: Toggle Filters Button */}
        <div className="sm:hidden mb-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between text-gray-700"
          >
            <span className="text-sm font-medium">🔍 Filters & Search</span>
            <ChevronRight className={`transform transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} size={18} />
          </button>
        </div>

        {/* Filters Section - Responsive */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden sm:block'} mb-4 sm:mb-6 transition-all`}>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {["today", "tomorrow", "week", "custom"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    if (window.innerWidth < 640) setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f === "today" && "📅 Today"}
                  {f === "tomorrow" && "⏰ Tomorrow"}
                  {f === "week" && "📆 This Week"}
                  {f === "custom" && "📅 Custom Date"}
                </button>
              ))}
            </div>

            {/* Custom Date Picker */}
            {filter === "custom" && (
              <div className="mb-3">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full sm:w-auto border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments Sections */}
        <div className="space-y-6 sm:space-y-8">
          {grouped.today.length > 0 && (
            <Section title="Today" icon={Clock} data={grouped.today} getStatus={getStatus} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
          )}
          
          {grouped.upcoming.length > 0 && (
            <Section title="Upcoming" icon={Calendar} data={grouped.upcoming} getStatus={getStatus} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
          )}
          
          {grouped.past.length > 0 && (
            <Section title="Past" icon={User} data={grouped.past} getStatus={getStatus} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200">
              <Calendar className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500">No appointments found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Responsive Section Component - CLEAN MOBILE VERSION
function Section({ title, icon: Icon, data, getStatus, getStatusIcon, getStatusColor }) {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={16} className="text-gray-500" />
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {data.length}
        </span>
      </div>
      
      {/* Mobile: Clean Card View */}
      <div className="sm:hidden space-y-3">
        {data.map((appointment) => {
          const status = getStatus(appointment);
          const time = new Date(appointment.startAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          
          return (
            <div key={appointment._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Top Row: Time & Status */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{time}</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  <span>{getStatusIcon(status)}</span>
                  <span className="capitalize">{status}</span>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-base font-semibold text-gray-900">{appointment.customerName}</p>
                {appointment.customerPhone && (
                  <div className="flex items-center gap-1 mt-1">
                    <Phone size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500">{appointment.customerPhone}</p>
                  </div>
                )}
              </div>
              
              {/* Bottom Row: Price & Staff */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₹{appointment.totalPrice}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.staffId?.name || "Auto"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Desktop: Table View */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-2">Time</div>
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Staff</div>
          <div className="col-span-2">Status</div>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {data.map((appointment) => {
            const status = getStatus(appointment);
            const time = new Date(appointment.startAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            
            return (
              <div key={appointment._id} className="grid grid-cols-12 gap-3 px-5 py-3 hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-2">
                  <span className="text-sm font-medium text-gray-900">{time}</span>
                </div>
                
                <div className="col-span-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.customerName}</p>
                    {appointment.customerPhone && (
                      <p className="text-xs text-gray-500 mt-0.5">{appointment.customerPhone}</p>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm font-semibold text-gray-900">₹{appointment.totalPrice}</span>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm text-gray-600">{appointment.staffId?.name || "Auto"}</span>
                </div>
                
                <div className="col-span-2">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    <span>{getStatusIcon(status)}</span>
                    <span className="capitalize">{status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}