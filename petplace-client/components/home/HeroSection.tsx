"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Dog, Play, Sparkles, Star } from "lucide-react";
import Link from "next/link";

// Refined Animation Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }, // Premium easing
};

const floatAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatAnimationDelayed: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-visible">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-sky/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-secondary-sun/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        {/* Left Column: Text & CTA */}
        <motion.div
          className="flex-1 space-y-8 max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Elite Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-primary-sky/30 shadow-sm text-sm font-bold text-primary-sky"
          >
            <Sparkles size={16} /> #1 Premium Pet Boutique
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-text-charcoal tracking-tight"
          >
            Spoil Your Pet <br />
            Like{" "}
            <span className="relative inline-block text-primary-sky">
              Royalty
              {/* Magic underline effect */}
              <svg
                className="absolute w-full h-4 -bottom-1 left-0 text-secondary-sun/40"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed"
          >
            Discover elite, organic treats and premium supplies for your
            majestic companions. Step into the Palace and elevate their
            everyday.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/items"
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4 group"
            >
              Explore Collection
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-text-charcoal bg-white border-2 border-transparent hover:border-gray-200 transition-colors shadow-sm hover:shadow-md">
              <div className="w-8 h-8 rounded-full bg-secondary-sun/20 flex items-center justify-center text-secondary-sun">
                <Play size={14} fill="currentColor" />
              </div>
              Watch Video
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-6 pt-6 border-t-2 border-gray-100"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 shadow-sm flex items-center justify-center text-xs font-bold text-gray-400"
                >
                  U{i}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex gap-1 text-secondary-sun">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm font-bold text-text-charcoal">
                Loved by 10k+ Elite Pets
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Abstract Hero Composition */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none h-[500px]"
        >
          {/* Main 3D Card Area */}
          <motion.div
            variants={floatAnimation}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-tr from-primary-sky/40 to-white rounded-[3rem] border-4 border-white shadow-2xl flex flex-col items-center justify-center rotate-3"
          >
            <Dog size={160} className="text-white drop-shadow-xl mb-6" />
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm">
              <p className="font-bold text-text-charcoal tracking-wide">
                Elite 3D Assets Space
              </p>
            </div>
          </motion.div>

          {/* Floating Element 1: Small Item Card */}
          <motion.div
            variants={floatAnimationDelayed}
            animate="animate"
            className="absolute -left-12 top-20 bg-white p-4 rounded-2xl shadow-xl border-2 border-gray-100 rotate-[-6deg] flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-bg-cream rounded-xl flex items-center justify-center text-orange-500">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1.1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                <path d="M8 14v.5" />
                <path d="M16 14v.5" />
                <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Featured
              </p>
              <p className="font-black text-text-charcoal">Luxury Cat Tree</p>
            </div>
          </motion.div>

          {/* Floating Element 2: Price Tag */}
          <motion.div
            variants={floatAnimation}
            animate="animate"
            className="absolute -right-8 bottom-32 bg-secondary-sun text-text-charcoal px-6 py-4 rounded-2xl shadow-xl rotate-[12deg] font-black text-2xl border-4 border-white"
          >
            $49.99
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
