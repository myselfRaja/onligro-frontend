"use client";

import React, { useState } from "react";

export default function CategoryFilters({ selected = [], onChange }) {
  const categories = [
    { id: "hair", label: "💇 Hair" },
    { id: "facial", label: "💆 Facial" },
    { id: "beard", label: "✂️ Beard" },
    { id: "makeup", label: "💄 Makeup" },
    { id: "trending", label: "🔥 Trending" },
    { id: "near", label: "📍 Near Me" },
    { id: "open", label: "🟢 Open Now" },
    { id: "budget", label: "💰 Budget" },
    { id: "premium", label: "⭐ Premium" },
  ];

  const [active, setActive] = useState(selected);

  const toggleFilter = (id) => {
    let updated;

    if (active.includes(id)) {
      updated = active.filter((item) => item !== id);
    } else {
      updated = [...active, id];
    }

    setActive(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Simple overflow without any custom classes */}
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleFilter(item.id)}
              className={`
                px-4 py-2 rounded-full text-sm whitespace-nowrap
                border transition flex-shrink-0
                ${
                  active.includes(item.id)
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}