"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Crown, Star, Award, Scissors, Sparkles } from "lucide-react";

export default function TopServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopServices() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/top-services`,
            {
    credentials: "include",
  }
        );
        const result = await res.json();
        if (result.success && result.data) {
          const maxRevenue = Math.max(...result.data.map(item => Number(item.revenue) || 0), 0);
          const formatted = result.data.map((item) => ({
            name: item._id || "Unknown",
            bookings: Number(item.count) || 0,
            revenue: Number(item.revenue) || 0,
            revenueFormatted: `₹${(Number(item.revenue) || 0).toLocaleString()}`,
            progress: maxRevenue > 0 ? ((Number(item.revenue) || 0) / maxRevenue) * 100 : 0,
          }));
          setServices(formatted);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadTopServices();
  }, []);

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return { bg: "bg-yellow-500", text: "text-yellow-500", icon: Crown };
      case 1: return { bg: "bg-gray-500", text: "text-gray-500", icon: Star };
      case 2: return { bg: "bg-amber-600", text: "text-amber-600", icon: Award };
      default: return { bg: "bg-blue-500", text: "text-blue-500", icon: null };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="text-center py-12">
          <Scissors size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No service data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top Services</h2>
            <p className="text-sm text-gray-500 mt-0.5">Most booked services by revenue</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={14} />
            <span>Revenue based</span>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="p-6">
        <div className="space-y-6">
          {services.map((service, index) => {
            const rank = getRankStyle(index);
            const RankIcon = rank.icon;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Rank Number */}
                    <div className={`w-8 h-8 ${rank.bg} rounded-md flex items-center justify-center text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        {RankIcon && <RankIcon size={14} className={rank.text} />}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{service.bookings} bookings</span>
                        <span className="text-xs font-medium text-gray-700">{service.revenueFormatted}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-600">
                        {Math.round(service.progress)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${rank.bg}`}
                    style={{ width: `${service.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Top performer: <span className="font-medium text-gray-700">{services[0]?.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
}