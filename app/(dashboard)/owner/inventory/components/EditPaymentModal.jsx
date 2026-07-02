"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

export default function EditPaymentModal({ isOpen, onClose, onSuccess, purchase }) {
  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amountPaid: purchase?.amountPaid || 0,
    paymentMode: purchase?.paymentMode || "Cash",
  });

  if (!isOpen || !purchase) return null;

  const balanceDue = purchase.totalAmount - form.amountPaid;
  const maxAmount = purchase.totalAmount;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/purchases/update-payment/${purchase._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amountPaid: form.amountPaid,
          paymentMode: form.paymentMode,
          paymentDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Payment updated successfully!");
        onSuccess();
      } else {
        alert(data.message || "Failed to update payment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">💳 Update Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <div className="text-lg font-bold text-gray-900">₹{purchase.totalAmount.toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Paid</label>
            <div className="text-sm text-gray-600">₹{purchase.amountPaid?.toLocaleString() || 0}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance Due</label>
            <div className="text-sm font-bold text-red-600">₹{balanceDue.toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
            <input
              type="number"
              value={form.amountPaid}
              onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              max={maxAmount}
              step="0.01"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Max: ₹{maxAmount.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Save className="w-4 h-4" /> Update Payment</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}