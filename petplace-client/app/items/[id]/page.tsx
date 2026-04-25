/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bird,
  Bone,
  Cat,
  Dog,
  Fish,
  Rabbit,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Turtle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

// ==========================================
// 1. Types & Icon Mapping
// ==========================================
interface Category {
  id: string;
  pet: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  fullDescription: string;
  icon: string;
  color: string;
  bg: string;
  images?: string[];
  category: Category | string;
}

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
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const floatingIcon: Variants = {
  animate: {
    y: [0, -12, 0],
    rotate: [-4, 4, -4],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
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
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative w-full h-full group overflow-hidden rounded-[inherit]">
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
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white scale-125 shadow-md"
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
// 4. Main Details Page Component
// ==========================================
export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch Product and Related Items
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/item/${resolvedParams.id}`,
        );
        const data = await res.json();

        if (data.success && data.data) {
          const currentItem = data.data;
          setProduct(currentItem);

          const categoryName =
            typeof currentItem.category === "object"
              ? currentItem.category.pet
              : currentItem.category;
          const relatedRes = await fetch(
            `http://localhost:5000/api/v1/item?category=${categoryName}`,
          );
          const relatedData = await relatedRes.json();

          if (relatedData.success) {
            const filteredRelated = relatedData.data
              .filter((p: Product) => p.id !== currentItem.id)
              .slice(0, 3);
            setRelatedItems(filteredRelated);
          }
        }
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemData();
  }, [resolvedParams.id]);

  // ==========================================
  // REAL BACKEND CART INTEGRATION
  // ==========================================
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    try {
      // Using the exact user ID you successfully tested!
      const currentUserId = "79452816-88f8-485f-9524-07455c8dc1fe";

      const payload = {
        userId: currentUserId,
        itemId: product.id,
        quantity: quantity,
      };

      const res = await fetch("http://localhost:5000/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Tossed in cart successfully!");
        router.push("/cart");
      } else {
        alert("Failed to add to cart: " + data.message);
      }
    } catch (error) {
      console.error("Cart error:", error);
      alert("Something went wrong communicating with the server!");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-sky-50/50">
        <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
        <h2 className="text-2xl font-black text-text-charcoal">
          Sniffing out details...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-sky-50/50 text-center">
        <Dog size={100} className="text-gray-300 mb-6" />
        <h1 className="text-4xl font-black text-text-charcoal mb-4">
          Item Not Found
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          This toy might have rolled under the couch!
        </p>
        <Link
          href="/items"
          className="px-6 py-3 rounded-full bg-primary-sky text-white font-bold hover:scale-105 transition-transform"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const Icon = iconMap[product.icon] || Sparkles;
  const categoryDisplay =
    typeof product.category === "object"
      ? product.category.pet
      : product.category;

  return (
    <div className="min-h-screen bg-sky-50/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/items"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-sky font-bold transition-colors bg-white px-4 py-2 rounded-full shadow-sm border-2 border-gray-100"
          >
            <ArrowLeft size={18} /> Back to Armory
          </Link>
        </motion.div>

        {/* MAIN PRODUCT SECTION */}
        <div className="bg-white rounded-[3rem] p-6 lg:p-10 border-4 border-white shadow-[0_12px_0_rgba(229,231,235,0.4)] flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-sky/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Image / Icon Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            className={`w-full lg:w-1/2 ${product.bg} rounded-[2.5rem] aspect-square flex items-center justify-center relative border-4 border-transparent hover:border-primary-sky/20 transition-all duration-500 shadow-inner group`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-60 z-0" />

            {product.images && product.images.length > 0 ? (
              <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden p-2">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-sm border-4 border-white">
                  <ProductImageSlider
                    images={product.images}
                    title={product.title}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                variants={floatingIcon}
                animate="animate"
                className="relative z-10"
              >
                <Icon
                  size={180}
                  strokeWidth={1}
                  className={`${product.color} drop-shadow-xl group-hover:scale-110 transition-transform duration-500`}
                />
              </motion.div>
            )}

            {/* Elite Badge */}
            <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm border-2 border-white px-4 py-2 rounded-full flex items-center gap-2 font-black text-secondary-sun shadow-sm">
              <Sparkles size={16} /> Premium
            </div>
          </motion.div>

          {/* Right Column: Product Details */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 space-y-6 relative z-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-primary-sky uppercase tracking-widest bg-primary-sky/10 px-4 py-2 rounded-xl border-2 border-primary-sky/20">
                {categoryDisplay}
              </span>
              <div className="flex gap-1 text-secondary-sun">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
                <span className="text-gray-400 text-sm font-bold ml-2">
                  (128)
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-text-charcoal tracking-tight leading-[1.1] mb-4">
                {product.title}
              </h1>
              <span className="font-black text-4xl text-primary-sky drop-shadow-sm flex items-center gap-2">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <hr className="border-t-4 border-dotted border-gray-100" />

            <p className="text-lg font-medium text-gray-500 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Trust Indicators */}
            <div className="flex gap-4 py-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border-2 border-gray-100">
                <ShieldCheck size={16} className="text-green-500" /> Organic
                Certified
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border-2 border-gray-100">
                <Truck size={16} className="text-blue-500" /> Fast Shipping
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center bg-gray-50 border-4 border-gray-100 rounded-[1.5rem] p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center font-black text-xl text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-xl text-text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-black text-xl text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-secondary-sun text-text-charcoal font-black text-xl rounded-[1.5rem] flex items-center justify-center gap-3 border-b-4 border-orange-400 hover:scale-[1.02] hover:shadow-lg active:scale-95 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={24} />
                  </motion.div>
                ) : (
                  <>
                    <ShoppingCart size={24} /> Toss in Cart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* RELATED ITEMS SECTION */}
        {relatedItems.length > 0 && (
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b-4 border-gray-200 pb-4">
              <h2 className="text-3xl font-black text-text-charcoal">
                The Pack Also Loved
              </h2>
              <Sparkles className="text-secondary-sun" size={28} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedItems.map((relItem) => {
                const RelIcon = iconMap[relItem.icon] || Sparkles;
                return (
                  <motion.div
                    key={relItem.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={popInCard}
                    className="bg-white rounded-[2rem] p-5 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,1)] hover:shadow-[0_10px_0_rgba(135,206,235,0.4)] hover:border-primary-sky/30 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div
                      className={`${relItem.bg} rounded-[1.5rem] aspect-[4/3] mb-5 flex items-center justify-center border-2 border-transparent group-hover:border-white transition-all relative overflow-hidden`}
                    >
                      {relItem.images && relItem.images.length > 0 ? (
                        <ProductImageSlider
                          images={relItem.images}
                          title={relItem.title}
                        />
                      ) : (
                        <RelIcon
                          size={70}
                          className={`${relItem.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                          strokeWidth={1.5}
                        />
                      )}
                    </div>

                    <div className="flex-grow flex flex-col">
                      <h3 className="font-black text-xl mb-2 text-text-charcoal leading-tight line-clamp-2">
                        {relItem.title}
                      </h3>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-100">
                      <span className="font-black text-2xl text-text-charcoal">
                        ${relItem.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/items/${relItem.id}`}
                        className="relative flex items-center justify-center w-12 h-12 bg-primary-sky text-white rounded-full font-bold hover:w-28 hover:px-4 transition-all duration-300 ease-out shadow-sm group/btn overflow-hidden"
                      >
                        <span className="absolute opacity-0 group-hover/btn:opacity-100 group-hover/btn:relative group-hover/btn:mr-2 transition-opacity duration-300 text-sm">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
