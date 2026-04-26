import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      needPasswordChange?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    accessToken?: string;
    needPasswordChange?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    needPasswordChange?: boolean;
  }
}
