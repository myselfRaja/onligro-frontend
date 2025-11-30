"use client";

export default function Hero() {
  return (
   <section className="w-full pt-40 pb-20 px-6 bg-white">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

    {/* LEFT CONTENT */}
    <div className="flex-1">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
        Salon Appointments. <br /> Automated.
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mt-5 max-w-md">
        Real-time slots, online bookings, staff auto assignment —
        everything runs on autopilot.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
       <a
  href="/auth/register"
  className="px-6 py-3 text-center bg-black text-white rounded-lg font-medium hover:bg-neutral-900 transition shadow w-full sm:w-auto"
>
  Get Started – Free
</a>

<a
  href="#demo"
  className="px-6 py-3 text-center border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition w-full sm:w-auto"
>
  Book a Demo
</a>

      </div>

      <p className="text-gray-500 text-sm mt-4">
        Free 14-day trial · No credit card required · Trusted by salons in India
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div className="flex-1 flex justify-center">
  <img
  src="/hero-salon2.png"
  alt="Salon SAAS dashboard"
  className="w-full rounded-2xl shadow-2xl border border-gray-100 hero-float max-w-full h-auto object-contain md:h-[460px] md:object-cover md:max-w-none"
/>


    </div>

  </div>
</section>

  );
}
