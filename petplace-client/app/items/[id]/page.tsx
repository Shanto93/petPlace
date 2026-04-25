"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bird,
  Bone,
  Cat,
  Dog,
  Fish,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react"; // IMPORT 'use' HERE

// 1. Expanded Mock Data
const mockProducts = [
  {
    id: "1",
    title: "Premium Organic Dog Bone",
    category: "Dogs",
    price: 24.99,
    description: "A healthy, delicious chew for your best friend.",
    fullDescription:
      "Treat your loyal companion to the ultimate chewing experience. Sourced from 100% organic, free-range farms, this premium bone is baked to perfection to lock in natural flavors and essential nutrients. It promotes dental health by naturally cleaning teeth and preventing tartar buildup, ensuring hours of safe, delicious engagement.",
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
    fullDescription:
      "Elevate your cat's lounging experience with this multi-level luxury tower. Featuring ultra-soft plush scratching posts wrapped in natural sisal rope, and a cozy top perch perfect for bird-watching. Built with a sturdy, anti-tip base to keep even the most energetic felines safe during playtime.",
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
    fullDescription:
      "Formulated by marine biologists, these elite tropical flakes are packed with natural color enhancers and premium proteins. Designed to float longer and digest easily, keeping your aquarium water crystal clear while ensuring your fish display their most vibrant, brilliant scales.",
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
    fullDescription:
      "A beautifully crafted, shatterproof mirror designed specifically for avian stimulation. It features a built-in melodic bell and an easy-mount cage hook. Perfect for reducing cage boredom and encouraging natural vocalization and social behaviors in parakeets, cockatiels, and canaries.",
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
    fullDescription:
      "Give your pet the gift of cloud-like sleep. This premium bed features a dual-layer orthopedic memory foam core that instantly relieves joint pressure and soothes aching muscles. Wrapped in a removable, machine-washable ultra-soft velvet cover that seamlessly blends with your home decor.",
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
    fullDescription:
      "The ultimate cure for feline boredom. This sleek, automated laser companion generates randomized, unpredictable patterns to trigger your cat's natural hunting instincts. Features a whisper-quiet motor, 3 speed settings, and an auto-shutoff timer to prevent over-exhaustion.",
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
    fullDescription:
      "A spectacular blend of premium sunflower seeds, dried tropical fruits, and essential vitamin pellets. This gourmet mix provides complete daily nutrition tailored for medium to large parrots, ensuring robust immune health and breathtaking feather vibrance.",
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
    fullDescription:
      "Transform your tank into a mesmerizing underwater palace. Hand-painted with non-toxic, aquatic-safe glowing pigments, this ultra-realistic coral replica creates a stunning visual centerpiece while providing essential hiding spots to reduce stress for your shy aquatic pets.",
    icon: Fish,
    color: "text-indigo-500",
    bg: "bg-indigo-100",
  },
];

// 2. Animations
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

// Next.js 15+ requires params to be a Promise and unwrapped using React.use()
export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // UNWRAP THE PARAMS HERE
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(1);

  // Find the specific product using resolvedParams.id
  const product = mockProducts.find((p) => p.id === resolvedParams.id);

  // Find Related Items (Same category, excluding current item, limit to 3)
  const relatedItems = mockProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  // Fallback if not enough related items in the same category
  if (relatedItems.length < 2) {
    const extraItems = mockProducts
      .filter((p) => p.id !== product?.id && p.category !== product?.category)
      .slice(0, 3 - relatedItems.length);
    relatedItems.push(...extraItems);
  }

  // Not Found State
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
          className="btn-primary px-6 py-3 rounded-full bg-primary-sky text-white font-bold hover:scale-105 transition-transform"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const Icon = product.icon;

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
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-sky/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Big Interactive Image Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            className={`w-full lg:w-1/2 ${product.bg} rounded-[2.5rem] aspect-square flex items-center justify-center relative border-4 border-transparent hover:border-primary-sky/20 transition-all duration-500 shadow-inner group`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] opacity-60" />
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

            {/* Elite Badge */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm border-2 border-white px-4 py-2 rounded-full flex items-center gap-2 font-black text-secondary-sun shadow-sm">
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
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-primary-sky uppercase tracking-widest bg-primary-sky/10 px-4 py-2 rounded-xl border-2 border-primary-sky/20">
                {product.category}
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

            {/* Title & Price */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-text-charcoal tracking-tight leading-[1.1] mb-4">
                {product.title}
              </h1>
              <span className="font-black text-4xl text-primary-sky drop-shadow-sm flex items-center gap-2">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <hr className="border-t-4 border-dotted border-gray-100" />

            {/* Full Description */}
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
              {/* Quantity Selector */}
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

              {/* Chunky Add to Cart Button */}
              <button className="flex-1 bg-secondary-sun text-text-charcoal font-black text-xl rounded-[1.5rem] flex items-center justify-center gap-3 border-b-4 border-orange-400 hover:scale-[1.02] hover:shadow-lg active:scale-95 active:border-b-0 active:translate-y-1 transition-all">
                <ShoppingCart size={24} /> Toss in Cart
              </button>
            </div>
          </motion.div>
        </div>

        {/* RELATED ITEMS SECTION */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 border-b-4 border-gray-200 pb-4">
            <h2 className="text-3xl font-black text-text-charcoal">
              The Pack Also Loved
            </h2>
            <Sparkles className="text-secondary-sun" size={28} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedItems.map((relItem) => {
              const RelIcon = relItem.icon;
              return (
                <motion.div
                  key={relItem.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={popInCard}
                  className="bg-white rounded-[2rem] p-5 border-2 border-gray-100 shadow-[0_6px_0_rgba(229,231,235,1)] hover:shadow-[0_10px_0_rgba(135,206,235,0.4)] hover:border-primary-sky/30 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div
                    className={`${relItem.bg} rounded-[1.5rem] aspect-[4/3] mb-5 flex items-center justify-center border-2 border-transparent group-hover:border-white transition-all relative overflow-hidden`}
                  >
                    <RelIcon
                      size={70}
                      className={`${relItem.color} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Details Area */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-black text-xl mb-2 text-text-charcoal leading-tight line-clamp-2">
                      {relItem.title}
                    </h3>
                  </div>

                  {/* Price & Action */}
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
      </div>
    </div>
  );
}
