"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/marketplace/Navbar";
import HeroSearch from "@/components/marketplace/HeroSearch";
import CategoryFilters from "@/components/marketplace/CategoryFilters";
import TrendingSection from "@/components/marketplace/TrendingSection";
import SalonGrid from "@/components/marketplace/SalonGrid";
import SortBar from "@/components/marketplace/SortBar";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import { getAllSalons } from "@/lib/getSalons";
import Footer from "@/app/landing/components/Footer";

export default function SalonsPage() {
  const [salons, setSalons] = useState([]);
  const [allSalons, setAllSalons] = useState([]);
  const [sort, setSort] = useState("rating-desc");
  const [searchQuery, setSearchQuery] = useState({
    salonName: "",
    query: "",
    location: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    rating: "",
    city: "",
    openNow: false,
    gender: "",
  });

  // Handle search from HeroSearch
  const handleSearch = (searchData) => {
    setSearchQuery(searchData);
  };

  // Fetch all salons once
  useEffect(() => {
    async function loadSalons() {
      try {
        setIsLoading(true);
        const data = await getAllSalons({}, sort);
        setAllSalons(data);
        setSalons(data);
      } catch (error) {
        console.error("Failed to load salons:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSalons();
  }, []);

  // Apply search and filters client-side
  useEffect(() => {
    // Agar data fetch nahi hua hai, toh kuch mat karo
    if (allSalons.length === 0) return;

    let filtered = [...allSalons];

    // 🔍 SEARCH LOGIC - Only apply if search query has value
    if (searchQuery.salonName.trim()) {
      filtered = filtered.filter((s) =>
        s.name?.toLowerCase().includes(searchQuery.salonName.toLowerCase())
      );
    }

    if (searchQuery.query.trim()) {
      filtered = filtered.filter((s) => {
        const serviceMatch = s.services?.some(service => 
          service.name?.toLowerCase().includes(searchQuery.query.toLowerCase())
        );
        const descriptionMatch = s.description?.toLowerCase().includes(searchQuery.query.toLowerCase());
        return serviceMatch || descriptionMatch;
      });
    }

    if (searchQuery.location.trim() && searchQuery.location !== "Current Location") {
      filtered = filtered.filter((s) =>
        s.city?.toLowerCase().includes(searchQuery.location.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchQuery.location.toLowerCase())
      );
    }

    // 🎯 FILTER LOGIC
    if (filters.city.trim()) {
      filtered = filtered.filter((s) =>
        s.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (s) => s.startingPrice >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (s) => s.startingPrice <= Number(filters.maxPrice)
      );
    }

    if (filters.rating) {
      filtered = filtered.filter((s) => s.rating >= filters.rating);
    }

    if (filters.gender) {
      filtered = filtered.filter((s) => s.gender === filters.gender);
    }

    if (filters.openNow) {
      filtered = filtered.filter((s) => s.isOpen === true);
    }

    // 📊 SORT LOGIC
    const sorted = filtered.sort((a, b) => {
      switch (sort) {
        case "rating-desc":
          return b.rating - a.rating;
        case "price-asc":
          return a.startingPrice - b.startingPrice;
        case "price-desc":
          return b.startingPrice - a.startingPrice;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setSalons(sorted);

  }, [allSalons, searchQuery, filters, sort]);

  return (
    <main className="min-h-screen bg-white">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO - ADD onSearch PROP */}
      <HeroSearch onSearch={handleSearch} />

      {/* CATEGORY FILTERS */}
      <CategoryFilters />

      {/* SORT BAR */}
      <SortBar sort={sort} onChange={setSort} />

      {/* Layout with filters + grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

        {/* FILTER SIDEBAR */}
      
        {/* GRID */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading salons...</p>
            </div>
          ) : (
            <SalonGrid salons={salons} />
          )}
        </div>

      </div>

      {/* TRENDING */}
      <TrendingSection title="🔥 Trending Salons" salons={salons} />
<Footer />
    </main>
  );
}