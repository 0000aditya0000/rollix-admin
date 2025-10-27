import { baseUrl } from "../config/server";

// Fetch user data
const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
const fetchAllUserData = async (userId) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/user/user-all-data/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

export const loginStatus = async (userId, disable) => {
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
    console.error("Error setting login status:", error.message);
    throw error;
  }
};

export const banWithdrawal = async (userId, block) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/block-withdrawal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, block }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error blocking withdrawal:", error.message);
    throw error;
  }
};

export const updateWalletBalance = async (userId, balance, cryptoname) => {
  try {
    const response = await fetch(`${baseUrl}/api/wallet/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, cryptoname, balance }),
    });

    if (!response.ok) {
      const errordata = await response.json().catch(() => ({}));
      throw new Error(
        errordata.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.log("Error Updating Wallet balance", error.message);
    throw error;
  }
};

export const updateBonusBalance = async (userId, bonus) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/edit-bonus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, bonus }),
    });

    if (!response.ok) {
      const errordata = await response.json().catch(() => ({}));
      throw new Error(
        errordata.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.log("Error Updating Wallet balance", error.message);
    throw error;
  }
};

export const getAllTransactions = async (userId) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/transactions/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errordata = await response.json().catch(() => ({}));
      throw new Error(
        errordata.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.log("Error fetching Transaction history", error.message);
    throw error;
  }
};

export const getWingoHistory = async (data) => {
  try {
    const response = await fetch(`${baseUrl}/api/color/bet-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Wingo history:", error.message);
    throw error;
  }
};

// --- Wingo 5D Bet History ---
export const getWingo5DHistory = async (data) => {
  try {
    const response = await fetch(`${baseUrl}/api/5d/bet-history-5d`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Wingo 5D history:", error.message);
    throw error;
  }
};

// --- TRX Bet History (Placeholder until you provide API) ---
export const getTrxHistory = async ({ userId, timer }) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/trx/bet-history-trx?timer=${timer}&userId=${userId}`,
      {
        method: "GET",
        headers: {
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
    console.error("Error fetching TRX history:", error.message);
    throw error;
  }
};

// --- Other Game Transactions ---
export const getOtherGameTransactions = async (userId) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/user/game-transactions/${userId}`,
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
    console.error("Error fetching Other game transactions:", error.message);
    throw error;
  }
};

// --- Unified Function ---
export const getBetHistoryByGameType = async (
  gameType,
  userId,
  timer,
  extraData = {}
) => {
  switch (gameType) {
    case "wingo":
      return getWingoHistory({ userId, ...extraData });
    case "wingo5d":
      return getWingo5DHistory({ userId, timer, ...extraData });
    case "trx":
      return getTrxHistory({ userId, timer, ...extraData });
    case "other":
      return getOtherGameTransactions(userId);
    default:
      throw new Error("Invalid game type");
  }
};

// --- Set Wagering ---
export const setWageringPercentage = async (userId, percentage) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/setGameplayPercentage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, percentage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting wagering:", error.message);
    throw error;
  }
};

// --- Add Bank Account ---
export const addBankAccount = async (data) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/addnew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding bank account:", error.message);
    throw error;
  }
};

// --- Delete Bank Account ---
export const deleteBankAccount = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/admin/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting bank account:", error.message);
    throw error;
  }
};

export const fetchUserData = async (userId) => fetchUser(userId);
export const fetchUserAllData = async (userId) => fetchAllUserData(userId);
export const updateUserData = async (userId, formData) =>
  updateUser(userId, formData);
