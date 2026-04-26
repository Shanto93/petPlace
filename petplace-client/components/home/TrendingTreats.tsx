"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Bird,
  Bone,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Sparkles,
  Turtle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ==========================================
// 1. Types & Icon Mapping
// ==========================================
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  icon: string;
  color: string;
  bg: string;
  images?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Bone,
  Cat,
  Dog,
  Fish,
  Bird,
  Rabbit,
  Turtle,
  Sparkles,
};

// ==========================================
// 2. Animations
// ==========================================
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const floatingIcon: Variants = {
  animate: {
    y: [0, -6, 0],
    rotate: [-4, 4, -4],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

// ==========================================
// 3. Main Component
// ==========================================
export default function TrendingTreats() {
  const [trendingItems, setTrendingItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const response = await fetch(
          "https://pet-place-server.vercel.app/api/v1/item",
        );
        const data = await response.json();

        if (data.success && data.data) {
          // Grab only the first 3 items using .slice(0, 3)
          setTrendingItems(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch trending items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Bone size={40} className="text-primary-sky animate-bounce mb-4" />
        <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">
          Sniffing out treats...
        </p>
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header Area */}
      <div className="flex justify-between items-end mb-10 border-b-4 border-gray-100 pb-4">
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl font-black text-text-charcoal flex items-center gap-3"
        >
          Trending Treats <Sparkles className="text-secondary-sun" size={28} />
        </motion.h2>
        <motion.div variants={fadeUp}>
          <Link
            href="/items"
            className="hidden sm:flex items-center gap-2 bg-primary-sky/10 text-primary-sky font-black px-5 py-2.5 rounded-full hover:bg-primary-sky hover:text-white transition-colors"
          >
            View All Armory <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {trendingItems.map((item) => {
          const Icon = iconMap[item.icon] || Sparkles;

          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="bg-white rounded-[2.5rem] p-5 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,1)] hover:shadow-[0_10px_0_rgba(135,206,235,0.4)] hover:border-primary-sky/30 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image / Icon Box */}
              <div
                className={`${item.bg} rounded-[2rem] aspect-[4/3] mb-5 flex items-center justify-center border-2 border-transparent group-hover:border-white transition-all relative overflow-hidden`}
              >
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <motion.div variants={floatingIcon} animate="animate">
                    <Icon
                      size={70}
                      className={`${item.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                )}
              </div>

              {/* Text Details */}
              <div className="flex-grow flex flex-col px-2">
                <h3 className="font-black text-xl mb-2 text-text-charcoal leading-tight line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & Action Button */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-100 px-2">
                <span className="font-black text-2xl text-text-charcoal">
                  ${item.price.toFixed(2)}
                </span>
                <Link
                  href={`/items/${item.id}`}
                  className="relative flex items-center justify-center px-6 py-3 bg-text-charcoal text-white rounded-full font-bold hover:bg-primary-sky transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  Details
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile "View All" Button */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/items"
          className="inline-flex items-center justify-center gap-2 w-full bg-primary-sky/10 text-primary-sky font-black px-6 py-4 rounded-full hover:bg-primary-sky hover:text-white transition-colors"
        >
          View All Armory <ArrowRight size={20} />
        </Link>
      </div>
    </motion.section>
  );
}
