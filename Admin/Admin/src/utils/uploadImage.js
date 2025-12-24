import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (file) => {
  const formData = new FormData();
  // append new  image file to form data
  formData.append("image", file);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", //set data for file upload
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the image: ", error);
    throw error; //Rethrow error for handling
  }
};

export default uploadImage;
