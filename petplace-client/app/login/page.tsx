"use client";

import { motion } from "framer-motion";
import { Dog, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; 

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields!");

    setLoading(true);

    if (isLogin) {
      // Trigger NextAuth Credentials Provider
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, 
      });

      if (result?.error) {
        toast.error(result.error); 
        setLoading(false);
      } else {
        toast.success("Welcome back to PetPalace!");
        router.push("/"); 
        router.refresh(); 
      }
    } else {
      // Handle Registration logic here later using axiosPublic.post('/user/create-user')
      toast.info("Registration API linking coming next!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="premium-card w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary-sky rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Dog size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-charcoal">
            {isLogin ? "Welcome Back!" : "Join the Pack!"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary-sky outline-none transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary-sky outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-sky font-bold hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
