"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ComposedChart, Area as ReArea 
} from "recharts";
import { TrendingUp, IndianRupee, Sparkles, Calendar, ArrowUp, ArrowDown } from "lucide-react";

export default function RevenueOverview() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRevenue() {
      try {
       const res = await fetch(
  `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/revenue-overview`,
  {
    credentials: "include",
  }
);
        const result = await res.json();
        if (result.success) {
          const formattedData = (result.chartData || []).map(item => ({
            ...item,
            name: item.date,
            revenue: item.revenue,
          }));
          setChartData(formattedData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadRevenue();
  }, []);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = chartData.length > 0 ? Math.round(totalRevenue / chartData.length) : 0;
  const maxRevenue = Math.max(...chartData.map(item => item.revenue), 0);
  const maxDay = chartData.find(item => item.revenue === maxRevenue)?.date || "-";

  // Calculate trend
  const lastDay = chartData[chartData.length - 1]?.revenue || 0;
  const firstDay = chartData[0]?.revenue || 0;
  const trend = ((lastDay - firstDay) / firstDay * 100).toFixed(1);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{payload[0].value?.toLocaleString()}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <p className="text-xs text-gray-500">Daily Revenue</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
        <div className="flex flex-col items-center justify-center h-80 gap-3">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400">Loading revenue insights...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <IndianRupee size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">No revenue data available</p>
          <p className="text-sm text-gray-300 mt-1">Start adding appointments to see insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-50" />
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Sales Analytics
                </h2>
                <Sparkles size={14} className="text-amber-400" />
              </div>
              <p className="text-sm text-gray-500 ml-9">Track your daily billing performance</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-4 py-2">
                <p className="text-xs text-emerald-600 font-medium">Total Revenue</p>
                <p className="text-xl font-bold text-emerald-700">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-4 py-2">
                <p className="text-xs text-blue-600 font-medium">Average Daily Sales</p>
                <p className="text-xl font-bold text-blue-700">₹{avgRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-4 py-2">
                <p className="text-xs text-amber-600 font-medium">Best Sales Day</p>
                <p className="text-xl font-bold text-amber-700">₹{maxRevenue.toLocaleString()}</p>
                <p className="text-[10px] text-amber-500">{maxDay}</p>
              </div>
            </div>
          </div>

          {/* Trend Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              parseFloat(trend) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {parseFloat(trend) >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(trend)}% vs start
            </div>
            <div className="text-xs text-gray-400">
              Last {chartData.length} days
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenueStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6"/>
                <stop offset="100%" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
              width={80}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
              formatter={() => <span className="text-gray-600 text-sm">Daily Revenue</span>}
            />
            
            <ReArea
              type="monotone"
              dataKey="revenue"
              stroke="url(#colorRevenueStroke)"
              fill="url(#colorRevenue)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#3B82F6' }}
            />
            
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#8B5CF6' }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-transparent rounded-lg">
            <Calendar size={16} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Highest Sales</p>
              <p className="text-sm font-semibold text-gray-800">{maxDay} • ₹{maxRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-emerald-50 to-transparent rounded-lg">
            <TrendingUp size={16} className="text-emerald-500" />
            <div>
              <p className="text-xs text-gray-500">Average per day</p>
              <p className="text-sm font-semibold text-gray-800">₹{avgRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-50 to-transparent rounded-lg">
            <IndianRupee size={16} className="text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Estimated Monthly Revenue</p>
              <p className="text-sm font-semibold text-gray-800">₹{Math.round(avgRevenue * 30).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Smart Insight Message */}
        <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
          <p className="text-xs text-gray-700">
            💡 <span className="font-semibold">Business Insight:</span> 
            {parseFloat(trend) > 10 && " Your revenue is showing strong growth momentum! 📈"}
            {parseFloat(trend) > 0 && parseFloat(trend) <= 10 && " Steady growth trend. Keep up the great work! 🎯"}
            {parseFloat(trend) < 0 && "  Repeat customers and higher bill values can increase monthly revenue💪"}
            {parseFloat(trend) === 0 && " Revenue stable. Time to introduce new services! ✨"}
          </p>
        </div>
      </div>
    </div>
  );
}