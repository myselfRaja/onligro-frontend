"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, Phone, Calendar, MessageCircle
  ,ChevronRight, Users, Star, AlertCircle, 
  TrendingUp, DollarSign, UserCheck, UserX, Filter, Download 
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Function to calculate days since last visit
function getDaysSinceLastVisit(lastVisit) {
  if (!lastVisit) return null;

  const last = new Date(lastVisit);
  const today = new Date();

  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - last.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

  // Function to get inactive status
  function getInactiveStatus(days) {
    if (days === null) return null;
    if (days >= 60) return { text: "Very Inactive", color: "red", level: "critical" };
    if (days >= 45) return { text: "Inactive", color: "orange", level: "warning" };
    if (days >= 30) return { text: "Getting Inactive", color: "yellow", level: "attention" };
    return null;
  }

  async function loadCustomers() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/all`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);
    const days = getDaysSinceLastVisit(customer.lastVisit);
    if (filter === "30") return matchesSearch && days >= 30;
    if (filter === "45") return matchesSearch && days >= 45;
    if (filter === "60") return matchesSearch && days >= 60;
    return matchesSearch;
  });

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalVisits = customers.reduce((sum, c) => sum + (c.totalVisits || 0), 0);
  const avgSpentPerCustomer = customers.length > 0 ? totalRevenue / customers.length : 0;
  
  const inactiveCustomers = customers.filter(customer => {
    const days = getDaysSinceLastVisit(customer.lastVisit);
    return days !== null && days >= 30;
  });
  
  const lostRevenue = inactiveCustomers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
  const activeCustomers = customers.length - inactiveCustomers.length;

const statsCards = [
  { label: "Total Customers", value: customers.length, icon: Users, color: "blue" },
  { label: "Active Customers", value: activeCustomers, icon: UserCheck, color: "green" },
  { label: "Inactive", value: inactiveCustomers.length, icon: UserX, color: "orange" },
  { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "emerald" },
  { label: "Avg Spend/Customer", value: `₹${Math.round(avgSpentPerCustomer).toLocaleString()}`, icon: TrendingUp, color: "purple" },
  { label: "Total Visits", value: totalVisits, icon: Calendar, color: "indigo" },
];

  const filterTabs = [
    { id: "all", label: "All Customers", count: customers.length, color: "blue" },
    { id: "30", label: "30+ Days", count: customers.filter(c => getDaysSinceLastVisit(c.lastVisit) >= 30).length, color: "yellow" },
    { id: "45", label: "45+ Days", count: customers.filter(c => getDaysSinceLastVisit(c.lastVisit) >= 45).length, color: "orange" },
    { id: "60", label: "60+ Days", count: customers.filter(c => getDaysSinceLastVisit(c.lastVisit) >= 60).length, color: "red" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Intelligence</h1>
              <p className="text-sm text-gray-500 mt-1">Track loyalty, spending patterns, and customer insights</p>
            </div>
          
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-50 text-blue-600",
              green: "bg-green-50 text-green-600",
              orange: "bg-orange-50 text-orange-600",
              emerald: "bg-emerald-50 text-emerald-600",
              purple: "bg-purple-50 text-purple-600",
              indigo: "bg-indigo-50 text-indigo-600",
            };
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${colorClasses[stat.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                 
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Inactive Customers Alert Banner */}
        {inactiveCustomers.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">Customer Re-engagement Opportunity</h3>
                    <p className="text-sm text-gray-600">
                      {inactiveCustomers.length} customers inactive for 30+ days · 
                      <span className="text-red-600 font-medium"> ₹{lostRevenue.toLocaleString()}</span> potential revenue at risk
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition shadow-sm">
                    Send Reminders
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === tab.id
                      ? `bg-white shadow-sm text-${tab.color}-600`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                    filter === tab.id ? `bg-${tab.color}-100 text-${tab.color}-600` : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No customers found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((customer) => {
              const daysSinceLastVisit = getDaysSinceLastVisit(customer.lastVisit);
              const inactiveStatus = getInactiveStatus(daysSinceLastVisit);
              
              const statusColors = {
                red: "border-red-200 bg-red-50/30",
                orange: "border-orange-200 bg-orange-50/30",
                yellow: "border-yellow-200 bg-yellow-50/30",
              };
              
              return (
           <Link
  key={customer._id}
  href={`/owner/customers/${customer._id}`}
>
                  <div className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    inactiveStatus ? statusColors[inactiveStatus.color] : 'border-gray-100 hover:border-blue-200'
                  }`}>
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Left Section */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                              <span className="text-blue-700 font-semibold text-lg">
                                {customer.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            {customer.totalVisits >= 5 && (
                              <div className="absolute -top-1 -right-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              </div>
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="font-semibold text-gray-800">
                                {customer.name}
                              </h2>
                              {customer.totalVisits >= 10 && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                  VIP
                                </span>
                              )}
                              {customer.totalVisits >= 5 && customer.totalVisits < 10 && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                  Loyal
                                </span>
                              )}
                              {inactiveStatus && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  inactiveStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                                  inactiveStatus.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {inactiveStatus.text}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm">
                              <span className="flex items-center gap-1 text-gray-500">
                                <Phone className="w-3.5 h-3.5" /> {customer.phone}
                              </span>
                              
                              {customer.lastVisit && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="flex items-center gap-1 text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" /> 
                                    Last: {new Date(customer.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                  <span className={`text-xs font-medium ${
                                    daysSinceLastVisit >= 60 ? 'text-red-600' :
                                    daysSinceLastVisit >= 45 ? 'text-orange-600' :
                                    daysSinceLastVisit >= 30 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    ({daysSinceLastVisit} days ago)
                                  </span>
                                </>
                              )}
                              
                              {!customer.lastVisit && (
                                <span className="text-gray-400 text-xs">No visits yet</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="flex items-center gap-6">
                          <div className="text-right min-w-[60px]">
                            <p className="text-xl font-bold text-blue-600">
                              {customer.totalVisits || 0}
                            </p>
                            <p className="text-xs text-gray-500">Visits</p>
                          </div>

   <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `Hello ${customer.name}, we miss you at our salon 😊 Please visit us again!`;

    const url = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }}
  className="p-2 rounded-full hover:bg-green-100 transition"
  title="Send WhatsApp Reminder"
>
  <MessageCircle
    size={28}
    className="text-green-600"
  />
</button>
                          
                          <div className="text-right min-w-[90px]">
                            <p className="text-xl font-bold text-green-600">
                              ₹{(customer.totalSpent || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Total Spent</p>
                          </div>

                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        {filteredCustomers.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
            <p>Showing {filteredCustomers.length} of {customers.length} customers</p>
            <div className="flex gap-4">
              <span>💰 Total Value: ₹{totalRevenue.toLocaleString()}</span>
              <span>📊 Avg: ₹{Math.round(avgSpentPerCustomer).toLocaleString()}/customer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}