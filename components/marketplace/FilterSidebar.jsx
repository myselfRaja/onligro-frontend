"use client";

import { useState } from "react";

export default function FilterSidebar({ filters, onChange }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <>
      {/* Mobile Filter Button - Always Visible */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile & Desktop */}
     <div className={`
  // Mobile: Bottom sheet style
  md:static md:transform-none md:translate-y-0
  fixed bottom-0 left-0 right-0 z-50
  transform transition-transform duration-300
  ${isMobileOpen ? 'translate-y-0' : 'translate-y-full'}

        
        // Layout
        w-full md:w-64 bg-white border-t md:border-r border-gray-200
        md:rounded-xl shadow-lg md:shadow-sm
        max-h-[85vh] md:max-h-none overflow-y-auto
      `}>
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 md:p-5 space-y-6 md:space-y-0">
          {/* PRICE RANGE */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm"
              />
            </div>
          </div>

          {/* RATING */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === r}
                    onChange={() => updateFilter("rating", r)}
                    className="w-4 h-4 text-pink-500"
                  />
                  <span className="flex items-center gap-1">
                    ⭐ {r}+ Stars
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* CITY */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">City</h4>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm"
            />
          </div>

          {/* OPEN NOW */}
          <div className="mb-6">
            <label className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(e) => updateFilter("openNow", e.target.checked)}
                className="w-4 h-4 text-pink-500 rounded"
              />
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Open Now
              </span>
            </label>
          </div>

          {/* GENDER */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Gender</h4>
            <div className="space-y-2">
              {["Men", "Women", "Unisex"].map((g) => (
                <label key={g} className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === g}
                    onChange={() => updateFilter("gender", g)}
                    className="w-4 h-4 text-pink-500"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* Mobile Apply Button */}
          <div className="md:hidden sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}