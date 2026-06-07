// app/(public)/book/[salonId]/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import SalonHeaderClient from "./SalonHeaderClient";
import ServiceSelector from "./ServiceSelector";
import DatePicker from "./DatePicker";
import SlotSelector from "./SlotSelector";
import StaffSelector from "./StaffSelector";
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
  const [finalAmount, setFinalAmount] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [services, setServices] = useState([]);
const [selectedStaff, setSelectedStaff] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: ""
  });
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch salon
  useEffect(() => {
    async function fetchSalon() {
      try {
        setError(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/salon/${salonId}`
, {
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
  fetchStaff();
}
  }, [salonId]);

  useEffect(() => {
  async function fetchServices() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/services/${salonId}`
    );

    const data = await res.json();

    if (res.ok) {
      setServices(data.services || []);
    }
  }

  if (salonId) {
    fetchServices();
  }
}, [salonId]);

  async function fetchStaff() {
  try {
    const res = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/public/salon/staff/${salonId}`
    );

    const data = await res.json();

    if (res.ok) {
      setStaffList(data.staff || []);
    }
  } catch (error) {
    console.error(error);
  }
}

 const router = useRouter();

const handleCreateAppointment = async () => {
  setBookingError("");
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
  if (!finalAmount || Number(finalAmount) <= 0) {
  alert("Please enter the final amount.");
  return;
}

 const payload = {
  salonId,
  services: selectedServices,
  date: selectedDate,
  time: selectedTime,
  customerName: customer.name,
  customerPhone: customer.phone,
  duration: totalDuration,
  staffId: selectedStaff || null,
  finalAmount: Number(finalAmount),
};

  try {
    setIsSubmitting(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/appointments/create`
, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

 if (res.ok) {
  router.push(`/book/${salonId}/success?appointmentId=${data.appointment._id}`);
  return;
} else {
  setBookingError(
    data.message ||
    data.error ||
    "Unable to complete your booking. Please try again."
  );
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

    {/* Billing Details */}
{selectedServices.length > 0 && (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <h2 className="text-xl font-semibold mb-4">
      Billing Details
    </h2>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      Final Amount Collected
    </label>

    <input
      type="number"
      min="0"
      value={finalAmount}
      onChange={(e) => setFinalAmount(e.target.value)}
      placeholder="Enter actual amount collected"
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
    />

    <p className="text-sm text-gray-500 mt-2">
      Enter the actual amount charged to the customer.
    </p>
  </div>
)}

{/* Booking Summary */}
{selectedServices.length > 0 && (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
    <h3 className="text-xl font-bold mb-4">
      Booking Summary
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">
          {selectedServices.length}
        </div>
        <div className="text-blue-100 text-sm">
          Services Selected
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold">
          {totalDuration}
        </div>
        <div className="text-blue-100 text-sm">
          Total Minutes
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold">
          ₹{finalAmount || 0}
        </div>
        <div className="text-blue-100 text-sm">
          Final Amount
        </div>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-blue-500">
      <h4 className="font-semibold mb-2 text-blue-100">
        Selected Services:
      </h4>

      <div className="space-y-1">
        {selectedServices.map((serviceId) => {
          const service = services.find(
            (s) => s._id === serviceId
          );

          return service ? (
            <div
              key={serviceId}
              className="flex justify-between text-sm"
            >
              <span className="text-blue-50">
                {service.name}
              </span>

              <span className="text-blue-100">
                ₹{service.price}
              </span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  </div>
)}

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
<StaffSelector
  staffList={staffList}
  selectedStaff={selectedStaff}
  setSelectedStaff={setSelectedStaff}
/>
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
{bookingError && (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
    <p className="text-red-700 font-medium">
      {bookingError}
    </p>
  </div>
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

      
      </div>
    </div>
  );
}