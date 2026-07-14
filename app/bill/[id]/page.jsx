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
  MapPin
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
        
        // Set browser title
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

  const discountAmount = bill.totalAmount - bill.finalAmount;
  const discountPercentage = bill.discount || 0;

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
                <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-xs font-medium text-green-700">Paid</span>
                </div>
              </div>

              {/* Customer */}
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
                  <p className="text-sm font-medium text-gray-700">{bill.staffName}</p>
                </div>
              </div>

              {/* Services */}
              {bill.services?.length > 0 && (
                <div className="py-4 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Scissors size={12} /> Services
                  </p>
                  {bill.services.map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0">
                      <span className="text-gray-700">{s.serviceName}</span>
                      <span className="font-medium text-gray-800">₹{s.price}</span>
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

              {/* Totals */}
              <div className="pt-4">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">₹{bill.totalAmount}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm py-1 text-green-600">
                    <span>
                      Discount 
                      {bill.discountType === 'percent' && ` (${discountPercentage}%)`}
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t-2 border-gray-200">
                  <span className="text-gray-800">Grand Total</span>
                  <span className="text-blue-600">₹{bill.finalAmount}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={14} /> Payment
                </span>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                  <CheckCircle size={14} /> {bill.paymentMode}
                </span>
              </div>
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