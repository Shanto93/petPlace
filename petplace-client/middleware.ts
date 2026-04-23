import { withAuth } from "next-auth/middleware";

// This protects the specified routes. If a user is not logged in,
// they will automatically be redirected to /login.
export default withAuth({
  pages: {
    signIn: "/login", // Custom login page
  },
});

export const config = {
  // Add any other routes that need protection inside this array
  matcher: ["/items/add/:path*", "/items/manage/:path*"],
};
