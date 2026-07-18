"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      name: "Anish Thakur",
      salon: "BOB The Barber",
      location: "Ranchi",
      text: "Earlier, I used to send double bills sometimes. The inventory and billing system has made my work so much easier. Now everything is tracked and customers are happy too.",
      role: "Owner",
      problem: "Billing & Inventory",
    },
    {
      name: "Geetanjali",
      salon: "Family Salon",
      location: "Kolkata",
      text: "I used to do billing on paper earlier. I had no reports and it was very difficult. Onligro has made my work so easy. Now everything is digital and I get reports too.",
      role: "Owner",
      problem: "Billing & Reports",
    },
    {
      name: "Nadeem Ali",
      salon: "Hair Studio",
      location: "Hyderabad",
      text: "I needed both billing and appointment management. Onligro gave me both in one place. Now customers book easily and billing is smooth too.",
      role: "Owner",
      problem: "Billing & Appointments",
    },
  ];

  return (
    <section className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Real Stories from Real Salon Owners
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 mt-3 max-w-2xl mx-auto"
        >
          See how Onligro is helping salon owners in Ranchi manage their business better.
        </motion.p>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              }}
              transition={{ duration: 0.4 }}
              className="bg-white border rounded-3xl p-8 shadow-sm text-left"
            >
              {/* Salon Owner Info */}
              <div>
                <p className="font-semibold text-gray-900 text-lg">{review.name}</p>
                <p className="text-sm text-gray-500">{review.salon}</p>
                <p className="text-xs text-gray-400">{review.location}</p>
              </div>

              {/* Problem Tag */}
              <div className="mt-3">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  🎯 {review.problem}
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                “{review.text}”
              </p>

              {/* Role */}
              <p className="text-sm font-medium text-gray-900 mt-4">
                — {review.role}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <p className="text-xs text-gray-400 mt-10">
          ⭐ Real reviews from Onligro users in Ranchi, Jharkhand
        </p>
      </div>
    </section>
  );
}