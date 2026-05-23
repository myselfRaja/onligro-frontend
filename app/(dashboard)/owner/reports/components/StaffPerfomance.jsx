"use client";

import { useEffect, useState } from "react";
import { Users, Crown } from "lucide-react";

export default function StaffPerformance() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/staff-performance`,
            {
    credentials: "include",
  }
        );
        
        const result = await res.json();
        if (result.success) {
          setStaff(result.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  const maxRevenue = Math.max(...staff.map(s => s.revenue), 0);
  const totalRevenue = staff.reduce((sum, s) => sum + s.revenue, 0);

  const getRankColor = (index) => {
    switch(index) {
      case 0: return "text-yellow-600 bg-yellow-50";
      case 1: return "text-gray-600 bg-gray-50";
      case 2: return "text-orange-600 bg-orange-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No staff performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Staff Performance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Revenue by team member</p>
      </div>

      {/* Staff List */}
      <div className="divide-y divide-gray-100">
        {staff.map((s, index) => {
          const revenuePercent = totalRevenue > 0 ? (s.revenue / totalRevenue) * 100 : 0;
          const revenueProgress = maxRevenue > 0 ? (s.revenue / maxRevenue) * 100 : 0;
          const rankColor = getRankColor(index);
          
          return (
            <div key={index} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded ${rankColor} flex items-center justify-center font-bold text-sm`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{s.name}</h3>
                      {index === 0 && <Crown size={14} className="text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-gray-600">{s.bookings} bookings</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600">₹{s.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    {revenuePercent.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">of total</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${revenueProgress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Insight */}
      {staff.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            🏆 Top performer: {staff[0]?.name} • ₹{staff[0]?.revenue.toLocaleString()} revenue
          </p>
        </div>
      )}
    </div>
  );
}