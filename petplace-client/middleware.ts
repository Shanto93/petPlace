import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  // Adding the secret here fixes the "Configuration" error in Middleware
  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  // Use specific paths to prevent Next.js prefetch issues
  matcher: [
    "/items/add", 
    "/items/manage",
    "/cart"
  ],
};