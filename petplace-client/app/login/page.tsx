"use client";

import { axiosPublic } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Dog,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "sonner"; // Using Sonner as requested

export default function LoginPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return toast.error("Image must be less than 2MB");
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Start a loading toast and capture its ID
    const toastId = toast.loading(
      isLogin ? "Signing you in..." : "Creating your pack profile...",
    );

    try {
      if (isLogin) {
        // ==========================================
        // LOGIN LOGIC
        // ==========================================
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          // 2. Update the SAME toast with the error message from your API
          return toast.error(result.error, { id: toastId });
        }

        // 3. Update to success
        toast.success("Welcome back to PetPalace! 🐾", { id: toastId });
        router.push("/");
        router.refresh();
      } else {
        // ==========================================
        // REGISTRATION LOGIC
        // ==========================================
        const registrationPayload = {
          password: formData.password,
          user: {
            name: formData.name,
            email: formData.email,
            contactNumber: formData.contactNumber,
            address: formData.address,
            role: "USER",
          },
        };

        const body = new FormData();
        body.append("data", JSON.stringify(registrationPayload));
        if (selectedFile) body.append("file", selectedFile);

        const res = await axiosPublic.post("/user/create-user", body);

        if (res.data.success) {
          toast.success(res.data.message, { id: toastId });

          // Auto-login logic
          await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            callbackUrl: "/",
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // 4. Extract specific backend message: e.g. "Duplicate Key Error"
      const backendError =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(backendError, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-sky-50/30">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-primary-sky rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-sky-100">
            <Dog size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-text-charcoal tracking-tight">
            {isLogin ? "Welcome Back!" : "Join the Pack!"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* PHOTO UPLOAD */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-24 h-24 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary-sky transition-all overflow-hidden"
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Camera
                        className="text-gray-400 group-hover:text-primary-sky"
                        size={30}
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Profile Image
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field-premium"
                  />
                </div>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="contactNumber"
                    type="text"
                    placeholder="Contact Number"
                    required
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="input-field-premium"
                  />
                </div>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    name="address"
                    type="text"
                    placeholder="Shipping Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field-premium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input-field-premium"
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="input-field-premium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary-sky text-white font-black py-4 rounded-2xl flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-sky-200 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : isLogin ? (
              "LOG IN"
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 font-medium text-sm">
          {isLogin ? "New to the pack? " : "Already a member? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-sky font-black hover:underline underline-offset-4"
          >
            {isLogin ? "Create Account" : "Log In"}
          </button>
        </p>
      </motion.div>

      <style jsx>{`
        .input-field-premium {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border-radius: 1rem;
          border: 2px solid #f3f4f6;
          outline: none;
          transition: all 0.2s;
          background: #f9fafb;
          font-weight: 600;
          color: #333;
        }
        .input-field-premium:focus {
          border-color: #87ceeb;
          background: white;
          box-shadow: 0 0 0 4px rgba(135, 206, 235, 0.1);
        }
      `}</style>
    </div>
  );
}
