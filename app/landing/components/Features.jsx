import Image from "next/image";
import { Clock3, Users, LayoutGrid } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Powerful Features Designed for Modern Salons
        </h2>

        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          Automated bookings, staff scheduling and a clean dashboard — everything works together beautifully.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 items-stretch">

          {/* CARD 1 */}
          <div className="flex flex-col p-7 bg-gray-50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center shadow">
              <Clock3 size={32} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Real-Time Slot Booking</h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Customers see only available 30-minute slots. Instantly updated — no double booking.
            </p>

            {/* IMAGE */}
            <div className="mt-6 w-full h-56 rounded-2xl overflow-hidden">
              <Image
                src="/slot.png"
                alt="Slot screenshot"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="flex flex-col p-7 bg-gray-50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white flex items-center justify-center shadow">
              <Users size={32} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Automated Staff Assignment</h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Our smart system assigns the best available staff automatically.
            </p>

            <div className="mt-6 w-full h-56 rounded-2xl overflow-hidden">
              <Image
                src="/staff.png"
                alt="Staff screenshot"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* CARD 3 */}
          <div className="flex flex-col p-7 bg-gray-50 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center shadow">
              <LayoutGrid size={32} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Owner Dashboard</h3>
            <p className="text-gray-600 mt-2 flex-grow">
              Manage appointments, staff, working hours and services — everything in one place.
            </p>

            <div className="mt-6 w-full h-56 rounded-2xl overflow-hidden">
              <Image
                src="/dashboard.png"
                alt="Dashboard screenshot"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
