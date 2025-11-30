"use client";

import { useEffect, useState } from "react";

export default function SlotSelector({
  salonId,
  selectedDate,
  totalDuration,
  onTimeSelect,
  selectedTime: externalSelectedTime
}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(externalSelectedTime || "");

  useEffect(() => {
    if (!selectedDate || !totalDuration) {
      setSlots([]);
      return;
    }

    async function fetchSlots() {
      try {
        setLoading(true);
        setSlots([]);

        const res = await fetch("http://localhost:5000/slots/available", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            salonId,
            date: selectedDate,
            duration: totalDuration,
          }),
        });

        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        console.error("Slot error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedDate, totalDuration, salonId]);

  const handleTimeSelect = (slot) => {
    if (slot.capacityLeft === 0) return;
    
    setSelectedTime(slot.time);
    onTimeSelect(slot.time);
  };

  // Format time for better display
  const formatTime = (time) => {
    return time; // Keep as is for now, can add AM/PM formatting if needed
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Time Slots
            </h2>
            <p className="text-gray-600">
              Choose your preferred appointment time
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-3">Loading available slots...</p>
            </div>
          )}

          {/* Time Slots Grid */}
          {!loading && slots.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  const isAvailable = slot.capacityLeft > 0;
                  
                  return (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={!isAvailable}
                      className={`
                        p-3 rounded-xl border-2 text-center transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                          : 'border-gray-200 bg-white'
                        }
                        ${isAvailable
                          ? 'hover:border-blue-300 hover:shadow-md hover:scale-105 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-100'
                        }
                      `}
                    >
                      {/* Time */}
                      <div className={`
                        font-semibold text-lg mb-1
                        ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                        ${!isAvailable ? 'text-gray-500' : ''}
                      `}>
                        {formatTime(slot.time)}
                      </div>
                      
                      {/* Capacity Indicator */}
                      <div className={`
                        text-xs font-medium
                        ${isSelected ? 'text-blue-700' : 'text-gray-500'}
                        ${!isAvailable ? 'text-gray-400' : ''}
                      `}>
                        {isAvailable ? (
                          <span className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              slot.capacityLeft > 2 ? 'bg-green-500' : 
                              slot.capacityLeft > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            {slot.capacityLeft} left
                          </span>
                        ) : (
                          "Fully booked"
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Slots Available */}
          {!loading && slots.length === 0 && selectedDate && (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Slots Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No time slots available for {selectedDate}. Please try another date or adjust your service selection.
              </p>
            </div>
          )}

          {/* Selected Time Display */}
          {selectedTime && !loading && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-green-800">Time Selected</span>
              </div>
              <p className="text-green-700 font-medium text-lg">
                {formatTime(selectedTime)}
              </p>
            </div>
          )}

          {/* Help Text */}
          {slots.length > 0 && !loading && (
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Good availability</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Limited slots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Fully booked</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}