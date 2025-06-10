import axios from 'axios';
import { baseUrl } from '../config/server';

export const getAllTransactions = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/transactions/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };