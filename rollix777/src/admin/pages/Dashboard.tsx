import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../lib/config/server";
import { getAllRecharges } from "../../lib/services/rechargeService";
import {
  fetchWalletSummary,
  fetchTodayBetStats,
} from "../../lib/services/WalletServices";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recharges, setRecharges] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [betStats, setBetStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recharge" | "withdrawals">(
    "recharge"
  );

  // ===== Helpers =====
  const safeDate = (dateStr: any) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatNumber = (num: number) => {
    if (!num) return 0;
    if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
    if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, "") + " L";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + " K";
    return num.toString();
  };

  // ===== Fetch Data =====
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Recharges
        let rechargeRes: any = {};
        try {
          rechargeRes = await getAllRecharges(1, 1000);
        } catch (err) {
          console.error("Error fetching recharges:", err);
        }
        setRecharges(rechargeRes?.data || rechargeRes?.recharges || []);

        // Withdrawals
        let withdrawalRes: any = {};
        try {
          withdrawalRes = await axios.get(
            `${baseUrl}/api/wallet/withdrawl-requests/0?page=1&limit=50`
          );
        } catch (err) {
          console.error("Error fetching withdrawals:", err);
        }
        setWithdrawals(
          withdrawalRes?.data?.data || withdrawalRes?.data?.withdrawals || []
        );

        // Wallet summary
        let summaryRes: any = {};
        try {
          summaryRes = await fetchWalletSummary();
        } catch (err) {
          console.error("Error fetching wallet summary:", err);
        }
        setSummary(summaryRes || null);

        // Today Bet Stats
        let betStatsRes: any = {};
        try {
          betStatsRes = await fetchTodayBetStats();
        } catch (err) {
          console.error("Error fetching bet stats:", err);
        }
        setBetStats(betStatsRes || null);
      } catch (err: any) {
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ===== Metrics (from API) =====
  const totalUsers = summary?.totalUsers ?? 0;
  const todayUsersCount = summary?.totalUsersJoinToday ?? 0;
  const todaysWithdrawal = summary?.todaysTotalWithdrawalAmount ?? 0;
  const userBalance = summary?.totalWalletBalanceOfUsers ?? 0;

  // ===== Bet Stats =====
  const todaysTotalBet = betStats?.todaysTotalBet ?? 0;
  const todaysTotalWin = betStats?.todaysTotalWin ?? 0;
  const todaysTotalProfit = betStats?.todaysTotalProfit ?? 0;

  // ===== Metrics (frontend only) =====
  const totalRecharge = recharges
    .filter((r: any) => r.status?.toLowerCase() === "success")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const totalDeposit = recharges.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  const pendingRecharge = recharges.filter(
    (r: any) => r.status?.toLowerCase() === "pending"
  ).length;

  const successRecharge = recharges.filter(
    (r: any) => r.status?.toLowerCase() === "success"
  ).length;

  // ===== Stat Card Component =====
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl p-6 border border-purple-500/20 flex items-center justify-between shadow-lg">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-white">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={formatNumber(totalUsers)}
          icon={Users}
          color="bg-purple-500/30"
        />
        <StatCard
          title="Total Users Join (Today)"
          value={formatNumber(todayUsersCount)}
          icon={Users}
          color="bg-pink-500/30"
        />
        <StatCard
          title="Today's Withdrawal"
          value={`₹${formatNumber(todaysWithdrawal)}`}
          icon={ArrowUpCircle}
          color="bg-red-600/30"
        />
        <StatCard
          title="User Balance"
          value={`₹${formatNumber(userBalance)}`}
          icon={Wallet}
          color="bg-indigo-500/30"
        />
        <StatCard
          title="Total Recharge"
          value={`₹${formatNumber(totalRecharge)}`}
          icon={DollarSign}
          color="bg-green-500/30"
        />
        <StatCard
          title="Total Deposit"
          value={`₹${formatNumber(totalDeposit)}`}
          icon={Wallet}
          color="bg-blue-500/30"
        />
        <StatCard
          title="Pending Recharges"
          value={formatNumber(pendingRecharge)}
          icon={ArrowDownCircle}
          color="bg-yellow-500/30"
        />
        <StatCard
          title="Success Recharge"
          value={formatNumber(successRecharge)}
          icon={DollarSign}
          color="bg-green-500/30"
        />
        {/* New Bet Stats */}
        <StatCard
          title="Today's Total Bet"
          value={`₹${formatNumber(Number(todaysTotalBet))}`}
          icon={ArrowUpCircle}
          color="bg-blue-500/30"
        />
        <StatCard
          title="Today's Total Win"
          value={`₹${formatNumber(Number(todaysTotalWin))}`}
          icon={ArrowDownCircle}
          color="bg-green-500/30"
        />
        <StatCard
          title="Today's Profit"
          value={`₹${formatNumber(Number(todaysTotalProfit))}`}
          icon={DollarSign}
          color="bg-red-500/30"
        />
      </div>

      {/* ===== Tabs for Requests ===== */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="border-b border-purple-500/10 flex">
          <button
            className={`flex-1 py-4 px-6 font-medium ${
              activeTab === "recharge"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("recharge")}
          >
            Recharge Requests
          </button>
          <button
            className={`flex-1 py-4 px-6 font-medium ${
              activeTab === "withdrawals"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("withdrawals")}
          >
            Withdrawal Requests
          </button>
        </div>

        <div className="p-6">
          {activeTab === "recharge" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-purple-500/10">
                    <th className="pb-3">Order ID</th>
                    <th>User ID</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recharges.slice(0, 5).map((r) => {
                    const date = safeDate(r.date);
                    return (
                      <tr
                        key={r.recharge_id || r.id}
                        className="text-white border-b border-purple-500/10"
                      >
                        <td className="py-3">{r.order_id}</td>
                        <td>{r.userId}</td>
                        <td className="text-purple-400">₹{r.amount}</td>
                        <td>{r.mode}</td>
                        <td
                          className={`${
                            r.status === "success"
                              ? "text-green-400"
                              : r.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {r.status}
                        </td>
                        <td>{date ? date.toLocaleDateString() : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-purple-500/10">
                    <th>ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.slice(0, 5).map((w) => {
                    const date = safeDate(w.createdAt);
                    return (
                      <tr
                        key={w.withdrawalId || w.id}
                        className="text-white border-b border-purple-500/10"
                      >
                        <td className="py-3">#{w.withdrawalId || w.id}</td>
                        <td>{w.user?.name || w.user?.username || w.userId}</td>
                        <td className="text-red-400">
                          ₹{w.amount} {w.cryptoname || ""}
                        </td>
                        <td>
                          {"walletAddress" in (w.withdrawalDetails || {})
                            ? "CRYPTO"
                            : "BANK"}
                        </td>
                        <td
                          className={`${
                            w.withdrawalStatus?.code === "0"
                              ? "text-yellow-400"
                              : w.withdrawalStatus?.code === "1"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {w.withdrawalStatus?.status || "Unknown"}
                        </td>
                        <td>{date ? date.toLocaleDateString() : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
