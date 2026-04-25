"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Bird,
  Bone,
  Cat,
  Dog,
  Filter,
  Fish,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// 1. Mock Data
const mockProducts = [
  {
    id: "1",
    title: "Premium Organic Dog Bone",
    category: "Dogs",
    price: 24.99,
    description: "A healthy, delicious chew for your best friend.",
    icon: Bone,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    id: "2",
    title: "Luxury Cat Tree Tower",
    category: "Cats",
    price: 129.99,
    description: "Multi-level entertainment and resting spot for felines.",
    icon: Cat,
    color: "text-orange-500",
    bg: "bg-orange-100",
  },
  {
    id: "3",
    title: "Tropical Fish Flakes",
    category: "Fish",
    price: 14.5,
    description: "Color-enhancing daily nutrition for tropical aquariums.",
    icon: Fish,
    color: "text-teal-500",
    bg: "bg-teal-100",
  },
  {
    id: "4",
    title: "Interactive Bird Mirror",
    category: "Birds",
    price: 9.99,
    description: "Keep your feathered friend entertained for hours.",
    icon: Bird,
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
  {
    id: "5",
    title: "Cozy Memory Foam Bed",
    category: "Dogs",
    price: 59.99,
    description: "Orthopedic support for restful, elite sleep.",
    icon: Dog,
    color: "text-purple-500",
    bg: "bg-purple-100",
  },
  {
    id: "6",
    title: "Automatic Laser Toy",
    category: "Cats",
    price: 34.99,
    description: "Endless chasing fun with safe, automated laser patterns.",
    icon: Cat,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    id: "7",
    title: "Gourmet Parrot Seed Mix",
    category: "Birds",
    price: 18.99,
    description: "Nutrient-rich blend for vibrant feathers and health.",
    icon: Bird,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  {
    id: "8",
    title: "Aquarium Coral Decor",
    category: "Fish",
    price: 45.0,
    description: "Premium glowing coral reef replica for tanks.",
    icon: Fish,
    color: "text-indigo-500",
    bg: "bg-indigo-100",
  },
];

const categories = ["All", "Dogs", "Cats", "Birds", "Fish"];

// 2. Enhanced Animation Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const popInCard: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 250, damping: 15 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const floatingIcon: Variants = {
  animate: {
    y: [0, -8, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const peekPet: Variants = {
  animate: {
    y: [20, -5, 20],
    rotate: [-3, 3, -3],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(150);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, maxPrice]);

  return (
    <div className="min-h-screen bg-sky-50/50 pb-20 pt-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Peeking Pet Header */}
        <div className="relative text-center mb-16 max-w-3xl mx-auto">
          <div className="relative h-20 w-32 mx-auto mb-[-2rem] z-0 overflow-hidden">
            <motion.div
              variants={peekPet}
              animate="animate"
              className="absolute bottom-0 w-full flex justify-center text-primary-sky drop-shadow-md"
            >
              <Dog size={80} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_12px_0_rgba(135,206,235,0.15)] border-2 border-primary-sky/10"
          >
            <div className="inline-flex items-center justify-center gap-2 bg-secondary-sun/20 text-secondary-sun font-black px-4 py-2 rounded-full mb-4 shadow-sm">
              <Sparkles size={16} /> Treat Armory
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-charcoal tracking-tight mb-2">
              Find The <span className="text-primary-sky">Perfect</span> Toy
            </h1>
            <p className="text-gray-500 font-medium">
              Browse our elite collection of pampered goodies.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* REFINED SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full lg:w-1/4 sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_0_rgba(229,231,235,0.6)] border-2 border-gray-100 space-y-8 z-10"
          >
            <div className="flex items-center gap-3 text-text-charcoal font-black text-xl pb-4 border-b-2 border-gray-100">
              <div className="bg-primary-sky/10 p-2 rounded-xl text-primary-sky">
                <Filter size={24} />
              </div>
              Filters
            </div>

            <div className="space-y-3">
              <label className="font-bold text-xs text-gray-400 uppercase tracking-widest pl-2">
                Search
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Squeaky toys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-[1.5rem] text-text-charcoal font-semibold outline-none border-2 border-gray-100 focus:border-primary-sky focus:ring-4 focus:ring-primary-sky/10 transition-all bg-gray-50 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-bold text-xs text-gray-400 uppercase tracking-widest pl-2">
                Pet Type
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-[1rem] text-sm font-bold transition-all border-b-2 active:scale-95 ${
                      selectedCategory === cat
                        ? "bg-primary-sky border-blue-500 text-white shadow-sm translate-y-[2px]"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-text-charcoal"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t-2 border-gray-100">
              <div className="flex justify-between items-center pl-2">
                <label className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                  Max Price
                </label>
                <span className="font-black text-lg text-primary-sky bg-primary-sky/10 px-3 py-1 rounded-xl">
                  ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-sky h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </motion.aside>

          {/* MAIN GRID */}
          <div className="w-full lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-[3rem] border-4 border-dashed border-primary-sky/30 text-center p-8 shadow-sm"
              >
                <motion.div
                  variants={peekPet}
                  animate="animate"
                  className="mb-6 text-gray-300"
                >
                  <Dog size={80} />
                </motion.div>
                <h3 className="text-3xl font-black text-text-charcoal mb-3">
                  Oh no! Empty bowl!
                </h3>
                <p className="text-gray-500 font-medium mb-8 text-lg">
                  We couldn&apos;t find any treats matching those filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setMaxPrice(150);
                  }}
                  className="bg-secondary-sun text-text-charcoal font-black px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform border-b-4 border-orange-400 shadow-md flex items-center gap-2"
                >
                  <Search size={20} /> Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => {
                    const Icon = product.icon;
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        variants={popInCard}
                        className="bg-white rounded-[2rem] p-5 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,1)] hover:shadow-[0_10px_0_rgba(135,206,235,0.4)] hover:border-primary-sky/30 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                      >
                        {/* Image Area */}
                        <div
                          className={`${product.bg} rounded-[1.5rem] aspect-[4/3] mb-5 flex items-center justify-center border-2 border-transparent group-hover:border-white transition-all relative overflow-hidden`}
                        >
                          <motion.div variants={floatingIcon} animate="animate">
                            <Icon
                              size={80}
                              className={`${product.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                              strokeWidth={1.5}
                            />
                          </motion.div>

                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-text-charcoal uppercase tracking-widest shadow-sm">
                            {product.category}
                          </div>
                        </div>

                        {/* Details Area */}
                        <div className="flex-grow flex flex-col">
                          <h3 className="font-black text-xl mb-2 text-text-charcoal leading-tight line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* REFINED Price & Action Area */}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Price
                            </span>
                            <span className="font-black text-2xl text-text-charcoal">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          {/* REFINED DETAILS BUTTON: Sleek, expandable pill */}
                          <Link
                            href={`/items/${product.id}`}
                            className="relative flex items-center justify-center w-12 h-12 bg-primary-sky text-white rounded-full font-bold hover:w-32 hover:px-4 transition-all duration-300 ease-out shadow-sm hover:shadow-md group/btn overflow-hidden"
                          >
                            <span className="absolute opacity-0 group-hover/btn:opacity-100 group-hover/btn:relative group-hover/btn:mr-2 transition-opacity duration-300 whitespace-nowrap text-sm">
                              View
                            </span>
                            <ArrowRight
                              size={20}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
