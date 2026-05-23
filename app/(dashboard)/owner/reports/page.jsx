"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Filter, X } from "lucide-react";
import ReportsSummaryCards from "./components/ReportsSummaryCards";
import RevenueOverview from "./components/RevenueOverview";
import StaffPerformance from "./components/StaffPerfomance";
import TopServices from "./components/TopServices";
import PeakHours from "./components/PeakHours";

export default function ReportsPage() {

  const router = useRouter();

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    repeatCustomerPercentage: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  // =========================
  // AUTH CHECK
  // =========================


  // Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);

  }, []);

  // Load data when dates change
  useEffect(() => {

    if (startDate && endDate) {
      loadSummary();
      loadRevenue();
    }

  }, [startDate, endDate]);

  async function loadSummary() {
    try {

      let url = `${BASE_URL}/reports/summary?`;

      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}`;

      const res = await fetch(url, {
        credentials: "include",
      });

      // unauthorized
      if (res.status === 401) {
        localStorage.removeItem("owner");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (result.success) {
        setSummary(result.summary);
      }

    } catch (err) {
      console.log(err);
    }
  }

  async function loadRevenue() {
    try {

      let url = `${BASE_URL}/reports/revenue-overview?`;

      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}`;

      const res = await fetch(url, {
        credentials: "include",
      });

      // unauthorized
      if (res.status === 401) {
        localStorage.removeItem("owner");
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (result.success) {
        setChartData(result.chartData || []);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Quick date filters
  const setLast7Days = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(sevenDaysAgo.toISOString().split("T")[0]);

    setShowDatePicker(false);
  };

  const setLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);

    setShowDatePicker(false);
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    setShowDatePicker(false);
  };

  const clearDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header with Date Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports
            </h1>

            <p className="text-gray-500 mt-1">
              Track revenue, bookings, and salon performance
            </p>

            {startDate && endDate && (
              <p className="text-sm text-gray-400 mt-2">
                📅 {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            )}
          </div>

          {/* Date Filter Button */}
          <div className="relative">

            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">
                Filter by Date
              </span>
              <Filter size={14} className="text-gray-400" />
            </button>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-semibold text-gray-900">
                    Select Date Range
                  </h3>

                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>

                </div>

                {/* Quick Filters */}
                <div className="grid grid-cols-3 gap-2 mb-4">

                  <button
                    onClick={setLast7Days}
                    className="px-2 py-1.5 text-xs bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Last 7 days
                  </button>

                  <button
                    onClick={setLast30Days}
                    className="px-2 py-1.5 text-xs bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Last 30 days
                  </button>

                  <button
                    onClick={setThisMonth}
                    className="px-2 py-1.5 text-xs bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    This month
                  </button>

                </div>

                {/* Custom Date Inputs */}
                <div className="space-y-3">

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={clearDates}
                    className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* SUMMARY */}
        <ReportsSummaryCards
          summary={summary}
          loading={loading}
        />

        {/* CHART */}
        <RevenueOverview chartData={chartData} />

        {/* OTHER */}
        <TopServices />
        <StaffPerformance />
        <PeakHours />

      </div>

    </div>
  );
}