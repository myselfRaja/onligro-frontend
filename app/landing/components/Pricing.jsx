"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full py-28 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Simple plans for every salon
        </h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Start with everything you need. Upgrade as you grow.
        </p>

        {/* Cards Wrapper (stagger animation) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {/* CARD 1 — Starter (Intentionally Limited) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col p-8 bg-white rounded-3xl border shadow-sm text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
            <p className="text-gray-600 mt-1">For individual stylists</p>

            <div className="flex items-end gap-1 mt-6">
              <span className="text-4xl font-bold text-gray-900">₹249</span>
              <span className="text-gray-500 mb-1 text-sm">/ month</span>
            </div>

            <p className="text-xs text-green-600 mt-1 font-medium">
              50% off first year · <s>₹499</s>
            </p>

            <ul className="mt-6 space-y-2 text-gray-700 text-sm flex-grow">
              <li>✔ Up to 2 staff members</li>
              <li>✔ Basic booking page</li>
              <li>✔ Manual appointment management</li>
              <li>✔ 5 services limit</li>
              <li>❌ No owner dashboard</li>
              <li>❌ No advanced features</li>
            </ul>

            <a
              href="/owner/register"
              className="mt-8 w-full py-3 rounded-xl border border-gray-300 text-gray-900 text-center text-sm font-medium hover:bg-gray-100 transition"
            >
              Start Basic
            </a>
          </motion.div>

          {/* CARD 2 — Professional (Most Popular) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{ y: -12, scale: 1.04 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-full shadow">
                Most Popular
              </span>
            </div>

            {/* Gradient Border */}
            <div className="h-full p-[2px] rounded-3xl bg-gradient-to-r from-black via-gray-700 to-black shadow-xl">
              <div className="flex flex-col h-full bg-white rounded-3xl p-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900">Professional</h3>
                <p className="text-gray-600 mt-1">
                  Complete salon management
                </p>

                <div className="flex items-end gap-1 mt-6">
                  <span className="text-4xl font-bold text-gray-900">₹749</span>
                  <span className="text-gray-500 mb-1 text-sm">/ month</span>
                </div>

                <p className="text-xs text-green-600 mt-1 font-medium">
                  50% off first year · <s>₹1499</s>
                </p>

                <ul className="mt-6 space-y-2 text-gray-700 text-sm flex-grow">
                  <li>✔ Up to 10 staff members</li>
                  <li>✔ Full owner dashboard</li>
                  <li>✔ Real-time booking system</li>
                  <li>✔ Staff management</li>
                  <li>✔ Unlimited services</li>
                  <li>✔ Advanced analytics</li>
                  <li>✔ Multi-service appointments</li>
                </ul>

                <a
                  href="/owner/register"
                  className="mt-8 w-full py-3 rounded-xl bg-black text-white text-center text-sm font-medium hover:bg-neutral-900 transition shadow-md"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </motion.div>

          {/* CARD 3 — Business (Future) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col p-8 bg-white rounded-3xl border shadow-sm text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">Business</h3>
            <p className="text-gray-600 mt-1">For salon chains</p>

            <div className="flex items-end gap-1 mt-6">
              <span className="text-4xl font-bold text-gray-900">₹1249</span>
              <span className="text-gray-500 mb-1 text-sm">/ month</span>
            </div>

            <p className="text-xs text-green-600 mt-1 font-medium">
              50% off first year · <s>₹2499</s>
            </p>

            <ul className="mt-6 space-y-2 text-gray-700 text-sm flex-grow">
              <li>✔ Everything in Professional</li>
              <li>✔ Multi-branch management</li>
              <li>✔ Advanced role permissions</li>
              <li>✔ Custom branding</li>
              <li>✔ Dedicated account manager</li>
              <li>✔ Priority support</li>
              <li>🔜 <span className="text-gray-500">Coming Soon</span></li>
            </ul>

            <a
              href="/contact"
              className="mt-8 w-full py-3 rounded-xl border border-gray-300 text-gray-900 text-center text-sm font-medium hover:bg-gray-100 transition"
            >
              Notify Me
            </a>
          </motion.div>

        </motion.div>

        <p className="text-xs text-gray-500 mt-6">
          All plans include 14-day free trial · No credit card required
        </p>
      </div>
    </section>
  );
}