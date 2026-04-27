import axios from "axios";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// Your Express Backend URL
// const BASE_URL = "https://petplace-server-3.onrender.com/api/v1";
const BASE_URL = "https://petplace-server-3.onrender.com/api/v1";

// 1. Public Axios (No Token Required)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Private Axios (Token Required)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Dynamic Interceptor to attach the Token
axiosPrivate.interceptors.request.use(
  async (config) => {
    // If we are on the client side, grab the session token
    if (typeof window !== "undefined") {
      const session = await getSession();
      const token = session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
