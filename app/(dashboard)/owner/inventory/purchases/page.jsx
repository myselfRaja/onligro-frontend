"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Loader2,
  Search,
  X,
  Truck,
  Package,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import AddPurchaseModal from "../components/AddPurchaseModal";
import EditPaymentModal from "../components/EditPaymentModal";

export default function PurchasesPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/purchases/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases || []);
      }
    } catch (err) {
      console.error("Error loading purchases:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPurchases = purchases.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.distributorId?.name?.toLowerCase().includes(s) ||
      p.paymentStatus?.toLowerCase().includes(s) ||
      p.invoiceNumber?.toLowerCase().includes(s)
    );
  });

  async function handleDelete(id) {
    if (!confirm("Delete this purchase? Stock will be restored.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${BASE_URL}/purchases/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        loadPurchases();
        alert("Purchase deleted! Stock restored.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  // ✅ Open payment modal
  function handleEditPayment(purchase) {
    setSelectedPurchase(purchase);
    setShowPaymentModal(true);
  }

  const getStatusColor = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Partial") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status === "Paid") return <CheckCircle className="w-3 h-3" />;
    if (status === "Partial") return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/owner/inventory" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-purple-600" /> Purchases
            </h1>
            <p className="text-gray-500 text-sm">Track stock purchases from distributors</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by distributor, status, invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Purchase
            </button>
          </div>
        </div>

        {/* Purchase List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-500">Loading purchases...</span>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{search ? "No purchases found" : "No purchases yet"}</p>
              {!search && (
                <button onClick={() => setShowModal(true)} className="mt-3 text-purple-600 text-sm hover:underline">
                  Add your first purchase
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPurchases.map((p) => {
                const totalItems = p.products?.reduce((sum, item) => sum + (item.quantity || 0), 0);
                const totalAmount = p.products?.reduce((sum, item) => sum + (item.quantity || 0) * (item.purchasePrice || 0), 0);

                return (
                  <div key={p._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{p.distributorId?.name || "Unknown"}</span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.paymentStatus)}`}>
                            {getStatusIcon(p.paymentStatus)} {p.paymentStatus}
                          </span>
                          {p.invoiceNumber && (
                            <>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500 font-mono">INV: {p.invoiceNumber}</span>
                            </>
                          )}
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(p.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span><Package className="w-3 h-3 inline mr-1" /> {totalItems} items</span>
                          <span><IndianRupee className="w-3 h-3 inline mr-1" /> {totalAmount.toLocaleString()}</span>
                          {p.balanceDue > 0 && <span className="text-red-600 font-medium">Balance: ₹{p.balanceDue.toLocaleString()}</span>}
                          {p.balanceDue === 0 && p.paymentStatus === "Paid" && <span className="text-green-600 font-medium">✅ Fully Paid</span>}
                        </div>
                        {p.products && p.products.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.products.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {item.productId?.name || "Unknown"} × {item.quantity}
                              </span>
                            ))}
                            {p.products.length > 3 && <span className="text-xs text-gray-400">+{p.products.length - 3} more</span>}
                          </div>
                        )}
                      </div>

                      {/* ✅ ACTIONS BUTTONS */}
                      <div className="flex items-center gap-1">
                        {/* Edit Payment Button */}
                        <button
                          onClick={() => handleEditPayment(p)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Payment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* View Details Button */}
                        <button
                          onClick={() => alert(`Distributor: ${p.distributorId?.name}\nTotal: ₹${p.totalAmount}\nPaid: ₹${p.amountPaid}\nBalance: ₹${p.balanceDue}\nStatus: ${p.paymentStatus}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete Purchase"
                        >
                          {deletingId === p._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {filteredPurchases.length > 0 && !loading && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Total {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Add Purchase Modal */}
      {showModal && (
        <AddPurchaseModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadPurchases();
          }}
        />
      )}

      {/* ✅ Edit Payment Modal */}
      {showPaymentModal && (
        <EditPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPurchase(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedPurchase(null);
            loadPurchases();
          }}
          purchase={selectedPurchase}
        />
      )}
    </div>
  );
}