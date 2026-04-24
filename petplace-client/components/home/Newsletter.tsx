"use client";

import { motion, Variants } from "framer-motion";
import { Dog, Mail } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Newsletter() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="bg-primary-sky text-white rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 p-8 opacity-20">
        <Dog size={150} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="text-4xl font-black">Join The Elite Pack</h2>
        <p className="text-blue-50 text-lg">
          Get 15% off your first order and exclusive access to premium pet
          drops.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex-1 relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 rounded-full text-text-charcoal outline-none border-4 border-transparent focus:border-secondary-sun transition-colors"
            />
          </div>
          <button className="bg-secondary-sun text-text-charcoal font-black px-8 py-4 rounded-full hover:scale-105 transition-transform">
            Subscribe
          </button>
        </form>
      </div>
    </motion.section>
  );
}
