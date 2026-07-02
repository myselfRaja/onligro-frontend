"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Phone,
  MapPin,
  Mail,
  Building,
  FileText,
  IndianRupee,
  Loader2,
  Package,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";

export default function DistributorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const distributorId = params.id;

  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const [distributor, setDistributor] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [distributorId]);

  async function loadData() {
    setLoading(true);
    try {
      const [distRes, histRes, ledgerRes] = await Promise.all([
        fetch(`${BASE_URL}/distributors/${distributorId}`, {
          credentials: "include",
        }),
        fetch(`${BASE_URL}/distributors/ledger/history/${distributorId}`, {
          credentials: "include",
        }),
        fetch(`${BASE_URL}/distributors/ledger/${distributorId}`, {
          credentials: "include",
        }),
      ]);

      const distData = await distRes.json();
      const histData = await histRes.json();
      const ledgerData = await ledgerRes.json();

      if (distData.success) setDistributor(distData.distributor);
      if (histData.success) setPurchases(histData.purchases || []);
      if (ledgerData.success) setLedger(ledgerData);
    } catch (err) {
      console.error("Error loading distributor data:", err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Partial") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  }

  function getStatusIcon(status) {
    if (status === "Paid") return <CheckCircle className="w-3 h-3" />;
    if (status === "Partial") return <Clock className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-green-600 mx-auto" size={40} />
          <p className="mt-3 text-gray-500 text-sm">Loading distributor details...</p>
        </div>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Distributor not found</h2>
          <Link
            href="/owner/inventory/distributors"
            className="mt-4 inline-block text-green-600 hover:underline"
          >
            ← Back to Distributors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/owner/inventory/distributors"
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-7 h-7 text-green-600" />
              {distributor.name}
            </h1>
            <p className="text-gray-500 text-sm">Distributor details & payment history</p>
          </div>
        </div>

        {/* Distributor Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {distributor.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{distributor.phone}</span>
              </div>
            )}
            {distributor.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{distributor.email}</span>
              </div>
            )}
            {distributor.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{distributor.address}</span>
              </div>
            )}
            {distributor.contactPerson && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Contact: {distributor.contactPerson}</span>
              </div>
            )}
            {distributor.gstNumber && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-mono">GST: {distributor.gstNumber}</span>
              </div>
            )}
            {distributor.paymentTerms && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Terms: {distributor.paymentTerms}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ledger Summary */}
        {ledger && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400">Total Purchases</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{ledger.totalPurchase?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400">Total Paid</p>
              <p className="text-xl font-bold text-green-600">
                ₹{ledger.totalPaid?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400">Balance Due</p>
              <p
                className={`text-xl font-bold ${
                  ledger.balance > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{ledger.balance?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400">Total Purchases Count</p>
              <p className="text-xl font-bold text-gray-900">{ledger.totalPurchases || 0}</p>
            </div>
          </div>
        )}

        {/* Purchase History */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Purchase History
            </h2>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No purchases from this distributor yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {purchases.map((p) => {
                const totalItems = p.products?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                );
                const totalAmount = p.products?.reduce(
                  (sum, item) =>
                    sum + (item.quantity || 0) * (item.purchasePrice || 0),
                  0
                );

                return (
                  <div key={p._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              p.paymentStatus
                            )}`}
                          >
                            {getStatusIcon(p.paymentStatus)}
                            {p.paymentStatus}
                          </span>

                          {p.invoiceNumber && (
                            <>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500 font-mono">
                                INV: {p.invoiceNumber}
                              </span>
                            </>
                          )}

                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(p.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>
                            <Package className="w-3 h-3 inline mr-1" />
                            {totalItems} items
                          </span>
                          <span>
                            <IndianRupee className="w-3 h-3 inline mr-1" />
                            {totalAmount.toLocaleString()}
                          </span>
                          {p.balanceDue > 0 && (
                            <span className="text-red-600 font-medium">
                              Balance: ₹{p.balanceDue.toLocaleString()}
                            </span>
                          )}
                          {p.balanceDue === 0 && p.paymentStatus === "Paid" && (
                            <span className="text-green-600 font-medium">
                              ✅ Fully Paid
                            </span>
                          )}
                        </div>

                        {p.products && p.products.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.products.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                              >
                                {item.productId?.name || "Unknown"} ×{" "}
                                {item.quantity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}