import axios from "axios";
import { baseUrl } from "../config/server";

export const fetchUserWallets = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/user/wallet/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    throw error;
  }
};
export const fetchWalletSummary = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/wallet/summary`);
    return res.data;
  } catch (err) {
    console.error("Error fetching wallet summary:", err);
    throw err;
  }
};

export const fetchTodayBetStats = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/today-bet-stats`);
    return res.data;
  } catch (err) {
    console.error("Error fetching today bet stats:", err);
    throw err;
  }
};

export const fetchOnlineGameCount = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/games/online-count`);
    return res.data;
  } catch (err) {
    console.error("Error fetching online game count:", err);
    throw err;
  }
};
