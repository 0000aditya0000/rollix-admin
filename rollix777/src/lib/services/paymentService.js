import { baseUrl } from "../config/server";

// Generic request function
const request = async (endpoint, method = "GET", data = null) => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment Request Error:", error.message);
    throw error;
  }
};

// ✅ Get all gateways (admin)
export const getAllGateways = async () => {
  return await request("/api/admin/gateways", "GET");
};

// ✅ Toggle gateway status (admin)
export const toggleGatewayStatus = async (name, status) => {
  return await request("/api/admin/gateway-update", "POST", {
    name,
    status,
  });
};
