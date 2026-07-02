"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Package, Truck, ShoppingBag, Plus, RefreshCw, ArrowRight, FileUp, Loader2 } from "lucide-react";
import InventoryCards from "./components/InventoryCards";
import ProductsTable from "./components/ProductsTable";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploading, setUploading] = useState(false); // ✅ NEW
  const fileInputRef = useRef(null); // ✅ NEW

  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  useEffect(() => {
    loadProducts();
  }, [refreshKey]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/products/all`, { credentials: "include" });
      const result = await res.json();
      if (result.success) setProducts(result.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ NEW: Import Excel Function
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${BASE_URL}/products/import`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      
      if (result.success) {
        alert(`✅ ${result.imported} products imported! ${result.failed} failed.`);
        refreshData();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (err) {
      alert("Failed to import. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const totalProducts = products.length;
  const lowStockItems = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);
  const totalStockValue = products.reduce((sum, p) => sum + p.stockQuantity * p.mrp, 0);
  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" /> Inventory
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage products, track stock, and handle purchases</p>
          </div>

          {/* ✅ UPDATED: Button Group with Import */}
          <div className="flex flex-wrap gap-2">
            {/* Import Excel Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileUp className="w-4 h-4" />
              )}
              {uploading ? "Importing..." : "Import Excel"}
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button onClick={refreshData} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-1 text-sm">
              <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={() => document.getElementById("addProductBtn")?.click()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /><span>Add Product</span>
            </button>
          </div>
        </div>

        <InventoryCards totalProducts={totalProducts} lowStock={lowStockItems.length} totalStockValue={totalStockValue} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/owner/inventory/distributors" className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition group flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl"><Truck className="w-6 h-6 text-green-600" /></div>
              <div><h3 className="font-semibold text-gray-900">Distributors</h3><p className="text-sm text-gray-500">Manage your suppliers</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition" />
          </Link>

          <Link href="/owner/inventory/purchases" className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition group flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl"><ShoppingBag className="w-6 h-6 text-purple-600" /></div>
              <div><h3 className="font-semibold text-gray-900">Purchases</h3><p className="text-sm text-gray-500">View purchase history</p></div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <ProductsTable products={products} loading={loading} onRefresh={refreshData} />
      </div>
    </div>
  );
}