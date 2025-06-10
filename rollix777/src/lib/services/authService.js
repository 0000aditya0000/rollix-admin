import { baseUrl } from '../config/server';

const request = async (endpoint, data) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Auth Request Error:', error.message);
        throw error;
    }
};

export const signin = async (data) => request('/api/user/login', data);
export const register = async (data) => request('/api/user/register', data);
