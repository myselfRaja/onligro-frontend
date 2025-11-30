"use client";

import { motion } from "framer-motion";

export default function TrustedBy() {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-sm text-gray-500 tracking-wide"
        >
          Trusted by salons across India
        </motion.p>

        {/* Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {[
            "Real-time slots",
            "Staff automation",
            "Easy setup",
            "Unlimited appointments",
          ].map((text, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
              transition={{ duration: 0.3 }}
              className="px-5 py-2 bg-gray-100/80 border border-gray-200 rounded-full text-sm text-gray-700 backdrop-blur-sm"
            >
              {text}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
