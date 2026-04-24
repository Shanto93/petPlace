"use client";

import { motion, Variants } from "framer-motion";
import { Bone } from "lucide-react";
import Link from "next/link";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TrendingTreats() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="flex justify-between items-end mb-10">
        <motion.h2 variants={fadeUp} className="text-3xl font-bold">
          Trending Treats
        </motion.h2>
        <motion.div variants={fadeUp}>
          <Link
            href="/items"
            className="text-primary-sky font-bold hover:underline hidden sm:block"
          >
            View All
          </Link>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            variants={fadeUp}
            className="premium-card group flex flex-col"
          >
            <div className="bg-gray-100 rounded-xl aspect-video mb-4 flex items-center justify-center overflow-hidden">
              <Bone
                size={60}
                className="text-gray-300 group-hover:text-primary-sky transition-colors duration-500 group-hover:rotate-12"
              />
            </div>
            <h3 className="font-bold text-xl mb-1">Organic Bone Treat</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">
              A healthy, delicious chew for your best friend.
            </p>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-black text-xl text-primary-sky">
                $24.99
              </span>
              <Link
                href={`/items/${item}`}
                className="px-4 py-2 bg-text-charcoal text-white rounded-lg font-bold text-sm hover:bg-primary-sky transition-colors"
              >
                Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
