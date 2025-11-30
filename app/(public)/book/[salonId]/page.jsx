// app/(public)/book/[salonId]/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import SalonHeaderClient from "./SalonHeaderClient";
import ServiceSelector from "./ServiceSelector";
import DatePicker from "./DatePicker";
import SlotSelector from "./SlotSelector";
import { useRouter } from "next/navigation";


export default function SalonBookingPage({ params }) {
  // Unwrap the params promise using use() hook
  const unwrappedParams = use(params);
  const { salonId } = unwrappedParams;

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch salon
  useEffect(() => {
    async function fetchSalon() {
      try {
        setError(null);
        const res = await fetch(`http://localhost:5000/public/salon/${salonId}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch salon: ${res.status}`);
        }
        
        const data = await res.json();
        setSalon(data.salon);
      } catch (error) {
        console.error("Failed to fetch salon:", error);
        setError("Failed to load salon information");
      } finally {
        setLoading(false);
      }
    }
    
    if (salonId) {
      fetchSalon();
    }
  }, [salonId]);

 const router = useRouter();

const handleCreateAppointment = async () => {
  // Validation
  if (!selectedServices.length) {
    alert("Please select at least one service.");
    return;
  }
  if (!selectedDate) {
    alert("Please select a date.");
    return;
  }
  if (!selectedTime) {
    alert("Please select a time slot.");
    return;
  }
  if (!customer.name.trim()) {
    alert("Please enter your name.");
    return;
  }
  if (!customer.phone.trim()) {
    alert("Please enter your phone number.");
    return;
  }

  const payload = {
    salonId,
    services: selectedServices,
    date: selectedDate,
    time: selectedTime,
    customerName: customer.name,
    customerPhone: customer.phone,
    duration: totalDuration
  };

  try {
    setIsSubmitting(true);

    const res = await fetch("http://localhost:5000/public/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      // SUCCESS → Go to Success Page
      router.push(`/book/${salonId}/success?appointmentId=${data.appointment._id}`);
      return;
    } else {
      alert(data.error || "Failed to create appointment");
    }

  } catch (err) {
    console.error("Create error:", err);
    alert("Network error. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug logs (remove in production)
  console.log("selectedServices:", selectedServices);
  console.log("totalDuration:", totalDuration);

  return (
    <div className="min-h-screen bg-gray-50">
      <SalonHeaderClient salon={salon} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 1. Services Selection */}
        <ServiceSelector
          salonId={salonId}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          totalDuration={totalDuration}
          setTotalDuration={setTotalDuration}
        />

        {/* 2. Customer Details - Show immediately */}
    {/* 2. Customer Details - Show immediately */}
<div className="bg-white p-6 rounded-lg shadow-sm border">
  <h2 className="text-xl font-semibold mb-4">Your Details</h2>
  <div className="space-y-4">
    <input
      placeholder="Your Full Name"
      value={customer.name}
      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <input
      placeholder="Phone Number"
      value={customer.phone}
      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
</div>

        {/* 3. Date Selection */}
        <DatePicker
          salonId={salonId}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />

        {/* 4. Time Slots - Only show if date is selected */}
        {selectedDate && (
          <SlotSelector
            salonId={salonId}
            selectedDate={selectedDate}
            totalDuration={totalDuration}
            onTimeSelect={setSelectedTime}
            selectedTime={selectedTime}
          />
        )}

        {/* 5. Confirmation Button */}
        {selectedTime && (
          <button
            onClick={handleCreateAppointment}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'Creating Appointment...' : 'Confirm Appointment'}
          </button>
        )}

        {/* 6. Booking Summary */}
        {(selectedServices.length > 0 || selectedDate || selectedTime) && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Booking Summary</h3>
            {selectedServices.length > 0 && (
              <p className="text-blue-700">Services: {selectedServices.length} selected</p>
            )}
            {selectedDate && (
              <p className="text-blue-700">Date: {selectedDate}</p>
            )}
            {selectedTime && (
              <p className="text-blue-700">Time: {selectedTime}</p>
            )}
            {totalDuration > 0 && (
              <p className="text-blue-700">Duration: {totalDuration} minutes</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}