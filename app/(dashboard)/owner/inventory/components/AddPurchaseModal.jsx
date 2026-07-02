"use client";

import { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
  Truck,
  Package,
  IndianRupee,
} from "lucide-react";

export default function AddPurchaseModal({ isOpen, onClose, onSuccess }) {
  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data states
  const [distributors, setDistributors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Form state
  const [form, setForm] = useState({
    distributorId: "",
    invoiceNumber: "",
    products: [],
    paymentStatus: "Pending",
    amountPaid: 0,
    paymentMode: "Cash",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Load distributors and products
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    try {
      const [dRes, pRes] = await Promise.all([
        fetch(`${BASE_URL}/distributors/all`, { credentials: "include" }),
        fetch(`${BASE_URL}/products/all`, { credentials: "include" }),
      ]);

      const dData = await dRes.json();
      const pData = await pRes.json();

      if (dData.success) setDistributors(dData.distributors || []);
      if (pData.success) setProducts(pData.products || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  if (!isOpen) return null;

  // Add product to purchase
  function addProduct() {
    if (!selectedProductId) return;

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    // Check if already added
    const existing = form.products.find((p) => p.productId === selectedProductId);
    if (existing) {
      alert("Product already added!");
      return;
    }

    setForm({
      ...form,
      products: [
        ...form.products,
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          purchasePrice: product.mrp || 0,
        },
      ],
    });
    setSelectedProductId("");
  }

  // Remove product from purchase
  function removeProduct(productId) {
    setForm({
      ...form,
      products: form.products.filter((p) => p.productId !== productId),
    });
  }

  // Update product quantity or price
  function updateProductField(productId, field, value) {
    setForm({
      ...form,
      products: form.products.map((p) =>
        p.productId === productId
          ? { ...p, [field]: field === "quantity" || field === "purchasePrice" ? Number(value) || 0 : value }
          : p
      ),
    });
  }

  // Calculate totals
  const totalItems = form.products.reduce((sum, p) => sum + p.quantity, 0);
  const subtotal = form.products.reduce(
    (sum, p) => sum + p.quantity * p.purchasePrice,
    0
  );
  const tax = subtotal * 0.10; // 10% GST
  const totalAmount = subtotal + tax;
  const balanceDue = totalAmount - form.amountPaid;

  // Auto-update payment status based on balance
  const getAutoPaymentStatus = () => {
    if (balanceDue <= 0) return "Paid";
    if (form.amountPaid > 0 && balanceDue > 0) return "Partial";
    return "Pending";
  };

  // Submit purchase
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.distributorId) {
      setError("Please select a distributor");
      return;
    }

    if (form.products.length === 0) {
      setError("Please add at least one product");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        distributorId: form.distributorId,
        invoiceNumber: form.invoiceNumber,
        products: form.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          purchasePrice: p.purchasePrice,
        })),
        paymentStatus: getAutoPaymentStatus(),
        amountPaid: form.amountPaid,
        paymentMode: form.paymentMode,
        paymentDate: form.paymentDate || new Date(),
        notes: form.notes,
      };

      const res = await fetch(`${BASE_URL}/purchases/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setSuccess("✅ Purchase created! Stock updated.");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to create purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              New Purchase Order
            </h2>
            <p className="text-sm text-gray-500">Add stock from distributor</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Distributor + Invoice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distributor *
              </label>
              <select
                required
                value={form.distributorId}
                onChange={(e) => setForm({ ...form, distributorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Distributor</option>
                {distributors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} {d.phone ? `(${d.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., INV-001"
              />
            </div>
          </div>

          {/* Products Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Products
            </label>
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a product...</option>
                {products.map((p) => {
                  const alreadyAdded = form.products.some(
                    (item) => item.productId === p._id
                  );
                  return (
                    <option key={p._id} value={p._id} disabled={alreadyAdded}>
                      {p.name} ({p.productCode}) - Stock: {p.stockQuantity}
                      {alreadyAdded ? " ✅" : ""}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                onClick={addProduct}
                disabled={!selectedProductId}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          {/* Products List */}
          {form.products.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Products in this purchase ({form.products.length})
              </h4>
              <div className="space-y-2">
                {form.products.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                    </div>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateProductField(item.productId, "quantity", e.target.value)
                      }
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-purple-500"
                      placeholder="Qty"
                      min="1"
                    />

                    <input
                      type="number"
                      value={item.purchasePrice}
                      onChange={(e) =>
                        updateProductField(item.productId, "purchasePrice", e.target.value)
                      }
                      className="w-24 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-purple-500"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />

                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                      ₹{(item.quantity * item.purchasePrice).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeProduct(item.productId)}
                      className="p-1 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Section */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">💰 Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  value={form.amountPaid}
                  onChange={(e) =>
                    setForm({ ...form, amountPaid: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Balance Due
                </label>
                <div className="w-full px-3 py-2 bg-blue-100 rounded-lg text-blue-800 font-bold">
                  ₹{balanceDue.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Payment Status (Auto)
                </label>
                <div
                  className={`w-full px-3 py-2 rounded-lg font-medium text-center
                    ${
                      getAutoPaymentStatus() === "Paid"
                        ? "bg-green-100 text-green-700"
                        : getAutoPaymentStatus() === "Partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {getAutoPaymentStatus()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={form.paymentMode}
                  onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any extra info..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || form.products.length === 0}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Purchase...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Purchase & Update Stock
              </>
            )}
          </button>

          {form.products.length === 0 && (
            <p className="text-center text-xs text-amber-600">
              ⚠️ Add at least one product
            </p>
          )}
        </form>
      </div>
    </div>
  );
}