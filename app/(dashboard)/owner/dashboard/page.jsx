"use client";

import { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import { Loader } from "lucide-react";
export default function DashboardPage() {
  const [stats, setStats] = useState({
      salonId: "",
    todayAppointments: 0,
    todayRevenue: 0,
    nextAppointment: null,
  });

  const [timeline, setTimeline] = useState([]);
  const [openSlots, setOpenSlots] = useState(0);
  const [insight, setInsight] = useState("");
  const [staffStatus, setStaffStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalStaffCount, setTotalStaffCount] = useState(0);
  
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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments/all`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) return;

        const all = data.appointments || [];
        const now = new Date();

        const startDay = new Date();
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date();
        endDay.setHours(23, 59, 59, 999);

        const todayList = all.filter((a) => {
          const t = new Date(a.startAt);
          return t >= startDay && t <= endDay;
        });

        const todayAppointments = todayList.length;
        const todayRevenue = todayList.reduce((sum, a) => sum + (a.finalAmount ?? a.totalPrice) || 0, 0);

        const nextAppointment =
          all
            .filter((a) => {
              const appointmentDate = new Date(a.startAt);
              return appointmentDate > now && a.status !== "cancelled";
            })
            .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0] || null;

        // GENERATE SLOTS
        const allSlots = [];
        let current = new Date(startDay);
        current.setHours(salonSettings.startHour, 0, 0, 0);

        const endTime = new Date(startDay);
        endTime.setHours(salonSettings.endHour, 0, 0, 0);

        while (current < endTime) {
          const slotStart = new Date(current);

          const bookingsInSlot = todayList.filter((a) => {
            const bookingStart = new Date(a.startAt);
            return bookingStart.getTime() === slotStart.getTime();
          });

          const bookedCount = bookingsInSlot.length;
          const availableSlots = Math.max(0, totalStaff - bookedCount);

          allSlots.push({
            time: slotStart,
            bookings: bookingsInSlot,
            bookedCount: bookedCount,
            availableSlots: availableSlots,
          });

          current.setMinutes(current.getMinutes() + salonSettings.slotDuration);
        }

        const nowTime = new Date();
        let totalFutureAvailableSlots = 0;

        allSlots.forEach((slot) => {
          const slotTime = new Date(slot.time);
          if (slotTime >= nowTime) {
            totalFutureAvailableSlots += slot.availableSlots;
          }
        });

        const displayOpenSlots = totalFutureAvailableSlots;
        const totalSlots = allSlots.length;
        const bookedPercentage = totalSlots > 0 ? Math.round((todayAppointments / totalSlots) * 100) : 0;
        const currentHour = new Date().getHours();
        
        let greeting = "";
        if (currentHour < 12) greeting = "Morning";
        else if (currentHour < 17) greeting = "Afternoon";
        else greeting = "Evening";

       let smartMessage = "";

if (todayAppointments === 0) {
  smartMessage = `😴 No bookings yet this. Try filling today's empty slots early.`;
} else if (bookedPercentage <= 25) {
  smartMessage = `⚠️ Only ${todayAppointments} booking${todayAppointments > 1 ? "s" : ""} so far. ${displayOpenSlots} slots are still open today.`;
} else if (bookedPercentage <= 50) {
  smartMessage = `🙂 Decent start today. ${todayAppointments} booking${todayAppointments > 1 ? "s" : ""} confirmed so far.`;
} else if (bookedPercentage <= 75) {
  smartMessage = `🔥 Nice pace today! ${bookedPercentage}% of your slots are already filled.`;
} else if (bookedPercentage < 100) {
  smartMessage = `🚀 Busy day! Only ${displayOpenSlots} slot${displayOpenSlots > 1 ? "s" : ""} left to fill today.`;
} else {
  smartMessage = `🏆 Fully booked today! Great work — your schedule is completely packed.`;
}

        const staffMap = {};
        staffList.forEach((staff) => {
          staffMap[staff.name] = { name: staff.name, bookings: 0 };
        });

        todayList.forEach((appt) => {
          const staffName = appt.staffId?.name || "Unassigned";
          if (staffMap[staffName]) staffMap[staffName].bookings++;
        });

        const staffArray = Object.values(staffMap);
        const futureSlots = allSlots.filter((slot) => new Date(slot.time) >= nowTime);
        const compactTimeline = futureSlots.slice(0, 6);

        setStats({salonId, todayAppointments, todayRevenue, nextAppointment });
        setTimeline(compactTimeline);
        setOpenSlots(displayOpenSlots);
        setInsight(smartMessage);
        setStaffStatus(staffArray);

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
      timeline={timeline}
      openSlots={openSlots}
      insight={insight}
      staffStatus={staffStatus}
      workingHours={`${formatHour(salonSettings.startHour)} - ${formatHour(salonSettings.endHour)}`}
      slotDuration={salonSettings.slotDuration}
      totalStaff={totalStaffCount}
      bookedPercentage={stats.todayAppointments > 0 ? Math.round((stats.todayAppointments / (timeline.length || 1)) * 100) : 0}
      todayAppointments={stats.todayAppointments}
      todayRevenue={stats.todayRevenue}
    />
  );
}