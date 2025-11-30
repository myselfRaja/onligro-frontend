"use client";

import { useState, useEffect } from "react";

export default function CustomerDetails({ onSubmit, initialData }) { // ✅ initialData prop add karo
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NEW: Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phone || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim() || phone.length !== 10) {
      alert("Please enter valid name and 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit({ name: name.trim(), phone: phone.trim() });
    setIsSubmitting(false);
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Details</h2>
            <p className="text-gray-600 text-sm">We'll confirm your appointment</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) setPhone(value);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="98765 43210"
                  maxLength={10}
                  disabled={isSubmitting}
                />
              </div>
              {phone && phone.length < 10 && (
                <p className="text-red-500 text-xs mt-1">Enter 10-digit number</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim() || phone.length !== 10}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold mt-6 transition-all
              ${isSubmitting || !name.trim() || phone.length !== 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              "Confirm Appointment"
            )}
          </button>

          {/* Privacy Note */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Your information is secure
          </p>
        </div>
      </div>
    </section>
  );
}