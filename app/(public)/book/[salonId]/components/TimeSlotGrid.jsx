"use client";

import { useState, useEffect } from "react";
import TimeSlotCard from "./components/TimeSlotCard";

export default function TimeSlotGrid({ salonId, selectedDate, selectedServices }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("🟧 DEBUG: Grid props:", { salonId, selectedDate, selectedServices });

// TimeSlotGrid.jsx - USE EXISTING WORKING ROUTE
useEffect(() => {
  if (!selectedDate || selectedServices.length === 0) {
    setSlots([]);
    return;
  }

  const fetchSlots = async () => {
    setLoading(true);
    try {
      // ✅ USE EXISTING WORKING ROUTE
 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/slots/available`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
          salonId,
          date: selectedDate,
          duration: selectedServices.reduce((sum, service) => sum + service.duration, 0)
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("🎯 REAL slots from working route:", data);
        setSlots(data.slots || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSlots();
}, [salonId, selectedDate, selectedServices]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Available Slots</h2>

      {loading && <p>⏳ Loading slots...</p>}

      {!loading && slots.length === 0 && selectedDate && (
        <p>No slots found.</p>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4">
        {slots.map((slot) => (
          <TimeSlotCard
            key={slot.time}
            slot={slot}
            isSelected={selectedSlot === slot.time}
            onSelect={(time) => setSelectedSlot(time)}
          />
        ))}
      </div>
    </div>
  );
}
