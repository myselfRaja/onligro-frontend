"use client";

import { useRouter } from "next/navigation";

export default function DashboardContent({ salonId }) {

  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/book/${salonId}`)}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
    >
      Add Walk-in
    </button>
  );
}