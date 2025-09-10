import { baseUrl } from "../config/server";

const request = async (endpoint, data) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Add Funds Request Error:", error.message);
    throw error;
  }
};

/**
 * Add balance to users
 * @param amount - Amount to add
 * @param userIds - Optional array of user IDs
 */
export const addFunds = async (amount, userIds) => {
  const payload = { amount };
  if (userIds && userIds.length > 0) {
    payload.userIds = userIds;
  }
  return request("/api/admin/wallet/add-balance", payload);
};
