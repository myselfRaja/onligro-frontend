"use client";

import { useEffect, useState } from "react";
import { Search, Clock, X } from "lucide-react";

export default function ServiceSelector({ 
  salonId, 
  selectedServices, 
  setSelectedServices,  
  totalDuration,
  setTotalDuration 
}) {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/services/${salonId}`);
        const data = await res.json();
        setServices(data.services || []);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [salonId]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayServices = filteredServices.slice(0, visibleCount);
  const hasMore = filteredServices.length > visibleCount;

  useEffect(() => {
    let price = 0, duration = 0;
    selectedServices.forEach((id) => {
      const s = services.find((x) => x._id === id);
      if (s) { price += s.price; duration += s.duration; }
    });
    setTotalPrice(price);
    setTotalDuration(duration);
  }, [selectedServices, services, setTotalDuration]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading services...</p>
    </div>
  );

  return (
    <section id="services" className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Services</h2>
          <p className="text-lg text-gray-600">{services.length}+ services available</p>
        </div>

        {/* Search Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-4 mb-6 rounded-xl shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services (e.g., pedicure, haircut)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-500">
              Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Services Grid - Max 20 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {displayServices.map((service) => {
            const isSelected = selectedServices.includes(service._id);
            return (
              <button
                key={service._id}
                onClick={() => toggleService(service._id)}
                className={`group p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-semibold text-base ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    {service.name}
                  </h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-300"
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />{service.duration} min
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    ₹{service.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && !searchTerm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Load More ({filteredServices.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No services found. Try a different search term.</p>
          </div>
        )}
      </div>
    </section>
  );
}