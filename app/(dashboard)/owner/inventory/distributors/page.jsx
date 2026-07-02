"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
  Phone,
  MapPin,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import AddDistributorModal from "../components/AddDistributorModal";

export default function DistributorsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [ledgerData, setLedgerData] = useState({});
  const [loadingLedger, setLoadingLedger] = useState({});

  useEffect(() => {
    loadDistributors();
  }, []);

  async function loadDistributors() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/distributors/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setDistributors(data.distributors || []);
        // Load ledger for each distributor
        data.distributors?.forEach((d) => {
          loadLedger(d._id);
        });
      }
    } catch (err) {
      console.error("Error loading distributors:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadLedger(distributorId) {
    setLoadingLedger((prev) => ({ ...prev, [distributorId]: true }));
    try {
      const res = await fetch(`${BASE_URL}/distributors/ledger/${distributorId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setLedgerData((prev) => ({ ...prev, [distributorId]: data }));
      }
    } catch (err) {
      console.error("Error loading ledger:", err);
    } finally {
      setLoadingLedger((prev) => ({ ...prev, [distributorId]: false }));
    }
  }

  // Filter distributors
  const filteredDistributors = distributors.filter((d) => {
    const s = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(s) ||
      d.phone?.includes(s) ||
      d.address?.toLowerCase().includes(s)
    );
  });

  // Delete distributor
  async function handleDelete(id, name) {
    const ledger = ledgerData[id];
    if (ledger?.totalPurchases > 0) {
      alert(`Cannot delete "${name}" because they have purchase history.`);
      return;
    }

    if (!confirm(`Delete distributor "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${BASE_URL}/distributors/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        loadDistributors();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  // Edit distributor
  function handleEdit(distributor) {
    setEditingDistributor(distributor);
    setShowModal(true);
  }

  // Modal handlers
  function handleModalClose() {
    setShowModal(false);
    setEditingDistributor(null);
  }

  function handleModalSuccess() {
    loadDistributors();
    handleModalClose();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/owner/inventory"
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-7 h-7 text-green-600" />
              Distributors
            </h1>
            <p className="text-gray-500 text-sm">Manage your suppliers</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search distributors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setEditingDistributor(null);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Distributor
            </button>
          </div>
        </div>

        {/* Distributor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-500">Loading distributors...</span>
            </div>
          ) : filteredDistributors.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {search ? "No distributors found" : "No distributors added yet"}
              </p>
              {!search && (
                <button
                  onClick={() => {
                    setEditingDistributor(null);
                    setShowModal(true);
                  }}
                  className="mt-3 text-green-600 text-sm hover:underline"
                >
                  Add your first distributor
                </button>
              )}
            </div>
          ) : (
            filteredDistributors.map((d) => {
              const ledger = ledgerData[d._id];
              const isLedgerLoading = loadingLedger[d._id];

              return (
                <div
                  key={d._id}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {d.name}
                      </h3>

                      {d.phone && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {d.phone}
                        </p>
                      )}

                      {d.address && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {d.address}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(d)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id, d.name)}
                        disabled={deletingId === d._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === d._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Ledger Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {isLedgerLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    ) : ledger ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Total Purchases</p>
                          <p className="text-sm font-semibold text-gray-800">
                            ₹{ledger.totalPurchase?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Paid</p>
                          <p className="text-sm font-semibold text-green-600">
                            ₹{ledger.totalPaid?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">Balance Due</p>
                          <p
                            className={`text-sm font-bold ${
                              ledger.balance > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            ₹{ledger.balance?.toLocaleString() || 0}
                            {ledger.balance > 0 && (
                              <span className="ml-2 text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                Due
                              </span>
                            )}
                            {ledger.balance === 0 && (
                              <span className="ml-2 text-xs font-normal text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                                ✅ Clear
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="col-span-2 mt-1">
                          <Link
                            href={`/owner/inventory/distributors/${d._id}`}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View Payment History
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 text-center">
                        No purchases yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        {filteredDistributors.length > 0 && !loading && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Total {filteredDistributors.length} distributor
            {filteredDistributors.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Add/Edit Distributor Modal */}
      {showModal && (
        <AddDistributorModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          editData={editingDistributor}
        />
      )}
    </div>
  );
}