"use client";

import { motion, Variants } from "framer-motion";
import { Bone, Dog, Heart, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import Link from "next/link";

// Entrance animation for the entire footer
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// Infinite floating animations for cute cartoon props
const floatSlow: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const pulseHeart: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Footer() {
  return (
    <footer className="relative bg-bg-cream pt-24 pb-8 mt-20 border-t-4 border-primary-sky/20 overflow-hidden">
      {/* Decorative Wavy Top Edge (Cartoon Cloud Vibe) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 text-white">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[40px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* Floating Cartoon Elements */}
      <motion.div
        variants={floatSlow}
        animate="animate"
        className="absolute top-10 left-[10%] text-primary-sky/20"
      >
        <Bone size={60} className="rotate-[30deg]" />
      </motion.div>
      <motion.div
        variants={floatSlow}
        animate="animate"
        className="absolute bottom-20 right-[5%] text-secondary-sun/30"
        style={{ animationDelay: "1s" }}
      >
        <Sparkles size={80} className="rotate-[-15deg]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={fadeUp} className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 bg-white rounded-2xl border-4 border-primary-sky shadow-[0_4px_0_rgba(135,206,235,1)] flex items-center justify-center group-hover:-translate-y-1 group-active:translate-y-1 group-active:shadow-none transition-all">
                <Dog className="text-primary-sky" size={28} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black text-text-charcoal tracking-tight">
                Pet<span className="text-primary-sky">Palace</span>
              </span>
            </Link>
            <p className="text-gray-600 font-medium leading-relaxed">
              Elite pet supplies with a magical touch. Because your best friend
              deserves the royal treatment!
            </p>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={fadeUp}>
            <h3 className="font-black text-xl mb-6 text-text-charcoal flex items-center gap-2">
              <Sparkles size={20} className="text-secondary-sun" /> Explore
            </h3>
            <ul className="space-y-4 font-bold text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-sky hover:translate-x-2 transition-all flex items-center gap-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/items"
                  className="hover:text-primary-sky hover:translate-x-2 transition-all flex items-center gap-2"
                >
                  Shop Treats
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-primary-sky hover:translate-x-2 transition-all flex items-center gap-2"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-sky hover:translate-x-2 transition-all flex items-center gap-2"
                >
                  Our Story
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={fadeUp}>
            <h3 className="font-black text-xl mb-6 text-text-charcoal">
              Say Hello!
            </h3>
            <ul className="space-y-4 font-medium text-gray-600">
              <li className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-sky/30 transition-colors">
                <div className="w-8 h-8 bg-sky-100 text-primary-sky rounded-xl flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span className="text-sm font-bold">
                  123 Magic Lane, Pet City
                </span>
              </li>
              <li className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-sky/30 transition-colors">
                <div className="w-8 h-8 bg-sky-100 text-primary-sky rounded-xl flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-bold">1-800-ROYAL-PET</span>
              </li>
              <li className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-sky/30 transition-colors">
                <div className="w-8 h-8 bg-sky-100 text-primary-sky rounded-xl flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-bold">woof@petpalace.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Column (Updated with Native SVGs) */}
          <motion.div variants={fadeUp}>
            <h3 className="font-black text-xl mb-6 text-text-charcoal">
              Follow the Pack
            </h3>
            <div className="flex gap-4">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  ),
                  color:
                    "hover:bg-blue-500 hover:border-blue-600 hover:text-white",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  ),
                  color:
                    "hover:bg-sky-400 hover:border-sky-500 hover:text-white",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ),
                  color:
                    "hover:bg-pink-500 hover:border-pink-600 hover:text-white",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-14 h-14 bg-white text-text-charcoal rounded-2xl border-4 border-gray-200 shadow-[0_6px_0_rgba(229,231,235,1)] flex items-center justify-center hover:-translate-y-2 hover:shadow-[0_8px_0_rgba(0,0,0,0.1)] active:translate-y-2 active:shadow-none transition-all ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar: FIXED HYDRATION BUG (Changed <p> to <div> and <motion.div> to <motion.span>) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t-4 border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 font-bold"
        >
          <div>
            © {new Date().getFullYear()} PetPalace Elite. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            Made with{" "}
            <motion.span variants={pulseHeart} animate="animate" className="inline-block">
              <Heart size={18} className="text-red-500 fill-red-500" />
            </motion.span>{" "}
            and lots of treats.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}