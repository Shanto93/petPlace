"use client";

import { motion, Variants } from "framer-motion";
import { Bone, Dog, Mail, PawPrint, Sparkles } from "lucide-react";

// The entrance animation for the main container
const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Infinite floating animation for the cartoon elements
const floatFast: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatSlow: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [5, -5, 5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
  },
};

export default function Newsletter() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={popIn}
      // UI FIX: Added mx-4 so it doesn't touch screen edges on mobile, reduced mobile padding (p-6)
      className="relative max-w-5xl mx-4 lg:mx-auto bg-gradient-to-tr from-primary-sky to-sky-400 text-text-charcoal rounded-[2.5rem] p-6 sm:p-8 md:p-12 text-center overflow-hidden border-4 border-white shadow-[0_12px_0_rgba(0,0,0,0.05)]"
    >
      {/* Floating Cartoon Element 1: Top Left Bone */}
      <motion.div
        variants={floatSlow}
        animate="animate"
        className="absolute top-8 left-8 text-white/30 hidden md:block"
      >
        <Bone size={50} className="rotate-[-45deg]" />
      </motion.div>

      {/* Floating Cartoon Element 2: Bottom Right Paw */}
      <motion.div
        variants={floatFast}
        animate="animate"
        className="absolute bottom-8 right-10 text-white/30 hidden md:block"
      >
        <PawPrint size={60} className="rotate-[20deg]" />
      </motion.div>

      {/* Main Cartoon Character Setup */}
      <motion.div
        variants={floatFast}
        animate="animate"
        className="mx-auto w-20 h-20 bg-white rounded-full border-4 border-secondary-sun shadow-[0_6px_0_rgba(255,215,0,0.5)] flex items-center justify-center mb-6 relative"
      >
        <Dog size={40} className="text-primary-sky" />
        <Sparkles
          size={18}
          className="absolute -top-2 -right-2 text-secondary-sun animate-pulse"
        />
      </motion.div>

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-md">
          Join The Elite Pack!
        </h2>
        <p className="text-sky-50 text-base md:text-lg font-bold max-w-md mx-auto drop-shadow-sm px-2">
          Snag <span className="text-secondary-sun text-xl">15% OFF</span> your
          first order and get early access to premium drops!
        </p>

        {/* GLASSMORPHISM FORM CONTAINER */}
        <div className="pt-4">
          <form
            // UI FIX: Changed rounded-full to rounded-3xl on mobile to fix the pill-shape stretching.
            // UI FIX: Increased mobile padding (p-3) and gap (gap-3) for a cleaner vertical stack.
            className="flex flex-col sm:flex-row gap-3 sm:gap-2 max-w-md mx-auto bg-white/20 backdrop-blur-md border border-white/40 p-3 sm:p-2 rounded-3xl sm:rounded-full shadow-xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                <Mail className="text-primary-sky" size={16} />
              </div>
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full pl-14 pr-4 py-3 rounded-full text-text-charcoal text-sm font-bold outline-none border-2 border-transparent focus:border-white transition-all bg-white/90 focus:bg-white shadow-inner placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* UI FIX: Added w-full on mobile, sm:w-auto on desktop so the button stretches properly */}
            <button className="w-full sm:w-auto bg-secondary-sun text-text-charcoal font-black text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform border-b-4 border-orange-400 shadow-md flex items-center justify-center gap-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
