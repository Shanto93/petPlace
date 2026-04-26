"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Bone,
  Cat,
  CreditCard,
  Dog,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ==========================================
// 1. Types based on your Backend JSON
// ==========================================
interface Product {
  id: string;
  title: string;
  price: number;
  images?: string[];
  icon: string;
  color: string;
  bg: string;
}

interface CartItem {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  item: Product;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = { Bone, Cat, Dog, Sparkles };

// ==========================================
// 2. Animations
// ==========================================
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const popInCard: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
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
// 3. Main Cart Component
// ==========================================
export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Optional: Add a loading state for the delete button to prevent spam clicking
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Fetch Cart Data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const currentUserId = "79452816-88f8-485f-9524-07455c8dc1fe";

        const res = await fetch(
          `https://pet-place-server.vercel.app/api/v1/cart/user/${currentUserId}`,
        );
        const data = await res.json();

        if (data.success) {
          setCartItems(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ==========================================
  // REAL BACKEND DELETE INTEGRATION
  // ==========================================
  const handleDelete = async (cartItemId: string) => {
    // Prevent multiple clicks while already deleting
    if (isDeletingId) return;

    setIsDeletingId(cartItemId);

    try {
      const res = await fetch(
        `https://pet-place-server.vercel.app/api/v1/cart/${cartItemId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (data.success) {
        // Remove the item from the local state so it instantly disappears from the UI
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== cartItemId),
        );
      } else {
        alert("Failed to delete item: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Something went wrong communicating with the server.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Calculate Totals
  const subtotal = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-sky-50/50">
        <Dog size={60} className="text-primary-sky animate-bounce mb-4" />
        <h2 className="text-2xl font-black text-text-charcoal">
          Fetching your cart...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/50 pb-20 pt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Peeking Pet Header */}
        <div className="relative text-center mb-16 max-w-3xl mx-auto">
          <div className="relative h-20 w-32 mx-auto mb-[-2rem] z-20 overflow-hidden">
            <motion.div
              variants={peekPet}
              animate="animate"
              className="absolute bottom-0 w-full flex justify-center text-primary-sky drop-shadow-md"
            >
              <Cat size={80} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_12px_0_rgba(135,206,235,0.15)] border-2 border-primary-sky/10"
          >
            <div className="inline-flex items-center justify-center gap-2 bg-secondary-sun/20 text-secondary-sun font-black px-4 py-2 rounded-full mb-4 shadow-sm">
              <ShoppingBag size={16} /> Shopping Cart
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-charcoal tracking-tight mb-2">
              Your <span className="text-primary-sky">Treats</span>
            </h1>
            <p className="text-gray-500 font-medium">
              Review your items before you checkout.
            </p>
          </motion.div>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[40vh] bg-white rounded-[3rem] border-4 border-dashed border-primary-sky/30 text-center p-8 shadow-sm"
          >
            <ShoppingBag size={80} className="text-gray-300 mb-6" />
            <h3 className="text-3xl font-black text-text-charcoal mb-3">
              Your cart is empty!
            </h3>
            <Link
              href="/items"
              className="bg-secondary-sun text-text-charcoal font-black px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform border-b-4 border-orange-400 shadow-md mt-4 inline-block"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Cart Items */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="w-full lg:w-2/3 space-y-6"
            >
              {cartItems.map((cartItem) => {
                const product = cartItem.item;
                const FallbackIcon = iconMap[product.icon] || Sparkles;

                return (
                  <motion.div
                    key={cartItem.id}
                    variants={popInCard}
                    className="bg-white rounded-[2rem] p-4 sm:p-6 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,0.6)] flex flex-col sm:flex-row items-center gap-6 relative group"
                  >
                    {/* Image Area */}
                    <div
                      className={`w-32 h-32 shrink-0 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center shadow-sm border-4 border-transparent group-hover:border-primary-sky/20 transition-all ${product.bg}`}
                    >
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <FallbackIcon
                          size={50}
                          className={`${product.color} drop-shadow-sm`}
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow text-center sm:text-left">
                      <Link
                        href={`/items/${product.id}`}
                        className="font-black text-2xl text-text-charcoal hover:text-primary-sky transition-colors line-clamp-1 mb-1"
                      >
                        {product.title}
                      </Link>
                      <p className="font-bold text-gray-400 mb-3">
                        Unit Price: ${product.price.toFixed(2)}
                      </p>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="inline-flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 font-black text-text-charcoal shadow-inner">
                          Qty: {cartItem.quantity}
                        </div>
                        <button
                          onClick={() => handleDelete(cartItem.id)}
                          disabled={isDeletingId === cartItem.id}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {/* Spin the trash icon slightly if it's currently deleting */}
                          {isDeletingId === cartItem.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                            >
                              <Sparkles size={18} />
                            </motion.div>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="sm:text-right w-full sm:w-auto border-t-2 sm:border-t-0 border-dashed border-gray-100 pt-4 sm:pt-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Total
                      </p>
                      <p className="font-black text-3xl text-secondary-sun">
                        ${(product.price * cartItem.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right Side: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/3"
            >
              <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_0_rgba(229,231,235,0.6)] border-2 border-gray-100">
                <h3 className="text-2xl font-black text-text-charcoal mb-6 border-b-2 border-gray-100 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 text-lg font-bold text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-text-charcoal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-text-charcoal">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t-4 border-dotted border-gray-100 pt-6 mb-8">
                  <span className="text-xl font-black text-gray-400 uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-4xl font-black text-primary-sky drop-shadow-sm">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button className="w-full bg-secondary-sun text-text-charcoal font-black text-xl rounded-[1.5rem] py-4 flex items-center justify-center gap-3 border-b-4 border-orange-400 hover:scale-[1.02] hover:shadow-lg active:scale-95 active:border-b-0 active:translate-y-1 transition-all">
                  <CreditCard size={24} /> Proceed to Checkout
                </button>

                <div className="mt-6 text-center">
                  <Link
                    href="/items"
                    className="text-sm font-bold text-gray-400 hover:text-primary-sky flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
