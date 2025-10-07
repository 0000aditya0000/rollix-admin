import { baseUrl } from "../config/server.js";

//  Add a new Recharge Bonus Configuration
export const addRechargeBonusConfig = async (bonusData) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/admin/rechargeBonusConfig/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bonusData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding recharge bonus config:", error);
    throw error;
  }
};

//  Get all Recharge Bonus Configurations
export const getRechargeBonusConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/rechargeBonusConfig`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recharge bonus config:", error);
    throw error;
  }
};

//  Update an existing Recharge Bonus Configuration
export const updateRechargeBonusConfig = async (updateData) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/admin/rechargeBonusConfig/update`,
      {
        method: "POST", // Assuming POST as per your API pattern
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating recharge bonus config:", error);
    throw error;
  }
};

//  Disable/Enable a Recharge Bonus Configuration
export const disableRechargeBonusConfig = async (disableData) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/admin/rechargeBonusConfig/disable`,
      {
        method: "POST", // Assuming POST as per your API structure
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(disableData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error disabling recharge bonus config:", error);
    throw error;
  }
};
