"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

export default function BillingPage() {
  const searchParams = useSearchParams();

  // ===== EXISTING STATES =====
  const [services, setServices] = useState([]);
  const [servicePrices, setServicePrices] = useState({});
  const [serviceNames, setServiceNames] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [openStaffDropdown, setOpenStaffDropdown] = useState(null);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
const skipNextSearchRef = useRef(false);
  // ✅ Wallet states
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [useBalance, setUseBalance] = useState(false);
  const [useDue, setUseDue] = useState(false);

  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creatingBill, setCreatingBill] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchService, setSearchService] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const receiptRef = useRef(null);

  const [form, setForm] = useState({
    customerName: searchParams.get("customerName") || "",
    customerPhone: searchParams.get("customerPhone") || "",
    services: searchParams.get("services") ? searchParams.get("services").split(",") : [],
    staffId: searchParams.get("staffId") || "",
    paymentMode: "Cash",
  });

  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState('flat');

  const isMobile = typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [productTotal, setProductTotal] = useState(0);

  // ===== LOAD DATA =====
  async function loadData() {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const salonId = user?.salonId || '';

      const [serviceRes, staffRes, billsRes, productRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/all?salonId=${salonId}`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/all?salonId=${salonId}`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/all?salonId=${salonId}`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all?salonId=${salonId}`, { credentials: "include" }),
      ]);

      const serviceData = await serviceRes.json();
      const staffData = await staffRes.json();
      const billsData = await billsRes.json();
      const productData = await productRes.json();

      setServices(serviceData.services || []);

      const appointmentServices = searchParams.get("services");
      if (appointmentServices && serviceData.services) {
        const serviceIds = appointmentServices.split(",");
        const prices = {};
        serviceIds.forEach(id => { prices[id] = ""; });
        setServicePrices(prices);
      }

      setStaff(staffData.staff || []);
      setBills(billsData.bills || []);
      setProducts(productData.products || []);

      const appointmentStaffId = searchParams.get("staffId");
      if (appointmentStaffId && staffData.staff) {
        const staffExists = staffData.staff.find(s => s._id === appointmentStaffId);
        if (staffExists) {
          setForm(prev => ({ ...prev, staffId: appointmentStaffId }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Customer search
useEffect(() => {
  // ✅ Skip search if customer just selected
  if (skipNextSearchRef.current) {
    skipNextSearchRef.current = false;
    return;
  }

  if (!form.customerName || form.customerName.length < 2) {
    setCustomerSuggestions([]);
    setShowCustomerDropdown(false);
    return;
  }

  const timer = setTimeout(async () => {
    setCustomerSearchLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/search?query=${form.customerName}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setCustomerSuggestions(data.customers || []);
      setShowCustomerDropdown(true);
    } catch (err) {
      console.error("Customer search failed:", err);
    } finally {
      setCustomerSearchLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [form.customerName]);

  // ✅ Wallet fetch
  useEffect(() => {
    if (!form.customerPhone || form.customerPhone.length !== 10) {
      setWallet(null);
      return;
    }

    async function loadWallet() {
      setWalletLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wallet/${form.customerPhone}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setWallet(data.wallet);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setWalletLoading(false);
      }
    }
    loadWallet();
  }, [form.customerPhone]);

  // ===== SERVICE TOTAL =====
  useEffect(() => {
    const total = selectedServices.reduce((sum, s) => sum + s.line_total, 0);
    setServiceTotal(total);
  }, [selectedServices]);

  // ===== PRODUCT TOTAL =====
  useEffect(() => {
    const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    setProductTotal(total);
  }, [selectedProducts]);

  // ===== TOTAL AMOUNT =====
  useEffect(() => {
    setTotalAmount(serviceTotal + productTotal);
  }, [serviceTotal, productTotal]);

  // ===== LOAD MORE BILLS =====
  const loadMoreBills = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setLoadingMore(false);
    }, 500);
  };

  // ===== CREATE BILL =====
  async function createBill(e) {
    e.preventDefault();
    if (creatingBill) return;

    if (!form.customerName || form.customerName.trim() === '') {
      alert("👤 Please enter customer name");
      return;
    }
    if (!/^\d{10}$/.test(form.customerPhone)) {
      alert("📞 Enter valid 10 digit phone number");
      return;
    }
   if (selectedServices.length === 0 && selectedProducts.length === 0) {
      alert("💇 Please select at least one service or product");
      return;
    }

    // ✅ FIX: Staff validation ab sirf services par chalega, products par nahi
    if (selectedServices.length > 0) {
      for (const service of selectedServices) {
        if (!service.staff_ids || service.staff_ids.length === 0) {
          alert(`👨‍💼 Please assign staff for "${service.serviceName}"`);
          return;
        }
      }
    }

    setCreatingBill(true);

    // ✅ Payable amount nikaalo
    let discountVal = discountAmount;
    if (discountType === 'percent') {
      discountVal = (totalAmount * discountAmount) / 100;
    }
    const payableAmount = Math.max(0, Math.round(totalAmount - discountVal));

        // ✅ INDUSTRY STANDARD: Advance always applied first, then points (if ticked), then remaining to due/cash
    let remaining = payableAmount;
    let balanceUsed = 0;
    let pointsUsed = 0;
    let dueAdded = 0;
    let finalAmount = 0;

    // 1. Advance — ALWAYS use if available (no checkbox needed)
    if (wallet?.balance > 0) {
      balanceUsed = Math.min(wallet.balance, remaining);
      remaining -= balanceUsed;
    }

    // 2. Points — only if user explicitly ticked (customer choice)
    if (usePoints && wallet?.points > 0) {
      pointsUsed = Math.min(wallet.points, remaining);
      remaining -= pointsUsed;
    }

    // 3. Due ya Cash — only the remaining after advance
    if (useDue) {
      dueAdded = remaining;
      finalAmount = 0;
    } else {
      dueAdded = 0;
      finalAmount = remaining;
    }

    const billData = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      services: selectedServices.map(s => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        unit_price: s.unit_price,
        quantity: s.quantity,
        line_total: s.line_total,
        staff_ids: s.staff_ids,
        staff_names: s.staff_names,
      })),
      finalAmount: Number(finalAmount),
      paymentMode: form.paymentMode,
      products: selectedProducts.map(p => ({
        productId: p.productId,
        productName: p.name,
        quantity: p.quantity,
        price: p.price
      })),
      discount: discountAmount,
      discountType: discountType,
      appointmentId: searchParams.get("appointmentId") || null,
      pointsUsed: pointsUsed,
      balanceUsed: balanceUsed,
      dueAdded: dueAdded,
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

        // ✅ Reset form
        setForm({
          customerName: "",
          customerPhone: "",
          services: [],
          staffId: "",
          paymentMode: "Cash",
        });
        setSelectedServices([]);
        setSelectedProducts([]);
        setSearchService("");
        setDiscountAmount(0);
        setDiscountType("flat");
        setServicePrices({});
        setServiceNames({});
        setOpenStaffDropdown(null);
        setUsePoints(false);
        setUseBalance(false);
        setUseDue(false);
        setWallet(null);
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

  // ===== GRAND TOTAL WITH DISCOUNT + WALLET =====
    const grandTotal = useMemo(() => {
    const subtotal = totalAmount;
    let discount = discountAmount;

    if (discountType === 'percent') {
      discount = (subtotal * discountAmount) / 100;
    }

    let total = Math.max(0, subtotal - discount);

    // Advance ALWAYS applied first
    if (wallet?.balance > 0) {
      total = Math.max(0, total - wallet.balance);
    }

    // Points only if ticked
    if (usePoints && wallet?.points > 0) {
      total = Math.max(0, total - wallet.points);
    }

    // Due — bacha hua due me
    if (useDue) {
      total = 0;
    }

    return Math.round(total);
  }, [totalAmount, discountAmount, discountType, usePoints, useDue, wallet]);

  // ===== EXISTING HANDLERS =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStaffDropdown && !event.target.closest('.staff-select-container')) {
        setShowStaffDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStaffDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.service-staff-dropdown')) {
        setOpenStaffDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.customer-search-container')) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ===== PRINT RECEIPT =====
  useEffect(() => {
    if (showReceiptModal && currentBill && receiptRef.current && !isMobile) {
      const timer = setTimeout(() => {
        const printContents = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`<!DOCTYPE html><html><head><title>Print Receipt</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Courier New', monospace; padding: 10px; width: 80mm; margin: 0 auto; } .flex { display: flex; } .justify-between { justify-content: space-between; } .text-center { text-align: center; } .border-bottom { border-bottom: 1px dashed #000; } .border-top { border-top: 1px dashed #000; } .font-bold { font-weight: bold; } .mt-2 { margin-top: 8px; } .mb-2 { margin-bottom: 8px; } @media print { body { margin: 0; padding: 0; } }</style></head><body>${printContents}<script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };<\/script></body></html>`);
          printWindow.document.close();
        } else {
          alert("Please allow popups for this website to print receipts");
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showReceiptModal, currentBill, isMobile]);

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setCurrentBill(null);
  };

  const manualPrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Print Receipt</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Courier New', monospace; padding: 10px; width: 80mm; margin: 0 auto; } .flex { display: flex; } .justify-between { justify-content: space-between; } .text-center { text-align: center; } .border-bottom { border-bottom: 1px dashed #000; } .border-top { border-top: 1px dashed #000; } .font-bold { font-weight: bold; } .mt-2 { margin-top: 8px; } .mb-2 { margin-bottom: 8px; } @media print { body { margin: 0; padding: 0; } }</style></head><body>${printContents}<script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); };<\/script></body></html>`);
        printWindow.document.close();
      }
    }
  };

  const shareOnWhatsApp = () => {
    if (!currentBill) return;

    const phone = currentBill.customerPhone;
    if (!phone) {
      alert("Customer phone number not available");
      return;
    }

    const billLink = `${window.location.origin}/bill/${currentBill._id}`;

    const message = `Hi ${currentBill.customerName} 👋

Thank you for visiting ${currentBill.salonId?.name || "our salon"}.

🧾 Your bill is ready.

Bill No: ${currentBill.billNumber}
Amount Paid: ₹${currentBill.finalAmount}

View Bill:
${billLink}

Thank you! ❤️
Powered by Onligro`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const displayedServices = searchService
    ? services.filter(service => service.name.toLowerCase().includes(searchService.toLowerCase()))
    : services.slice(0, 6);

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

  useEffect(() => {
    loadData();
  }, []);

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

  const isFormInvalid = (form.services.length === 0 && selectedProducts.length === 0) || !form.staffId || creatingBill;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 md:p-4 overflow-x-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-3 md:px-4">

        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">💰 Billing System</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage customer bills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 sticky top-6 overflow-hidden">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">New Bill</h2>

              <form onSubmit={createBill} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="relative customer-search-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name / Phone *</label>
<input
  type="text"
  value={form.customerName}
  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
  placeholder="Search by name or phone..."
  required
/>

                    {showCustomerDropdown && customerSuggestions.length > 0 && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {customerSuggestions.map((customer) => (
                          <button
                            key={customer._id}
                            type="button"
                         onClick={(e) => {
  e.preventDefault();
  skipNextSearchRef.current = true;
  setForm(prev => ({
    ...prev,
    customerName: customer.name,
    customerPhone: customer.phone
  }));
  setShowCustomerDropdown(false);
  setCustomerSuggestions([]);
  document.activeElement?.blur();
}}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition border-b border-gray-100 last:border-0 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                                <p className="text-xs text-gray-500">📞 {customer.phone}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">{customer.totalVisits || 0} visits</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {customerSearchLoading && (
                      <div className="absolute right-3 top-10">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" placeholder="10 digit mobile number" required />
                  </div>

                  {/* ✅ Wallet Display */}
                  {wallet && form.customerPhone.length === 10 && (
                    <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">₹</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-900">Customer Wallet</p>
                        {walletLoading && (
                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-auto"></div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                          <p className="text-[10px] text-gray-500 mb-0.5">Points</p>
                          <p className="text-base font-bold text-blue-600">{wallet.points || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                          <p className="text-[10px] text-gray-500 mb-0.5">Balance</p>
                          <p className={`text-base font-bold ${wallet.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ₹{wallet.balance || 0}
                          </p>
                        </div>
                      </div>

                      {wallet.membershipPackage && (
                        <div className="mt-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-yellow-700 font-medium">🏆 {wallet.membershipPackage}</p>
                          </div>
                          {wallet.membershipExpiry && (
                            <p className="text-[10px] text-yellow-600">
                              Exp: {new Date(wallet.membershipExpiry).toLocaleDateString("en-IN")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ===== SERVICES SECTION ===== */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Services</label>
                  <div className="relative mb-4">
                    <input type="text" placeholder="🔍 Search services..." value={searchService} onChange={(e) => setSearchService(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10 text-sm sm:text-base" />
                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    {searchService && (<button type="button" onClick={() => setSearchService("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">✕</button>)}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-80 overflow-y-auto">
                    {displayedServices.map((service) => {
                      const isSelected = selectedServices.some(s => s.serviceId === service._id);
                      return (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedServices(prev => prev.filter(s => s.serviceId !== service._id));
                            } else {
                              const newService = {
                                serviceId: service._id,
                                serviceName: service.name,
                                unit_price: service.price,
                                quantity: 1,
                                line_total: service.price,
                                staff_ids: [],
                                staff_names: [],
                                duration: service.duration,
                              };

                              setSelectedServices(prev => {
                                if (prev.length > 0 && prev[prev.length - 1].staff_ids.length > 0) {
                                  const lastService = prev[prev.length - 1];
                                  newService.staff_ids = [...lastService.staff_ids];
                                  newService.staff_names = [...lastService.staff_names];
                                }
                                return [...prev, newService];
                              });

                              setOpenStaffDropdown(service._id);
                            }
                          }}
                          className={`p-2 sm:p-3 rounded-xl text-left transition-all text-sm sm:text-base ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="font-medium">{service.name}</div>
                          <div className={`text-sm mt-1 ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                            ₹{service.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="mt-4 border border-blue-200 bg-blue-50/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-blue-700">
                          📌 {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedServices([])}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Clear All
                        </button>
                      </div>

                      {selectedServices.map((service) => (
                        <div
                          key={service.serviceId}
                          className="bg-white rounded-lg px-3 py-2 border border-blue-100 mb-2"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={service.serviceName}
                              onChange={(e) => {
                                setSelectedServices(prev =>
                                  prev.map(s =>
                                    s.serviceId === service.serviceId
                                      ? { ...s, serviceName: e.target.value }
                                      : s
                                  )
                                );
                              }}
                              className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedServices(prev =>
                                  prev.filter(s => s.serviceId !== service.serviceId)
                                );
                              }}
                              className="text-red-400 hover:text-red-600 flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">₹</span>
                              <input
                                type="number"
                                value={service.unit_price}
                                onChange={(e) => {
                                  const newPrice = Number(e.target.value) || 0;
                                  setSelectedServices(prev =>
                                    prev.map(s =>
                                      s.serviceId === service.serviceId
                                        ? { ...s, unit_price: newPrice, line_total: newPrice * s.quantity }
                                        : s
                                    )
                                  );
                                }}
                                className="w-16 px-1.5 py-1 border border-gray-200 rounded text-sm text-center"
                                min="0"
                              />
                            </div>

                            <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  const newQty = Math.max(1, service.quantity - 1);
                                  setSelectedServices(prev =>
                                    prev.map(s =>
                                      s.serviceId === service.serviceId
                                        ? { ...s, quantity: newQty, line_total: s.unit_price * newQty }
                                        : s
                                    )
                                  );
                                }}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="px-2 py-1 text-sm font-medium min-w-[25px] text-center">
                                {service.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newQty = service.quantity + 1;
                                  setSelectedServices(prev =>
                                    prev.map(s =>
                                      s.serviceId === service.serviceId
                                        ? { ...s, quantity: newQty, line_total: s.unit_price * newQty }
                                        : s
                                    )
                                  );
                                }}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-gray-800">
                              ₹{service.line_total}
                            </span>
                          </div>

                          <div className="relative service-staff-dropdown">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenStaffDropdown(
                                  openStaffDropdown === service.serviceId ? null : service.serviceId
                                )
                              }
                              className={`w-full px-3 py-1.5 rounded-lg border text-left text-sm flex items-center justify-between ${
                                service.staff_ids.length === 0
                                  ? "border-red-300 bg-red-50 text-red-600"
                                  : "border-gray-200 bg-white text-gray-800"
                              }`}
                            >
                              <span className="truncate">
                                {service.staff_ids.length === 0
                                  ? "⚠️ Select Staff"
                                  : `👨‍💼 ${service.staff_names.join(", ")}`}
                              </span>
                              <svg
                                className="w-3 h-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {openStaffDropdown === service.serviceId && (
                              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {staff.map((member) => {
                                  const isSelected = service.staff_ids.includes(member._id);
                                  return (
                                    <button
                                      key={member._id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedServices(prev =>
                                          prev.map(s => {
                                            if (s.serviceId !== service.serviceId) return s;

                                            if (isSelected) {
                                              return {
                                                ...s,
                                                staff_ids: s.staff_ids.filter(id => id !== member._id),
                                                staff_names: s.staff_names.filter(n => n !== member.name),
                                              };
                                            } else {
                                              return {
                                                ...s,
                                                staff_ids: [...s.staff_ids, member._id],
                                                staff_names: [...s.staff_names, member.name],
                                              };
                                            }
                                          })
                                        );
                                      }}
                                      className={`w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center justify-between text-sm ${
                                        isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                      }`}
                                    >
                                      <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-xs text-gray-400">
                                          {member.role || "Staff"}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ===== PRODUCTS SECTION ===== */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">🛒 Products (Optional)</label>
                  <div className="relative mb-3">
                    <input type="text" placeholder="🔍 Search products..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 pl-10 text-sm sm:text-base" />
                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-48 overflow-y-auto">
                    {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase())).slice(0, 12).map((product) => {
                      const isSelected = selectedProducts.find(p => p.productId === product._id);
                      const isOutOfStock = product.stockQuantity <= 0;

                      return (
                        <button
                          key={product._id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => {
                            if (isOutOfStock) return;
                            if (isSelected) {
                              setSelectedProducts(selectedProducts.filter(p => p.productId !== product._id));
                            } else {
                              setSelectedProducts([...selectedProducts, { productId: product._id, name: product.name, price: product.mrp, quantity: 1, stock: product.stockQuantity }]);
                            }
                          }}
                          className={`p-2 rounded-xl text-left transition-all text-sm ${
                            isOutOfStock
                              ? 'bg-gray-100 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className={`font-medium text-xs sm:text-sm ${isOutOfStock ? 'text-gray-400' : ''}`}>
                            {product.name}
                          </div>
                          <div className={`text-xs ${
                            isOutOfStock
                              ? 'text-red-500'
                              : isSelected
                              ? 'text-green-100'
                              : 'text-gray-500'
                          }`}>
                            ₹{product.mrp} | {isOutOfStock ? '❌ Out of Stock' : `Stock: ${product.stockQuantity}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedProducts.length > 0 && (
                    <div className="mt-3 border border-green-200 bg-green-50/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-green-700">📦 {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected</p>
                        <button type="button" onClick={() => setSelectedProducts([])} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear All</button>
                      </div>
                      {selectedProducts.map((p) => (
                        <div key={p.productId} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-green-100 mb-1 flex-wrap gap-2">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => {
                              setSelectedProducts(prev =>
                                prev.map(sp =>
                                  sp.productId === p.productId
                                    ? { ...sp, name: e.target.value }
                                    : sp
                                )
                              );
                            }}
                            className="flex-1 min-w-[80px] px-2 py-1 border border-gray-200 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Product name"
                          />

                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => {
                              const newPrice = Number(e.target.value) || 0;
                              setSelectedProducts(prev =>
                                prev.map(sp =>
                                  sp.productId === p.productId ? { ...sp, price: newPrice } : sp
                                )
                              );
                            }}
                            className="w-16 sm:w-20 px-2 py-1 border border-gray-200 rounded text-xs text-center"
                            min="0"
                          />

                          <input
                            type="number"
                            value={p.quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                setSelectedProducts(prev =>
                                  prev.map(sp =>
                                    sp.productId === p.productId ? { ...sp, quantity: '' } : sp
                                  )
                                );
                              } else {
                                const qty = parseInt(val) || 0;
                                if (qty >= 0) {
                                  setSelectedProducts(prev =>
                                    prev.map(sp =>
                                      sp.productId === p.productId ? { ...sp, quantity: qty } : sp
                                    )
                                  );
                                }
                              }
                            }}
                            className="w-12 px-1 py-0.5 border border-gray-200 rounded text-xs text-center"
                            min="0"
                            max={p.stock}
                          />

                          <button
                            type="button"
                            onClick={() => setSelectedProducts(selectedProducts.filter(sp => sp.productId !== p.productId))}
                            className="text-red-400 hover:text-red-600 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

               {/* ===== PAYMENT MODE ===== */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
                  {/* ✅ FIX: Agar amount > 0 hai ya customer due kar raha hai tabhi option dikhao */}
                  {grandTotal > 0 || useDue ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Cash', 'UPI', 'Card', 'Due'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            if (mode === 'Due') {
                              setUseDue(true);
                              setForm({ ...form, paymentMode: 'Due' });
                            } else {
                              setUseDue(false);
                              setForm({ ...form, paymentMode: mode });
                            }
                          }}
                          className={`py-2 sm:py-2.5 rounded-xl font-medium transition-all text-sm sm:text-base ${
                            mode === 'Due' && useDue
                              ? 'bg-red-600 text-white shadow-md'
                              : form.paymentMode === mode && !useDue
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {mode === 'Due' ? '🔴 Due' : mode}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-green-700 font-semibold text-sm">✅ Bill Fully Paid via Wallet/Points</p>
                    </div>
                  )}
                </div>

                {/* ===== WALLET USE CHECKBOXES ===== */}
                {wallet && (wallet.points > 0 || wallet.balance > 0) && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-3">💳 Use Wallet</p>
                    <div className="space-y-2">

                     
                    {/* Advance — always applied */}
{wallet.balance > 0 && (
  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-700">
        Advance applied automatically
      </span>
    </div>
    <span className="text-sm font-bold text-green-600">
      ₹{wallet.balance} off
    </span>
  </div>
)}

                      {/* Points */}
                      {wallet.points > 0 && (
                        <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-50 transition">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={usePoints}
                              onChange={(e) => setUsePoints(e.target.checked)}
                              className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Use {wallet.points} points
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            ₹{wallet.points} off
                          </span>
                        </label>
                      )}

                    </div>
                  </div>
                )}

                {/* ===== FINAL AMOUNT ===== */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm sm:text-base">Service Total:</span>
                    <span className="text-lg font-bold text-gray-800">₹{serviceTotal}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm sm:text-base">Product Total:</span>
                    <span className="text-lg font-bold text-gray-800">₹{productTotal}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Subtotal:</span>
                    <span className="text-xl font-bold text-blue-600">₹{totalAmount}</span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Discount</label>
                      <span className="text-[10px] text-gray-400">Optional</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                      <input
                        type="number"
                        value={discountAmount || ''}
                        onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 sm:py-2.5 text-sm bg-transparent outline-none min-w-0"
                        placeholder="0"
                        min="0"
                      />
                      <div className="flex items-center gap-0.5 bg-gray-50 px-1 py-1 rounded-lg mr-1">
                        <button
                          type="button"
                          onClick={() => setDiscountType('percent')}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                            discountType === 'percent'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          %
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscountType('flat')}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                            discountType === 'flat'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          ₹
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">Total:</span>
                      <span className="text-xl sm:text-2xl font-bold text-green-600">₹{grandTotal}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    (selectedServices.length === 0 && selectedProducts.length === 0) ||
                    creatingBill
                  }
                  className={`w-full text-white font-semibold py-2.5 sm:py-3 rounded-xl text-base sm:text-lg no-print transition ${
                    (selectedServices.length === 0 && selectedProducts.length === 0) || creatingBill
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {creatingBill ? 'Creating Bill...' : '💾 Save & Print Bill'}
                </button>
              </form>
            </div>
          </div>

          {/* ===== RECENT BILLS ===== */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">📋 Recent Bills</h2>
                <span className="text-xs text-gray-400">{bills.length} total</span>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {bills.length === 0 ? (<p className="text-center text-gray-400 py-8">No bills yet</p>) : (
                  <>
                    {bills.slice(0, visibleCount).map((bill) => (
                      <div key={bill._id} className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div><p className="font-semibold text-gray-900 text-sm sm:text-base">{bill.customerName}</p><p className="text-xs text-gray-500">{bill.billNumber}</p></div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                            bill.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' :
                            bill.paymentMode === 'Due' ? 'bg-red-100 text-red-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>{bill.paymentMode}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex-1 min-w-0">
                            {(() => {
                              const allStaffNames = [];
                              if (bill.services && bill.services.length > 0) {
                                bill.services.forEach((service) => {
                                  (service.staff_names || []).forEach((name) => {
                                    if (name && !allStaffNames.includes(name)) {
                                      allStaffNames.push(name);
                                    }
                                  });
                                });
                              }
                              if (allStaffNames.length === 0 && bill.staffName) {
                                allStaffNames.push(bill.staffName);
                              }

                              return allStaffNames.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {allStaffNames.map((name, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full border border-blue-100 truncate max-w-full"
                                    >
                                      {name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600">Staff</p>
                              );
                            })()}
                          </div>
                      {/* ✅ FIX: Ab bill history me proper Asli bill value aur payment method dikhega */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-gray-800">
                              ₹{(bill.finalAmount || 0) + (bill.pointsUsed || 0) + (bill.balanceUsed || 0) + (bill.dueAdded || 0)}
                            </p>
                            <div className="flex flex-col items-end mt-1 space-y-1">
                              {bill.dueAdded > 0 && <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium border border-red-100">Due: ₹{bill.dueAdded}</span>}
                              {bill.pointsUsed > 0 && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Points: ₹{bill.pointsUsed}</span>}
                              {bill.balanceUsed > 0 && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100">Advance: ₹{bill.balanceUsed}</span>}
                              {bill.finalAmount > 0 && <span className="text-[10px] text-gray-500 font-medium">Paid: ₹{bill.finalAmount}</span>}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{new Date(bill.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                    {visibleCount < bills.length && (
                      <div className="pt-2"><button onClick={loadMoreBills} disabled={loadingMore} className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 flex items-center justify-center gap-2">
                        {loadingMore ? (<><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>Loading...</>) : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>Load More ({bills.length - visibleCount} remaining)</>)}
                      </button></div>
                    )}
                    <p className="text-center text-xs text-gray-400 pt-2">Showing {Math.min(visibleCount, bills.length)} of {bills.length} bills</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECEIPT MODAL ===== */}
      {showReceiptModal && currentBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧾 Receipt Ready</h2>
              <button onClick={closeReceiptModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div ref={receiptRef} className="print-area" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <div className="receipt" style={{ padding: '10px', fontFamily: 'monospace', width: '80mm' }}>
                <div className="text-center border-bottom pb-2 mb-2"><h2 className="font-bold" style={{ fontSize: '16px' }}>✂️ {currentBill.salonId?.name || 'Salon Name'}</h2><p style={{ fontSize: '10px' }}>{currentBill.salonId?.address || 'Salon Address'}</p></div>
                <div style={{ fontSize: '10px', marginBottom: '8px' }}>
                  <div className="flex justify-between"><span>Bill No:</span><span className="font-bold">{currentBill.billNumber}</span></div>
                  <div className="flex justify-between"><span>Date:</span><span>{new Date(currentBill.createdAt).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Customer:</span><span>{currentBill.customerName}</span></div>
                  <div className="flex justify-between"><span>Phone:</span><span>{currentBill.customerPhone}</span></div>
                  <div className="flex justify-between"><span>Staff:</span><span>{currentBill.staffName}</span></div>
                </div>
                <div className="border-bottom my-1"></div>
                <div style={{ fontSize: '10px' }}><div className="font-bold mb-1">SERVICES</div>{currentBill.services.map((s, i) => (<div key={i} className="flex justify-between mb-1"><span>{s.serviceName}</span><span>₹{s.price}</span></div>))}</div>
                <div className="border-bottom my-1"></div>
                <div style={{ fontSize: '10px' }}>
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{currentBill.totalAmount}</span></div>
                  {currentBill.totalAmount !== currentBill.finalAmount && (<div className="flex justify-between text-danger"><span>Discount:</span><span>-₹{currentBill.totalAmount - currentBill.finalAmount}</span></div>)}
                  <div className="flex justify-between font-bold mt-1" style={{ fontSize: '12px' }}><span>TOTAL:</span><span>₹{currentBill.finalAmount}</span></div>
                  <div className="flex justify-between mt-1"><span>Payment:</span><span>{currentBill.paymentMode}</span></div>
                </div>

                {/* ✅ Loyalty Details */}
                {(currentBill.pointsEarned > 0 || currentBill.pointsUsed > 0 || currentBill.balanceUsed > 0 || currentBill.dueAdded > 0) && (
                  <div style={{ fontSize: '10px', marginTop: '6px' }}>
                    <div className="border-bottom my-1"></div>
                    {currentBill.pointsEarned > 0 && (
                      <div className="flex justify-between"><span>🎁 Points Earned:</span><span>+{currentBill.pointsEarned}</span></div>
                    )}
                    {currentBill.pointsUsed > 0 && (
                      <div className="flex justify-between"><span>🎯 Points Used:</span><span>{currentBill.pointsUsed}</span></div>
                    )}
                    {currentBill.balanceUsed > 0 && (
                      <div className="flex justify-between"><span>💰 Advance Used:</span><span>₹{currentBill.balanceUsed}</span></div>
                    )}
                    {currentBill.dueAdded > 0 && (
                      <div className="flex justify-between"><span>📝 Due Added:</span><span>₹{currentBill.dueAdded}</span></div>
                    )}
                  </div>
                )}

                <div className="border-bottom my-2"></div>
                <div className="text-center" style={{ fontSize: '9px' }}><p>✨ Thank you! Visit Again ✨</p><p style={{ fontSize: '8px', marginTop: '4px' }}>Powered by Onligro</p></div>
              </div>
            </div>
            <div className="space-y-3">
              {isMobile ? (<p className="text-sm text-blue-600 text-center">💡 Tap WhatsApp to share bill</p>) : (<p className="text-sm text-gray-600 text-center">Print dialog will open automatically</p>)}
              <button onClick={shareOnWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm sm:text-base"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Share on WhatsApp</button>
              {!isMobile && (<button onClick={manualPrint} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm sm:text-base">🖨️ Print Again / Manual Print</button>)}
              <button onClick={closeReceiptModal} className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl text-sm sm:text-base">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}