interface UserResponse {
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
    wallet: Array<{
      id: number;
      userId: number;
      balance: string;
      cryptoname: string;
    }>;
    referrals: Array<{
      id: number;
      referrer_id: number;
      referred_id: number;
      level: number;
      referred_username: string;
    }>;
  };
}

export function fetchUserData(userId: string | number): Promise<UserResponse>;
export function fetchUserAllData(userId: string | number): Promise<UserResponse>;
export function updateUserData(userId: string | number, formData: any): Promise<UserResponse>; 