import axios from 'axios';

import { baseUrl } from "../config/server";


export const getQueries = async (params = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/api/queries/admin/all`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status,
        priority: params.priority,
        search: params.search,
      },
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

export const queryComment = async (id,comment) =>{
  try{
    const response = await axios.post(`${baseUrl}/api/queries/${id}/comment`,comment,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }catch(error){
    throw error.response?.data || error.message;
  }
}

export const queryStatus = async (queryId, data) => {
  try {
    const response = await axios.put(`${baseUrl}/api/queries/${queryId}/status`, data, {
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