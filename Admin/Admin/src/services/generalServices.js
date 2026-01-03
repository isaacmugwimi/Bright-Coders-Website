import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const getAllRegistrations = async () => {
  const res = await axiosInstance.get(API_PATHS.REGISTRATIONS.GET_ALL);
  return res.data;
};

export const getAllBlogs = async () => {
  const res = await axiosInstance.get(API_PATHS.BLOGS.GET_ALL);
  return res.data;
};

export const getAllTestimonials = async () => {
  const res = await axiosInstance.get(API_PATHS.TESTIMONIALS.GET_ALL);
  return res.data;
};
