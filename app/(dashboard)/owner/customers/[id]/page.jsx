"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  TrendingUp,
  Crown,
  Gift,
  Wallet,
  AlertCircle,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);

  // Modal states
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advanceNote, setAdvanceNote] = useState("");
  const [addingAdvance, setAddingAdvance] = useState(false);

  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipAmount, setMembershipAmount] = useState(1000);
  const [membershipPoints, setMembershipPoints] = useState(1200);
  const [membershipPackage, setMembershipPackage] = useState("Silver");
  const [membershipMonths, setMembershipMonths] = useState(12);
  const [addingMembership, setAddingMembership] = useState(false);

  const [showDueModal, setShowDueModal] = useState(false);
  const [dueAmount, setDueAmount] = useState("");
  const [dueNote, setDueNote] = useState("");
  const [collectingDue, setCollectingDue] = useState(false);

  async function fetchWallet(phone) {
    setWalletLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/${phone}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setWallet(data.wallet);
    } catch (err) {
      console.log(err);
    } finally {
      setWalletLoading(false);
    }
  }

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
        if (data.customer?.phone) {
          fetchWallet(data.customer.phone);
        }
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

  // ===== Add Advance =====
  async function addAdvance(e) {
    e.preventDefault();
    if (addingAdvance || !advanceAmount || Number(advanceAmount) <= 0) return;

    setAddingAdvance(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/advance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customerPhone: customer.phone,
            customerName: customer.name,
            amount: Number(advanceAmount),
            note: advanceNote || `Advance added: ₹${advanceAmount}`,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowAdvanceModal(false);
        setAdvanceAmount("");
        setAdvanceNote("");
      } else {
        alert(data.message || "Failed to add advance");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setAddingAdvance(false);
    }
  }

  // ===== Add Membership =====
  async function addMembership(e) {
    e.preventDefault();
    if (addingMembership || !membershipAmount || !membershipPoints) return;

    setAddingMembership(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/membership`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customerPhone: customer.phone,
            customerName: customer.name,
            amountPaid: Number(membershipAmount),
            creditGiven: Number(membershipPoints),
            packageName: membershipPackage,
            expiryMonths: Number(membershipMonths),
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowMembershipModal(false);
        setMembershipAmount(1000);
        setMembershipPoints(1200);
      } else {
        alert(data.message || "Failed to sell membership");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setAddingMembership(false);
    }
  }

  // ===== Collect Due =====
  async function collectDue(e) {
    e.preventDefault();
    if (collectingDue || !dueAmount || Number(dueAmount) <= 0) return;

    setCollectingDue(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/due/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customerPhone: customer.phone,
            amount: Number(dueAmount),
            note: dueNote || `Due paid: ₹${dueAmount}`,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
        setShowDueModal(false);
        setDueAmount("");
        setDueNote("");
      } else {
        alert(data.message || "Failed to collect due");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setCollectingDue(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-slate-500 text-sm">Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const avgPerVisit =
    customer.totalVisits > 0
      ? Math.round(customer.totalSpent / customer.totalVisits)
      : 0;

  const isVIP = customer.totalVisits >= 10;
  const isLoyal = customer.totalVisits >= 5 && customer.totalVisits < 10;
  const hasDue = wallet && wallet.balance < 0;
  const hasAdvance = wallet && wallet.balance > 0;
  const dueAmountValue = wallet ? Math.abs(wallet.balance) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span className="text-sm font-medium">Back to Customers</span>
        </button>

        {/* ===== HERO HEADER ===== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 sm:p-8 mb-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -ml-36 -mb-36"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white/30">
                {customer.name?.charAt(0).toUpperCase() || "?"}
              </div>
              {isVIP && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                  <Crown size={14} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white truncate">
                  {customer.name}
                </h1>
                {isVIP && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-500/20 text-yellow-200 border border-yellow-400/30">
                    👑 VIP
                  </span>
                )}
                {isLoyal && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    ⭐ Loyal
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                  <Phone size={14} className="text-indigo-300" />
                  <span className="text-white text-sm font-medium truncate">
                    {customer.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                  <Calendar size={14} className="text-indigo-300" />
                  <span className="text-white text-sm font-medium truncate">
                    Joined{" "}
                    {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {customer.lastVisit && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10">
                    <Clock size={14} className="text-indigo-300" />
                    <span className="text-white text-sm font-medium truncate">
                      Last visit{" "}
                      {new Date(customer.lastVisit).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== WALLET SECTION ===== */}
        {walletLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-6 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : wallet ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Wallet size={16} className="text-slate-600" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Customer Wallet
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Points Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Gift size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      Points
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {wallet.points || 0}
                  </p>
                  <p className="text-xs text-white/70">
                    Worth {fmt(wallet.points || 0)}
                  </p>
                </div>
              </div>

              {/* Balance Card */}
              <div className={`relative overflow-hidden rounded-2xl p-5 shadow-lg ${
                hasDue
                  ? "bg-gradient-to-br from-red-500 to-orange-500"
                  : "bg-gradient-to-br from-emerald-500 to-green-500"
              }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <IndianRupee size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {hasDue ? "Due" : "Balance"}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {fmt(Math.abs(wallet.balance || 0))}
                  </p>
                  <p className="text-xs text-white/70">
                    {hasDue ? "⚠️ Outstanding amount" : "💚 Available advance"}
                  </p>
                </div>
              </div>
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <button
                onClick={() => setShowAdvanceModal(true)}
                className="group bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-2 border-green-200 hover:border-green-300 rounded-2xl p-4 transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <Plus size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">
                    Add Advance
                  </p>
                  <p className="text-xs text-slate-500">Deposit money</p>
                </div>
              </button>

              <button
                onClick={() => setShowMembershipModal(true)}
                className="group bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 rounded-2xl p-4 transition-all duration-200 flex items-center gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition">
                  <Crown size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">
                    Sell Membership
                  </p>
                  <p className="text-xs text-slate-500">Give points</p>
                </div>
              </button>

              <button
                onClick={() => hasDue && setShowDueModal(true)}
                disabled={!hasDue}
                className={`group border-2 rounded-2xl p-4 transition-all duration-200 flex items-center gap-3 shadow-sm ${
                  hasDue
                    ? "bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 border-red-200 hover:border-red-300 hover:shadow-md cursor-pointer"
                    : "bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition ${
                  hasDue
                    ? "bg-gradient-to-br from-red-500 to-orange-500 group-hover:scale-110"
                    : "bg-slate-300"
                }`}>
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">
                    Collect Due
                  </p>
                  <p className="text-xs text-slate-500">
                    {hasDue ? `₹${dueAmountValue} pending` : "No due"}
                  </p>
                </div>
              </button>
            </div>

            {/* Membership Badge */}
            {wallet.membershipPackage && (
              <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-yellow-700 font-medium">
                      Active Membership
                    </p>
                    <p className="font-bold text-yellow-900">
                      {wallet.membershipPackage}
                    </p>
                  </div>
                </div>
                {wallet.membershipExpiry && (
                  <div className="text-right">
                    <p className="text-[10px] text-yellow-600 uppercase tracking-wide">
                      Valid till
                    </p>
                    <p className="text-sm font-semibold text-yellow-900">
                      {new Date(wallet.membershipExpiry).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingBag size={16} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              {customer.totalVisits || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total visits</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <IndianRupee size={16} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {fmt(customer.totalSpent)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total spent</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-purple-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {fmt(avgPerVisit)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Avg per visit</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <CreditCard size={16} className="text-orange-600" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {bills.length > 0 ? bills[0]?.paymentMode || "—" : "—"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Last payment</p>
          </div>
        </div>

        {/* ===== VISIT HISTORY ===== */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
                <Receipt size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Visit History</h2>
                <p className="text-xs text-slate-500">
                  {bills.length} {bills.length === 1 ? "visit" : "visits"} total
                </p>
              </div>
            </div>
          </div>

          {bills.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400">No visit history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bills.map((bill) => (
                <div key={bill._id} className="p-5 hover:bg-slate-50/70 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-semibold">
                          #{bill.billNumber}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            bill.paymentMode === "Cash"
                              ? "bg-green-100 text-green-700"
                              : bill.paymentMode === "UPI"
                              ? "bg-blue-100 text-blue-700"
                              : bill.paymentMode === "Due"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {bill.paymentMode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(bill.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {bill.services?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {bill.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                            >
                              {service.serviceName}
                            </span>
                          ))}
                        </div>
                      )}

                      {bill.products?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {bill.products.map((product, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                            >
                              🛒 {product.productName} × {product.quantity}
                            </span>
                          ))}
                        </div>
                      )}

                      {bill.staffName && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <User className="w-3 h-3" /> Staff: {bill.staffName}
                        </p>
                      )}
                    </div>

                   <div className="text-right">
  {/* ✅ Bill ka actual total = cash + points + balance + due */}
  <p
    className={`text-2xl font-bold ${
      bill.dueAdded > 0 ? "text-red-600" : "text-emerald-600"
    }`}
  >
    {fmt(
      (bill.finalAmount || 0) +
        (bill.pointsUsed || 0) +
        (bill.balanceUsed || 0) +
        (bill.dueAdded || 0)
    )}
  </p>

  {/* ✅ Due amount alag se dikhao agar hai */}
  {bill.dueAdded > 0 && (
    <p className="text-xs text-red-600 font-medium mt-1">
      Due: {fmt(bill.dueAdded)}
    </p>
  )}

  {/* ✅ Paid breakdown — agar wallet/points use hua ho */}
  {(bill.pointsUsed > 0 || bill.balanceUsed > 0 || bill.finalAmount > 0) && (
    <p className="text-[11px] text-slate-400 mt-1">
      {bill.finalAmount > 0 && <>Paid: {fmt(bill.finalAmount)}</>}
      {bill.pointsUsed > 0 && (
        <>
          {bill.finalAmount > 0 ? " · " : ""}
          Points: {bill.pointsUsed}
        </>
      )}
      {bill.balanceUsed > 0 && (
        <>
          {bill.finalAmount > 0 || bill.pointsUsed > 0 ? " · " : ""}
          Advance: {fmt(bill.balanceUsed)}
        </>
      )}
    </p>
  )}

  <p className="text-xs text-slate-400 mt-1">
    {bill.services?.length || 0} service
    {bill.services?.length !== 1 ? "s" : ""}
    {bill.products?.length > 0 && (
      <>
        {" "}
        · {bill.products?.length} product
        {bill.products?.length !== 1 ? "s" : ""}
      </>
    )}
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
                <p className="font-semibold text-slate-800">Loyal Customer ✨</p>
                <p className="text-sm text-slate-600">
                  {customer.totalVisits} visits completed. This customer loves your salon!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADD ADVANCE MODAL ===== */}
        {showAdvanceModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  <button
                    onClick={() => setShowAdvanceModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h2 className="text-xl font-bold">Add Advance</h2>
                <p className="text-sm text-white/80 mt-1">
                  For: {customer.name}
                </p>
              </div>

              <form onSubmit={addAdvance}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Amount (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(e.target.value)}
                        min="1"
                        autoFocus
                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAdvanceAmount(amt.toString())}
                        className="flex-1 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Note (optional)
                    </label>
                    <input
                      type="text"
                      value={advanceNote}
                      onChange={(e) => setAdvanceNote(e.target.value)}
                      placeholder="e.g., Cash payment"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setShowAdvanceModal(false)}
                    className="flex-1 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold transition"
                    disabled={addingAdvance}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingAdvance || !advanceAmount}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-500/30 disabled:opacity-50 transition"
                  >
                    {addingAdvance ? "Adding..." : "Add Advance"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== MEMBERSHIP MODAL ===== */}
        {showMembershipModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Crown size={20} />
                  </div>
                  <button
                    onClick={() => setShowMembershipModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h2 className="text-xl font-bold">Sell Membership</h2>
                <p className="text-sm text-white/80 mt-1">
                  For: {customer.name}
                </p>
              </div>

              <form onSubmit={addMembership}>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Package
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Silver", amount: 1000, points: 1200 },
                        { name: "Gold", amount: 5000, points: 6500 },
                        { name: "Platinum", amount: 10000, points: 14000 },
                        { name: "Custom", amount: 0, points: 0 },
                      ].map((pkg) => (
                        <button
                          key={pkg.name}
                          type="button"
                          onClick={() => {
                            setMembershipPackage(pkg.name);
                            if (pkg.name !== "Custom") {
                              setMembershipAmount(pkg.amount);
                              setMembershipPoints(pkg.points);
                            }
                          }}
                          className={`p-3 rounded-xl border-2 text-left transition ${
                            membershipPackage === pkg.name
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <p className="font-bold text-sm text-slate-800">
                            {pkg.name}
                          </p>
                          {pkg.name !== "Custom" && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              ₹{pkg.amount} → {pkg.points} pts
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Amount Paid
                      </label>
                      <input
                        type="number"
                        value={membershipAmount}
                        onChange={(e) => setMembershipAmount(Number(e.target.value) || 0)}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Points Given
                      </label>
                      <input
                        type="number"
                        value={membershipPoints}
                        onChange={(e) => setMembershipPoints(Number(e.target.value) || 0)}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Validity (Months)
                    </label>
                    <input
                      type="number"
                      value={membershipMonths}
                      onChange={(e) => setMembershipMonths(Number(e.target.value) || 12)}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setShowMembershipModal(false)}
                    className="flex-1 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold transition"
                    disabled={addingMembership}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMembership || !membershipAmount || !membershipPoints}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-yellow-500/30 disabled:opacity-50 transition"
                  >
                    {addingMembership ? "Processing..." : `Sell for ₹${membershipAmount}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== COLLECT DUE MODAL ===== */}
        {showDueModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                  <button
                    onClick={() => setShowDueModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h2 className="text-xl font-bold">Collect Due</h2>
                <p className="text-sm text-white/80 mt-1">
                  From: {customer.name}
                </p>
              </div>

              <form onSubmit={collectDue}>
                <div className="p-6 space-y-4">
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">
                      Outstanding Due
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {fmt(dueAmountValue)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Amount to Collect (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={dueAmount}
                        onChange={(e) => setDueAmount(e.target.value)}
                        min="1"
                        max={dueAmountValue}
                        autoFocus
                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDueAmount(dueAmountValue.toString())}
                    className="w-full py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition border border-red-200"
                  >
                    Pay Full Due ({fmt(dueAmountValue)})
                  </button>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Note (optional)
                    </label>
                    <input
                      type="text"
                      value={dueNote}
                      onChange={(e) => setDueNote(e.target.value)}
                      placeholder="e.g., Cash payment"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setShowDueModal(false)}
                    className="flex-1 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold transition"
                    disabled={collectingDue}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={collectingDue || !dueAmount}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-red-500/30 disabled:opacity-50 transition"
                  >
                    {collectingDue ? "Collecting..." : `Collect ₹${dueAmount || 0}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}