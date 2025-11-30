"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function CalendarView() {
  const [appointments, setAppointments] = useState([]);

  async function load() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/all`, {
      credentials: "include",
    });
    const data = await res.json();

    if (data.appointments) {
      setAppointments(data.appointments);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Convert DB appointments → Calendar events
  const events = useMemo(() => {
    return appointments.map((a) => ({
      id: a._id,
      title: `${a.customerName} (${a.totalDuration} min)`,
      start: new Date(a.startAt),
      end: new Date(a.endAt),
      staff: a.staffId?.name,
      price: a.totalPrice
    }));
  }, [appointments]);

  const eventStyleGetter = (event) => {
    const color = "#4F46E5"; // Indigo
    return {
      style: {
        backgroundColor: color,
        color: "white",
        borderRadius: "6px",
        border: "none",
        paddingLeft: "6px",
      },
    };
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-4">Calendar View</h1>
      <p className="text-gray-600 mb-6">Weekly appointment planner</p>

      <div className="bg-white rounded-xl shadow border p-3">
        <Calendar
          localizer={momentLocalizer(require("moment"))}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["week", "day", "month"]}
          defaultView="week"
          step={30}
          timeslots={2}
          style={{ height: 700 }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}
