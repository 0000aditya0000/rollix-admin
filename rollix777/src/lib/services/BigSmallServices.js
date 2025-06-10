import axios from "axios";
import { baseUrl } from "../config/server.js";

export const fetchResults = async (duration) => {
  try {
    const response = await axios.post(`${baseUrl}/api/color/results`, {
      duration
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateResult = async(periodNumber, duration)  => {
  try {
    if (!periodNumber || isNaN(periodNumber)) {
      throw new Error("Invalid period number");
    }

    const response = await axios.post(`${baseUrl}/api/color/generate-result`, {
      periodNumber: Number(periodNumber),
      duration
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to generate result"
      );
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw error;
    }
  }
};

export const getBetHistory = async userId => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/color/bet-history`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkValidBet = async (userId,duration) => {
  try {
    const response = await axios.post(`${baseUrl}/api/color/checkValidBet`, {
      userId,duration
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const placeBet = async betData => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/color/place-bet`,
      betData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
