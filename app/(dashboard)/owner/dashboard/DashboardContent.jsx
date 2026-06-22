"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  Wallet,
  Smartphone,
  CreditCard,
  UserPlus as UserPlusIcon,
  Repeat,
  Receipt,
} from "lucide-react";

export default function DashboardContent({
  salonId,
  stats,
  recentBills = [],
  insight,
  staffStatus,
  workingHours,
  slotDuration,
  totalStaff,
  paymentSplit = { cash: 0, upi: 0, card: 0, cashCount: 0, upiCount: 0, cardCount: 0 },
  customerInsights = { new: 0, returning: 0 },
}) {

  const router = useRouter();
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

  const paymentMethods = [
    { key: 'cash', label: 'Cash', icon: Wallet, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    { key: 'upi', label: 'UPI', icon: Smartphone, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    { key: 'card', label: 'Card', icon: CreditCard, color: 'from-purple-500 to-fuchsia-600', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  ];

  const hasPaymentData = paymentSplit.cash > 0 || paymentSplit.upi > 0 || paymentSplit.card > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-gray-100 p-5 shadow-sm">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{greetingEmoji}</span>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {greeting}
                  </h1>
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

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <motion.button 
                  onClick={() => router.push('/owner/billing')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
                >
                  <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Create Bill</span>
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
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {/* Revenue Card */}
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
              <p className="text-2xl font-bold text-green-700 mt-0.5">₹{stats.todayRevenue || 0}</p>
              <p className="text-[10px] text-green-600/60 mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live earnings
              </p>
            </div>
          </motion.div>

          {/* Bills Generated Card */}
          <motion.div 
            variants={itemVariants} 
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-purple-100"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Receipt size={16} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">Today</span>
              </div>
              <p className="text-xs text-purple-700/70 font-medium">Bills Generated</p>
              <p className="text-2xl font-bold text-purple-700 mt-0.5">{stats.todayBills || 0}</p>
              <p className="text-[10px] text-purple-600/60 mt-1">
                Bills created today
              </p>
            </div>
          </motion.div>

          {/* Customers Served Card */}
          <motion.div 
            variants={itemVariants} 
            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-orange-100"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">Today</span>
              </div>
              <p className="text-xs text-orange-700/70 font-medium">Customers Served</p>
              <p className="text-2xl font-bold text-orange-600 mt-0.5">{stats.customersServed || 0}</p>
              <p className="text-[10px] text-orange-600/60 mt-1">
                Today's walk-ins
              </p>
            </div>
          </motion.div>

          {/* Average Bill Card */}
          <motion.div 
            variants={itemVariants} 
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-blue-100"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <DollarSign size={16} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">Today</span>
              </div>
              <p className="text-xs text-blue-700/70 font-medium">Average Bill</p>
              <p className="text-2xl font-bold text-blue-700 mt-0.5">₹{stats.avgBillValue || 0}</p>
              <p className="text-[10px] text-blue-600/60 mt-1">
                Per customer
              </p>
            </div>
          </motion.div>
        </motion.div>


        {/* ===== MAIN SECTION: RECENT BILLS + STAFF ON DUTY ===== */}
        {/* Same as before - Recent Bills on left, Staff on right */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT: Recent Bills (Takes 2/3 space) - Same design as before */}
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
                      Recent Bills
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{stats.todayBills || 0} bills today</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <span>🟢</span> Live Updates
                  </div>
                </div>
              </div>

              {/* Bill Rows - Same as before */}
              <div className="divide-y divide-gray-100">
                {recentBills.length === 0 ? (
                  <div className="p-10 text-center">
                    <Gift size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No bills created today 💸
                    </p>
                  </div>
                ) : (
                  recentBills.slice(0, 9).map((bill, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 transition-all duration-200 hover:bg-gray-50/80"
                    >
                      {/* Desktop Layout */}
                      <div className="hidden sm:flex sm:items-center sm:gap-4">
                        {/* Time + Status */}
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <span className="text-sm font-semibold text-gray-800">
                            {new Date(bill.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-gray-300 text-sm">·</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Completed
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-medium text-gray-800">{bill.customerName}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-600 font-semibold">₹{bill.amount}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {bill.services?.join(' + ') || 'Service'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{bill.staffName || 'Staff'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="sm:hidden space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                              {new Date(bill.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Completed
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                              <span className="font-medium text-gray-800">{bill.customerName}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-600 font-semibold">₹{bill.amount}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                              <span>{bill.services?.join(' + ') || 'Service'}</span>
                              <span className="text-gray-300">•</span>
                              <span>{bill.staffName || 'Staff'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Staff on Duty */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
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
                          <span className="text-sm font-bold text-blue-700">{staff.name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                          <p className="text-[10px] text-gray-400">{staff.billsHandled || 0} bills handled today</p>
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
            {/* Payment Split + Customer Insights - Compact with Borders */}
            <div className="grid grid-cols-2 gap-2">
              {/* Payment Split Card - Green Border */}
              <div className="bg-white rounded-xl border border-green-200 p-3 shadow-sm">
                <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider mb-2">💳 Payments</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Cash</span>
                    <span className="font-medium text-green-600">₹{(paymentSplit.cash || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">UPI</span>
                    <span className="font-medium text-blue-600">₹{(paymentSplit.upi || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Card</span>
                    <span className="font-medium text-purple-600">₹{(paymentSplit.card || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Insights Card - Purple Border */}
              <div className="bg-white rounded-xl border border-purple-200 p-3 shadow-sm">
                <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wider mb-2">👥 Customers</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">New</span>
                    <span className="font-medium text-blue-600">{customerInsights.new || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Returning</span>
                    <span className="font-medium text-purple-600">{customerInsights.returning || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap size={14} />
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => router.push('/owner/billing')}
                  className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1"
                >
                  <UserPlus size={14} />
                  Create Bill
                </button>
                <button 
                  onClick={() => router.push('/owner/customers')}
                  className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1"
                >
                  <Users size={14} />
                  Customers
                </button>
                <button 
                  onClick={() => router.push('/owner/reports')}
                  className="bg-white/20 hover:bg-white/30 px-2 py-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-1"
                >
                  <Share2 size={14} />
                  Reports
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}