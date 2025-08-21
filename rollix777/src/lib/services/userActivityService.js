import { baseUrl } from "../config/server";

export const fetchUserLogins = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/admin/user-logins?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user login logs:", error.message);
    throw error;
  }
};

// ✅ Block or Unblock an IP
export const disableUserAccount = async (userId, disable) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/disable-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, disable }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error blocking/unblocking IP:", error.message);
    throw error;
  }
};

// ✅ blocked IPs
export const blockIpAddress = async (ip, block) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/block-ip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ip, block }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error blocking/unblocking IP:", error.message);
    throw error;
  }
};
