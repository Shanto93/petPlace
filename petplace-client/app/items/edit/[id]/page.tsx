/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosPublic } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignLeft,
  ChevronRight,
  DollarSign,
  Info,
  Layout,
  Loader2,
  Save,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  // Images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    description: "",
    fullDescription: "",
    icon: "Sparkles",
  });

  // 1. Fetch Categories and Existing Product Data
  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch Categories
        const catRes = await axiosPublic.get("/category");
        if (catRes.data.success) setCategories(catRes.data.data);

        // Fetch Product Details
        const prodRes = await axiosPublic.get(`/item/${resolvedParams.id}`);
        if (prodRes.data.success) {
          const item = prodRes.data.data;
          setFormData({
            title: item.title,
            categoryId: item.categoryId || item.category?.id,
            price: item.price.toString(),
            description: item.description,
            fullDescription: item.fullDescription,
            icon: item.icon || "Sparkles",
          });
          setExistingImages(item.images || []);
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [resolvedParams.id]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newFiles.length > 5)
      return toast.error("Max 5 images total");

    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== imgUrl));
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Reforging your item... 🔨");

    try {
      const body = new FormData();

      // Update payload: We send the existing image URLs + new ones will be handled by backend
      const updateData = {
        ...formData,
        price: Number(formData.price),
        images: existingImages, // Pass remaining old images back to keep them
      };

      body.append("data", JSON.stringify(updateData));

      // Append new files
      newFiles.forEach((file) => {
        body.append("images", file);
      });

      const res = await axiosPublic.patch(`/item/${resolvedParams.id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
      });

      if (res.data.success) {
        toast.success("Item Updated Successfully!", { id: toastId });
        router.push("/items/manage");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed!", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF0]">
        <Loader2 className="animate-spin text-primary-sky" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCF0] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs mb-6 uppercase tracking-widest">
          Manage <ChevronRight size={14} />{" "}
          <span className="text-primary-sky">Edit Item</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <h1 className="text-4xl font-black text-text-charcoal tracking-tighter">
              Edit <span className="text-primary-sky">Product</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-4 border-white shadow-xl">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="label-elite">
                      <Layout size={16} /> Title
                    </label>
                    <input
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-elite"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="label-elite">
                        <Tag size={16} /> Category
                      </label>
                      <select
                        name="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="input-elite"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="label-elite">
                        <DollarSign size={16} /> Price
                      </label>
                      <input
                        name="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        className="input-elite"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="label-elite">
                      <AlignLeft size={16} /> Short Sniff
                    </label>
                    <input
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-elite"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="label-elite">
                      <Info size={16} /> Detailed Narrative
                    </label>
                    <textarea
                      name="fullDescription"
                      required
                      rows={6}
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      className="input-elite resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-sky text-white font-black py-6 rounded-[2.5rem] flex justify-center items-center gap-4 hover:bg-text-charcoal transition-all text-2xl shadow-2xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={30} />
                ) : (
                  <>
                    SAVE CHANGES <Save size={24} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Sidebar: Image Management */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border-4 border-white shadow-xl">
              <h3 className="font-black text-text-charcoal text-xl mb-6">
                Product Images
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {/* Render Existing Images */}
                  {existingImages.map((src) => (
                    <motion.div
                      key={src}
                      className="relative aspect-square rounded-3xl overflow-hidden border-2 border-primary-sky/20 group"
                    >
                      <Image
                        src={src}
                        alt="existing"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(src)}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={24} />
                      </button>
                    </motion.div>
                  ))}
                  {/* Render New Previews */}
                  {previews.map((src, i) => (
                    <motion.div
                      key={src}
                      className="relative aspect-square rounded-3xl overflow-hidden border-2 border-green-200 group"
                    >
                      <Image
                        src={src}
                        alt="new"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={24} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {existingImages.length + newFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-4 border-dashed border-sky-100 flex flex-col items-center justify-center text-primary-sky hover:bg-sky-50 transition-all"
                  >
                    <UploadCloud size={32} />
                    <span className="text-[10px] font-black mt-2">ADD NEW</span>
                  </button>
                )}
              </div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .label-elite {
          font-size: 0.75rem;
          font-weight: 900;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .input-elite {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border-radius: 1.5rem;
          border: 3px solid #f7fafc;
          outline: none;
          transition: all 0.3s ease;
          background: #f7fafc;
          font-weight: 700;
          color: #2d3748;
        }
        .input-elite:focus {
          border-color: #87ceeb;
          background: white;
          box-shadow: 0 10px 30px -10px rgba(135, 206, 235, 0.2);
        }
      `}</style>
    </div>
  );
}
