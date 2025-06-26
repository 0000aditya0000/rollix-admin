import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Eye,
  Check,
  X,
  User,
  IndianRupeeIcon,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../lib/config/server";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface KYCRequest {
  user_id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  referral_code: string;
  kyc_status: {
    code: number;
    text: string;
  };
  documents: {
    aadharfront: string | null;
    aadharback: string | null;
    pan: string | null;
  };
  created_at: string;
}

interface Withdrawal {
  withdrawalId: number;
  amount: string;
  cryptoname: string;
  requestDate: string;
  withdrawalStatus: {
    code: string;
    status: string;
  };
  user: {
    username: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  withdrawalDetails: {
    accountName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    branch?: string | null;
    bankAccountStatus?: string | null;
    walletAddress?: string | null;
    networkType?: string | null;
  };
}

interface TransactionData {
  total_transactions: number;
  total_amount: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"kyc" | "withdrawals">("kyc");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<Withdrawal[]>(
    []
  );
  const [loadingKYC, setLoadingKYC] = useState(true);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [loadingTotalTransaction, setLoadingTotalTransaction] = useState(true);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://api.rollix777.com/api/user/allusers"
        );
        setUsers(response.data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch users");
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchKYCRequests = async () => {
      try {
        setLoadingKYC(true);
        const url = new URL("api/user/pending-kyc", baseUrl);
        url.searchParams.append("status", "0"); // Pending status
        url.searchParams.append("page", "1");
        url.searchParams.append("limit", "5");

        const response = await axios.get(url.toString());
        if (response.data.success) {
          setKycRequests(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch KYC requests"
          );
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch KYC requests");
      } finally {
        setLoadingKYC(false);
      }
    };

    const fetchWithdrawalRequests = async () => {
      try {
        setLoadingWithdrawals(true);
        const response = await axios.get(
          `${baseUrl}/api/wallet/withdrawl-requests/0?page=1&limit=5`
        );
        if (response.data.success) {
          setWithdrawalRequests(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch withdrawal requests"
          );
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch withdrawal requests");
      } finally {
        setLoadingWithdrawals(false);
      }
    };

    const fetchTodayTotalTransaction = async () => {
      try {
        setLoadingTotalTransaction(true);
        const response = await axios.get(
          `${baseUrl}/api/recharge/report/today-recharge-summary`
        );
        if (response.data.success) {
          setTransactionData(response.data || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch recharge summary"
          );
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch recharge summary");
      } finally {
        setLoadingTotalTransaction(false);
      }
    };

    fetchKYCRequests();
    fetchWithdrawalRequests();
    fetchTodayTotalTransaction();
  }, []);

  const totalUsers = users.length;
  const totalTransactions = "₹0";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (code: number | string) => {
    switch (code.toString()) {
      case "1":
        return "text-green-400";
      case "2":
        return "text-red-400";
      case "0":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const handleViewAllUsers = () => {
    navigate("/admin/users");
  };

  if (error) {
    return <div className="text-red-500 text-center py-6">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Card */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Users</p>
                <h2 className="text-3xl font-bold text-white">
                  {totalUsers?.toLocaleString()}
                </h2>
                <p className="text-green-400 text-sm mt-2">+124 this week</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <button
              onClick={handleViewAllUsers}
              className="mt-4 py-2 px-4 bg-[#1A1A2E] text-purple-400 rounded-lg text-sm hover:bg-purple-500/10 transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              <span>View All Users</span>
            </button>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              {transactionData && (
                <div>
                  <p className="text-gray-400 mb-1">Total Transactions</p>
                  <h2 className="text-3xl font-bold text-white">
                    ₹ {transactionData.total_amount}
                  </h2>
                  <p className="text-green-400 text-sm mt-2">
                    {transactionData.total_transactions} Total Transactions
                  </p>
                </div>
              )}
              <div className="p-3 bg-green-500/20 rounded-xl">
                <IndianRupeeIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
            {/* <button className="mt-4 py-2 px-4 bg-[#1A1A2E] text-green-400 rounded-lg text-sm hover:bg-green-500/10 transition-colors flex items-center gap-2">
              <Eye size={16} />
              <span>View All Transactions</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="border-b border-purple-500/10">
          <div className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "kyc"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("kyc")}
            >
              KYC Requests
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "withdrawals"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("withdrawals")}
            >
              Withdrawal Requests
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "kyc" ? (
            <div className="overflow-x-auto">
              {loadingKYC ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
              ) : kycRequests.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No pending KYC requests
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">User</th>
                      <th className="pb-4 font-medium">Email</th>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycRequests.map((request) => (
                      <tr
                        key={request.user_id}
                        className="border-t border-purple-500/10 text-white"
                      >
                        <td className="py-4">#{request.user_id}</td>
                        <td className="py-4">
                          {request.name || request.username}
                        </td>
                        <td className="py-4">{request.email}</td>
                        <td className="py-4">
                          {formatDate(request.created_at)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`font-medium ${getStatusColor(
                              request.kyc_status.code
                            )}`}
                          >
                            {request.kyc_status.text}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {loadingWithdrawals ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
              ) : withdrawalRequests.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No pending withdrawal requests
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">User</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Method</th>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalRequests.map((request) => (
                      <tr
                        key={request.withdrawalId}
                        className="border-t border-purple-500/10 text-white"
                      >
                        <td className="py-4">#{request.withdrawalId}</td>
                        <td className="py-4">
                          {request.user.name || request.user.username}
                        </td>
                        <td className="py-4">
                          <span className="font-medium">
                            {Number(request.amount).toLocaleString()}{" "}
                            {request.cryptoname.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium">
                            {"walletAddress" in request.withdrawalDetails
                              ? "CRYPTO"
                              : "BANK TRANSFER"}
                          </span>
                        </td>
                        <td className="py-4">
                          {formatDate(request.requestDate)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`font-medium ${getStatusColor(
                              request.withdrawalStatus.code
                            )}`}
                          >
                            {request.withdrawalStatus.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
