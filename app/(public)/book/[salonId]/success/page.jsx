// app/(public)/book/[salonId]/success/page.jsx
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage({ params, searchParams }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  
  const { salonId } = unwrappedParams;
  const appointmentId = unwrappedSearchParams.appointmentId;
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) {
        setError("No appointment ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
       const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/public/appointments/${appointmentId}`
);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch appointment: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📦 Full appointment data:", data); // Debug log
        setAppointment(data.appointment);
        
      } catch (err) {
        console.error("Error loading appointment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (appointmentId) {
      loadAppointment();
    } else {
      setLoading(false);
    }
  }, [appointmentId]);

  // Format date and time nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Debug info
  console.log("Appointment ID:", appointmentId);
  console.log("Appointment data:", appointment);
  console.log("Staff data:", appointment?.staffId);

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Booking</h1>
          <p className="text-gray-600 mb-6">No appointment ID found. Please book again.</p>
          <Link 
            href={`/book/${salonId}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-green-100">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-800 text-center mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your appointment has been successfully scheduled
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointment details...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-center">{error}</p>
            <p className="text-red-600 text-center text-sm mt-2">
              Please contact the salon directly for your booking details.
            </p>
          </div>
        )}

        {/* Appointment Details */}
        {appointment && !loading && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Customer & Appointment Details */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Your Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="text-gray-800 font-semibold">{appointment.customerName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Phone:</span>
                  <span className="text-gray-800 font-mono">{appointment.customerPhone}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-800">{formatDate(appointment.startAt)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-gray-800 font-semibold">{formatTime(appointment.startAt)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="text-gray-800">{appointment.totalDuration} minutes</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status?.charAt(0)?.toUpperCase() + appointment.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Staff & Services Details */}
            <div className="space-y-6">
              {/* Staff Details */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                  Your Stylist
                </h2>
                
                {appointment.staffId ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {appointment.staffId.name?.charAt(0)?.toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {appointment.staffId.name || "Senior Stylist"}
                        </p>
                        {appointment.staffId.specialization && (
                          <p className="text-blue-600 text-sm">
                            {appointment.staffId.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {appointment.staffId.phone && (
                      <p className="text-gray-600 text-sm">
                        📞 {appointment.staffId.phone}
                      </p>
                    )}
                    
                    {appointment.staffId.email && (
                      <p className="text-gray-600 text-sm">
                        ✉️ {appointment.staffId.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    Staff will be assigned soon
                  </p>
                )}
              </div>

              {/* Services List */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Services Booked
                </h2>
                
                {appointment.services && appointment.services.length > 0 ? (
                  <div className="space-y-3">
                    {appointment.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-gray-800 font-medium">{service.name}</p>
                          {service.duration && (
                            <p className="text-gray-500 text-sm">{service.duration} min</p>
                          )}
                        </div>
                        <span className="text-gray-800 font-semibold">₹{service.price}</span>
                      </div>
                    ))}
                    
                    {/* Total Price */}
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                      <span className="text-gray-800 font-bold text-lg">Total:</span>
                      <span className="text-gray-800 font-bold text-lg">₹{appointment.totalPrice}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No services listed</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointment ID & Actions */}
        {appointment && (
          <div className="space-y-6">
            {/* Reference ID */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 text-center text-sm">
                <strong>Booking Reference:</strong> {appointment._id || appointmentId}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/book/${salonId}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Book Another Appointment
              </Link>
              
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Print Details
              </button>
              
              <Link 
                href={`/`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Home Page
              </Link>
            </div>
          </div>
        )}

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          A confirmation message has been sent to your phone number. 
          Please arrive 10 minutes before your scheduled time.
        </p>
      </div>
    </div>
  );
}