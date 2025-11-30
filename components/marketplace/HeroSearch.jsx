"use client";

import React, { useState } from "react";

export default function HeroSearch({ initialQuery = "", initialLocation = "", onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [salonName, setSalonName] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ query, location, salonName });
  };

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setLocation("Current Location");
            setIsLocating(false);
          }, 1500);
        },
        () => {
          setIsLocating(false);
          alert("Unable to fetch location");
        }
      );
    }
  };

  return (
    <section className="relative pt-20 md:pt-28 w-full bg-gradient-to-br from-pink-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Hero Content */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
            Trusted by 5000+ salons across India
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Discover{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Perfect Beauty
            </span>{" "}
            Experiences
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Book appointments at top-rated salons, spas, and beauty experts near you. 
            <span className="text-pink-500 font-semibold"> Instant confirmation.</span>
          </p>
        </div>

        {/* Luxury Search Form */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            
            {/* Main Search Container */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-2 flex flex-col md:flex-row gap-2 items-stretch">
              
              {/* Salon Name Input */}
              <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-purple-200 transition-all group">
                <div className="flex items-center justify-center w-9 h-9 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Salon Name</label>
                  <input 
                    type="text" 
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="Search by salon name..." 
                    className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-base font-medium"
                  />
                </div>
              </div>

              {/* Search Service Input */}
              <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-pink-200 transition-all group">
                <div className="flex items-center justify-center w-9 h-9 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Service</label>
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Haircut, facial, spa..." 
                    className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-base font-medium"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-200 transition-all group">
                <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or area..." 
                    className="w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-base font-medium"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group min-w-[120px]"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-white text-center">
                  <div className="text-sm font-semibold">Search</div>
                </div>
              </button>

            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all text-xs font-medium text-gray-700 hover:text-pink-700 disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    Locating...
                  </>
                ) : (
                  <>
                    <span className="text-xs">📍</span>
                    Near Me
                  </>
                )}
              </button>
              
              {["💇 Hair", "💆 Spa", "💄 Makeup", "✂️ Beard", "🧖 Facial"].map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setQuery(item.split(' ')[1])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all text-xs font-medium text-gray-700 hover:text-pink-700"
                >
                  {item}
                </button>
              ))}
            </div>

          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-6">Trusted by beauty enthusiasts across</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 opacity-60">
            {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"].map((city) => (
              <div key={city} className="flex items-center gap-1 text-gray-700 text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                {city}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}