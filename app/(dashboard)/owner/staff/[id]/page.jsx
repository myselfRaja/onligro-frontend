"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader,
  Scissors,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  IndianRupee,
  Clock,
  Target,
  Zap,
  Activity,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/staff/${params.id}/details`,
          { credentials: "include" }
        );
        const result = await res.json();
        if (result.success) setData(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto" size={40} />
          <p className="mt-3 text-gray-500 text-sm">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Staff Not Found</h2>
          <p className="text-gray-500 mb-6">
            This staff member doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/owner/staff")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
          >
            Back to Staff
          </button>
        </div>
      </div>
    );
  }

  const { staff, today, week, month, topServices, dailyBreakdown } = data;

  const initials = staff.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Chart data
  const chartData = [...dailyBreakdown]
    .slice(0, 15)
    .reverse()
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      revenue: d.revenue,
      services: d.services,
    }));

  const pieData = topServices.slice(0, 6).map((s) => ({
    name: s.serviceName,
    value: s.revenue,
  }));


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Back Button */}
        <button
          onClick={() => router.push("/owner/staff")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
          <span className="font-medium">Back to Staff</span>
        </button>

        {/* ===== HERO HEADER ===== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 sm:p-8 mb-6 shadow-2xl">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white font-bold text-5xl shadow-2xl border-2 border-white/30">
                {initials}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-slate-900 ${
                staff.isActive ? "bg-green-500" : "bg-red-500"
              } shadow-lg`}>
                <div className={`w-full h-full rounded-full ${staff.isActive ? "bg-green-500" : "bg-red-500"} animate-ping opacity-75`}></div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white truncate">
                  {staff.name}
                </h1>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    staff.isActive
                      ? "bg-green-500/20 text-green-300 border border-green-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-400/30"
                  }`}
                >
                  ● {staff.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-indigo-200 text-lg font-medium mb-5 flex items-center gap-2">
                <Briefcase size={18} />
                {staff.role}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {staff.phone && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                    <Phone size={14} className="text-indigo-300" />
                    <span className="text-white text-sm truncate font-medium">
                      {staff.phone}
                    </span>
                  </div>
                )}
                {staff.address && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                    <MapPin size={14} className="text-indigo-300" />
                    <span className="text-white text-sm truncate font-medium">
                      {staff.address}
                    </span>
                  </div>
                )}
                {staff.email && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                    <Mail size={14} className="text-indigo-300" />
                    <span className="text-white text-sm truncate font-medium">
                      {staff.email}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                  <Calendar size={14} className="text-indigo-300" />
                  <span className="text-white text-sm font-medium">
                    {new Date(staff.joinDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Today"
            data={today}
            gradient="from-blue-500 to-cyan-400"
            icon={Zap}
          />
          <StatCard
            title="This Week"
            data={week}
            gradient="from-purple-500 to-pink-500"
            icon={Award}
          />
          <StatCard
            title="This Month"
            data={month}
            gradient="from-emerald-500 to-green-400"
            icon={IndianRupee}
          />
        </div>

        {/* ===== CHARTS ROW ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
                  <Activity size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Revenue Trend</h2>
                  <p className="text-xs text-slate-500">Last 15 days performance</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {chartData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        padding: "10px 14px",
                      }}
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

                   {/* Best Day Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                <Award size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Best Day</h2>
                <p className="text-xs text-slate-500">Highest revenue day</p>
              </div>
            </div>

            <div className="p-6 flex flex-col items-center justify-center min-h-[280px]">
              {dailyBreakdown.length > 0 ? (
                (() => {
                  const bestDay = dailyBreakdown.reduce(
                    (max, d) => (d.revenue > max.revenue ? d : max),
                    dailyBreakdown[0]
                  );
                  return (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-200">
                        <Award size={40} className="text-amber-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        {new Date(bestDay.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-4xl font-bold text-slate-900 mb-2">
                        {fmt(bestDay.revenue)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {bestDay.services} service{bestDay.services > 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500">No data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== BOTTOM ROW ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Service Split Pie */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <PieIcon size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Service Split</h2>
                <p className="text-xs text-slate-500">Top 6 services by revenue</p>
              </div>
            </div>

            <div className="p-6">
              {pieData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        padding: "10px 14px",
                      }}
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Services Bar Chart */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Services Per Day</h2>
                <p className="text-xs text-slate-500">Last 15 days activity</p>
              </div>
            </div>

            <div className="p-6">
              {chartData.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b"/>
                        <stop offset="100%" stopColor="#ef4444"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        padding: "10px 14px",
                      }}
                      cursor={{ fill: "#fef3c7" }}
                      formatter={(value) => [value, "Services"]}
                    />
                    <Bar
                      dataKey="services"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* ===== TOP SERVICES + DAILY ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Services */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <Scissors size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Top Services</h2>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
            </div>

            {topServices.length === 0 ? (
              <EmptyChart />
            ) : (
              <div className="divide-y divide-slate-50">
                {topServices.map((s, i) => {
                  const maxRevenue = topServices[0]?.revenue || 1;
                  const progress = (s.revenue / maxRevenue) * 100;

                  return (
                    <div key={i} className="px-6 py-4 hover:bg-slate-50/70 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              i === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md"
                                : i === 1
                                ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white"
                                : i === 2
                                ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="font-semibold text-slate-900 text-sm truncate">
                            {s.serviceName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          <span className="text-xs font-medium text-slate-500 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded-full">
                            {s.count}×
                          </span>
                          <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">
                            {fmt(s.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Breakdown */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Daily Breakdown</h2>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
            </div>

            {dailyBreakdown.length === 0 ? (
              <EmptyChart />
            ) : (
           <div className="divide-y divide-slate-50 max-h-[700px] overflow-y-auto">
                {dailyBreakdown.map((d, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 hover:bg-slate-50/70 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-sm font-bold text-white leading-none">
                          {new Date(d.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                          })}
                        </span>
                        <span className="text-[10px] text-blue-100 leading-none mt-0.5">
                          {new Date(d.date).toLocaleDateString("en-IN", {
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(d.date).toLocaleDateString("en-IN", {
                            weekday: "long",
                          })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {d.services} service{d.services > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">
                      {fmt(d.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Data refreshed just now
        </div>
      </div>
    </div>
  );
}

// ===== STAT CARD =====
function StatCard({ title, data, gradient, icon: Icon }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          >
            <Icon size={22} className="text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {title}
          </span>
        </div>

        <p className="text-3xl font-bold text-slate-900 mb-3">
          {fmt(data.revenue)}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`}></span>
            <span className="font-medium">{data.services} services</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`}></span>
            <span className="font-medium">{data.bills} bills</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
        <TrendingUp size={24} className="text-slate-300" />
      </div>
      <p className="text-sm font-medium">No data available</p>
      <p className="text-xs">Data will appear here</p>
    </div>
  );
}