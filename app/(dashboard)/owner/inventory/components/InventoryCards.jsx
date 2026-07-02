"use client";

import { Package, AlertTriangle, IndianRupee, Loader2 } from "lucide-react";

export default function InventoryCards({
  totalProducts,
  lowStock,
  totalStockValue,
  loading,
}) {
  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Low Stock Alert",
      value: lowStock,
      icon: AlertTriangle,
      color: "red",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Stock Value",
      value: `₹${totalStockValue.toLocaleString()}`,
      icon: IndianRupee,
      color: "green",
      bg: "bg-green-50",
      text: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              {loading ? (
                <div className="mt-2">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.text}`} />
            </div>
          </div>

          {/* Small indicator for low stock */}
          {card.title === "Low Stock Alert" && !loading && lowStock > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {lowStock} product{lowStock > 1 ? "s" : ""} need attention
            </div>
          )}

          {card.title === "Stock Value" && !loading && totalStockValue === 0 && (
            <div className="mt-3 text-xs text-gray-400">
              No products added yet
            </div>
          )}

          {card.title === "Total Products" && !loading && totalProducts === 0 && (
            <div className="mt-3 text-xs text-gray-400">
              Start by adding your first product
            </div>
          )}
        </div>
      ))}
    </div>
  );
}