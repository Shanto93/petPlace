// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { axiosPublic } from "@/lib/axios";
// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           // Call your Express Login API
//           const res = await axiosPublic.post("/auth/login", {
//             email: credentials?.email,
//             password: credentials?.password,
//           });

//           const responseData = res.data;

//           // If success is true, return the user object to NextAuth
//           if (responseData && responseData.success) {
//             return {
//               id: credentials?.email || "1",
//               email: credentials?.email,
//               // IMPORTANT: Assuming your backend sends the JWT token in responseData.data.accessToken
//               accessToken: responseData.data.accessToken,
//               needPasswordChange: responseData.data.needPasswordChange,
//             };
//           }
//           return null;
//         } catch (error: any) {
//           // Send backend error message to the frontend
//           throw new Error(error.response?.data?.message || "Login failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     // 1. Store the backend token in the NextAuth JWT
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//         token.needPasswordChange = (user as any).needPasswordChange;
//       }
//       return token;
//     },
//     // 2. Pass the token to the frontend session so Axios can use it
//     async session({ session, token }) {
//       (session as any).accessToken = token.accessToken;
//       (session.user as any).needPasswordChange = token.needPasswordChange;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", // Redirect to our custom animated login page
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 Days
//   },
//   secret: process.env.NEXTAUTH_SECRET || "petpalace-super-secret-key-123",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPublic } from "@/lib/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Call your Express Login API
          const res = await axiosPublic.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const responseData = res.data;

          // If success is true, return the user object to NextAuth
          if (responseData && responseData.success) {
            return {
              // 1. GRAB THE REAL ID FROM YOUR BACKEND RESPONSE HERE
              // Assuming your backend sends the user data inside responseData.data.user
              id: responseData.data.user?.id || responseData.data.id, 
              email: credentials?.email,
              accessToken: responseData.data.accessToken,
              needPasswordChange: responseData.data.needPasswordChange,
            };
          }
          return null;
        } catch (error: any) {
          // Send backend error message to the frontend
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    // 1. Store the backend token AND ID in the NextAuth JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // <-- ADDED THIS LINE
        token.accessToken = (user as any).accessToken;
        token.needPasswordChange = (user as any).needPasswordChange;
      }
      return token;
    },
    // 2. Pass the token AND ID to the frontend session
    async session({ session, token }) {
      (session.user as any).id = token.id; // <-- ADDED THIS LINE
      (session as any).accessToken = token.accessToken;
      (session.user as any).needPasswordChange = token.needPasswordChange;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to our custom animated login page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.NEXTAUTH_SECRET || "petpalace-super-secret-key-123",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };