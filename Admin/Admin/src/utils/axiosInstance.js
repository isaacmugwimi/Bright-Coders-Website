import axios from "axios";
import { API_PATHS, BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 1. Request Interceptor: Automatically attach the CSRF token


axiosInstance.interceptors.request.use((config) => {
  // 1. Finding the cookie. 
  // NOTE: Check your browser to see if the name is 'XSRF-TOKEN' or '_csrf'
  const cookieName = '_csrf'; 
  
  const token = document.cookie
    .split('; ')
    .find(row => row.trim().startsWith(`${cookieName}=`))
    ?.split('=')[1];

  if (token) {
    // 2. Use the header name you whitelisted in your Express CORS
    config.headers['X-CSRF-Token'] = decodeURIComponent(token);
  }
  
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      const currentPath = window.location.pathname;

      // 1. FORBIDDEN (403): This is for Step-Up or CSRF issues.
      // We NEVER redirect here. We let the component (AccountSettings) 
      // catch this error to show the OTP overlay.
      if (status === 403) {
        console.warn("403 Forbidden: Security barrier hit. Handling in-component.");
        return Promise.reject(error);
      }

      // 2. UNAUTHORIZED (401): This is for expired sessions.
      // We define "Safe Zones" where we SHOULD NOT redirect.
      const isAuthPage = currentPath === "/authentication" || currentPath === "/reset-password";
      
      // We check the URL of the request that failed. 
      // If it was an OTP request, it's okay to fail; don't eject the user!
      const isOtpRequest = config.url?.includes("/step-up/verify") || config.url?.includes("/step-up/request");

      if (status === 401 && !isAuthPage && !isOtpRequest) {
        console.error("Session expired or invalid. Redirecting to login...");
        window.location.href = "/authentication";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;