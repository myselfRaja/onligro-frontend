"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CreditCard, Package, BarChart3, MessageCircle, Calendar, LayoutGrid } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: CreditCard,
      title: "Smart Billing & POS",
      description: "Create professional bills in seconds. Accept Cash, UPI, Card — all payments tracked automatically.",
      image: "/bil.png",
      gradient: "from-black to-gray-700",
    },
    {
      icon: Package,
      title: "Customer & Inventory Management",
      description: "Store customer history, track product stock, get low-stock alerts — everything organized.",
      image: "/inven.png",
      gradient: "from-violet-600 to-purple-600",
    },
    {
      icon: BarChart3,
      title: "Staff Performance & Reports",
      description: "Track staff commissions, monitor performance, and view daily/weekly business reports.",
      image: "/staff (2).png",
      gradient: "from-emerald-600 to-green-600",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Reminders",
      description: "Auto-send bill receipts, appointment reminders, and promotional messages via WhatsApp.",
      image: "/whats.png",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      icon: Calendar,
      title: "Appointment Management",
      description: "Easy booking, rescheduling, and calendar view — fully integrated with your billing system.",
      image: "/slot.png",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: LayoutGrid,
      title: "All-in-One Dashboard",
      description: "Manage billing, customers, inventory, staff, and reports — everything from a single dashboard.",
      image: "/dash.png",
      gradient: "from-rose-600 to-pink-600",
    },
  ];

  return (
    <section id="features" className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading with animation */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900"
        >
          Everything You Need to Run Your Salon
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 mt-3 max-w-2xl mx-auto"
        >
          Billing • Customer Management • Inventory • Staff • Reports • WhatsApp — all from one dashboard.
        </motion.p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">

          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="flex flex-col bg-gray-50 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="md:w-8 md:h-8" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mt-5 md:mt-6 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm md:text-base flex-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image with smooth appear effect */}
                <div className="w-full h-48 md:h-56 overflow-hidden flex-shrink-0 relative bg-gray-200">
                  <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.08 + 0.2 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                      priority={index < 3}
                      quality={90}
                    />
                  </motion.div>
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent opacity-60"></div>
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}