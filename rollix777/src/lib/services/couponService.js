import axios from 'axios';

import { baseUrl } from "../config/server";

// Create a new coupon
export const createCoupon = async (couponData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/coupons/create`, couponData, {
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

// Redeem a coupon
export const redeemCoupon = async (userId, code) => {
  try {
    const response = await axios.post(`${baseUrl}/api/coupons/redeem`, 
      { 
        code, 
        userId 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all coupons
export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/coupons/all`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get coupon redemption history
export const getCouponHistory = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/coupons/history/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 
