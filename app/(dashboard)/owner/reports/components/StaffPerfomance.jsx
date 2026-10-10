"use client";

import { useEffect, useState } from "react";
import { Users, Crown, ChevronDown, ChevronRight } from "lucide-react";

const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function StaffPerformance({ startDate, endDate }) {
  const [staff, setStaff] = useState([]);
  const [totals, setTotals] = useState({ actualRevenue: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!startDate || !endDate) return;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ startDate, endDate });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/staff-performance?${params}`,
          { credentials: "include" }
        );
        const result = await res.json();
        if (result.success) {
          setStaff(result.data || []);
          setTotals(result.totals || { actualRevenue: 0, bookings: 0 });
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.log(err);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [startDate, endDate]);

  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));
  const maxRevenue = Math.max(...staff.map((s) => s.actualRevenue || 0), 0);

  const getRankColor = (i) => {
    switch (i) {
      case 0: return "text-yellow-600 bg-yellow-50";
      case 1: return "text-gray-600 bg-gray-50";
      case 2: return "text-orange-600 bg-orange-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Staff Performance</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Revenue by staff (discount ke baad)
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && staff.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No staff performance data available</p>
        </div>
      )}

      {!loading && staff.length > 0 && (
        <>
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Staff</div>
            <div className="col-span-2 text-right">Services</div>
            <div className="col-span-4 text-right">Revenue</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-gray-100">
            {staff.map((s, index) => {
              const key = s.staffId || `unassigned-${index}`;
              const isOpen = !!expanded[key];
              const isUnassigned = !s.staffId;
              const progress = maxRevenue > 0 ? (s.actualRevenue / maxRevenue) * 100 : 0;

              return (
                <div key={key}>
                  <div
                    className={`px-5 py-3 grid grid-cols-12 gap-2 items-center cursor-pointer hover:bg-gray-50 ${isUnassigned ? "bg-yellow-50/30" : ""}`}
                    onClick={() => toggle(key)}
                  >
                    <div className="col-span-1">
                      <div className={`w-7 h-7 rounded ${getRankColor(index)} flex items-center justify-center font-bold text-xs`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{s.staffName}</span>
                      {index === 0 && !isUnassigned && <Crown size={14} className="text-yellow-500" />}
                      {isUnassigned && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">no staff</span>
                      )}
                    </div>
                    <div className="col-span-2 text-right text-sm text-gray-600">{s.bookings}</div>
                    <div className="col-span-4 text-right font-medium text-green-700">{fmt(s.actualRevenue)}</div>
                    <div className="col-span-1 flex justify-end text-gray-400">
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>

                  <div className="px-5 pb-2">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-4 bg-gray-50/50">
                      <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-100 text-xs font-semibold text-gray-600">
                          <div className="col-span-7">Service</div>
                          <div className="col-span-2 text-right">Qty</div>
                          <div className="col-span-3 text-right">Revenue</div>
                        </div>
                        {s.services && s.services.length > 0 ? (
                          s.services.map((svc, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-t border-gray-100 text-sm">
                              <div className="col-span-7 text-gray-800">{svc.serviceName}</div>
                              <div className="col-span-2 text-right text-gray-600">{svc.count}</div>
                              <div className="col-span-3 text-right text-green-700">{fmt(svc.actualRevenue)}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No service details</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-5 font-bold text-gray-900">TOTAL</div>
              <div className="col-span-2 text-right text-gray-700">{totals.bookings}</div>
              <div className="col-span-4 text-right font-bold text-green-700">{fmt(totals.actualRevenue)}</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          <div className="px-5 py-3 bg-green-50 border-t border-green-100">
            <p className="text-xs text-gray-600 leading-relaxed">
              Note: Revenue is calculated after applying discounts. Staff performance is based on the actual revenue generated by each staff member during the selected date range.
            </p>
          </div>
        </>
      )}
    </div>
  );
}