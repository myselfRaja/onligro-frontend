"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";

const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function ProductPerformance({ startDate, endDate }) {
  const [products, setProducts] = useState([]);
  const [totals, setTotals] = useState({ quantity: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ startDate, endDate });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/reports/product-performance?${params}`,
          { credentials: "include" }
        );
        const result = await res.json();
        if (result.success) {
          setProducts(result.data || []);
          setTotals(result.totals || { quantity: 0, revenue: 0 });
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [startDate, endDate]);

  const maxRevenue = Math.max(...products.map((p) => p.revenue || 0), 0);

  // Most sold by quantity
  const mostSoldByQty = products.length > 0
    ? [...products].sort((a, b) => b.quantity - a.quantity)[0]
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Product Performance</h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No product sales in this period</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-3 text-right">Revenue</div>
          </div>

          <div className="divide-y divide-gray-100">
            {products.map((p, index) => {
              const progress = maxRevenue > 0 ? (p.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={index}>
                  <div className="px-5 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50">
                    <div className="col-span-1">
                      <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <div className="col-span-6">
                      <span className="font-semibold text-gray-900">{p.productName}</span>
                    </div>
                    <div className="col-span-2 text-right text-sm text-gray-600">
                      {p.quantity}
                    </div>
                    <div className="col-span-3 text-right font-medium text-green-700">
                      {fmt(p.revenue)}
                    </div>
                  </div>

                  <div className="px-5 pb-2">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-12 gap-2 items-center text-sm">
              <div className="col-span-7 font-bold text-gray-900">TOTAL</div>
              <div className="col-span-2 text-right text-gray-700">{totals.quantity}</div>
              <div className="col-span-3 text-right font-bold text-green-700">
                {fmt(totals.revenue)}
              </div>
            </div>
          </div>

          {/* Most Sold Product */}
          {mostSoldByQty && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                🏆 Most sold product:{" "}
                <span className="font-semibold text-green-700">
                  {mostSoldByQty.productName}
                </span>{" "}
                ({mostSoldByQty.quantity} sold)
              </p>
            </div>
          )}

          <div className="px-5 py-3 bg-green-50 border-t border-green-100">
            <p className="text-xs text-gray-600">
              Product revenue is calculated after discounts. Staff commission is not included.
            </p>
          </div>
        </>
      )}
    </div>
  );
}