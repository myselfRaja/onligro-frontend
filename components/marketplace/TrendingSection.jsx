"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function TrendingSection({ title, salons = [] }) {
  const [isInView, setIsInView] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Intersection Observer for lazy loading entire section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '200px',
        threshold: 0.1 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll functions for horizontal scrolling
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Handle individual image load
  const handleImageLoad = (salonId) => {
    setLoadedImages(prev => ({ ...prev, [salonId]: true }));
  };

  // Handle image error
  const handleImageError = (salonId) => {
    setLoadedImages(prev => ({ ...prev, [salonId]: false }));
  };

  // Optimize image URL
  const getOptimizedImage = (imageUrl) => {
    if (!imageUrl) return '/fallback-salon.jpg';
    
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl
        .replace('/upload/', '/upload/w_400,h_300,c_fill,f_auto,q_auto:low/')
        .replace('http://', 'https://');
    }
    
    return imageUrl;
  };

  return (
    <section 
      ref={sectionRef}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {/* When no salons */}
      {salons.length === 0 && (
        <p className="text-gray-500 text-sm">No trending salons found.</p>
      )}

      {/* Content that loads only when in view */}
      {isInView && salons.length > 0 && (
        <>
          {/* Horizontal scroll container with navigation */}
          <div className="relative">
            {/* Scroll buttons */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-sm text-gray-600">
                Showing {Math.min(salons.length, 8)} trending salons
              </span>
              
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Horizontal scroll cards */}
            <div 
              ref={scrollContainerRef}
              className="
                flex gap-5 overflow-x-auto pb-4 
                scrollbar-hide snap-x snap-mandatory
              "
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {salons.slice(0, 8).map((salon) => (
                <div
                  key={`trending-${salon.id}-${salon.name}`}
                  className="
                    min-w-[280px] bg-white rounded-xl shadow-sm border border-gray-200
                    hover:shadow-md transition-all duration-300 hover:scale-105 flex-shrink-0
                    snap-start
                  "
                >
                  {/* Image with lazy loading */}
                  <div className="relative w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                    {/* Skeleton loader */}
                    {!loadedImages[salon.id] && loadedImages[salon.id] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                        </div>
                        <div className="relative text-gray-400">
                          <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Error fallback */}
                    {loadedImages[salon.id] === false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="text-xs">Salon Image</p>
                        </div>
                      </div>
                    )}

                    {/* Actual image */}
                    <Image
                      src={getOptimizedImage(salon.image)}
                      alt={salon.name}
                      fill
                      className={`
                        object-cover transition-opacity duration-700
                        ${loadedImages[salon.id] ? 'opacity-100' : 'opacity-0'}
                      `}
                      onLoad={() => handleImageLoad(salon.id)}
                      onError={() => handleImageError(salon.id)}
                      loading="lazy"
                      quality={70}
                      sizes="280px"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                      {salon.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">{salon.location}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        ⭐ <span className="font-semibold">{salon.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        ({salon.reviews} reviews)
                      </span>
                    </div>

                    {/* Starting price */}
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-700">
                        Starting from{" "}
                        <span className="font-bold text-gray-900">₹{salon.startingPrice}</span>
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      className="
                        w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white 
                        rounded-xl py-3 font-semibold hover:from-pink-600 hover:to-pink-700 
                        transition-all transform hover:scale-105
                      "
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Loading placeholder when not in view */}
      {!isInView && salons.length > 0 && (
        <div className="flex gap-5 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="min-w-[280px] bg-white rounded-xl shadow-sm border border-gray-200 flex-shrink-0 animate-pulse"
            >
              {/* Skeleton image */}
              <div className="w-full h-48 bg-gray-300 rounded-t-xl"></div>
              
              {/* Skeleton content */}
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}