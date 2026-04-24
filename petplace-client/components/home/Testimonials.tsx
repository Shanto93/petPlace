"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { PawPrint, Quote, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Existing Stagger/Fade variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// New: Carousel/Slider animation variants
const sliderVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 100, damping: 20 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.3, delay: 0.1 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
    transition: {
      x: { duration: 0.3 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

// New: Playful/Cute Cartoon floating animation for card content
const cartoonFloat: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 1.5, -1.5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Testimonials() {
  // Extracting existing review data
  const reviews = [
    {
      text: "The quality is unmatched. My golden retriever is obsessed with the organic toys!",
      author: "Sarah & Buster",
    },
    {
      text: "Fastest shipping and the packaging was absolutely beautiful. Elite service.",
      author: "Mike & Whiskers",
    },
    {
      text: "The quality is unmatched. My golden retriever is obsessed with the organic toys!",
      author: "Sarah & Buster",
    },
    {
      text: "Fastest shipping and the packaging was absolutely beautiful. Elite service.",
      author: "Mike & Whiskers",
    },
  ];

  // Carousel State Management
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logic (Required: changes index every 6 seconds)
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setDirection(1); // Auto-scroll always goes forward
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 6000); // 6 second interval

    return () => {
      // Clean up interval on component unmount
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [reviews.length]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      // Stacking styling:speech bubble shape, borders, shadow
      className="bg-white rounded-[3rem] p-10 md:p-16 border-4 border-secondary-sun/40 shadow-2xl relative"
    >
      {/* Cartoon "speech bubble" thought tail */}
      <div className="absolute top-0 left-12 -translate-y-1/2 bg-secondary-sun text-text-charcoal font-black px-6 py-2 rounded-full rotate-[-7deg] flex items-center gap-2">
        <PawPrint className="text-text-charcoal" size={20} />
        Happy Tails
      </div>

      <motion.h2
        variants={fadeUp}
        className="text-4xl font-extrabold text-center mb-16 text-text-charcoal tracking-tight"
      >
        What Our Pack Says
      </motion.h2>

      {/* Horizontal Overflow Viewport for Slider */}
      <div className="relative overflow-hidden min-h-[300px]">
        {/* framer-motion AnimatePresence enables exit animations */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={sliderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Stack items horizontally
            className="flex flex-col items-center justify-center text-center absolute w-full gap-6 px-4"
          >
            {/* Indiviudal slide card with floating cartoon effect */}
            <motion.div
              variants={cartoonFloat}
              animate="animate"
              // Preserving user styling classes (bg-bg-cream, text-primary-sky)
              className="p-8 bg-bg-cream rounded-[2.5rem] border-2 border-gray-200/50 shadow-lg relative flex flex-col items-center gap-6"
            >
              {/* Cute Icons: Large quote icon */}
              <Quote
                className="absolute -top-4 -left-4 text-secondary-sun rotate-[-15deg] opacity-60"
                size={40}
                strokeWidth={3}
              />

              {/* Enhanced Star Rating: Larger stars */}
              <div className="flex gap-1 text-secondary-sun mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={28} fill="currentColor" strokeWidth={1} />
                ))}
              </div>

              {/* Preserving user text and author style */}
              <p className="text-gray-700 italic font-semibold leading-relaxed px-4 text-lg">
                &quot;{reviews[index].text}&quot;
              </p>

              <p className="font-bold text-primary-sky text-xl">
                — {reviews[index].author}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
