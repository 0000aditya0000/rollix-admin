import axios from "axios";

import { baseUrl } from "../config/server";

export const getColorReport = async (periodnumber, duration) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/color/color-bet-report/${periodnumber}?duration=${duration}min`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getwingo5dReport = async (periodnumber, timer) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/5d/report-5d/?periodNumber=${periodnumber}&timer=${timer}min`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTrxReport = async (periodnumber, timer) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/trx/report-trx/?periodNumber=${periodnumber}&timer=${timer}min`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserReport = async (userId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/user/user-bet-stats/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const getTransactionsReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/user/report/transactions`,
      {
        params: { start: startDate, end: endDate },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
