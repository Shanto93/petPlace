// "use client";
import Footer from "@/components/home/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/shared/Navbar";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
// Import your Navbar and ToastProvider here later!

export const metadata: Metadata = {
  title: "PetPalace | Elite Pet Supplies",
  description: "Premium pet supplies with a magical touch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning right here! */}
      <body className="" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 min-h-[calc(100vh-80px)]">
            {children}
            <Toaster position="top-center" richColors />
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
