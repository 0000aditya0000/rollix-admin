export interface RechargeResponse {
  data: Recharge[];
  totalPages: number;
  totalRecharges: number;
}

export interface RechargeDetailResponse {
  recharge?: RechargeDetail;
}

export interface Recharge {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time: string;
  data?: any[];
}

export interface RechargeDetail {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time: string;
  user_name?: string;
  email?: string;
  phone?: string;
  transaction_id?: string;
  id?: number;
  recharge_amount?: string;
  recharge_type?: string;
  payment_mode?: string;
  recharge_status?: string;
}

export declare function getAllRecharges(page: number, limit: number): Promise<RechargeResponse>;
export declare function getRechargeByOrderId(orderId: string): Promise<RechargeDetailResponse>;
export declare function getSortedRecharges(type: string, mode: string, page?: number, limit?: number): Promise<RechargeResponse>;
