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
  Loader2,
  Rabbit,
  ShoppingCart,
  Sparkles,
  Turtle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

// --- Types ---
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

// --- Animations ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// --- Sub-Component: Image Slider ---
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
    const timer = setInterval(
      () => setCurrentIndex((p) => (p + 1) % images.length),
      3500,
    );
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
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white scale-125" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const res = await fetch(
          `https://petplace-server-3.onrender.com/api/v1/item/${resolvedParams.id}`,
        );
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          const categoryName =
            typeof data.data.category === "object"
              ? data.data.category.pet
              : data.data.category;
          const relatedRes = await fetch(
            `https://petplace-server-3.onrender.com/api/v1/item?category=${categoryName}`,
          );
          const relatedData = await relatedRes.json();
          if (relatedData.success) {
            setRelatedItems(
              relatedData.data
                .filter((p: Product) => p.id !== data.data.id)
                .slice(0, 3),
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItemData();
  }, [resolvedParams.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (status === "unauthenticated" || !session?.user) {
      toast.error("Please login to join the pack! 🐾");
      return;
    }

    const currentUserId = (session.user as any).id;

    if (!currentUserId) {
      toast.error("Session error: User ID is missing.");
      return;
    }

    setIsAdding(true);
    const toastId = toast.loading("Tossing in your pack...");

    try {
      // 1. Send userId exactly as your Zod validation originally expected
      const payload = {
        userId: String(currentUserId), // Convert to string safely
        itemId: product.id,
        quantity: quantity,
      };

      const res = await fetch(
        "https://petplace-server-3.onrender.com/api/v1/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      // 2. Exact error logging
      if (data.success) {
        toast.success("🎉 Added to cart successfully!", { id: toastId });
      } else {
        // This will pop up the EXACT error from your backend (e.g., "Zod Error" or "Prisma Error")
        toast.error(`Failed: ${data.message || "Unknown Error"}`, {
          id: toastId,
        });
        console.error("Backend Error Details:", data);
      }
    } catch (error: any) {
      toast.error(`Network error: ${error.message}`, { id: toastId });
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
        <h2 className="text-2xl font-black text-text-charcoal uppercase tracking-widest">
          Sniffing out details...
        </h2>
      </div>
    );

  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  const Icon = iconMap[product.icon] || Sparkles;

  return (
    <div className="min-h-screen bg-sky-50/30 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-sky mb-8 bg-white px-5 py-2 rounded-full shadow-sm border-2 border-gray-100 transition-all"
        >
          <ArrowLeft size={18} /> Back to Armory
        </Link>

        <div className="bg-white rounded-[3rem] p-6 lg:p-10 border-4 border-white shadow-2xl flex flex-col lg:flex-row gap-12 items-center mb-20 overflow-hidden">
          <div className="w-full lg:w-1/2 aspect-square rounded-[2.5rem] bg-sky-50 flex items-center justify-center relative overflow-hidden border-4 border-gray-50 shadow-inner">
            {product.images?.length ? (
              <ProductImageSlider
                images={product.images}
                title={product.title}
              />
            ) : (
              <Icon
                size={180}
                className={`${product.color} drop-shadow-xl animate-pulse`}
              />
            )}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-black text-secondary-sun shadow-sm text-sm">
              <Sparkles size={16} className="inline mr-1" /> PREMIUM
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 space-y-6"
          >
            <span className="text-xs font-black text-primary-sky uppercase tracking-[0.2em] bg-sky-100 px-4 py-2 rounded-xl border-2 border-sky-200">
              {typeof product.category === "object"
                ? product.category.name
                : product.category}
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-text-charcoal tracking-tight leading-none">
              {product.title}
            </h1>
            <p className="text-4xl font-black text-primary-sky drop-shadow-sm">
              ${product.price.toFixed(2)}
            </p>

            <hr className="border-t-4 border-dotted border-gray-100" />
            <p className="text-lg font-medium text-gray-500 leading-relaxed">
              {product.fullDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center justify-between bg-gray-50 border-4 border-gray-100 rounded-2xl p-2 sm:w-40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 font-black text-xl text-gray-400 hover:text-primary-sky transition-colors"
                >
                  -
                </button>
                <span className="font-black text-2xl text-text-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 font-black text-xl text-gray-400 hover:text-primary-sky transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-secondary-sun text-text-charcoal font-black py-5 rounded-[1.5rem] flex justify-center items-center gap-3 border-b-8 border-orange-400 hover:translate-y-1 active:border-b-0 transition-all shadow-xl disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <>
                    <ShoppingCart size={24} /> Toss in Cart
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {relatedItems.length > 0 && (
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-text-charcoal border-b-4 border-gray-200 pb-4">
              The Pack Also Loved
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="bg-white p-5 rounded-[2rem] border-2 border-gray-100 shadow-[0_8px_0_#F3F4F6] hover:-translate-y-2 transition-all"
                >
                  <div
                    className={`${item.bg} aspect-video rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden`}
                  >
                    {item.images?.length ? (
                      <Image
                        src={item.images[0]}
                        alt="p"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Sparkles className={item.color} size={40} />
                    )}
                  </div>
                  <h3 className="font-black text-xl text-text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-primary-sky">
                      ${item.price}
                    </span>
                    <div className="w-10 h-10 bg-primary-sky text-white rounded-full flex items-center justify-center">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
