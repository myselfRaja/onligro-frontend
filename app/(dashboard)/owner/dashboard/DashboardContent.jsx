"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WalkInModal from "./components/WalkInModal";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  Scissors, 
  Sparkles,
  Target,
  Award,
  Zap,
  ChevronRight,
  DollarSign,
  UserCheck,
  ClockIcon,
  Star,
  Gift,
  Bell,
  Share2,
  Coffee,
  User,
  CheckCircle,
  XCircle,
  UserPlus,
} from "lucide-react";

export default function DashboardContent({
  salonId,
  stats,
  timeline,
  openSlots,
  insight,
  staffStatus,
  workingHours,
  slotDuration,
  totalStaff,
}) {

    const router = useRouter();
  console.log(stats);


  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  let greetingEmoji = "🌅";
  let greetingColor = "from-orange-500 to-pink-500";
  
  if (currentHour < 12) {
    greeting = "Good Morning";
    greetingEmoji = "🌅";
    greetingColor = "from-orange-500 to-pink-500";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
    greetingEmoji = "☀️";
    greetingColor = "from-yellow-500 to-orange-500";
  } else {
    greeting = "Good Evening";
    greetingEmoji = "🌙";
    greetingColor = "from-indigo-500 to-purple-500";
  }

  const bookedPercentage = stats.todayAppointments > 0 && timeline.length > 0 
    ? Math.round((stats.todayAppointments / (timeline.length * totalStaff || 1)) * 100) 
    : 0;

  // Helper to check if time is current/next hour
  const isCurrentSlot = (slotTime) => {
    const now = new Date();
    const slotHour = slotTime.getHours();
    const slotMinute = slotTime.getMinutes();
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();
    return slotHour === nowHour && Math.abs(slotMinute - nowMinute) < 30;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
       {/* HEADER - Compact & Clean */}
{/* HEADER - Colorful & Premium */}
<motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-6"
>
  {/* Gradient Background Card */}
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-gray-100 p-5 shadow-sm">
    
    {/* Decorative circles */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -mr-20 -mt-20"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full -ml-16 -mb-16"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
         <span className="text-2xl">
  {greetingEmoji}
</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {greeting}
          </h1>
          {/* Live indicator */}
          <div className="flex items-center gap-1 ml-2 bg-green-100 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] font-medium text-green-700">Live</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1 shadow-sm">
            <ClockIcon size={12} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-700">{workingHours}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1 shadow-sm">
            <span className="text-xs">⏱️ {slotDuration} min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1 shadow-sm">
            <Users size={12} className="text-purple-500" />
            <span className="text-xs font-medium text-gray-700">{totalStaff} Staff</span>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Buttons */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
    <motion.button 
onClick={() => {
  console.log(salonId);
  router.push(`/book/${salonId}`);
}}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
        >
          <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
          <span>Add Walk-in</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group bg-white border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-700 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
        >
          <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
          <span>Copy Link</span>
        </motion.button>
      </motion.div>
    </div>
  </div>
</motion.div>

        {/* Smart Insight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r ${greetingColor} text-white p-5 shadow-xl`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-xs font-medium uppercase tracking-wider">Insight</span>
            </div>
            <p className="text-lg font-semibold">{insight}</p>
            {bookedPercentage > 0 && bookedPercentage < 100 && (
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{bookedPercentage}%</span>
                </div>
                <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${bookedPercentage}%` }} />
                </div>
              </div>
            )}
          </div>
          <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all hidden sm:flex items-center gap-2">
            Fill Slots <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* Stats Cards */}
       <motion.div 
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
>
  {/* Revenue Card - Green Theme */}
  <motion.div 
    variants={itemVariants} 
    className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-green-100"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Today</span>
      </div>
      <p className="text-xs text-green-700/70 font-medium">Total Revenue</p>
      <p className="text-2xl font-bold text-green-700 mt-0.5">₹{stats.todayRevenue}</p>
      <p className="text-[10px] text-green-600/60 mt-1 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        Live earnings
      </p>
    </div>
  </motion.div>

  {/* Appointments Card - Purple Theme */}
  <motion.div 
    variants={itemVariants} 
    className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-purple-100"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-sm">
          <Calendar size={16} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">Today</span>
      </div>
      <p className="text-xs text-purple-700/70 font-medium">Appointments</p>
      <p className="text-2xl font-bold text-purple-700 mt-0.5">{stats.todayAppointments}</p>
      <p className="text-[10px] text-purple-600/60 mt-1">
        Total bookings today
      </p>
    </div>
  </motion.div>

  {/* Open Slots Card - Orange Theme */}
  <motion.div 
    variants={itemVariants} 
    className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-orange-100"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
          <Clock size={16} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">Available</span>
      </div>
      <p className="text-xs text-orange-700/70 font-medium">Open Slots</p>
      <p className="text-2xl font-bold text-orange-600 mt-0.5">{openSlots}</p>
      <p className="text-[10px] text-orange-600/60 mt-1">
        Ready for booking
      </p>
    </div>
  </motion.div>

  {/* Next Appointment Card - Blue Theme */}
  <motion.div 
    variants={itemVariants} 
    className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-blue-100"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <UserCheck size={16} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">Next</span>
      </div>
      <p className="text-xs text-blue-700/70 font-medium">Up Next</p>
      {stats.nextAppointment ? (
        <>
          <p className="text-sm font-bold text-blue-700 truncate mt-0.5">{stats.nextAppointment.customerName}</p>
          <p className="text-[10px] text-blue-600/70 mt-1 flex items-center gap-1">
            <span>⏰</span>
            {new Date(stats.nextAppointment.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-400 mt-1">No appointments</p>
      )}
    </div>
  </motion.div>
</motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Schedule - ATTRACTIVE VERSION */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Today's Schedule
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{timeline.length} upcoming slots</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <span>🟢</span> Live Updates
                  </div>
                </div>
              </div>

              {/* Timeline Rows */}
              {/* Timeline Rows */}
{/* Timeline Rows - Mobile Optimized */}
<div className="divide-y divide-gray-100">
  {timeline.length === 0 ? (
    <div className="p-10 text-center">
      <Gift size={32} className="mx-auto text-gray-300 mb-2" />
      <p className="text-sm text-gray-500">
        All slots filled! Great day! 🎉
      </p>
    </div>
  ) : (
    timeline.map((slot, i) => {
      const isCurrent = (() => {
        const now = new Date();
        const slotTime = new Date(slot.time);
        const slotEnd = new Date(slotTime.getTime() + 30 * 60000);
        return slotTime <= now && slotEnd >= now;
      })();
      const hasBookings = slot.bookings && slot.bookings.length > 0;
      const bookingCount = slot.bookings?.length || 0;

      let statusConfig = {
        label: "Available",
        color: "bg-gray-100 text-gray-600"
      };
      if (isCurrent) {
        statusConfig = {
          label: "Live Now",
          color: "bg-green-100 text-green-700"
        };
      } else if (hasBookings) {
        statusConfig = {
          label: `${bookingCount} Booking${bookingCount > 1 ? "s" : ""}`,
          color: "bg-blue-100 text-blue-700"
        };
      }

      return (
        <div
          key={i}
          className={`px-4 py-2.5 transition-all duration-200 hover:bg-gray-50/80 ${
            isCurrent ? "bg-green-50/30" : ""
          }`}
        >
          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {/* Time + Status */}
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm font-semibold text-gray-800">
                {slot.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-gray-300 text-sm">·</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1">
              {hasBookings ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {slot.bookings.map((booking, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-800">{booking.customerName}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-600">₹{booking.totalPrice}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{booking.staffId?.name || "Staff"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">{slot.availableSlots} slot{slot.availableSlots > 1 ? "s" : ""}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span>{totalStaff} staff free</span>
                </span>
              )}
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="sm:hidden space-y-1.5">
            {/* Time + Status Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {slot.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Details Row */}
            <div>
              {hasBookings ? (
                <div className="space-y-1">
                  {slot.bookings.map((booking, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="font-medium text-gray-800">{booking.customerName}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-600">₹{booking.totalPrice}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{booking.staffId?.name || "Staff"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-gray-600">{slot.availableSlots} slot{slot.availableSlots > 1 ? "s" : ""}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span>{totalStaff} staff free</span>
                </span>
              )}
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Staff Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={14} />
                  Staff on Duty
                </h2>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{totalStaff} Active</span>
              </div>
              <div className="space-y-2">
                {staffStatus.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No staff scheduled</p>
                ) : (
                  staffStatus.slice(0, 4).map((staff, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-700">{staff.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                          <p className="text-[10px] text-gray-400">{staff.bookings} bookings today</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-[10px] text-green-600">Active</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap size={14} />
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1">
                  <UserPlus size={14} />
                  Walk-in
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1">
                  <Bell size={14} />
                  Remind
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>

            {/* Summary Card */}
        
          </motion.div>
        </div>
      </div>
    </div>
  );
}