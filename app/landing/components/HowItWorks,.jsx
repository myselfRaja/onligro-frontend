import { UserPlus, Settings, Link2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works
        </h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Start taking online appointments in just a few minutes.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">

          {/* STEP 1 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto bg-black text-white rounded-2xl flex items-center justify-center shadow-md">
              <UserPlus size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Create Your Account</h3>
            <p className="text-gray-600 mt-2">
              Sign up with your name, phone number, and salon details.
            </p>

            <div className="text-5xl font-bold text-gray-200 absolute md:relative top-4 right-6 md:mt-4">
              01
            </div>
          </div>

          {/* STEP 2 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <Settings size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Add Staff & Services</h3>
            <p className="text-gray-600 mt-2">
              Set working hours, add services, and connect your staff.
            </p>

            <div className="text-5xl font-bold text-gray-200 absolute md:relative top-4 right-6 md:mt-4">
              02
            </div>
          </div>

          {/* STEP 3 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 mx-auto bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <Link2 size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Share Booking Link</h3>
            <p className="text-gray-600 mt-2">
              Share your unique link — customers can book anytime.
            </p>

            <div className="text-5xl font-bold text-gray-200 absolute md:relative top-4 right-6 md:mt-4">
              03
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
