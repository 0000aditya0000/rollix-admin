import { baseUrl } from "../config/server";

// Fetch user data
const fetchUser = async userId => {
  try {
    const response = await fetch(`${baseUrl}/api/user/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error;
  }
};

// Fetch all user data including wallet, referrals, etc.
const fetchAllUserData = async userId => {
  try {
    const response = await fetch(`${baseUrl}/api/user/user-all-data/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user all data:", error.message);
    throw error;
  }
};

// Update user data
const updateUser = async (userId, formData) => {
  console.log(formData);
  try {
    const response = await fetch(`${baseUrl}/api/user/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Server Error Details:", errorData);
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const userCouponHistory = async (userId) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/coupons/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching coupon history:", error);
    throw error;
  }
};

export const fetchUserData = async userId => fetchUser(userId);
export const fetchUserAllData = async userId => fetchAllUserData(userId);
export const updateUserData = async (userId, formData) =>
  updateUser(userId, formData);
