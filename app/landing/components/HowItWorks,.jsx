import { UserPlus, Settings, CreditCard } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Get Started in 3 Simple Steps
        </h2>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Set up your salon and start managing your business in minutes.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">

          {/* STEP 1 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <div className="w-14 h-14 mx-auto bg-black text-white rounded-2xl flex items-center justify-center shadow-md">
              <UserPlus size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Create Your Salon Profile</h3>
            <p className="text-gray-600 mt-2">
              Sign up with your name, phone number, and salon details. Get started in 2 minutes.
            </p>

            <div className="text-5xl font-bold text-gray-200 absolute md:relative top-4 right-6 md:mt-4">
              01
            </div>
          </div>

          {/* STEP 2 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <div className="w-14 h-14 mx-auto bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <Settings size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Add Staff, Services & Products</h3>
            <p className="text-gray-600 mt-2">
              Add your team members, services with prices, and manage your product inventory.
            </p>

            <div className="text-5xl font-bold text-gray-200 absolute md:relative top-4 right-6 md:mt-4">
              02
            </div>
          </div>

          {/* STEP 3 */}
          <div className="group p-8 rounded-3xl border bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <div className="w-14 h-14 mx-auto bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <CreditCard size={30} />
            </div>

            <h3 className="text-xl font-semibold mt-6">Start Billing & Manage Your Business</h3>
            <p className="text-gray-600 mt-2">
              Create bills, track customers, manage inventory, and view reports — all from one dashboard.
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