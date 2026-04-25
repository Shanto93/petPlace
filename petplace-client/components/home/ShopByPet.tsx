"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Bird, Cat, Dog, Fish } from "lucide-react";
import Link from "next/link";

// Animations
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Bouncy floating animation for the icons
const floatingIcon: Variants = {
  animate: {
    y: [0, -5, 0],
    rotate: [-4, 4, -4],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function ShopByPet() {
  const categories = [
    {
      icon: Dog,
      name: "Dogs",
      color: "text-blue-500",
      bg: "bg-blue-100",
      border: "border-blue-200",
      shadow: "shadow-[0_6px_0_rgba(191,219,254,1)]",
    },
    {
      icon: Cat,
      name: "Cats",
      color: "text-orange-500",
      bg: "bg-orange-100",
      border: "border-orange-200",
      shadow: "shadow-[0_6px_0_rgba(254,215,170,1)]",
    },
    {
      icon: Bird,
      name: "Birds",
      color: "text-pink-500",
      bg: "bg-pink-100",
      border: "border-pink-200",
      shadow: "shadow-[0_6px_0_rgba(252,165,165,1)]",
    },
    {
      icon: Fish,
      name: "Fish",
      color: "text-teal-500",
      bg: "bg-teal-100",
      border: "border-teal-200",
      shadow: "shadow-[0_6px_0_rgba(153,246,228,1)]",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="px-4 md:px-0 max-w-5xl mx-auto" // Added max-w-5xl to constrain overall width
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-4xl font-black text-center mb-10 text-text-charcoal tracking-tight"
      >
        Shop by <span className="text-primary-sky">Pet</span>
      </motion.h2>

      {/* Changed gap-8 to gap-5 for a tighter grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat, i) => {
          const Icon = cat.icon;

          return (
            <motion.div key={i} variants={fadeUp} className="h-full">
              <Link
                href={`/items?category=${cat.name}`}
                // Reduced padding (p-5), rounded corners (rounded-[2rem]), and shadow height
                className={`bg-white rounded-[2rem] p-5 border-4 ${cat.border} ${cat.shadow} hover:-translate-y-1.5 hover:shadow-[0_8px_0_rgba(0,0,0,0.08)] active:translate-y-1.5 active:shadow-none transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group h-full block`}
              >
                {/* Scaled down the decorative blurry background blob */}
                <div
                  className={`absolute -top-6 -right-6 w-28 h-28 ${cat.bg} rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`}
                />

                {/* Scaled down Icon Circle (w-20 h-20 instead of w-32 h-32) */}
                <div
                  className={`w-20 h-20 ${cat.bg} rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-inner relative z-10`}
                >
                  <motion.div variants={floatingIcon} animate="animate">
                    <Icon
                      size={36} // Smaller icon
                      className={`${cat.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={2}
                    />
                  </motion.div>
                </div>

                {/* Scaled down text */}
                <h3 className="font-black text-xl text-text-charcoal relative z-10 mb-4">
                  {cat.name}
                </h3>

                {/* Scaled down Circular Arrow Button */}
                <div
                  className={`mt-auto w-10 h-10 rounded-full ${cat.bg} flex items-center justify-center ${cat.color} group-hover:bg-text-charcoal group-hover:text-white transition-colors duration-300 z-10`}
                >
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
