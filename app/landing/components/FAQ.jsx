"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Will my customers use this?",
    answer:
      "Yes — booking link WhatsApp, Instagram, Facebook sab jagah share ho sakta hai. Mobile-friendly booking flow customers ke liye bahut easy hai.",
  },
  {
    question: "Is it hard to setup?",
    answer:
      "Bilkul nahi. Staff, services aur working hours add karte hi system automatically 30-minute slots generate kar deta hai.",
  },
  {
    question: "Is support available?",
    answer:
      "Yes — chat, email, WhatsApp support sab available hai. Yearly plan par priority support milta hai.",
  },
  {
    question: "Can I use it from mobile?",
    answer:
      "Haan. Owner dashboard aur customer booking — dono completely mobile friendly hai.",
  },
  {
    question: "Does it prevent double booking?",
    answer:
      "Yes — jaise hi slot book hota hai wo real-time me block ho jata hai. Kisi bhi customer ko same slot visible nahi hota.",
  },
  {
     question: "Can I cancel anytime? Is it risky to try?",
    answer:
      "Yes — cancel anytime, no hidden fees, no long-term commitment. Aap 14-day free trial me pura system test kar sakte hain, bilkul zero risk.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  const toggleFAQ = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="w-full py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ List */}
        <div className="mt-14 space-y-4 text-left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="bg-white border rounded-2xl shadow-sm"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex justify-between items-center"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>

                <motion.div
                  animate={{ rotate: active === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-gray-600" />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {active === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-gray-700"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
