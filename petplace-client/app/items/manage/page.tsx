/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosPublic } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Eye, Loader2, Package, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: { name: string } | string;
}

export default function ManageItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch all items (Owner/Admin perspective)
  const fetchMyItems = async () => {
    try {
      setIsLoading(true);
      const res = await axiosPublic.get("/item"); // Using your GET all API
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to sniff out items!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      await fetchMyItems();
    };

    void loadItems();
  }, []);

  // 2. Delete Functionality
  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Removing item from armory...");
    try {
      const res = await axiosPublic.delete(`/item/${id}`, {
        headers: { Authorization: `Bearer ${(session as any)?.accessToken}` },
      });

      if (res.data.success) {
        toast.success("Item vanished successfully! 🐾", { id: toastId });
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed", {
        id: toastId,
      });
    }
  };

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary-sky mb-4" size={40} />
        <p className="font-black text-text-charcoal uppercase tracking-widest">
          Inventory loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF0] py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-text-charcoal tracking-tight">
              Manage <span className="text-primary-sky">Armory</span>
            </h1>
            <p className="text-gray-500 font-bold">
              You have {items.length} products listed in PetPalace.
            </p>
          </div>

          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-sky transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 w-full md:w-80 rounded-2xl border-4 border-white shadow-lg outline-none focus:border-primary-sky/30 transition-all font-bold text-text-charcoal"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-6">Product</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Price</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                          <Image
                            src={item.images[0] || "/placeholder.png"}
                            alt="img"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-text-charcoal line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 font-bold">
                            ID: ...{item.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-sky-100 text-primary-sky text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {typeof item.category === "object"
                          ? item.category.name
                          : "Pet Gear"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-black text-text-charcoal">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/items/${item.id}`)}
                          className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-primary-sky hover:text-white transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/items/edit/${item.id}`)}
                          className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-secondary-sun hover:text-text-charcoal transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <Package size={60} className="text-gray-200 mb-4" />
              <p className="font-black text-gray-400 uppercase tracking-widest">
                No items found in your pack
              </p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-[2rem] border-4 border-white shadow-xl flex items-center gap-4"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shrink-0">
                <Image
                  src={item.images[0] || "/placeholder.png"}
                  alt="img"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-black text-text-charcoal leading-tight mb-1">
                  {item.title}
                </p>
                <p className="text-sm font-black text-primary-sky">
                  ${item.price}
                </p>
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => router.push(`/items/${item.id}`)}
                    className="text-gray-400"
                  >
                    <Eye size={20} />
                  </button>
                  {/* <button
                    onClick={() => router.push(`/items/edit/${item.id}`)}
                    className="text-gray-400"
                  >
                    <Edit3 size={20} />
                  </button> */}
                  <button
                    onClick={() => router.push(`/items/edit/${item.id}`)}
                    className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-secondary-sun hover:text-text-charcoal transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 ml-auto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
