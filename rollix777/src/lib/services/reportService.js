import axios from 'axios';

import { baseUrl } from "../config/server";

export const getColorReport = async (periodnumber) => {
    try {
      const response = await axios.get(`${baseUrl}/api/color/color-bet-report/${periodnumber}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  export const getUserReport = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/user-bet-stats/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };