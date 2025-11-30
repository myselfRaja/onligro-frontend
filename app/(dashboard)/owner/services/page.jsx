"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Clock, IndianRupee, Search, Loader } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });
  const [selectedService, setSelectedService] = useState(null);

  // ===========================
  // Fetch services
  // ===========================
  async function loadServices() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setServices(data.services);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  // ===========================
  // Add new service
  // ===========================
  async function addService(e) {
    e.preventDefault();
    setActionLoading("adding");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setAddModal(false);
        setForm({ name: "", price: "", duration: "" });
        await loadServices();
      }
    } catch (error) {
      console.error("Failed to add service:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Update service
  // ===========================
  async function updateService(e) {
    e.preventDefault();
    setActionLoading("updating");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/update/${selectedService._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setEditModal(false);
        setForm({ name: "", price: "", duration: "" });
        setSelectedService(null);
        await loadServices();
      }
    } catch (error) {
      console.error("Failed to update service:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Delete service
  // ===========================
  async function deleteService() {
    setActionLoading("deleting");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/delete/${selectedService._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setDeleteModal(false);
        setSelectedService(null);
        await loadServices();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Open edit modal
  // ===========================
  function openEditModal(service) {
    setSelectedService(service);
    setForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
    });
    setEditModal(true);
  }

  // ===========================
  // Open delete modal
  // ===========================
  function openDeleteModal(service) {
    setSelectedService(service);
    setDeleteModal(true);
  }

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your salon services and pricing</p>
        </div>

        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* SERVICES GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading services...</p>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No services found" : "No services added yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by adding your first service"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Add Your First Service
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{service.name}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(service)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <IndianRupee size={16} className="text-green-600" />
                    <span className="font-medium text-gray-900">₹{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-blue-600" />
                    <span>{service.duration} minutes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      <AnimatePresence>
        {addModal && (
          <Modal
            title="Add New Service"
            onClose={() => setAddModal(false)}
            onSubmit={addService}
            loading={actionLoading === "adding"}
            submitText="Add Service"
          >
            <ServiceForm form={form} setForm={setForm} />
          </Modal>
        )}
      </AnimatePresence>

      {/* EDIT SERVICE MODAL */}
      <AnimatePresence>
        {editModal && (
          <Modal
            title="Edit Service"
            onClose={() => {
              setEditModal(false);
              setSelectedService(null);
              setForm({ name: "", price: "", duration: "" });
            }}
            onSubmit={updateService}
            loading={actionLoading === "updating"}
            submitText="Update Service"
          >
            <ServiceForm form={form} setForm={setForm} />
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteConfirmationModal
            service={selectedService}
            onClose={() => {
              setDeleteModal(false);
              setSelectedService(null);
            }}
            onConfirm={deleteService}
            loading={actionLoading === "deleting"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===========================
// REUSABLE SERVICE FORM COMPONENT
// ===========================
function ServiceForm({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Name *
        </label>
        <input
          type="text"
          placeholder="e.g., Hair Cut, Facial, Massage"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            placeholder="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            placeholder="30"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="5"
            required
          />
        </div>
      </div>
    </div>
  );
}

// ===========================
// REUSABLE MODAL COMPONENT
// ===========================
function Modal({ title, children, onClose, onSubmit, loading, submitText }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6">
            {children}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading && <Loader className="animate-spin" size={16} />}
              {submitText}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ===========================
// DELETE CONFIRMATION MODAL
// ===========================
function DeleteConfirmationModal({ service, onClose, onConfirm, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-600">Delete Service</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-red-800">Are you sure?</p>
              <p className="text-red-600 text-sm">This action cannot be undone.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-2">You are about to delete:</p>
            <p className="font-semibold text-gray-900">{service?.name}</p>
            <p className="text-gray-600 text-sm">₹{service?.price} • {service?.duration} mins</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading && <Loader className="animate-spin" size={16} />}
            Delete Service
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}