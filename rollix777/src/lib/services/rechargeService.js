import axios from 'axios';
import { baseUrl } from '../config/server';

// Get all recharges
export const getAllRecharges = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/recharge/get-all-recharges`, {
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

// Get recharge details by order ID
export const getRechargeByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/recharge/recharge-detail/${orderId}`, {
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