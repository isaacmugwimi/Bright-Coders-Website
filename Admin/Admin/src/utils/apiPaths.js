export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_USER_INFO: "/api/auth/getUser",
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
};
