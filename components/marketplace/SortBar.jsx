"use client";

export default function SortBar({ sort, onChange }) {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-3">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
        <span className="text-sm text-gray-600">Sort by:</span>

        <select
          value={sort}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400"
        >
          <option value="rating-desc">Rating: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}
