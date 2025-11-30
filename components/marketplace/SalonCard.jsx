"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function SalonCard({ salon }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px', // Load images 100px before they come into view
        threshold: 0.1 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Advanced image optimization
  const getOptimizedImage = (imageUrl) => {
    if (!imageUrl) return '/fallback-salon.jpg';
    
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl
        .replace('/upload/', '/upload/w_400,h_300,c_fill,f_auto,q_auto:low/')
        .replace('http://', 'https://');
    }
    
    return imageUrl;
  };

  const optimizedImage = getOptimizedImage(salon.image);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <Link
        href={`/book/${salon._id}`}
        className="
          bg-white rounded-2xl shadow-sm border border-gray-100 
          hover:shadow-2xl transition-all duration-300 block overflow-hidden
          group-hover:border-pink-200
        "
      >
        {/* IMAGE WRAPPER WITH LAZY LOADING */}
        <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          
          {/* Enhanced Skeleton Loader - Shows until image is in view and loaded */}
          {(!isInView || !imageLoaded) && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
              {/* Loading Icon */}
              <div className="relative text-gray-400">
                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Fallback for image error */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-xs">Salon Image</p>
              </div>
            </div>
          )}

          {/* Optimized Image - Only load when in view */}
          {isInView && !imageError && (
            <Image
              src={optimizedImage}
              alt={salon.name || "Salon"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`
                object-cover transition-all duration-700
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                group-hover:scale-110
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              quality={65} // Lower quality for faster loading
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs font-semibold text-gray-800">
              {salon.rating?.toFixed(1) || '4.5'}
            </span>
          </div>
        </div>

        {/* CONTENT - Always visible immediately */}
        <div className="p-5">
          {/* Name with better typography */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {salon.name}
          </h3>

          {/* Location with icon */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm truncate">
              {salon.area ? `${salon.area}, ` : ''}{salon.city}
            </p>
          </div>

          {/* Reviews Count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              {salon.reviews || 0} reviews
            </span>
            <span className="text-sm font-semibold text-gray-900">
              ₹{salon.startingPrice || '299'} onwards
            </span>
          </div>

          {/* Enhanced CTA Button */}
          <button
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-pink-500 to-pink-600 
              hover:from-pink-600 hover:to-pink-700 
              transform hover:scale-105 transition-all duration-200
              shadow-sm hover:shadow-md
              flex items-center justify-center gap-2
            "
          >
            <span>Book Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}