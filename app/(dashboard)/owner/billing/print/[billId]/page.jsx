"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PrintBillPage() {
  const { billId } = useParams();

  const [bill, setBill] = useState(null);

  // Fetch bill
  useEffect(() => {
    async function fetchBill() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bills/${billId}`,
          {
            credentials: "include",
          }
        );

        console.log("status", res.status);

        const data = await res.json();

        console.log("data", data);

        if (res.ok) {
          setBill(data.bill);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (billId) {
      fetchBill();
    }
  }, [billId]);

  // Auto print
  useEffect(() => {
    if (bill) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [bill]);

  if (!bill) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 text-black">
      <div className="text-center border-b pb-3">
        <h1 className="text-2xl font-bold">
          {bill.salonId?.name}
        </h1>

        <p className="text-sm">
          {bill.salonId?.address}
        </p>

        <p className="text-xs">
          {bill.salonId?.city}
        </p>
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p>
          <strong>Bill No:</strong> {bill.billNumber}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(bill.createdAt).toLocaleString()}
        </p>

        <p>
          <strong>Customer:</strong> {bill.customerName}
        </p>

        <p>
          <strong>Phone:</strong> {bill.customerPhone}
        </p>
      </div>

      <div className="border-t border-b my-4 py-3">
        <h2 className="font-semibold mb-2">
          Services
        </h2>

        {bill.services.map((service) => (
          <div
            key={service._id}
            className="flex justify-between text-sm py-1"
          >
            <span>{service.serviceName}</span>
            <span>₹{service.price}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Service Total</span>
          <span>₹{bill.totalAmount}</span>
        </div>

        <div className="flex justify-between">
          <span>Final Amount</span>
          <span className="font-bold">
            ₹{bill.finalAmount}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Payment Mode</span>
          <span>{bill.paymentMode}</span>
        </div>

        <div className="flex justify-between">
          <span>Staff</span>
          <span>{bill.staffName}</span>
        </div>
      </div>

      <div className="text-center mt-6 border-t pt-4">
        <p className="font-medium">
          Thank You Visit Again
        </p>

        <div className="mt-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}