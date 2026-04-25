"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Bone,
  Cat,
  Crown,
  Dog,
  Heart,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Animations
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const popInCard: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const floatingIcon: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const peekPet: Variants = {
  animate: {
    y: [20, -5, 20],
    rotate: [-3, 3, -3],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

// Core Values Data
const coreValues = [
  {
    id: 1,
    title: "Royal Quality",
    description:
      "Every toy and habitat is rigorously tested to ensure it meets our elite standards of durability and fun.",
    icon: Crown,
    bg: "bg-blue-100",
    color: "text-blue-500",
    borderColor: "border-blue-200",
    shadow: "shadow-[0_8px_0_rgba(191,219,254,1)]",
  },
  {
    id: 2,
    title: "100% Organic",
    description:
      "We believe in nature's magic. All our treats are sourced from organic, chemical-free farms.",
    icon: Leaf,
    bg: "bg-green-100",
    color: "text-green-500",
    borderColor: "border-green-200",
    shadow: "shadow-[0_8px_0_rgba(187,247,208,1)]",
  },
  {
    id: 3,
    title: "Pure Love",
    description:
      "Our products are designed to strengthen the magical bond between you and your loyal companion.",
    icon: Heart,
    bg: "bg-pink-100",
    color: "text-pink-500",
    borderColor: "border-pink-200",
    shadow: "shadow-[0_8px_0_rgba(252,165,165,1)]",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sky-50/50 py-16 relative overflow-hidden">
      {/* Background Decor */}
      <motion.div
        variants={floatingIcon}
        animate="animate"
        className="absolute top-40 left-10 text-primary-sky/20 hidden lg:block"
      >
        <Bone size={80} className="rotate-[-20deg]" />
      </motion.div>
      <motion.div
        variants={floatingIcon}
        animate="animate"
        className="absolute bottom-40 right-10 text-secondary-sun/20 hidden lg:block"
        style={{ animationDelay: "1s" }}
      >
        <Cat size={90} className="rotate-[15deg]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HERO SECTION */}
        <div className="relative text-center mb-24 max-w-4xl mx-auto">
          <div className="relative h-20 w-32 mx-auto mb-[-2rem] z-20 overflow-hidden">
            <motion.div
              variants={peekPet}
              animate="animate"
              className="absolute bottom-0 w-full flex justify-center text-primary-sky drop-shadow-md"
            >
              <Dog size={80} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative z-10 bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_12px_0_rgba(135,206,235,0.15)] border-2 border-primary-sky/10"
          >
            <div className="inline-flex items-center justify-center gap-2 bg-secondary-sun/20 text-secondary-sun font-black px-5 py-2.5 rounded-full mb-6 shadow-sm border-2 border-secondary-sun/30">
              <Sparkles size={18} className="animate-pulse" /> Our Magical Story
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-charcoal tracking-tight mb-6 leading-tight">
              Building a <span className="text-primary-sky">Palace</span> for
              Your Best Friend.
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
              PetPalace wasn&apos;t born in a boardroom; it was born in a
              backyard. We realized that our magical companions didn&apos;t just
              need basic supplies—they deserved elite, high-quality treasures
              that matched the unconditional love they give us every day.
            </p>
          </motion.div>
        </div>

        {/* CORE VALUES SECTION */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-text-charcoal mb-4">
              The Royal Decree
            </h2>
            <p className="text-gray-500 font-bold">
              The values that guide every treat we bake and toy we craft.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.id}
                  variants={popInCard}
                  className={`bg-white rounded-[2.5rem] p-8 border-4 ${val.borderColor} ${val.shadow} hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(0,0,0,0.05)] active:translate-y-2 active:shadow-none transition-all duration-300 flex flex-col items-center text-center`}
                >
                  <div
                    className={`w-24 h-24 ${val.bg} rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner relative`}
                  >
                    <motion.div variants={floatingIcon} animate="animate">
                      <Icon
                        size={40}
                        className={`${val.color} drop-shadow-sm`}
                        strokeWidth={2}
                      />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-black text-text-charcoal mb-4">
                    {val.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* THE GUARANTEE / CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-gradient-to-tr from-primary-sky to-sky-400 rounded-[3rem] p-10 md:p-16 border-4 border-white shadow-[0_12px_0_rgba(135,206,235,0.4)] text-center relative overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Decorative backdrop shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <ShieldCheck size={64} className="text-white mb-6 drop-shadow-md" />

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
            The PetPalace Promise
          </h2>
          <p className="text-sky-50 font-bold text-lg max-w-xl mx-auto mb-10 drop-shadow-sm">
            If your pet doesn&apos;t absolutely love their new treasure, we will
            replace it or refund it. No growls, no hisses, no questions asked.
          </p>

          <Link
            href="/items"
            className="bg-secondary-sun text-text-charcoal font-black text-xl px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-transform border-b-4 border-orange-400 shadow-lg flex items-center gap-3 group"
          >
            Explore the Armory
            <ArrowRight
              size={24}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
