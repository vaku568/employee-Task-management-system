import axios from "axios";

console.log("[CRITICAL] axiosInstance.js - FILE LOADED");

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api"
});

console.log("[CRITICAL] axiosInstance - INSTANCE CREATED");

console.log("[DEBUG] axiosInstance - Initialized");

axiosInstance.interceptors.request.use(
  (config) => {
    console.group("========== API REQUEST ==========");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Token from localStorage:", localStorage.getItem("token") ? "EXISTS" : "MISSING");
    console.log("localStorage keys:", Object.keys(localStorage));
    console.log("Request Headers:", config.headers);
    console.trace();
    console.groupEnd();

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    } else {

      console.warn("⚠️ NO TOKEN FOUND - Request will be unauthenticated");

    }

    return config;

  },
  (error) => {
    console.group("========== REQUEST ERROR ==========");
    console.error("Request error:", error);
    console.trace();
    console.groupEnd();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.group("========== API RESPONSE SUCCESS ==========");
    console.log("URL:", response.config.url);
    console.log("Status:", response.status);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group("========== API RESPONSE ERROR ==========");
    console.log("URL:", error.config?.url);
    console.log("Status:", error.response?.status);
    console.log("Error:", error.message);
    console.log("Request Headers:", error.config?.headers);
    console.trace();
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default axiosInstance;