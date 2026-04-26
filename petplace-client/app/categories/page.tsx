/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";

// ==========================================
// 1. Types & Icon Mapping
// ==========================================
interface Category {
  id: string;
  name: string;
  pet: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  borderColor: string;
  shadow: string;
  isDeleted: boolean;
}

// Maps the string from the database to the actual Lucide component
const iconMap: Record<string, any> = {
  Dog,
  Cat,
  Bird,
  Fish,
  Rabbit,
  Turtle,
  Sparkles,
};

// ==========================================
// 2. Animations
// ==========================================
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

// ==========================================
// 3. Main Component
// ==========================================
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories Data from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://petplace-server-3.onrender.com/api/v1/category",
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50/50">
        <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
        <h2 className="text-2xl font-black text-text-charcoal">
          Gathering the Kingdoms...
        </h2>
      </div>
    );
  }

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
        {categories.length === 0 ? (
          <div className="text-center text-gray-500 font-medium mt-10">
            No categories found. Please add some from the dashboard!
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category) => {
              // Resolve the icon dynamically from the map
              const Icon = iconMap[category.icon] || Sparkles;

              return (
                <motion.div key={category.id} variants={popInCard}>
                  {/* DYNAMIC LINK: Sends the category parameter to the items page */}
                  <Link
                    href={`/items?category=${category.pet}`}
                    className="block outline-none group"
                  >
                    <div
                      className={`bg-white rounded-[3rem] p-8 border-4 ${category.borderColor} ${category.shadow} hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-none transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden`}
                    >
                      <div
                        className={`absolute -top-10 -right-10 w-40 h-40 ${category.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`}
                      />

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

                      <span
                        className={`text-xs font-black uppercase tracking-widest ${category.color} bg-white px-4 py-1.5 rounded-full shadow-sm mb-4 border-2 border-gray-50 z-10`}
                      >
                        {category.pet}
                      </span>

                      <h2 className="text-3xl font-black text-text-charcoal mb-3 z-10">
                        {category.name}
                      </h2>
                      <p className="text-gray-500 font-medium mb-8 z-10 flex-grow">
                        {category.description}
                      </p>

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
        )}
      </div>
    </div>
  );
}
