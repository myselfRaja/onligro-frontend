"use client";

import { Calendar, TrendingUp, Repeat, ArrowUpRight, Sparkles, IndianRupee } from "lucide-react";

export default function ReportsSummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue?.toLocaleString() || 0}`,
      subtitle: "This month",
  
      icon: IndianRupee,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "Appointments",
      value: summary?.totalBookings || 0,
      subtitle: "Completed services",
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      title: "Average Booking",
      value: `₹${summary?.avgBookingValue?.toLocaleString() || 0}`,
      subtitle: "Per visit",
      icon: IndianRupee,
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      title: "Repeat Customers",
      value: `${summary?.repeatCustomerPercentage || 0}%`,
      subtitle: "Loyal clients",
      icon: Repeat,
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
          <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          
          <div className="relative p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`relative bg-gradient-to-br ${card.bgGradient} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon size={22} className={`text-gray-700`} />
                <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-400" />
              </div>
              
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors">
                <ArrowUpRight size={12} className="text-emerald-500" />
                <span className="text-xs font-semibold text-gray-700">{card.trend}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
                  {card.value}
                </h3>
              </div>
              
              <div className="relative pt-2">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-700`}
                    style={{ width: `${card.title === "Repeat Customers" ? summary?.repeatCustomerPercentage || 0 : 75}%` }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                {card.subtitle}
              </p>
            </div>
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </div>
      ))}
    </div>
  );
}