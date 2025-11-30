"use client";

import { useEffect, useState } from "react";

export default function ServiceSelector({ 
  salonId, 
  selectedServices, 
  setSelectedServices,  
  totalDuration,
  setTotalDuration 
}) {
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all services
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/services/${salonId}`
);
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

  // Recalculate totals whenever selectedServices change
  useEffect(() => {
    let price = 0;
    let duration = 0;

    selectedServices.forEach((id) => {
      const s = services.find((x) => x._id === id);
      if (s) {
        price += s.price;
        duration += s.duration;
      }
    });

    setTotalPrice(price);
    setTotalDuration(duration);
  }, [selectedServices, services, setTotalDuration]);

  // Handle select/unselect
  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // Format price with Indian numbering
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  if (loading) {
    return (
      <section id="services" className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select one or more services to customize your appointment
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service._id);
            
            return (
              <button
                key={service._id}
                onClick={() => toggleService(service._id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:shadow-lg ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`font-semibold text-lg leading-tight ${
                    isSelected ? "text-blue-900" : "text-gray-900"
                  }`}>
                    {service.name}
                  </h3>
                  
                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected 
                      ? "bg-blue-500 border-blue-500" 
                      : "bg-white border-gray-300 group-hover:border-blue-300"
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <p className={`text-sm mb-4 ${
                  isSelected ? "text-blue-700" : "text-gray-600"
                }`}>
                  {service.description || "Professional service with expert care"}
                </p>

                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isSelected 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.duration} min
                  </span>
                  
                  <div className={`text-lg font-bold ${
                    isSelected ? "text-blue-900" : "text-gray-900"
                  }`}>
                    ₹{formatPrice(service.price)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* No Services State */}
        {services.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600">Please check back later for available services.</p>
          </div>
        )}

        {/* Summary Card */}
        {(selectedServices.length > 0 || totalPrice > 0) && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedServices.length}</div>
                <div className="text-blue-100 text-sm">Services Selected</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{totalDuration}</div>
                <div className="text-blue-100 text-sm">Total Minutes</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">₹{formatPrice(totalPrice)}</div>
                <div className="text-blue-100 text-sm">Total Amount</div>
              </div>
            </div>

            {/* Selected Services List */}
            {selectedServices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-500">
                <h4 className="font-semibold mb-2 text-blue-100">Selected Services:</h4>
                <div className="space-y-1">
                  {selectedServices.map((serviceId) => {
                    const service = services.find(s => s._id === serviceId);
                    return service ? (
                      <div key={serviceId} className="flex justify-between text-sm">
                        <span className="text-blue-50">{service.name}</span>
                        <span className="text-blue-100">₹{formatPrice(service.price)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}