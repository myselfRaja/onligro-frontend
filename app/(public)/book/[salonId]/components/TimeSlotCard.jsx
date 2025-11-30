// app/public_pages/book/[salonId]/components/TimeSlotCard.jsx
"use client";

export default function TimeSlotCard({ slot, isSelected, onSelect }) {
  const isAvailable = slot.capacityLeft > 0;
  
  return (
    <button
      onClick={() => isAvailable && onSelect(slot.time)}
      disabled={!isAvailable}
      className={`
        p-4 rounded-lg border-2 text-center transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105' 
          : isAvailable
            ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-800 hover:scale-102'
            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      <div className="font-semibold text-lg mb-1">{slot.time}</div>
      <div className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
        {isAvailable ? (
          `${slot.capacityLeft} slot${slot.capacityLeft !== 1 ? 's' : ''} left`
        ) : (
          'Full'
        )}
      </div>
    </button>
  );
}