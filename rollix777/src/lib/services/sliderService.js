import axios from "axios";
import { baseUrl } from "../config/server.js";

export const getAllSliders = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/slider/slider`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sliders");
  }
};

export const addSlider = async (sliderData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/slider/slider`,
      sliderData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add slider");
  }
};

export const deleteSlider = async (sliderId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/slider/slider/${sliderId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete slider");
  }
};
