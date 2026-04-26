/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosPublic } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignLeft,
  ChevronRight,
  DollarSign,
  Image as ImageIcon,
  Info,
  Layout,
  Loader2,
  Sparkles,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    description: "",
    fullDescription: "",
    icon: "Sparkles",
    color: "text-primary-sky",
    bg: "bg-sky-100",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosPublic.get("/category");
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error("Category Fetch Error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5)
      return toast.error("Max 5 images allowed");

    const validFiles = files.filter((f) => f.size < 2 * 1024 * 1024);
    if (validFiles.length < files.length) toast.error("Some files exceed 2MB");

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [
      ...prev,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId)
      return toast.error("Please select a pet category!");

    setLoading(true);
    const toastId = toast.loading("Forging your premium item... 🔨");

    try {
      const body = new FormData();

      // JSON data
      body.append(
        "data",
        JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      );

      // FIXED KEY: Changed from 'files' to 'images' to match your backend
      selectedFiles.forEach((file) => {
        body.append("images", file);
      });

      const res = await axiosPublic.post("/item", body, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
      });

      if (res.data.success) {
        toast.success("Item Published Successfully! 🐾", { id: toastId });
        router.push("/items");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Forge failed!", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-[#FDFCF0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs mb-6 uppercase tracking-widest">
          Store <ChevronRight size={14} /> Armory <ChevronRight size={14} />{" "}
          <span className="text-primary-sky">New Item</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black text-text-charcoal tracking-tighter mb-2">
                Forge <span className="text-primary-sky">Elite</span> Gear
              </h1>
              <p className="text-gray-500 font-bold text-lg">
                Add high-quality products to the PetPalace collection.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="space-y-8">
                  {/* Title */}
                  <div className="group space-y-3">
                    <label className="label-elite">
                      <Layout size={16} /> Product Title
                    </label>
                    <input
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Royal Golden Cat Bed"
                      className="input-elite"
                    />
                  </div>

                  {/* Category & Price Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="label-elite">
                        <Tag size={16} /> Pet Category
                      </label>
                      <select
                        name="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="input-elite appearance-none"
                      >
                        <option value="">Select Type</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="label-elite">
                        <DollarSign size={16} /> Price (USD)
                      </label>
                      <input
                        name="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="input-elite"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-3">
                    <label className="label-elite">
                      <AlignLeft size={16} /> Short Sniff (Tagline)
                    </label>
                    <input
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="The fluffiest bed for your king..."
                      className="input-elite"
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-3">
                    <label className="label-elite">
                      <Info size={16} /> Narrative & Specifications
                    </label>
                    <textarea
                      name="fullDescription"
                      required
                      rows={6}
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      placeholder="Describe the premium quality, materials used, and why pets love it..."
                      className="input-elite resize-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-text-charcoal text-white font-black py-6 rounded-[2.5rem] flex justify-center items-center gap-4 hover:bg-primary-sky transition-all text-2xl shadow-2xl disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={30} />
                ) : (
                  <>
                    LIST PRODUCT{" "}
                    <Sparkles className="group-hover:animate-pulse" size={24} />
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Right Column: Visuals (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[3rem] border-4 border-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-text-charcoal text-xl">
                  Gallery
                </h3>
                <span className="bg-sky-100 text-primary-sky text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {selectedFiles.length}/5
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {previews.map((src, i) => (
                    <motion.div
                      key={src}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="relative aspect-square rounded-3xl overflow-hidden border-2 border-gray-100 group shadow-sm"
                    >
                      <Image
                        src={src}
                        alt="preview"
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={24} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {selectedFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-4 border-dashed border-sky-100 flex flex-col items-center justify-center text-primary-sky hover:bg-sky-50 transition-all group"
                  >
                    <UploadCloud
                      size={32}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[10px] font-black mt-2">
                      ADD PHOTO
                    </span>
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
            </motion.div>

            {/* Visual Customization */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-sun p-8 rounded-[3rem] border-4 border-white shadow-xl"
            >
              <h3 className="font-black text-text-charcoal text-xl mb-6">
                Icon Theme
              </h3>
              <div className="space-y-4">
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="input-elite !bg-white/40 !border-transparent"
                >
                  <option value="Dog">🐶 Dog Pack</option>
                  <option value="Cat">🐱 Cat Pack</option>
                  <option value="Bird">🦜 Bird Pack</option>
                  <option value="Fish">🐠 Fish Pack</option>
                  <option value="Sparkles">✨ Elite Edition</option>
                </select>
                <div className="bg-white/30 p-4 rounded-2xl flex items-start gap-3">
                  <div className="bg-white p-2 rounded-xl text-secondary-sun">
                    <ImageIcon size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-text-charcoal/70 leading-tight uppercase tracking-tighter">
                    Icons help the pack find <br />
                    your items faster in search.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .label-elite {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 900;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-left: 0.5rem;
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
          font-size: 1rem;
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
