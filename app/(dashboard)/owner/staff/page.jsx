"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, Users, Loader, UserPlus } from "lucide-react";

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    role: "",
  });
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Role options
  const roleOptions = [
    "Hair Stylist",
    "Senior Hair Stylist",
    "Beautician",
    "Senior Beautician", 
    "Makeup Artist",
    "Bridal Makeup Artist",
    "Massage Therapist",
    "Spa Therapist",
    "Nail Artist",
    "Nail Technician",
    "Salon Manager",
    "Receptionist",
    "Trainee"
  ];

  // ===========================
  // Fetch staff
  // ===========================
  async function fetchStaff() {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/all`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setStaffList(data.staff || []);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  }

  // ===========================
  // Add staff
  // ===========================
  async function addStaff(e) {
    e.preventDefault();
    setActionLoading("adding");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setAddModal(false);
        setForm({ name: "", role: "" });
        await fetchStaff();
      }
    } catch (error) {
      console.error("Failed to add staff:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Update staff
  // ===========================
  async function updateStaff(e) {
    e.preventDefault();
    setActionLoading("updating");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/update/${selectedStaff._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setEditModal(false);
        setForm({ name: "", role: "" });
        setSelectedStaff(null);
        await fetchStaff();
      }
    } catch (error) {
      console.error("Failed to update staff:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Delete staff
  // ===========================
  async function deleteStaff() {
    setActionLoading("deleting");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/delete/${selectedStaff._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setDeleteModal(false);
        setSelectedStaff(null);
        await fetchStaff();
      }
    } catch (error) {
      console.error("Failed to delete staff:", error);
    } finally {
      setActionLoading(null);
    }
  }

  // ===========================
  // Open edit modal
  // ===========================
  function openEditModal(staff) {
    setSelectedStaff(staff);
    setForm({
      name: staff.name,
      role: staff.role,
    });
    setEditModal(true);
  }

  // ===========================
  // Open delete modal
  // ===========================
  function openDeleteModal(staff) {
    setSelectedStaff(staff);
    setDeleteModal(true);
  }

  // Filter staff based on search
  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group staff by role
  const staffByRole = filteredStaff.reduce((acc, staff) => {
    if (!acc[staff.role]) {
      acc[staff.role] = [];
    }
    acc[staff.role].push(staff);
    return acc;
  }, {});

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your salon team and their roles</p>
        </div>

        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlus size={20} />
          Add Staff Member
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffList.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(staffByRole).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Today</p>
              <p className="text-2xl font-bold text-gray-900">{staffList.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* STAFF LIST */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading staff...</p>
          </div>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No staff found" : "No staff members yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Start building your team by adding your first staff member"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Add First Staff Member
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(staffByRole).map(([role, staffMembers]) => (
            <div key={role} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{role}</h3>
                <p className="text-gray-600 text-sm">{staffMembers.length} staff member(s)</p>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffMembers.map((staff, index) => (
                    <motion.div
                      key={staff._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(staff)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(staff)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{staff.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{staff.role}</p>
                      
                      <div className="flex gap-2 text-xs">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Available
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD STAFF MODAL */}
      <AnimatePresence>
        {addModal && (
          <StaffModal
            title="Add Staff Member"
            onClose={() => setAddModal(false)}
            onSubmit={addStaff}
            loading={actionLoading === "adding"}
            submitText="Add Staff"
            form={form}
            setForm={setForm}
            roleOptions={roleOptions}
          />
        )}
      </AnimatePresence>

      {/* EDIT STAFF MODAL */}
      <AnimatePresence>
        {editModal && (
          <StaffModal
            title="Edit Staff Member"
            onClose={() => {
              setEditModal(false);
              setSelectedStaff(null);
              setForm({ name: "", role: "" });
            }}
            onSubmit={updateStaff}
            loading={actionLoading === "updating"}
            submitText="Update Staff"
            form={form}
            setForm={setForm}
            roleOptions={roleOptions}
          />
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteStaffModal
            staff={selectedStaff}
            onClose={() => {
              setDeleteModal(false);
              setSelectedStaff(null);
            }}
            onConfirm={deleteStaff}
            loading={actionLoading === "deleting"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===========================
// STAFF MODAL COMPONENT
// ===========================
function StaffModal({ title, onClose, onSubmit, loading, submitText, form, setForm, roleOptions }) {
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
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Name *
              </label>
              <input
                type="text"
                placeholder="Enter staff member's name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
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
// DELETE STAFF MODAL
// ===========================
function DeleteStaffModal({ staff, onClose, onConfirm, loading }) {
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
          <h2 className="text-xl font-semibold text-red-600">Remove Staff Member</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-red-800">Are you sure?</p>
              <p className="text-red-600 text-sm">This staff member will be removed from all appointments.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {staff?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{staff?.name}</p>
                <p className="text-gray-600 text-sm">{staff?.role}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">This action cannot be undone and may affect upcoming appointments.</p>
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
            Remove Staff
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}