"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Building2, MapPin, Navigation, Loader, CheckCircle, AlertCircle, Sparkles, Upload } from "lucide-react";

export default function SalonSetupPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load salon data on page load
  useEffect(() => {
    async function fetchSalon() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/salon/my-salon`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok && data.salon) {
          setSalon(data.salon);
          if (data.salon.image) {
            setPreview(data.salon.image);
          }
        }
      } catch (err) {
        console.log("Salon fetch error:", err);
        setError("Failed to load salon details");
      } finally {
        setLoading(false);
      }
    }

    fetchSalon();
  }, []);

  // Handle image selection and preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // Handle image upload
  async function handleImageUpload() {
    if (!imageFile || !salon?._id) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/salon/upload-image/${salon._id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.salon?.image) {
        setSalon((prev) => ({ ...prev, image: data.salon.image }));
        setSuccess("Salon image updated successfully!");
        // Clear the temporary preview and file
        setImageFile(null);
      }
    } catch (err) {
      console.log("Upload error:", err);
      setError("Failed to upload image");
    }
  }

  // Form submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.target);
    const payload = {
      name: form.get("name"),
      address: form.get("address"),
      city: form.get("city"),
      description: form.get("description"),
    };

    try {
      // ✅ LOCALHOST REPLACED WITH ENV VARIABLE
      const url = salon
        ? `${process.env.NEXT_PUBLIC_API_URL}/salon/update`
        : `${process.env.NEXT_PUBLIC_API_URL}/salon/create`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess(salon ? "Salon details updated successfully!" : "Salon created successfully!");
      
      // Upload image if new file is selected
      if (imageFile && data.salon?._id) {
        await handleImageUpload();
      }

      // Redirect after success
      setTimeout(() => {
        router.push("/owner/salon");
      }, 1500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-2">Loading salon details...</p>
        </div>
      </div>
    );
  }

  const isEditMode = !!salon;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Building2 className="text-white w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
          {isEditMode ? "Salon Details" : "Setup Your Salon"}
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          {isEditMode 
            ? "Update your salon information to keep your business details current"
            : "Welcome! Let's set up your salon profile to start accepting bookings"
          }
        </p>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
            <p className="text-red-800 text-sm sm:text-base">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
          >
            <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0" />
            <p className="text-green-800 text-sm sm:text-base">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {isEditMode ? "Salon Information" : "Salon Details"}
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isEditMode 
              ? "Update your salon information below"
              : "Fill in your salon details to get started"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* Salon Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Salon Image
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Upload a high-quality image of your salon (JPG, PNG, WebP)
                </p>
              </div>
              
              {imageFile && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Now
                </button>
              )}
            </div>

            {/* Image Preview */}
            <div className="mt-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Salon preview"
                    className="w-full h-48 object-cover rounded-xl border"
                  />
                  {imageFile && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs">
                      New Image
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed">
                  <Upload className="w-8 h-8 mb-2" />
                  <p>No image uploaded</p>
                  <p className="text-xs mt-1">Select an image to preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Salon Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                Salon Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={salon?.name || ""}
                placeholder="Enter your salon name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
              />
              <p className="text-gray-500 text-xs mt-2">
                This will be displayed to customers when they book appointments
              </p>
            </div>

            {/* Address & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Address *
                </label>
                <input
                  name="address"
                  type="text"
                  defaultValue={salon?.address || ""}
                  placeholder="Full street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Navigation className="w-4 h-4 text-purple-600" />
                  City *
                </label>
                <input
                  name="city"
                  type="text"
                  defaultValue={salon?.city || ""}
                  placeholder="City name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Salon Description
              </label>
              <textarea
                name="description"
                defaultValue={salon?.description || ""}
                placeholder="Describe your salon, services, specialties, or anything customers should know..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
              />
              <p className="text-gray-500 text-xs mt-2">
                This helps customers understand what makes your salon special
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="text-center sm:text-left">
              <p className="text-gray-600 text-sm">
                {isEditMode 
                  ? "Update your salon information to keep it current"
                  : "Almost there! Complete your salon setup"
                }
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm sm:text-base"
                disabled={submitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {submitting ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {submitting 
                  ? "Saving..." 
                  : (isEditMode ? "Update Salon" : "Create Salon")
                }
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}