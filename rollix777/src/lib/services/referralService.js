import { baseUrl } from '../config/server';

const getReferrals = async (userId) => {
 
    try {
        const response = await fetch(`${baseUrl}/api/user/referrals/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch referrals');
        }

        const data = await response.json();
       
        return data;
    } catch (error) {
        console.error('Error fetching referrals:', error);
        throw error;
    }
};

export const referralService = {
    getReferrals,
};

export default referralService; 