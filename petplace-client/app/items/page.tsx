/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  AlertCircle, // Added for the error state UI
  ArrowRight,
  Bird,
  Bone,
  Cat,
  Dog,
  Filter,
  Fish,
  Rabbit,
  Search,
  Sparkles,
  Turtle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

// ==========================================
// 1. Types & Icon Mapping
// ==========================================
interface Category {
  id: string;
  pet: string;
  name: string;
  description: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  icon: string;
  color: string;
  bg: string;
  images?: string[];
  category: Category | string | null; // Added null for extra safety
}

// Maps the string from the database to the actual Lucide component
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

const categories = [
  "All",
  "Dogs",
  "Cats",
  "Birds",
  "Fish",
  "Small Pets",
  "Reptiles",
];

// ==========================================
// 2. Animations
// ==========================================
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

// ==========================================
// 3. Image Slider Component (Auto-scroll)
// ==========================================
const ProductImageSlider = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only auto-slide if there is more than 1 image
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Slides every 3 seconds

    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${title} - View ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            priority={currentIndex === 0} // Prioritize loading the first image
          />
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white scale-125 shadow-sm"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. Main Shop Content Component
// ==========================================
function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  // State for products, loading, AND errors
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // NEW: Error state

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(150);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // FIXED: Using an environment variable, falling back to port 5000 for local backend
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://petplace-server-3.onrender.com";
        const response = await fetch(`${API_URL}/api/v1/item`);

        // FIXED: Catch 404s and server errors BEFORE trying to parse JSON
        if (!response.ok) {
          throw new Error(`Server responded with a ${response.status} status.`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error("Failed to load products from database.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(
          "We couldn't connect to the server. Please ensure your backend is running.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search filter
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      // FIXED: Safely extract category name, checking for null to prevent crashes
      const categoryName =
        typeof item.category === "object" && item.category !== null
          ? item.category.pet
          : item.category || "Unknown";

      const matchesCategory =
        selectedCategory === "All" || categoryName === selectedCategory;

      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, maxPrice]);

  // Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50/50">
        <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
        <h2 className="text-2xl font-black text-text-charcoal">
          Fetching Treats from Database...
        </h2>
      </div>
    );
  }

  // FIXED: New Error UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50/50 p-6 text-center">
        <AlertCircle size={60} className="text-red-400 mb-4" />
        <h2 className="text-3xl font-black text-text-charcoal mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-500 font-medium max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/50 pb-20 pt-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Peeking Pet Header */}
        <div className="relative text-center mb-16 max-w-3xl mx-auto">
          <div className="relative h-20 w-32 mx-auto mb-[-2rem] z-20 overflow-hidden">
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
          {/* SIDEBAR FILTERS */}
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
                    const Icon = iconMap[product.icon] || Sparkles;

                    // FIXED: Safe category display
                    const categoryDisplay =
                      typeof product.category === "object" &&
                      product.category !== null
                        ? product.category.pet
                        : product.category || "General";

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        variants={popInCard}
                        className="bg-white rounded-[2rem] p-5 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,1)] hover:shadow-[0_10px_0_rgba(135,206,235,0.4)] hover:border-primary-sky/30 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                      >
                        <div
                          className={`${product.bg || "bg-gray-100"} rounded-[1.5rem] aspect-[4/3] mb-5 flex items-center justify-center border-2 border-transparent group-hover:border-white transition-all relative overflow-hidden`}
                        >
                          {/* DYNAMIC IMAGE SLIDER OR FALLBACK ICON */}
                          {product.images && product.images.length > 0 ? (
                            <ProductImageSlider
                              images={product.images}
                              title={product.title}
                            />
                          ) : (
                            <motion.div
                              variants={floatingIcon}
                              animate="animate"
                            >
                              <Icon
                                size={80}
                                className={`${product.color || "text-gray-400"} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                                strokeWidth={1.5}
                              />
                            </motion.div>
                          )}

                          {/* Category Badge overlaying the top corner */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-text-charcoal uppercase tracking-widest shadow-sm z-20">
                            {categoryDisplay}
                          </div>
                        </div>

                        <div className="flex-grow flex flex-col">
                          <h3 className="font-black text-xl mb-2 text-text-charcoal leading-tight line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Price
                            </span>
                            <span className="font-black text-2xl text-text-charcoal">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

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

// ==========================================
// 5. Main Export Wrapped in Suspense
// ==========================================
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50/50">
          <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
          <h2 className="text-2xl font-black text-text-charcoal">
            Fetching Treats...
          </h2>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
