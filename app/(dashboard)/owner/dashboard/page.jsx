"use client";

import { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import { Loader } from "lucide-react";

export default function DashboardPage() {
  // ✅ Billing-based states
  const [stats, setStats] = useState({
    salonId: "",
    todayRevenue: 0,
    todayBills: 0,
    customersServed: 0,
    avgBillValue: 0,
  });

  const [recentBills, setRecentBills] = useState([]);
  const [insight, setInsight] = useState("");
  const [staffStatus, setStaffStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStaffCount, setTotalStaffCount] = useState(0);
  
  // ✅ New states for payment split and customer insights
  const [paymentSplit, setPaymentSplit] = useState({
    cash: 0,
    upi: 0,
    card: 0,
    cashCount: 0,
    upiCount: 0,
    cardCount: 0,
  });
  
  const [customerInsights, setCustomerInsights] = useState({
    new: 0,
    returning: 0,
  });
  
  const [salonSettings, setSalonSettings] = useState({
    startHour: 12,
    endHour: 23,
    slotDuration: 30,
  });

  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const getTodayDayName = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[new Date().getDay()];
  };

  const timeToHour = (timeStr) => {
    if (!timeStr) return null;
    const [hour] = timeStr.split(":");
    return parseInt(hour);
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const hoursRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hours/get`,
          { credentials: "include" }
        );
        
        if (hoursRes.ok) {
          const hoursData = await hoursRes.json();
          const todayName = getTodayDayName();
          const todayHours = hoursData.hours?.find(
            (h) => h.dayOfWeek === todayName
          );
          
          if (todayHours && !todayHours.isClosed) {
            const startHour = timeToHour(todayHours.openTime);
            const endHour = timeToHour(todayHours.closeTime);
            
            setSalonSettings({
              startHour: startHour || 12,
              endHour: endHour || 23,
              slotDuration: 30,
            });
          }
        }
      } catch (err) {
        console.error("Error loading working hours:", err);
      } finally {
        setSettingsLoaded(true);
      }
    }
    
    loadSettings();
  }, []);

  useEffect(() => {
    async function load() {
      if (!settingsLoaded) return;
      
      try {
        // 1. Fetch Staff
        const staffRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/staff/all`,
          { credentials: "include" }
        );
        
        let staffList = [];
        let salonId = "";

        if (staffRes.ok) {
          const staffData = await staffRes.json();
          staffList = staffData.staff || [];
          salonId = staffList[0]?.salonId?._id || staffList[0]?.salonId || "";
        }
        
        const totalStaff = staffList.length;
        setTotalStaffCount(totalStaff);

        // 2. ✅ Fetch ALL Bills (Billing-based)
        const billsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bills/all`,
          { credentials: "include" }
        );

        const billsData = await billsRes.json();
        if (!billsRes.ok) {
          console.error("Failed to fetch bills");
          setLoading(false);
          return;
        }

        const allBills = billsData.bills || [];

        // 3. ✅ Filter Today's Bills
        const startDay = new Date();
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date();
        endDay.setHours(23, 59, 59, 999);

        const todayBillsList = allBills.filter((bill) => {
          const t = new Date(bill.createdAt);
          return t >= startDay && t <= endDay;
        });

        // 4. ✅ Calculate Stats
        const todayBills = todayBillsList.length;
        const todayRevenue = todayBillsList.reduce((sum, bill) => sum + (bill.finalAmount || 0), 0);
        
        // Unique customers today
        const uniqueCustomers = new Set(todayBillsList.map(bill => bill.customerPhone));
        const customersServed = uniqueCustomers.size;
        
        // Average bill value
        const avgBillValue = todayBills > 0 ? Math.round(todayRevenue / todayBills) : 0;

        // 5. ✅ Payment Split
        let cashTotal = 0, upiTotal = 0, cardTotal = 0;
        let cashCount = 0, upiCount = 0, cardCount = 0;

        todayBillsList.forEach(bill => {
          const mode = bill.paymentMode || 'Cash';
          const amount = bill.finalAmount || 0;
          
          if (mode === 'Cash') {
            cashTotal += amount;
            cashCount++;
          } else if (mode === 'UPI') {
            upiTotal += amount;
            upiCount++;
          } else if (mode === 'Card') {
            cardTotal += amount;
            cardCount++;
          }
        });

        setPaymentSplit({
          cash: cashTotal,
          upi: upiTotal,
          card: cardTotal,
          cashCount,
          upiCount,
          cardCount,
        });

        // 6. ✅ Customer Insights (New vs Returning)
        const allCustomerPhones = {};
        allBills.forEach(bill => {
          const phone = bill.customerPhone;
          if (phone && !allCustomerPhones[phone]) {
            allCustomerPhones[phone] = new Date(bill.createdAt);
          }
        });

      // ✅ Customer Insights (New vs Returning) - Poori history se compare
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const newCustomersSet = new Set();
const returningCustomersSet = new Set();

// 🔥 Same logic jo insight mein use ho raha hai
todayBillsList.forEach(bill => {
  const phone = bill.customerPhone;
  if (phone) {
    // Check if this customer has visited before today
    const previousVisits = allBills.filter(b => 
      b.customerPhone === phone && 
      new Date(b.createdAt) < todayStart
    );
    
    if (previousVisits.length > 0) {
      returningCustomersSet.add(phone);
    } else {
      newCustomersSet.add(phone);
    }
  }
});

setCustomerInsights({
  new: newCustomersSet.size,
  returning: returningCustomersSet.size,
});

        // 7. ✅ Recent Bills (last 7)
        const recentBillsList = todayBillsList
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 7)
          .map((bill) => ({
            customerName: bill.customerName || "Unknown",
            amount: bill.finalAmount || 0,
            services: bill.services?.map(s => s.serviceName) || [],
            staffName: bill.staffName || "Staff",
            createdAt: bill.createdAt,
            paymentMode: bill.paymentMode,
          }));

        setRecentBills(recentBillsList);

        // 8. ✅ Staff Performance (from bills)
        const staffMap = {};

        staffList.forEach((staff) => {
          staffMap[staff._id.toString()] = {
            name: staff.name,
            billsHandled: 0,
          };
        });

        todayBillsList.forEach((bill) => {
          const id = bill.staffId?.toString();
          if (id && staffMap[id]) {
            staffMap[id].billsHandled++;
          }
        });

        const staffArray = Object.values(staffMap);
        setStaffStatus(staffArray);

        // 9. ✅ Generate Insight Message (Billing-based)
        let smartMessage = "";

        if (todayBills === 0) {
          smartMessage = "😴 No bills yet today. Start filling early customers.";
        } else if (todayBills <= 3) {
          smartMessage = `📉 ${todayBills} bills so far. Revenue is lower than usual today.`;
        } else if (todayBills <= 6) {
          smartMessage = `🙂 ${todayBills} bills today. Steady progress! Keep going.`;
        } else if (todayBills <= 10) {
          smartMessage = `🔥 Good day! ${todayBills} bills created. Great job!`;
        } else {
          smartMessage = `🚀 Busy day! ${todayBills} bills and ₹${todayRevenue.toLocaleString()} revenue so far! 💰`;
        }

        // Check for repeat customers
        const repeatCount = todayBillsList.filter(bill => 
          allBills.filter(b => b.customerPhone === bill.customerPhone).length > 1
        ).length;
        
        if (repeatCount > todayBills * 0.3 && todayBills > 0) {
          smartMessage = `💚 Strong repeat customers (${Math.round((repeatCount/todayBills)*100)}% returning). Great loyalty!`;
        }

        // // Check for inactive customers (30+ days)
        // try {
        //   const inactiveRes = await fetch(
        //     `${process.env.NEXT_PUBLIC_API_URL}/customers/inactive/30`,
        //     { credentials: "include" }
        //   );
        //   if (inactiveRes.ok) {
        //     const inactiveData = await inactiveRes.json();
        //     if (inactiveData.count > 0) {
        //       smartMessage = `💬 ${inactiveData.count} customers haven't visited in 30+ days. Send reminders!`;
        //     }
        //   }
        // } catch (e) {
        //   // Silent fail
        // }

        // 10. ✅ Set all states
        setStats({
          salonId,
          todayRevenue,
          todayBills,
          customersServed,
          avgBillValue,
        });

        setInsight(smartMessage);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [settingsLoaded, salonSettings]);

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-gray-500" size={28} />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContent
      salonId={stats.salonId}
      stats={stats}
      recentBills={recentBills}
      insight={insight}
      staffStatus={staffStatus}
      workingHours={`${formatHour(salonSettings.startHour)} - ${formatHour(salonSettings.endHour)}`}
      slotDuration={salonSettings.slotDuration}
      totalStaff={totalStaffCount}
      paymentSplit={paymentSplit}
      customerInsights={customerInsights}
    />
  );
}