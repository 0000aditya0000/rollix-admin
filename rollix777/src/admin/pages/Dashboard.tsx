import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  CreditCard,
  User,
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

// ===== Utility Helpers =====
const safeDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

const formatNumber = (num: number) => {
  if (!num) return "0";

  if (num >= 10000000) {
    // 1 crore or more
    return (num / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
  }

  if (num >= 100000) {
    // 1 lakh or more
    return (num / 100000).toFixed(1).replace(/\.0$/, "") + " L";
  }

  // less than 1 lakh → show actual number
  return num.toString();
};

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
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </div>
);

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
            `${baseUrl}/api/wallet/withdrawl-requests/1?page=1&limit=50`
          );
        } catch (err) {
          console.error("Error fetching withdrawals:", err);
        }
        setWithdrawals(withdrawalRes?.data?.data || []);

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
      } catch (err) {
        toast.error("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  console.log(withdrawals, "withdrawals");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  // ===== Metrics (from APIs) =====
  const totalUsers = summary?.totalUsers ?? 0;
  const todayUsersCount = summary?.totalUsersJoinToday ?? 0;
  const todaysWithdrawal = summary?.todaysTotalWithdrawalAmount ?? 0;
  const totalWithdrawal = summary?.totalWithdrawal ?? 0;
  const userBalance = summary?.totalWalletBalanceOfUsers ?? 0;
  const todayRechargeAmount = summary?.todayTotalRechargeAmount ?? 0;
  const alltimeRechargeAmount = summary?.alltimeTotalRechargeAmount ?? 0;
  const todayRechargeCount = summary?.numberOfSuccessfulRechargeToday ?? 0;
  const alltimeRechargeCount = summary?.numberOfSuccessfulRechargeAlltime ?? 0;
  const totalUsersJoinYesterday = summary?.totalUsersJoinYesterday ?? 0;
  const yesterdayTotalRechargeAmount =
    summary?.yesterdayTotalRechargeAmount ?? 0;
  const yesterdayTotalWithdrawalAmount =
    summary?.yesterdayTotalWithdrawalAmount ?? 0;

  const todaysTotalBet = betStats?.todaysTotalBet ?? 0;
  const todaysTotalWin = betStats?.todaysTotalWin ?? 0;
  const todaysTotalProfit = betStats?.todaysTotalProfit ?? 0;
  const alltimeTotalBet = betStats?.alltimeTotalBet ?? 0;
  const alltimeTotalWin = betStats?.alltimeTotalWin ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Users */}
        <StatCard
          title="Total Users"
          value={formatNumber(totalUsers)}
          icon={Users}
          color="bg-purple-500/30"
        />
        <StatCard
          title="New Users Today"
          value={formatNumber(todayUsersCount)}
          icon={Users}
          color="bg-pink-500/30"
        />

        {/* Wallet & Withdrawals */}
        <StatCard
          title="Withdrawals Today"
          value={`₹${formatNumber(todaysWithdrawal)}`}
          icon={ArrowUpCircle}
          color="bg-red-600/30"
        />
        <StatCard
          title="Total Withdrawals"
          value={`₹${formatNumber(totalWithdrawal)}`}
          icon={ArrowDownCircle}
          color="bg-red-500/30"
        />
        <StatCard
          title="Total Wallet Balance"
          value={`₹${formatNumber(userBalance)}`}
          icon={Wallet}
          color="bg-indigo-500/30"
        />

        {/* Recharges */}
        <StatCard
          title="Today's Recharge Amount"
          value={`₹${formatNumber(todayRechargeAmount)}`}
          icon={DollarSign}
          color="bg-green-500/30"
        />
        <StatCard
          title="Today Total Recharges"
          value={formatNumber(todayRechargeCount)}
          icon={ArrowUpCircle}
          color="bg-yellow-500/30"
        />
        <StatCard
          title="All-Time Recharge Amount"
          value={`₹${formatNumber(alltimeRechargeAmount)}`}
          icon={DollarSign}
          color="bg-blue-500/30"
        />
        <StatCard
          title="All-Time Successful Recharges"
          value={formatNumber(alltimeRechargeCount)}
          icon={ArrowUpCircle}
          color="bg-green-600/30"
        />
        <StatCard
          title="Yesterday's Total Users"
          value={formatNumber(totalUsersJoinYesterday)}
          icon={Users}
          color="bg-blue-600/30"
        />

        <StatCard
          title="Yesterday's Total Recharges"
          value={formatNumber(yesterdayTotalRechargeAmount)}
          icon={CreditCard}
          color="bg-green-600/30"
        />

        <StatCard
          title="Yesterday's Total Withdrawals"
          value={formatNumber(yesterdayTotalWithdrawalAmount)}
          icon={ArrowDownCircle}
          color="bg-red-600/30"
        />

        {/* Bet Stats */}
        {/* <StatCard
          title="Today's Bet"
          value={`₹${formatNumber(todaysTotalBet)}`}
          icon={ArrowUpCircle}
          color="bg-blue-500/30"
        />
        <StatCard
          title="Today's Win"
          value={`₹${formatNumber(todaysTotalWin)}`}
          icon={ArrowDownCircle}
          color="bg-green-500/30"
        /> */}
        {/* <StatCard
          title="Today's Profit"
          value={`₹${formatNumber(todaysTotalProfit)}`}
          icon={DollarSign}
          color="bg-red-500/30"
        /> */}
        {/* <StatCard
          title="All-Time Bet"
          value={`₹${formatNumber(alltimeTotalBet)}`}
          icon={ArrowUpCircle}
          color="bg-purple-600/30"
        />
        <StatCard
          title="All-Time Win"
          value={`₹${formatNumber(alltimeTotalWin)}`}
          icon={ArrowDownCircle}
          color="bg-indigo-600/30"
        /> */}
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
              <table className="w-full table-fixed">
                <thead>
                  <tr className="align-middle text-gray-400 text-sm border-b border-purple-500/10">
                    <th className="pb-3 text-left px-4">Order ID</th>
                    <th className="text-left px-4">User ID</th>
                    <th className="text-right px-4">Amount</th>
                    <th className="text-left px-4">Mode</th>
                    <th className="text-left px-4">Status</th>
                    <th className="text-left px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recharges
                    .filter((r) => r.status === "success")
                    .slice(0, 5)
                    .map((r) => {
                      const date = safeDate(r.date);
                      return (
                        <tr
                          key={r.recharge_id || r.id}
                          className="align-middle text-white border-b border-purple-500/10"
                        >
                          <td className="py-3 text-left px-4">{r.order_id}</td>
                          <td className="text-left px-4">{r.userId}</td>
                          <td className="text-right px-4 text-purple-400">
                            ₹{r.amount}
                          </td>
                          <td className="text-left px-4">{r.mode}</td>
                          <td
                            className={`text-left px-4 ${
                              r.status === "success"
                                ? "text-green-400"
                                : r.status === "pending"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {r.status}
                          </td>
                          <td className="text-left px-4">
                            {date ? date.toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="align-middle text-gray-400 text-sm border-b border-purple-500/10">
                    <th className="pb-3 text-left px-4">ID</th>
                    <th className="text-left px-4">User ID</th>
                    <th className="text-right px-4">Amount</th>
                    <th className="text-left px-4">Status</th>
                    <th className="text-left px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.slice(0, 5).map((w) => {
                    const date = safeDate(w.createdOn);
                    return (
                      <tr
                        key={w.id}
                        className="align-middle text-white border-b border-purple-500/10"
                      >
                        <td className="py-3 text-left px-4">
                          #{w.withdrawalId}
                        </td>
                        <td className="text-left px-4">{w.user.userId}</td>
                        <td className="text-right px-4 text-red-400">
                          ₹{w.amountRequested}
                        </td>
                        {/* <td
                          className={`text-left px-4 ${
                            w.status === 0
                              ? "text-yellow-400"
                              : w.status === 1
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {w.status === 0
                            ? "Pending"
                            : w.status === 1
                            ? "Approved"
                            : "Rejected"}
                        </td> */}
                        <td className={"text-left px-4 text-green-400"}>
                          {w.withdrawalStatus.status}
                        </td>
                        <td className="text-left px-4">
                          {w.requestDate
                            ? new Date(w.requestDate).toLocaleDateString()
                            : "-"}
                        </td>
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
