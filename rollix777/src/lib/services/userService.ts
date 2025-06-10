import axios from 'axios';

interface UserAllDataResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
      phone: string;
      dob: string | null;
      aadhar: string | null;
      pan: string | null;
      kycstatus: number;
      image: string;
      my_referral_code: string;
      referred_by: string | null;
    };
    wallet: {
      id: number;
      userId: number;
      balance: string;
      cryptoname: string;
    }[];
    bankAccounts: any[];
    referrals: any[];
    withdrawals: any[];
    kyc: {
      status: number;
      aadhar: string | null;
      pan: string | null;
    };
  };
}

export const fetchUserAllData = async (userId: string | number): Promise<UserAllDataResponse> => {
  try {
    const response = await axios.get(`https://api.rollix777.com/api/user/user-all-data/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 