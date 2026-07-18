"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Can I create bills from my mobile?",
    answer:
      "Yes! Onligro works perfectly on mobile, tablet, and desktop. You can create bills, manage customers, and track inventory from anywhere — anytime.",
  },
  {
    question: "Can I manage my inventory and stock?",
    answer:
      "Absolutely. Track product stock in real-time, get low stock alerts, and manage all your inventory in one place. Never run out of essential items again.",
  },
  {
    question: "Can I track staff performance?",
    answer:
      "Yes. Monitor staff commissions, track performance metrics, and see who's your top performer. Perfect for managing your team effectively.",
  },
  {
    question: "Can I send WhatsApp reminders to customers?",
    answer:
      "Yes! Auto-send bill receipts, appointment reminders, and promotional messages directly via WhatsApp. Keep your customers engaged and informed.",
  },
  {
    question: "Is customer history stored automatically?",
    answer:
      "Yes. Every customer's service history, preferences, and phone numbers are saved automatically. You'll never lose customer data again.",
  },
  {
    question: "Is my business data secure?",
    answer:
      "100% secure. Your data is encrypted and stored safely. We take data privacy and security very seriously. Your business data is safe with us.",
  },
  {
    question: "Can I cancel anytime? Is it risky to try?",
    answer:
      "Yes — cancel anytime, no hidden fees, no long-term commitment. You can test the complete system with our 14-day free trial, absolutely zero risk.",
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 mt-3"
        >
          Everything you need to know about Onligro — Salon Management Software
        </motion.p>

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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <p className="text-gray-600">
            Still have questions?{" "}
            <a href="#contact" className="text-black font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>

      </div>
    </section>
  );
}