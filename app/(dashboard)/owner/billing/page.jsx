"use client";

import { useEffect, useState, useRef } from "react";
import { Loader } from "lucide-react";
export default function BillingPage() {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);  // ✅ ADD THIS
const [loadingMore, setLoadingMore] = useState(false); // ✅ ADD THIS
const [creatingBill, setCreatingBill] = useState(false); // ✅ ADD THIS

  const [loading, setLoading] = useState(true);
    // ✅ Add this - Mobile device check
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const [searchService, setSearchService] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  
  const receiptRef = useRef(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    services: [],
    staffId: "",
    finalAmount: "",
    paymentMode: "Cash",
  });
const [showStaffDropdown, setShowStaffDropdown] = useState(false); // ✅ ADD THIS
  const [totalAmount, setTotalAmount] = useState(0);

  async function loadData() {
      setLoading(true); //
    try {
      const [serviceRes, staffRes, billsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/all`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/all`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/all`, { credentials: "include" }),
      ]);

      const serviceData = await serviceRes.json();
      const staffData = await staffRes.json();
      const billsData = await billsRes.json();

      setServices(serviceData.services || []);
      setStaff(staffData.staff || []);
      setBills(billsData.bills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const loadMoreBills = () => {
  setLoadingMore(true);
  setTimeout(() => {
    setVisibleCount(prev => prev + 10);
    setLoadingMore(false);
  }, 500); // Smooth loading effect
};

async function createBill(e) {
  e.preventDefault();
  
  if (creatingBill) return;
  
  // ✅ CUSTOMER NAME
  if (!form.customerName || form.customerName.trim() === '') {
    alert("👤 Please enter customer name");
    return;
  }
  
  // ✅ PHONE
  if (!/^\d{10}$/.test(form.customerPhone)) {
    alert("📞 Enter valid 10 digit phone number");
    return;
  }
  
  // ✅ FINAL AMOUNT
  if (!form.finalAmount || Number(form.finalAmount) <= 0) {
    alert("💰 Please enter final amount");
    return;
  }

  // ✅ SERVICES
  if (form.services.length === 0) {
    alert("💇 Please select at least one service");
    return;
  }

  // ✅ STAFF
  if (!form.staffId) {
    alert("👨‍💼 Please select a staff member");
    return;
  }

  setCreatingBill(true);

  const billData = {
    customerName: form.customerName,
    customerPhone: form.customerPhone,
    services: form.services,
    staffId: form.staffId,
    finalAmount: Number(form.finalAmount),
    paymentMode: form.paymentMode,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billData),
    });

    const data = await res.json();

    if (res.ok) {
      setCurrentBill(data.bill);
      setShowReceiptModal(true);

      setForm({
        customerName: "",
        customerPhone: "",
        services: [],
        staffId: "",
        finalAmount: "",
        paymentMode: "Cash",
      });
      setSearchService("");
      loadData();
    } else {
      alert(data.message || "Failed to create bill");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setCreatingBill(false);
  }
}
// Close staff dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (showStaffDropdown && !event.target.closest('.staff-select-container')) {
      setShowStaffDropdown(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [showStaffDropdown]);
  // ✅ Auto print when receipt modal opens
  useEffect(() => {
if (showReceiptModal && currentBill && receiptRef.current && !isMobile) {  // ✅ Added !isMobile
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const printContents = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Print Receipt</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: 'Courier New', monospace; 
                  padding: 10px; 
                  width: 80mm; 
                  margin: 0 auto; 
                }
                .receipt { width: 100%; }
                .text-center { text-align: center; }
                .border-bottom { border-bottom: 1px dashed #000; }
                .border-top { border-top: 1px dashed #000; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .mt-1 { margin-top: 4px; }
                .mt-2 { margin-top: 8px; }
                .mb-1 { margin-bottom: 4px; }
                .mb-2 { margin-bottom: 8px; }
                .pt-1 { padding-top: 4px; }
                .pb-1 { padding-bottom: 4px; }
                .font-bold { font-weight: bold; }
                .font-large { font-size: 14px; }
                .text-danger { color: #dc2626; }
                @media print {
                  body { margin: 0; padding: 0; }
                }
              </style>
            </head>
            <body>
              ${printContents}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
                };
              <\/script>
            </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          alert("Please allow popups for this website to print receipts");
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
}, [showReceiptModal, currentBill, isMobile]);

  // ✅ Close modal after print (will be called when print window closes)
  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setCurrentBill(null);
  };

  // ✅ Manual print button handler
  const manualPrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Print Receipt</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Courier New', monospace; padding: 10px; width: 80mm; margin: 0 auto; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .text-center { text-align: center; }
              .border-bottom { border-bottom: 1px dashed #000; }
              .border-top { border-top: 1px dashed #000; }
              .font-bold { font-weight: bold; }
              .mt-2 { margin-top: 8px; }
              .mb-2 { margin-bottom: 8px; }
              @media print { body { margin: 0; padding: 0; } }
            </style>
          </head>
          <body>${printContents}<script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };<\/script></body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

    // ✅ WhatsApp Share Function
const shareOnWhatsApp = () => {
  if (!currentBill) return;

  const salonName =
    currentBill.salonId?.name || "Salon";

  const salonAddress =
    currentBill.salonId?.address || "";

  const servicesList = currentBill.services
    .map((s) => `${s.serviceName} - ₹${s.price}`)
    .join("\n");

  const discountAmount = Math.max(
    0,
    currentBill.totalAmount - currentBill.finalAmount
  );

  const message = `       ${salonName.toUpperCase()}
      ${salonAddress}

Bill: ${currentBill.billNumber}
${new Date(currentBill.createdAt).toLocaleDateString("en-IN")} ${new Date(
    currentBill.createdAt
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}

Customer: ${currentBill.customerName}
Phone: ${currentBill.customerPhone}
Staff: ${currentBill.staffName}

Services:
${servicesList}

Subtotal: ₹${currentBill.totalAmount}
Discount: ₹${discountAmount}
Total: ₹${currentBill.finalAmount}
Paid By: ${currentBill.paymentMode}
Status: Paid ✅

Thank you! Visit again
powered by Onligro`;

  const encodedMessage = encodeURIComponent(message);

  const phone = currentBill.customerPhone || "";

  if (phone) {
    window.open(
      `https://wa.me/91${phone}?text=${encodedMessage}`,
      "_blank"
    );
  } else {
    alert("Customer phone number not available");
  }
};
  const displayedServices = searchService 
    ? services.filter(service => service.name.toLowerCase().includes(searchService.toLowerCase()))
    : services.slice(0, 6);

  useEffect(() => {
    const selected = services.filter((service) => form.services.includes(service._id));
    const total = selected.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(total);
  }, [form.services, services]);

  useEffect(() => {
    loadData();
  }, []);

  const groupBillsByDate = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const groups = { today: [], yesterday: [], older: [] };
    bills.forEach(bill => {
      const billDate = new Date(bill.createdAt).toDateString();
      if (billDate === today) groups.today.push(bill);
      else if (billDate === yesterday) groups.yesterday.push(bill);
      else groups.older.push(bill);
    });
    return groups;
  };

  const groupedBills = groupBillsByDate();

   if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto" size={48} />
          <p className="mt-3 text-gray-500 text-sm">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💰 Billing System</h1>
          <p className="text-gray-600 mt-1">Create and manage customer bills</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">New Bill</h2>
              
              <form onSubmit={createBill} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="10 digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Services</label>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="🔍 Search services..."
                      value={searchService}
                      onChange={(e) => setSearchService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10"
                    />
                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    {searchService && (
                      <button type="button" onClick={() => setSearchService("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                    {displayedServices.length === 0 ? (
                      <div className="col-span-full text-center text-gray-400 py-8">No services found</div>
                    ) : (
                      displayedServices.map((service) => (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => {
                            if (form.services.includes(service._id)) {
                              setForm({ ...form, services: form.services.filter(id => id !== service._id) });
                            } else {
                              setForm({ ...form, services: [...form.services, service._id] });
                            }
                          }}
                          className={`p-3 rounded-xl text-left transition-all ${
                            form.services.includes(service._id)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className={`text-sm mt-1 ${form.services.includes(service._id) ? 'text-blue-100' : 'text-blue-600'}`}>
                            ₹{service.price}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                  
                {/* ✅ SELECTED SERVICES PREVIEW - ADD THIS */}
{form.services.length > 0 && (
  <div className="mt-4 border border-blue-200 bg-blue-50/50 rounded-xl p-3">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-blue-700">
        📌 {form.services.length} Service{form.services.length > 1 ? 's' : ''} Selected
      </p>
      <button
        type="button"
        onClick={() => setForm({ ...form, services: [] })}
        className="text-xs text-red-500 hover:text-red-700 font-medium"
      >
        Clear All
      </button>
    </div>
    <div className="space-y-1.5 max-h-40 overflow-y-auto">
      {services
        .filter((s) => form.services.includes(s._id))
        .map((service) => (
          <div
            key={service._id}
            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800">
                {service.name}
              </span>
              <span className="text-xs text-gray-500">₹{service.price}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm({
                  ...form,
                  services: form.services.filter((id) => id !== service._id),
                });
              }}
              className="text-red-400 hover:text-red-600 transition p-1"
              title="Remove service"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
    </div>
    {/* Total amount in preview */}
    <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between items-center">
      <span className="text-xs font-medium text-gray-500">Total:</span>
      <span className="text-sm font-bold text-blue-600">₹{totalAmount}</span>
    </div>
  </div>
)}
                  {!searchService && services.length > 6 && (
                    <p className="text-xs text-gray-400 mt-3">🔍 Showing 6 of {services.length} services. Search to see more.</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign Staff *</label>
               {/* Staff Selection - Beautiful Custom Dropdown */}
<div className="relative">
 
  
  {/* Custom Dropdown Button */}
  <button
    type="button"
    onClick={() => setShowStaffDropdown(!showStaffDropdown)}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
  >
    <span className={form.staffId ? "text-gray-800" : "text-gray-400"}>
      {form.staffId 
        ? staff.find(m => m._id === form.staffId)?.name 
        : "Select staff member"}
    </span>
    <svg 
      className={`w-4 h-4 text-gray-400 transition-transform ${showStaffDropdown ? 'rotate-180' : ''}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  {/* Dropdown Options */}
  {showStaffDropdown && (
    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
      <button
        type="button"
        onClick={() => {
          setForm({ ...form, staffId: "" });
          setShowStaffDropdown(false);
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 text-gray-400"
      >
        Select staff member
      </button>
      {staff.map((member) => (
        <button
          key={member._id}
          type="button"
          onClick={() => {
            setForm({ ...form, staffId: member._id });
            setShowStaffDropdown(false);
          }}
          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center justify-between ${
            form.staffId === member._id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-xs text-gray-400">{member.role || 'Staff'}</p>
          </div>
          {form.staffId === member._id && (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  )}
</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
                    <div className="flex gap-3">
                      {['Cash', 'UPI', 'Card'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setForm({ ...form, paymentMode: mode })}
                          className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                            form.paymentMode === mode
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Service Total:</span>
                    <span className="text-xl font-bold text-gray-800">₹{totalAmount}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Final Amount *</label>
                    <input
                      type="number"
                      value={form.finalAmount}
                      onChange={(e) => setForm({ ...form, finalAmount: e.target.value })}
                       onWheel={(e) => e.target.blur()}
                      className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                      placeholder="Enter final amount"
                      required
                    />
                    {totalAmount > 0 && form.finalAmount && (
                      <p className={`text-sm mt-2 ${Number(form.finalAmount) > totalAmount ? 'text-orange-500' : 'text-green-600'}`}>
                        {Number(form.finalAmount) > totalAmount 
                          ? `⚠️ Extra charges: ₹${Number(form.finalAmount) - totalAmount} added` 
                          : Number(form.finalAmount) < totalAmount 
                          ? `💸 Discount given: ₹${totalAmount - Number(form.finalAmount)}` 
                          : `✓ Exact amount`}
                      </p>
                    )}
                  </div>
                </div>

       <button
  type="submit"
  disabled={
    form.services.length === 0 ||
    !form.staffId ||
    !form.finalAmount ||
    creatingBill
  }
  className={`w-full text-white font-semibold py-3 rounded-xl text-lg no-print transition ${
    creatingBill || form.services.length === 0 || !form.staffId || !form.finalAmount
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'
  }`}
>
  {creatingBill ? 'Creating Bill...' : '💾 Save & Print Bill'}
</button>
              </form>
            </div>
          </div>

          {/* Recent Bills */}
          <div>
           {/* Recent Bills Section */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-800">📋 Recent Bills</h2>
    <span className="text-xs text-gray-400">{bills.length} total</span>
  </div>
  
  <div className="space-y-3 max-h-[600px] overflow-y-auto">
    {bills.length === 0 ? (
      <p className="text-center text-gray-400 py-8">No bills yet</p>
    ) : (
      <>
        {/* Show only visibleCount bills */}
        {bills.slice(0, visibleCount).map((bill) => (
          <div key={bill._id} className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{bill.customerName}</p>
                <p className="text-xs text-gray-500">{bill.billNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                bill.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {bill.paymentMode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">{bill.staffName}</p>
              <p className="text-lg font-bold text-blue-600">₹{bill.finalAmount}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(bill.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        
        {/* Load More Button - Beautiful Design */}
        {visibleCount < bills.length && (
          <div className="pt-2">
            <button
              onClick={loadMoreBills}
              disabled={loadingMore}
              className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More ({bills.length - visibleCount} remaining)
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Showing info */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Showing {Math.min(visibleCount, bills.length)} of {bills.length} bills
        </p>
      </>
    )}
  </div>
</div>
          </div>
        </div>
      </div>

      {/* ✅ Receipt Modal - SAME PAGE, NO REDIRECT */}
      {showReceiptModal && currentBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧾 Receipt Ready</h2>
              <button onClick={closeReceiptModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            {/* Hidden receipt for printing */}
            <div ref={receiptRef} className="print-area" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <div className="receipt" style={{ padding: '10px', fontFamily: 'monospace', width: '80mm' }}>
                {/* Header */}
                <div className="text-center border-bottom pb-2 mb-2">
                <h2 className="font-bold" style={{ fontSize: '16px' }}>
   ✂️ {currentBill.salonId?.name || 'Salon Name'}
</h2>
<p style={{ fontSize: '10px' }}>
  {currentBill.salonId?.address || 'Salon Address'}
</p>
                </div>

                {/* Bill Info */}
                <div style={{ fontSize: '10px', marginBottom: '8px' }}>
                  <div className="flex justify-between"><span>Bill No:</span><span className="font-bold">{currentBill.billNumber}</span></div>
                  <div className="flex justify-between"><span>Date:</span><span>{new Date(currentBill.createdAt).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Customer:</span><span>{currentBill.customerName}</span></div>
                  <div className="flex justify-between"><span>Phone:</span><span>{currentBill.customerPhone}</span></div>
                  <div className="flex justify-between"><span>Staff:</span><span>{currentBill.staffName}</span></div>
                </div>

                <div className="border-bottom my-1"></div>

                {/* Services */}
                <div style={{ fontSize: '10px' }}>
                  <div className="font-bold mb-1">SERVICES</div>
                  {currentBill.services.map((s, i) => (
                    <div key={i} className="flex justify-between mb-1">
                      <span>{s.serviceName}</span>
                      <span>₹{s.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-bottom my-1"></div>

                {/* Totals */}
                <div style={{ fontSize: '10px' }}>
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{currentBill.totalAmount}</span></div>
                  {currentBill.totalAmount !== currentBill.finalAmount && (
                    <div className="flex justify-between text-danger"><span>Discount:</span><span>-₹{currentBill.totalAmount - currentBill.finalAmount}</span></div>
                  )}
                  <div className="flex justify-between font-bold mt-1" style={{ fontSize: '12px' }}>
                    <span>TOTAL:</span>
                    <span>₹{currentBill.finalAmount}</span>
                  </div>
                  <div className="flex justify-between mt-1"><span>Payment:</span><span>{currentBill.paymentMode}</span></div>
                </div>

                <div className="border-bottom my-2"></div>

                {/* Footer */}
                <div className="text-center" style={{ fontSize: '9px' }}>
                  <p>✨ Thank you! Visit Again ✨</p>
                  <p style={{ fontSize: '8px', marginTop: '4px' }}>Powered by Onligro</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
           <div className="space-y-3">
  {/* Message based on device */}
  {isMobile ? (
    <p className="text-sm text-blue-600 text-center">💡 Tap WhatsApp to share bill</p>
  ) : (
    <p className="text-sm text-gray-600 text-center">Print dialog will open automatically</p>
  )}
  
  {/* WhatsApp Button - Show on ALL devices */}
  <button
    onClick={shareOnWhatsApp}
    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    Share on WhatsApp
  </button>
  
  {/* Print Button - Show only on Desktop */}
  {!isMobile && (
    <button
      onClick={manualPrint}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition"
    >
      🖨️ Print Again / Manual Print
    </button>
  )}
  
  <button
    onClick={closeReceiptModal}
    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl"
  >
    Close
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
}