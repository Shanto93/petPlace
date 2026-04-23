import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/shared/Navbar";
import type { Metadata } from "next";
import "./globals.css";
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
      <body className="bg-bg-cream text-text-charcoal min-h-screen font-sans antialiased">
        <AuthProvider>
          {/* <Navbar /> */}
          <main className="container mx-auto px-4 py-8">
            <Navbar />
            {children}
          </main>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
