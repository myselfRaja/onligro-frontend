"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Phone, 
  IndianRupee, 
  Calendar, 
  Clock, 
  User, 
  Receipt, 
  ShoppingBag,
  CreditCard,
  Star,
  TrendingUp
} from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCustomerData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${id}/history`,
        { credentials: "include" }
      );
      const data = await res.json();
      
      if (res.ok) {
        setCustomer(data.customer);
        setBills(data.bills || []);
      } else {
        router.push("/owner/customers");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadCustomerData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  // Calculate average per visit
  const avgPerVisit = customer.totalVisits > 0 
    ? Math.round(customer.totalSpent / customer.totalVisits) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span className="text-sm">Back to Customers</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User className="w-4 h-4" />
              <span>Customer Profile</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <span className="text-blue-700 font-bold text-2xl">
                  {customer.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              
              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
                  {customer.totalVisits >= 10 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      👑 VIP Customer
                    </span>
                  )}
                  {customer.totalVisits >= 5 && customer.totalVisits < 10 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      ⭐ Loyal Customer
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {customer.lastVisit && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Big & Clear */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Visits</span>
              <div className="p-2 bg-blue-50 rounded-xl">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{customer.totalVisits || 0}</p>
            <p className="text-xs text-gray-400 mt-1">lifetime visits</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Spent</span>
              <div className="p-2 bg-green-50 rounded-xl">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">₹{(customer.totalSpent || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">lifetime value</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Average per Visit</span>
              <div className="p-2 bg-purple-50 rounded-xl">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">₹{avgPerVisit.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">average spend</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Payment Mode</span>
              <div className="p-2 bg-orange-50 rounded-xl">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-800">
              {bills.length > 0 ? bills[0]?.paymentMode || '—' : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-1">most used</p>
          </div>
        </div>

        {/* Visit History Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-800">Visit History</h2>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {bills.length} {bills.length === 1 ? 'visit' : 'visits'}
              </span>
            </div>
          </div>

          {bills.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No visit history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bills.map((bill, index) => (
                <div key={bill._id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left Side */}
                    <div className="flex-1">
                      {/* Bill Header */}
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-700">
                          #{bill.billNumber}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                          bill.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {bill.paymentMode}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {/* Services */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {bill.services?.map((service, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {service.serviceName}
                          </span>
                        ))}
                      </div>
                      
                      {/* Staff */}
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <User className="w-3 h-3" /> Staff: {bill.staffName}
                      </p>
                    </div>

                    {/* Right Side - Amount */}
                    <div className="text-right md:text-left">
                      <p className="text-2xl font-bold text-green-600">₹{bill.finalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {bill.services?.length} service{bill.services?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loyalty Message */}
        {customer.totalVisits >= 5 && (
          <div className="mt-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              <div>
                <p className="font-semibold text-gray-800">Loyal Customer ✨</p>
                <p className="text-sm text-gray-600">
                  {customer.totalVisits} visits completed. This customer loves your salon!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}