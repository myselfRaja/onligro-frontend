"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

export default function ProductsTable({ products, loading, onRefresh }) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const searchLower = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(searchLower) ||
      p.productCode?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Delete product
  async function handleDelete(productId, productName) {
    if (
      !confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(productId);
    try {
      const res = await fetch(`${BASE_URL}/products/delete/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onRefresh();
        alert("Product deleted successfully!");
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  // Open edit modal
  function handleEdit(product) {
    setEditingProduct(product);
    setShowEditModal(true);
  }

  // Modal handlers
  function handleAddSuccess() {
    onRefresh();
    setShowAddModal(false);
  }

  function handleEditSuccess() {
    onRefresh();
    setShowEditModal(false);
    setEditingProduct(null);
  }

  function handleModalClose() {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingProduct(null);
  }

  // Export CSV
  function exportCSV() {
    if (filteredProducts.length === 0) return;

    const headers = ["Name", "Code", "Category", "Stock", "MRP"];
    const rows = filteredProducts.map((p) => [
      p.name,
      p.productCode,
      p.category || "-",
      p.stockQuantity,
      p.mrp,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Products
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({filteredProducts.length})
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              disabled={filteredProducts.length === 0}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              📥 Export
            </button>

            <button
              id="addProductBtn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500">Loading products...</span>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-16">
            {search ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products found for "{search}"</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products in inventory</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-blue-600 text-sm hover:underline"
                >
                  Add your first product
                </button>
              </>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  MRP
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => {
                const isLowStock =
                  product.stockQuantity <= product.lowStockThreshold;
                const isOutOfStock = product.stockQuantity === 0;

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition group"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 sm:hidden">
                          {product.productCode}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                      {product.productCode}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      {product.category || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isOutOfStock ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {product.stockQuantity} left
                          </span>
                        ) : (
                          <span className="text-sm text-gray-700">
                            {product.stockQuantity}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{product.mrp}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deletingId === product._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === product._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500 hidden sm:block">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </p>

          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="px-3 py-1.5 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={handleModalClose}
          onSuccess={handleEditSuccess}
          productData={editingProduct}
        />
      )}
    </div>
  );
}