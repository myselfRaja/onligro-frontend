// app/(public)/book/[salonId]/SalonHeaderClient.jsx
"use client";

import { useState } from "react";

export default function SalonHeaderClient({ salon }) {
  const fallbackImg = "/fallback-image.jpeg";

 const gallery = [
  salon?.image
    ? salon.image
    : "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=600&auto=format&fit=crop&q=60"
];


  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((i) => (i + 1) % gallery.length);
  const prevSlide = () => setCurrentIndex((i) => (i - 1 + gallery.length) % gallery.length);

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  return (
    <header className="bg-gradient-to-br from-white to-gray-50/80 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          
          {/* Gallery Section - Mobile First */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <img
                src={gallery[currentIndex]}
                alt={`${salon.name} - Image ${currentIndex + 1}`}
                className="w-full aspect-[4/3] lg:aspect-[21/9] object-cover transition-opacity duration-300"
                loading="eager"
              />
              
              {/* Navigation Arrows */}
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Gallery Indicators */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {gallery.length}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Salon Header */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {salon.name}
              </h1>
              
              <div className="flex items-start space-x-2 text-gray-600">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-base leading-relaxed">
                  {salon.address}{salon.city ? `, ${salon.city}` : ""}
                </p>
              </div>
            </div>

            {/* Description */}
            {salon.description && (
              <p className="text-gray-700 leading-relaxed text-lg">
                {salon.description}
              </p>
            )}

            {/* Primary CTA */}
            <button
              onClick={scrollToServices}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              Book Appointment
              <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Salon Meta Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{salon.serviceCount || "—"}</div>
                <div className="text-sm text-blue-600 font-medium">Services</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{salon.staffCount || "—"}</div>
                <div className="text-sm text-green-600 font-medium">Experts</div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-gray-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Opening Hours</span>
              </div>
              <p className="text-gray-600 text-sm">
                {salon.openingInfo || "Check working hours for availability"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}