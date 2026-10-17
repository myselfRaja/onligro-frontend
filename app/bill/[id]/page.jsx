'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { 
  Loader, 
  Printer, 
  Share2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Users, 
  Scissors, 
  Package, 
  CreditCard, 
  CheckCircle,
  Receipt,
  MapPin,
  Gift,
  Wallet,
  AlertCircle
} from 'lucide-react';

export default function BillPrintPage({ params }) {
  const { id: billId } = React.use(params);
  
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBill() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bills/${billId}`
        );
        
        if (!res.ok) {
          throw new Error('Bill not found');
        }
        
        const data = await res.json();
        setBill(data.bill);
        
        if (data.bill) {
          document.title = `Invoice ${data.bill.billNumber} | ${data.bill.salonId?.name || 'Salon'}`;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (billId) {
      fetchBill();
    }
  }, [billId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Bill not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // ✅ Correct discount calculation
  let discountAmount = 0;
  if (bill.discountType === 'percent') {
    discountAmount = Math.round((bill.totalAmount * (bill.discount || 0)) / 100);
  } else {
    discountAmount = Math.round(bill.discount || 0);
  }

  // ✅ Payable amount (after discount)
  const payableAmount = Math.round(bill.totalAmount - discountAmount);

  // ✅ Loyalty values
  const pointsEarned = bill.pointsEarned || 0;
  const pointsUsed = bill.pointsUsed || 0;
  const balanceUsed = bill.balanceUsed || 0;
  const dueAdded = bill.dueAdded || 0;

  const showLoyalty = pointsEarned > 0 || pointsUsed > 0 || balanceUsed > 0 || dueAdded > 0;
  const isDue = bill.paymentMode === 'Due' || dueAdded > 0;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container {
            max-width: 100% !important;
            padding: 20px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-6 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full print-container">
          
          {/* ===== INVOICE CARD ===== */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            
            {/* ===== HEADER ===== */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {bill.salonId?.name || 'Salon'}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-500" />
                    {bill.salonId?.address || ''}
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Invoice</p>
                  <p className="text-sm font-mono font-semibold">{bill.billNumber}</p>
                </div>
              </div>
            </div>

            {/* ===== BODY ===== */}
            <div className="px-6 py-5">
              
              {/* Invoice Meta */}
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {formatDate(bill.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    {formatTime(bill.createdAt)}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  isDue ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  {isDue ? (
                    <>
                      <AlertCircle size={14} className="text-red-600" />
                      <span className="text-xs font-medium text-red-700">Due</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-700">Paid</span>
                    </>
                  )}
                </div>
              </div>

              {/* Customer + Staff */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Customer
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{bill.customerName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />
                    {bill.customerPhone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Users size={12} /> Staff
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {(() => {
                      const names = [];
                      if (bill.services && bill.services.length > 0) {
                        bill.services.forEach((service) => {
                          (service.staff_names || []).forEach((name) => {
                            if (name && !names.includes(name)) names.push(name);
                          });
                        });
                      }
                      if (names.length === 0 && bill.staffName) {
                        names.push(bill.staffName);
                      }
                      return names.join(", ") || "Staff";
                    })()}
                  </p>
                </div>
              </div>

              {/* Services */}
              {bill.services?.length > 0 && (
                <div className="py-4 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Scissors size={12} /> Services
                  </p>
                  {bill.services.map((s, i) => (
                    <div key={i} className="py-1.5 border-b border-dashed border-gray-100 last:border-0">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{s.serviceName}</span>
                        <span className="font-medium text-gray-800">₹{s.price}</span>
                      </div>
                      {s.staff_names && s.staff_names.length > 0 && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          👨‍💼 {s.staff_names.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Products */}
              {bill.products?.length > 0 && (
                <div className="py-4 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Package size={12} /> Products
                  </p>
                  {bill.products.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0">
                      <span className="text-gray-700">
                        {p.productName} <span className="text-gray-400 text-xs">× {p.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-800">₹{p.total || p.price * p.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== TOTALS ===== */}
              <div className="pt-4">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">₹{bill.totalAmount}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm py-1 text-green-600">
                    <span>
                      Discount 
                      {bill.discountType === 'percent' && ` (${bill.discount}%)`}
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t-2 border-gray-200">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-blue-600">₹{payableAmount}</span>
                </div>
              </div>

              {/* ===== PAYMENT + LOYALTY BREAKDOWN ===== */}
              {showLoyalty && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Wallet size={12} /> Payment Breakdown
                  </p>

                  <div className="space-y-2">
                    {/* Advance Used */}
                    {balanceUsed > 0 && (
                      <div className="flex justify-between items-center text-sm bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-green-700 flex items-center gap-2">
                          <Wallet size={14} /> Advance Used
                        </span>
                        <span className="font-semibold text-green-700">-₹{balanceUsed}</span>
                      </div>
                    )}

                    {/* Points Used */}
                    {pointsUsed > 0 && (
                      <div className="flex justify-between items-center text-sm bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="text-blue-700 flex items-center gap-2">
                          <Gift size={14} /> Points Used ({pointsUsed} pts)
                        </span>
                        <span className="font-semibold text-blue-700">-₹{pointsUsed}</span>
                      </div>
                    )}

                    {/* Cash Paid */}
                    {bill.finalAmount > 0 && (
                      <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-gray-700 flex items-center gap-2">
                          <CreditCard size={14} /> {bill.paymentMode} Paid
                        </span>
                        <span className="font-semibold text-gray-800">₹{bill.finalAmount}</span>
                      </div>
                    )}

                    {/* Due Added */}
                    {dueAdded > 0 && (
                      <div className="flex justify-between items-center text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <span className="text-red-700 flex items-center gap-2">
                          <AlertCircle size={14} /> Added to Due
                        </span>
                        <span className="font-semibold text-red-700">₹{dueAdded}</span>
                      </div>
                    )}
                  </div>

                  {/* Points Earned */}
                  {pointsEarned > 0 && (
                    <div className="mt-3 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 px-3 py-2.5 rounded-lg">
                      <span className="text-yellow-800 flex items-center gap-2 text-sm font-medium">
                        <Gift size={16} /> Points Earned
                      </span>
                      <span className="font-bold text-yellow-800">+{pointsEarned} pts</span>
                    </div>
                  )}
                </div>
              )}

              {/* ===== PAYMENT MODE (only if no loyalty) ===== */}
              {!showLoyalty && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard size={14} /> Payment
                  </span>
                  <span className={`text-sm font-medium flex items-center gap-1.5 ${
                    isDue ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isDue ? <AlertCircle size={14} /> : <CheckCircle size={14} />} 
                    {bill.paymentMode}
                  </span>
                </div>
              )}

            </div>

            {/* ===== FOOTER ===== */}
            <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
              <p className="text-sm text-gray-600">❤️ Thank you for choosing us</p>
              <p className="text-sm font-medium text-gray-700">We look forward to serving you again.</p>
              <p className="text-[10px] text-gray-400 mt-1">Powered by Onligro</p>
            </div>

            {/* ===== BUTTONS ===== */}
            <div className="flex gap-3 px-6 py-4 bg-white border-t border-gray-100 no-print">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Invoice ${bill.billNumber}`,
                      text: `Invoice for ${bill.customerName}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}