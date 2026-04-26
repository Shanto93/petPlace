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

// Carousel/Slider animation variants
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

// Playful/Cute Cartoon floating animation
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

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 6000);

    return () => {
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
      // UI FIX: Added max-w-4xl to prevent full-screen stretching on desktop
      // UI FIX: Reduced md:p-16 to md:p-12 so the box isn't unnecessarily tall
      className="max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-12 border-4 border-secondary-sun/40 shadow-2xl relative mx-4 lg:mx-auto my-10"
    >
      <div className="absolute top-0 left-6 sm:left-12 -translate-y-1/2 bg-secondary-sun text-text-charcoal font-black px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base rounded-full rotate-[-7deg] flex items-center gap-2">
        <PawPrint className="text-text-charcoal w-4 h-4 sm:w-5 sm:h-5" />
        Happy Tails
      </div>

      <motion.h2
        variants={fadeUp}
        // UI FIX: Tighter bottom margin on large screens
        className="text-3xl md:text-4xl font-extrabold text-center mb-10 md:mb-12 text-text-charcoal tracking-tight mt-4"
      >
        What Our Pack Says
      </motion.h2>

      {/* UI FIX: Reduced minimum height for medium/large screens (md:min-h-[250px]) */}
      <div className="relative overflow-hidden min-h-[350px] sm:min-h-[300px] md:min-h-[250px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={sliderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center text-center absolute w-full gap-6 px-2 sm:px-4"
          >
            <motion.div
              variants={cartoonFloat}
              animate="animate"
              // UI FIX: Shrunk the maximum width of the inner card from max-w-2xl to max-w-xl
              className="p-6 sm:p-8 w-full max-w-[95%] sm:max-w-lg md:max-w-xl bg-bg-cream rounded-[2rem] sm:rounded-[2.5rem] border-2 border-gray-200/50 shadow-lg relative flex flex-col items-center gap-4 sm:gap-6"
            >
              <Quote
                className="absolute -top-3 -left-2 sm:-top-4 sm:-left-4 text-secondary-sun rotate-[-15deg] opacity-60 w-8 h-8 sm:w-10 sm:h-10"
                strokeWidth={3}
              />

              <div className="flex gap-1 text-secondary-sun mb-1 sm:mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 sm:w-7 sm:h-7"
                    fill="currentColor"
                    strokeWidth={1}
                  />
                ))}
              </div>

              <p className="text-gray-700 italic font-semibold leading-relaxed px-0 sm:px-4 text-base sm:text-lg">
                &quot;{reviews[index].text}&quot;
              </p>

              <p className="font-bold text-primary-sky text-lg sm:text-xl">
                — {reviews[index].author}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
