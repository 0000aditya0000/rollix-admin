import { baseUrl } from "../config/server";

const request = async (endpoint, data) => {
  try {
    const userId = localStorage.getItem("userId");
    console.log("aasifId", userId);
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Request Error:", error.message);
    throw error;
  }
};

export const updatePassword = async (userId, data) =>
  request(`/api/user/user/password/${userId}`, data);
