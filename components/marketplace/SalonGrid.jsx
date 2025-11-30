"use client";

import SalonCard from "./SalonCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SalonGrid({ salons = [], loading }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [sortedSalons, setSortedSalons] = useState([]);

  // ✅ TEMPORARY SORTING BY _id (MongoDB ObjectId contains timestamp)
  useEffect(() => {
    console.log('Original salons:', salons);
    
    if (salons.length > 0) {
      // MongoDB ObjectId ke first 8 characters timestamp hote hain
      const sorted = [...salons].sort((a, b) => {
        return b._id.localeCompare(a._id); // Newest _id first
      });
      
      console.log('Sorted salons:', sorted);
      setSortedSalons(sorted);
    } else {
      setSortedSalons([]);
    }
    setVisibleCount(6);
  }, [salons]);

  // Load more function
  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const visibleSalons = sortedSalons.slice(0, visibleCount);
  const hasMore = sortedSalons.length > visibleCount;

  // ... baki code same

  // Smart grid calculation based on salon count
  const getGridClass = (count) => {
    if (count === 0) return "grid-cols-1";
    if (count === 1) return "grid-cols-1 max-w-sm mx-auto";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto";
    
    // For 4 or more cards, use responsive grid
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Stagger animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className={`grid ${getGridClass(8)} gap-6 px-4 py-8`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-100 rounded w-3/5"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

 if (sortedSalons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Salons Found</h3>
        <p className="text-gray-600 max-w-md">
          Try adjusting your search criteria or filters to find more salons in your area.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleSalons.length}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          className={`grid ${getGridClass(visibleSalons.length)} gap-6 px-4 py-8`}
        >
       {visibleSalons.map((salon, index) => ( // ✅ YAHAN sortedSalons ki jagah visibleSalons
            <motion.div
              key={salon._id || `salon-${index}`}
              variants={cardVariants}
              layout
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              <SalonCard salon={salon} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8 px-4"
        >
          <button
            onClick={loadMore}
            className="
              bg-gradient-to-r from-pink-500 to-pink-600 text-white 
              px-8 py-3 rounded-xl font-semibold 
              hover:from-pink-600 hover:to-pink-700 
              transition-all transform hover:scale-105
              shadow-sm hover:shadow-md
            "
          >
               Load More ({sortedSalons.length - visibleCount} remaining)
          </button>
        </motion.div>
      )}

      {/* Show message when all salons are loaded */}
    {!hasMore && sortedSalons.length > 6 && ( // ✅ YAHAN CHANGE
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 px-4"
        >
          <p className="text-gray-600 font-medium">
               🎉 All {sortedSalons.length} salons loaded!
          </p>
        </motion.div>
      )}
    </div>
  );
}