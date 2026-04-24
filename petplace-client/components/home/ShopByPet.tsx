"use client";

import { motion, Variants } from "framer-motion";
import { Bird, Cat, Dog, Fish } from "lucide-react";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ShopByPet() {
  const categories = [
    { icon: <Dog size={40} />, name: "Dogs", color: "text-blue-500" },
    { icon: <Cat size={40} />, name: "Cats", color: "text-orange-500" },
    { icon: <Bird size={40} />, name: "Birds", color: "text-green-500" },
    { icon: <Fish size={40} />, name: "Fish", color: "text-purple-500" },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-bold text-center mb-10"
      >
        Shop by Pet
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="premium-card flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-primary-sky/5 group text-center"
          >
            <div
              className={`${cat.color} group-hover:scale-110 transition-transform duration-300`}
            >
              {cat.icon}
            </div>
            <h3 className="font-bold text-lg">{cat.name}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
