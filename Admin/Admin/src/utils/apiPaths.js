export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_USER_INFO: "/api/auth/getUser",
    VERIFY_OTP: "/api/auth/verify-otp",
  },
  SECURITY: {
    CSRF_TOKEN: "/api/csrf-token",
  },
  DASHBOARD: {
    GET_DATA: "/api/dashboard",
  },
  COURSES: {
    GET_ALL: "/api/courses",
    CREATE: "/api/courses",
    UPDATE: (id) => `/api/courses/${id}`,
    DELETE: (id) => `/api/courses/${id}`,
    PUSH: (id) => `/api/courses/${id}/push`,
    WITHDRAW: (id) => `/api/courses/${id}/withdraw`,
    FEATURED: (id) => `/api/courses/${id}/featured`,
  },
  BLOGS: {
    GET_ALL: "/api/blogs",
    GET_LIVE: "/api/blogs/live",
    CREATE: "/api/blogs",
    UPDATE: (id) => `/api/blogs/${id}`,
    DELETE: (id) => `/api/blogs/${id}`,
    PUSH: (id) => `/api/blogs/${id}/push`,
    WITHDRAW: (id) => `/api/blogs/${id}/withdraw`,
  },
  // 🔹 Testimonial Routes
  TESTIMONIALS: {
    GET_LIVE: "/api/testimonials/live", // Public landing page
    SUBMIT: "/api/testimonials/submit", // Public form submission
    GET_ALL: "/api/testimonials", // Admin dashboard view
    DELETE: (id) => `/api/testimonials/${id}`,
    APPROVE: (id) => `/api/testimonials/${id}/approve`,
    HIDE: (id) => `/api/testimonials/${id}/hide`,
  },
  REGISTRATIONS: {
    GET_ALL: "/api/registration/StudentsRegistration",
    UPDATE_PAYMENT: (id) => `/api/registration/payment/${id}`,
    ISSUE_CERTIFICATE: (id) => `/api/registration/certificate/${id}`,
    DELETE: (id) => `/api/registration/${id}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },


PASSWORD_RESET: {
    AUTH_RESET: "/api/auth-reset", // Base path
    REQUEST: "/api/auth-reset/request", // The one for sending the email
    CONFIRM: "/api/auth-reset/confirm", // The one for the new password
},
ADMIN_ACCOUNT: {
    REQUEST_OTP: "/api/admin/step-up/request",   // To send the code
    VERIFY_OTP: "/api/admin/step-up/verify",     // To lift the "security curtain"
    GET_PROFILE: "/api/admin/profile",           // Fetch basic info
    UPDATE_PROFILE: "/api/admin/profile-update", // PUT request for name/image
    CHANGE_PASSWORD: "/api/admin/change-password",
    DELETE_ACCOUNT: "/api/admin/delete-account",
  }

};
