"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  Calendar, 
  Download, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Loader2,
  Receipt,
  Users,
  DollarSign,
  Clock,
  FileText,
  Printer,
  Share2,
  AlertCircle
} from "lucide-react";

export default function BillingHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterStaff, setFilterStaff] = useState("all");
  const [staffList, setStaffList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [searchSuggestion, setSearchSuggestion] = useState("");
  const searchInputRef = useRef(null);

  // Fix: Clear any active states when component mounts
  useEffect(() => {
    // Reset any sidebar states if needed
    document.querySelectorAll('.sidebar-link').forEach(el => {
      if (!el.getAttribute('href')?.includes('billing-history')) {
        el.classList.remove('active');
      }
    });
  }, []);

  async function loadData() {
    try {
      const [billsRes, staffRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bills/all`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/all`, {
          credentials: "include",
        }),
      ]);

      const billsData = await billsRes.json();
      const staffData = await staffRes.json();

      if (billsRes.ok) {
        const sortedBills = billsData.bills?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];
        setBills(sortedBills);
        setTotalRevenue(sortedBills.reduce((sum, b) => sum + (b.finalAmount || 0), 0));
        setTotalBills(sortedBills.length);
      }

      if (staffRes.ok) {
        setStaffList(staffData.staff || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Delete bill
  async function deleteBill(billId) {
    if (!confirm("Are you sure you want to delete this bill? This action cannot be undone.")) {
      return;
    }

    setDeletingId(billId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bills/${billId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        alert("Bill deleted successfully!");
        loadData();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete bill");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

    // ✅ Share bill on WhatsApp
  function shareBillOnWhatsApp(bill) {
    if (!bill.customerPhone) {
      alert("Customer phone number not available");
      return;
    }

    const billLink = `${window.location.origin}/bill/${bill._id}`;
    const totalBillAmount =
      (bill.finalAmount || 0) +
      (bill.pointsUsed || 0) +
      (bill.balanceUsed || 0) +
      (bill.dueAdded || 0);

    const message = `Hi ${bill.customerName} 👋

Thank you for visiting ${bill.salonId?.name || "our salon"}.

🧾 Your bill is ready.

Bill No: ${bill.billNumber}
Bill Amount: ₹${totalBillAmount}
${bill.dueAdded > 0 ? `Due: ₹${bill.dueAdded}\n` : ""}${bill.pointsUsed > 0 ? `Points Used: ${bill.pointsUsed}\n` : ""}${bill.balanceUsed > 0 ? `Advance Used: ₹${bill.balanceUsed}\n` : ""}

View Bill:
${billLink}

Thank you! ❤️
Powered by Onligro`;

    window.open(
      `https://wa.me/91${bill.customerPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  // Export functionality
  async function exportData(format = 'csv') {
    setExporting(true);
    try {
      const filteredData = filteredBills.map(bill => ({
        'Bill Number': bill.billNumber,
        'Customer Name': bill.customerName,
        'Customer Phone': bill.customerPhone,
        'Amount': bill.finalAmount,
        'Payment Mode': bill.paymentMode,
        'Staff': bill.staffName,
        'Date': new Date(bill.createdAt).toLocaleDateString(),
        'Time': new Date(bill.createdAt).toLocaleTimeString(),
        'Services': bill.services?.map(s => s.name).join(', ') || '',
      }));

      if (format === 'csv') {
        // Create CSV
        const headers = Object.keys(filteredData[0] || {});
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        for (const row of filteredData) {
          const values = headers.map(header => {
            const val = row[header] || '';
            return `"${String(val).replace(/"/g, '""')}"`;
          });
          csvRows.push(values.join(','));
        }
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `billing-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'print') {
        window.print();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  }

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const searchLower = search.toLowerCase().trim();
    
    if (!searchLower) return true;
    
    const customerName = (bill.customerName || '').toLowerCase();
    const customerPhone = (bill.customerPhone || '');
    const billNumber = (bill.billNumber || '').toLowerCase();
    
    return customerName.includes(searchLower) || 
           customerPhone.includes(search) ||
           billNumber.includes(searchLower);
  }).filter((bill) => {
    const matchesPayment = filterPayment === "all" || bill.paymentMode === filterPayment;
    const matchesStaff = filterStaff === "all" || bill.staffId === filterStaff;
    return matchesPayment && matchesStaff;
  });

  // Check if search returns no results
  const noResultsFound = search.trim() !== "" && filteredBills.length === 0;

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, startIndex + itemsPerPage);

  const uniquePaymentModes = [...new Set(bills.map((b) => b.paymentMode))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
          <p className="mt-3 text-gray-500 text-sm">Loading billing history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Billing History</h1>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {totalBills} Bills
                </span>
              </div>
              <p className="text-gray-500 text-sm ml-11">
                View and manage all bills
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Export Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => exportData('csv')}
                  disabled={exporting || filteredBills.length === 0}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  <button
                    onClick={() => exportData('csv')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => exportData('print')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-t"
                  >
                    <Printer className="w-4 h-4" />
                    Print Report
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => router.push("/owner/billing")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                New Bill
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Bills</p>
            <p className="text-2xl font-bold text-gray-800">{totalBills}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">Unique Customers</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(bills.map(b => b.customerPhone)).size}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500">Avg Bill Value</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalBills > 0 ? Math.round(totalRevenue / totalBills).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by customer name, phone, or bill number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter - Payment Mode */}
            <select
              value={filterPayment}
              onChange={(e) => {
                setFilterPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Payments</option>
              {uniquePaymentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>

            {/* Filter - Staff */}
            <select
              value={filterStaff}
              onChange={(e) => {
                setFilterStaff(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Staff</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(search || filterPayment !== "all" || filterStaff !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterPayment("all");
                  setFilterStaff("all");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Search Result Status */}
          {search && (
            <div className="mt-3 text-sm">
              {noResultsFound ? (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    <strong>"{search}"</strong> - No customers or bills found with this name/phone/bill number
                  </span>
                </div>
              ) : (
                <div className="text-gray-500">
                  Found <strong>{filteredBills.length}</strong> bill{filteredBills.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBills.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      {noResultsFound ? (
                        <div className="text-amber-600">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-medium">No bills found for "{search}"</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try checking the spelling or use a different search term
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p>No bills found</p>
                          <p className="text-sm mt-1">Create your first bill to get started</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        <span className="font-mono">{bill.billNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {bill.customerName || 'Walk-in Customer'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {bill.customerPhone || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">
                        ₹{bill.finalAmount?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                          bill.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' : 
                          bill.paymentMode === 'Card' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {bill.paymentMode || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {bill.staffName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(bill.createdAt).toLocaleDateString()}
                      </td>
                     <td className="px-4 py-3 text-right">
  <div className="flex items-center justify-end gap-2">
    <button
      onClick={() => router.push(`/owner/bills/${bill._id}`)}
      className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
      title="View Bill"
    >
      <Eye className="w-4 h-4" />
    </button>
    {/* ✅ WhatsApp Share Button */}
    <button
      onClick={() => shareBillOnWhatsApp(bill)}
      className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
      title="Share on WhatsApp"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
    <button
      onClick={() => deleteBill(bill._id)}
      disabled={deletingId === bill._id}
      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
      title="Delete Bill"
    >
      {deletingId === bill._id ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  </div>
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBills.length)} of {filteredBills.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredBills.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredBills.length} bill{filteredBills.length !== 1 ? 's' : ''} 
            {search && ` matching "${search}"`}
          </div>
        )}
      </div>
    </div>
  );
}