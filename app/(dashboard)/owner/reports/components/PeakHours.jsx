"use client";

import { useEffect, useState } from "react";
import { Flame, Calendar, Coffee, Zap } from "lucide-react";

export default function PeakHours() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/peak-hours`,
            {
    credentials: "include",
  }
        );
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="text-center py-8 text-gray-400">
          No peak hours data available
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Peak Hours",
      value: data.peakHours,
      subtitle: "Highest customer traffic",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Busiest Day",
      value: data.busiestDay,
      subtitle: "Most appointments",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Slow Hours",
      value: data.slowHours,
      subtitle: "Low traffic period",
      icon: Coffee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">Peak Hours</h2>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">Customer traffic insights</p>
      </div>

      {/* Cards Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-lg border border-gray-100 ${card.bgColor} p-4`}
            >
              <div className="flex items-center gap-3 mb-3">
                <card.icon size={18} className={card.color} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.title}
                </p>
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                {card.value}
              </h3>
              
              <p className="text-xs text-gray-500 mt-2">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Simple Tip */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            💡 Schedule promotions during peak hours • Use slow hours for breaks
          </p>
        </div>
      </div>
    </div>
  );
}