"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      name: "Riya’s Beauty Salon",
      text: "Booking system itna easy hai ki humare customers khud book kar lete hain.",
     // placeholder
      role: "Owner",
    },
    {
      name: "The Hair Studio",
      text: "Staff auto-assignment ne hamare double bookings completely khatam kar diye.",
     
      role: "Founder",
    },
    {
      name: "Diva Glow Salon",
      text: "Dashboard simple hai and real-time slots amazing work karta hai.",

      role: "Manager",
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
          Loved by Real Salon Owners
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 mt-3"
        >
          Hear from salons already using our appointment system every day.
        </motion.p>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16"
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
              {/* Salon Owner Photo */}
              <div className="flex items-center gap-4">
       
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 italic leading-relaxed mt-6">
                “{review.text}”
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
