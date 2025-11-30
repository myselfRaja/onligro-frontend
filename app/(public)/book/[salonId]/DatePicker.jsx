// app/(public)/book/[salonId]/DatePicker.jsx
"use client";

import { useEffect, useState } from "react";

export default function DatePicker({ salonId, onDateSelect, selectedDate: externalSelectedDate }) {
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || "");
  const [closedDays, setClosedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);

  // Load working hours and generate available dates
  useEffect(() => {
    async function loadHours() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/working-hours/${salonId}`

        );

        if (res.ok) {
          const data = await res.json();
          const closed = data.hours
            ?.filter((h) => h.isClosed)
            ?.map((h) => h.dayOfWeek) || [];
          
          setClosedDays(closed);
          generateAvailableDates(closed);
        }
      } catch (error) {
        console.error("Error loading working hours:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHours();
  }, [salonId]);

  // Generate next 14 days with closed day filtering
  const generateAvailableDates = (closedDaysList) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const isClosed = closedDaysList.includes(dayOfWeek);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        isClosed,
        isToday: i === 0
      });
    }
    
    setAvailableDates(dates);
  };

  const handleDateSelect = (date) => {
    if (date.isClosed) return;

    setSelectedDate(date.date);
    onDateSelect(date.date);
  };

  // Format date for display
  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-6 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl border p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="flex gap-2 overflow-hidden">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-14 h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Select Date
            </h2>
            <p className="text-sm text-gray-600">
              Choose your preferred appointment date
            </p>
          </div>

          {/* Date Grid - BookMyShow Style */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {availableDates.map((dateObj) => {
                const isSelected = selectedDate === dateObj.date;
                const isDisabled = dateObj.isClosed;

                return (
                  <button
                    key={dateObj.date}
                    onClick={() => handleDateSelect(dateObj)}
                    disabled={isDisabled}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border min-w-[70px] transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-blue-500/30 flex-shrink-0
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                      ${isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100'
                        : 'hover:bg-gray-50'
                      }
                      ${dateObj.isToday && !isSelected && !isDisabled
                        ? 'border-blue-200 bg-blue-25'
                        : ''
                      }
                    `}
                  >
                    {/* Day - Small */}
                    <div className={`
                      text-xs font-medium mb-1 uppercase
                      ${isSelected ? 'text-blue-600' : 'text-gray-500'}
                      ${isDisabled ? 'text-gray-400' : ''}
                    `}>
                      {dateObj.day}
                    </div>

                    {/* Date Number - Compact */}
                    <div className={`
                      text-lg font-bold
                      ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                      ${isDisabled ? 'text-gray-500' : ''}
                    `}>
                      {dateObj.dateNum}
                    </div>

                    {/* Month - Small */}
                    <div className={`
                      text-xs font-medium mt-0.5
                      ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                      ${isDisabled ? 'text-gray-400' : ''}
                    `}>
                      {dateObj.month}
                    </div>

                    {/* Today Indicator Dot */}
                    {dateObj.isToday && !isSelected && !isDisabled && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                    )}

                    {/* Closed Indicator Dot */}
                    {isDisabled && (
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend - Compact */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Selected Date Display - Compact */}
          {selectedDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">Selected Date</span>
                </div>
                <span className="text-sm font-semibold text-blue-900">
                  {formatSelectedDate(selectedDate)}
                </span>
              </div>
            </div>
          )}

          {/* Fallback Date Input - Hidden by default, shown only if needed */}
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              Manual date selection
            </summary>
            <div className="mt-2">
              <input
                type="date"
                min={availableDates[0]?.date}
                value={selectedDate}
                onChange={(e) => handleDateSelect({ 
                  date: e.target.value, 
                  isClosed: false 
                })}
                className="w-full max-w-xs border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}