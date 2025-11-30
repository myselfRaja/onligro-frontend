// app/public_pages/book/[salonId]/page.jsx
import SalonHeaderClient from "./SalonHeaderClient";
import ServiceSelector from "./ServiceSelector";
import DatePicker from "./DatePicker";
import TimeSlotGrid from "./components/TimeSlotGrid";

export default async function SalonBookingPage({ params }) {
  const { salonId } = await params;

  const salonRes = await fetch(
    `http://localhost:5000/public/salon/${salonId}`,
    { cache: "no-store" }
  );

  if (!salonRes.ok) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Salon Not Found</h1>
        </div>
      </div>
    );
  }

  const salon = await salonRes.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <SalonHeaderClient salon={salon} />
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Services Section */}
        <ServiceSelector salonId={salonId} />
        
        {/* Date Picker Section */}
        <DatePicker salonId={salonId} />
        
        {/* Time Slot Grid Section */}
        <TimeSlotGrid 
          salonId={salonId} 
          selectedDate={""} // Will be connected in next step
          selectedServices={[]} // Will be connected in next step
        />

        {/* Customer Form Section (Coming Next) */}
        <div id="customer-form" className="min-h-[200px]">
          {/* Step 5 will go here */}
        </div>

      </div>
    </div>
  );
}