"use client";

import { useState } from "react";

export default function SplitPayment({ grandTotal, onPaymentChange }) {
  const [payments, setPayments] = useState([
    { mode: "Cash", amount: 0 },
    { mode: "UPI", amount: 0 },
    { mode: "Card", amount: 0 },
  ]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = grandTotal - totalPaid;

  const updatePayment = (index, value) => {
    const newPayments = [...payments];
    newPayments[index].amount = Number(value) || 0;
    setPayments(newPayments);
    onPaymentChange(newPayments);
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        💳 Split Payment (Optional)
      </label>
      <div className="space-y-2">
        {payments.map((p, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-16 text-sm font-medium text-gray-600">{p.mode}</span>
            <input
              type="number"
              value={p.amount || ""}
              onChange={(e) => updatePayment(index, e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between items-center text-sm">
        <span className="text-gray-600">Total Paid:</span>
        <span className="font-bold text-green-600">₹{totalPaid}</span>
      </div>

      {totalPaid > 0 && (
        <div
          className={`text-xs mt-1 ${
            balance === 0 ? "text-green-600" : "text-orange-500"
          }`}
        >
          {balance === 0
            ? "✅ Fully paid"
            : `⚠️ Balance: ₹${balance.toFixed(2)}`}
        </div>
      )}
    </div>
  );
}