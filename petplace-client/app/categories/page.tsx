"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Bird,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Sparkles,
  Turtle,
} from "lucide-react";
import Link from "next/link";

// 1. Category Data
const petCategories = [
  {
    id: "dogs",
    name: "Loyal Canines",
    pet: "Dogs",
    description:
      "Premium chews, orthopedic beds, and interactive toys for your best friend.",
    icon: Dog,
    color: "text-blue-500",
    bg: "bg-blue-100",
    borderColor: "border-blue-200",
    shadow: "shadow-[0_8px_0_rgba(191,219,254,1)]", // blue-200
  },
  {
    id: "cats",
    name: "Regal Felines",
    pet: "Cats",
    description:
      "Luxury towers, automated lasers, and gourmet treats for indoor hunters.",
    icon: Cat,
    color: "text-orange-500",
    bg: "bg-orange-100",
    borderColor: "border-orange-200",
    shadow: "shadow-[0_8px_0_rgba(254,215,170,1)]", // orange-200
  },
  {
    id: "birds",
    name: "Melodic Birds",
    pet: "Birds",
    description:
      "Nutrient-rich seed mixes and stimulating mirrors for feathered royalty.",
    icon: Bird,
    color: "text-pink-500",
    bg: "bg-pink-100",
    borderColor: "border-pink-200",
    shadow: "shadow-[0_8px_0_rgba(252,165,165,1)]", // pink-200
  },
  {
    id: "fish",
    name: "Aquatic Royals",
    pet: "Fish",
    description:
      "Glowing habitats and color-enhancing flakes for pristine aquariums.",
    icon: Fish,
    color: "text-teal-500",
    bg: "bg-teal-100",
    borderColor: "border-teal-200",
    shadow: "shadow-[0_8px_0_rgba(153,246,228,1)]", // teal-200
  },
  {
    id: "small-pets",
    name: "Pocket Pets",
    pet: "Small Pets",
    description:
      "Cozy burrows and healthy nibbles for hamsters, guinea pigs, and rabbits.",
    icon: Rabbit,
    color: "text-purple-500",
    bg: "bg-purple-100",
    borderColor: "border-purple-200",
    shadow: "shadow-[0_8px_0_rgba(233,213,255,1)]", // purple-200
  },
  {
    id: "reptiles",
    name: "Exotic Scales",
    pet: "Reptiles",
    description:
      "Basking rocks, heat lamps, and dietary supplements for cold-blooded kings.",
    icon: Turtle,
    color: "text-green-500",
    bg: "bg-green-100",
    borderColor: "border-green-200",
    shadow: "shadow-[0_8px_0_rgba(187,247,208,1)]", // green-200
  },
];

// 2. Animations
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-sky-50/50 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 bg-white text-primary-sky font-black px-6 py-3 rounded-full mb-2 shadow-sm border-2 border-primary-sky/10">
            <Sparkles size={20} className="text-secondary-sun animate-pulse" />{" "}
            Shop By Kingdom
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-text-charcoal tracking-tight">
            Choose Your <span className="text-primary-sky">Companion</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Every pet deserves the royal treatment. Select your companion below
            to explore their dedicated armory of treats, toys, and habitats.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {petCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.id} variants={popInCard}>
                {/* We link to /items. In a real app, you might pass ?category=Dogs here */}
                <Link href="/items" className="block outline-none group">
                  <div
                    className={`bg-white rounded-[3rem] p-8 border-4 ${category.borderColor} ${category.shadow} hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-none transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden`}
                  >
                    {/* Background decorative blob */}
                    <div
                      className={`absolute -top-10 -right-10 w-40 h-40 ${category.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}
                    />

                    {/* Animated Icon Area */}
                    <div
                      className={`w-32 h-32 ${category.bg} rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner relative z-10`}
                    >
                      <motion.div variants={floatingIcon} animate="animate">
                        <Icon
                          size={64}
                          className={`${category.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>

                    {/* Pet Pill */}
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${category.color} bg-white px-4 py-1.5 rounded-full shadow-sm mb-4 border-2 border-gray-50 z-10`}
                    >
                      {category.pet}
                    </span>

                    {/* Text Content */}
                    <h2 className="text-3xl font-black text-text-charcoal mb-3 z-10">
                      {category.name}
                    </h2>
                    <p className="text-gray-500 font-medium mb-8 z-10 flex-grow">
                      {category.description}
                    </p>

                    {/* Action Arrow */}
                    <div
                      className={`w-14 h-14 rounded-full ${category.bg} flex items-center justify-center ${category.color} group-hover:bg-text-charcoal group-hover:text-white transition-colors duration-300 z-10`}
                    >
                      <ArrowRight
                        size={24}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
