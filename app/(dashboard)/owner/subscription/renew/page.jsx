"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle, Copy, Check } from "lucide-react";

export default function RenewSubscriptionPage() {
  const router = useRouter();
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [plan, setPlan] = useState("yearly"); // "monthly" | "yearly"
  const [copied, setCopied] = useState(false);

  const UPI_ID = "mohammedraza11239@okaxis"; // ← apna UPI ID daalo
  const WHATSAPP_NUMBER = "919038459931"; // ← apna WhatsApp number daalo
  const SALON_NAME = "Onligro";

  const plans = {
    monthly: { amount: 1000, label: "Monthly", note: "Onligro Monthly Subscription" },
    yearly: { amount: 10000, label: "Yearly", note: "Onligro Annual Subscription", savings: 2000 },
  };

  const current = plans[plan];

  const upiString = `upi://pay?pa=${UPI_ID}&pn=${SALON_NAME}&am=${current.amount}&cu=INR&tn=${current.note}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) setScreenshot(file);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!screenshot) {
      alert("Please upload payment screenshot first");
      return;
    }

    const message = `Hi, I have paid ₹${current.amount} for ${current.note}. Please find my payment screenshot attached. My account email: [aapka email]`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Screenshot Sent!</h1>
          <p className="text-gray-600 mb-6">
            Aapka payment screenshot bhej diya gaya hai. Hum 10-15 minute mein verify karke account activate kar denge.
          </p>
          <button
            onClick={() => router.push("/owner/dashboard")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Renew Subscription</h1>
          <p className="text-gray-500 mt-1">Choose your plan</p>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setPlan("monthly")}
            className={`p-4 rounded-xl border-2 transition text-left ${
              plan === "monthly"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <p className="text-xs text-gray-500 font-medium">Monthly</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹1,000</p>
            <p className="text-xs text-gray-400 mt-1">per month</p>
          </button>

          <button
            onClick={() => setPlan("yearly")}
            className={`p-4 rounded-xl border-2 transition text-left relative ${
              plan === "yearly"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SAVE ₹2,000
            </div>
            <p className="text-xs text-gray-500 font-medium">Yearly</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹10,000</p>
            <p className="text-xs text-gray-400 mt-1">per year</p>
          </button>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <p className="text-blue-100 text-sm mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{current.amount.toLocaleString()}</p>
          <p className="text-blue-100 text-xs mt-2">
            {plan === "yearly" ? "Save ₹2,000 with annual plan" : current.note}
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Payment Steps:</h2>

          <div className="space-y-4">

            {/* Step 1: QR */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Scan QR to pay ₹{current.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Amount automatically filled in UPI app</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <img
                src={qrUrl}
                alt={`UPI QR - ₹${current.amount}`}
                className="w-[220px] h-[220px] mx-auto rounded-lg bg-white p-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                Scan with PhonePe, GPay, Paytm
              </p>
            </div>

            {/* OR - UPI ID */}
            <div className="text-center text-xs text-gray-400">OR</div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">UPI ID</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold text-gray-900">{UPI_ID}</p>
                <button
                  onClick={handleCopyUPI}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Screenshot upload karein</p>
                <p className="text-sm text-gray-500">Payment ke baad screenshot upload karein</p>
              </div>
            </div>

            {/* Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
                id="screenshot-upload"
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                {screenshot ? (
                  <p className="text-green-600 font-medium text-sm">✓ {screenshot.name}</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium text-sm">Click to upload screenshot</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG (max 5MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">WhatsApp pe bhejein</p>
                <p className="text-sm text-gray-500">Screenshot upload karke button dabayein</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!screenshot}
          className={`w-full py-3.5 rounded-xl font-bold text-white text-lg shadow-lg transition flex items-center justify-center gap-2 ${
            screenshot ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send on WhatsApp
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          After verification, account will be activated within 10-15 minutes
        </p>
      </div>
    </div>
  );
}