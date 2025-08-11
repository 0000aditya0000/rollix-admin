import { useState, useEffect } from "react";
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Calendar,
} from "lucide-react";
import {
  getColorReport,
  getwingo5dReport,
  getUserReport,
  getTransactionsReport,
  getTrxReport,
} from "../../lib/services/reportService";
import { TransactionReport } from "../../lib/utils/exportToExcel";
import { exportTransactionsToExcel } from "../../lib/utils/exportToExcel";

interface ColorBet {
  total_bets: number;
  total_amount: number;
  unique_users: number;
}

interface GameResult {
  winning_color: string;
  winning_number: number;
}

interface GameData {
  success: boolean;
  period_number: string;
  result: GameResult;
  color_bets: {
    red: ColorBet;
    green: ColorBet;
    voilet: ColorBet;
  };
  summary: {
    total_bets: number;
    total_amount: number;
    total_unique_users: number;
  };
}

interface BetDistribution {
  color: number;
  number: number;
  size: number;
}

interface Statistics {
  total_bets: number;
  total_bet_amount: number;
  total_winnings: number;
  total_wins: number;
  win_rate: string;
  profit_loss: number;
  bet_distribution: BetDistribution;
}

interface GameStat {
  gameId: string;
  total_bets: number;
  total_bet_amount: number;
  total_win_amount: number;
}

interface OtherGameStats {
  total_turnover_bets: number;
  total_turnover_amount: number;
  total_turnover_wins: number;
  total_turnover_win_amount: number;
  turnover_profit_loss: number;
  game_distribution: GameStat[];
}

interface RecentBet {
  period_number: number;
  bet_type: string;
  bet_value: string;
  amount: number;
  winnings: number;
  result: "won" | "lost";
  placed_at: string;
  data: [];
}

interface RecentBetsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: RecentBet[];
}

interface UserReport {
  success: boolean;
  statistics: Statistics;
  recent_bets: RecentBetsResponse;
  other_game_stats: OtherGameStats;
}

interface PositionBet {
  total_bets: number;
  total_amount: number;
  unique_users: number;
}

interface Digits {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

interface WingoResult {
  draw_number: string;
  digits: Digits;
  sum: number;
}

export interface WingoGameData {
  success: boolean;
  period_number: string;
  timer: string;
  result: WingoResult;
  position_bets: Record<string, PositionBet>;
  size_bets: Record<string, PositionBet>;
  summary: {
    total_bets: number;
    total_amount: number;
    total_unique_users: number;
  };
}

interface TrxGameResult {
  number: number;
  color: "red" | "green" | "purple";
  size: "big" | "small";
}

interface TrxBetData {
  total_bets: number;
  total_amount: number;
  unique_users: number;
}

interface TrxGameSummary {
  total_bets: number;
  total_amount: number;
  total_unique_users: number;
}

interface TrxGameData {
  period_number: number;
  result: TrxGameResult;
  color_bets: Record<string, TrxBetData>;
  size_bets: Record<string, TrxBetData>;
  summary: TrxGameSummary;
}

const Reports = () => {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periodNumber, setPeriodNumber] = useState<string>("");
  const [wingo5dPeriodNumber, setWingo5dPeriodNumber] = useState<string>("");
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [userReportLoading, setUserReportLoading] = useState(false);
  const [userReportError, setUserReportError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [transactionReport, setTransactionReport] =
    useState<TransactionReport | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [wingoGameData, setWingoGameData] = useState<WingoGameData | null>(
    null
  );
  const [timer, setTimer] = useState(1);
  const [trxPeriodNumber, setTrxPeriodNumber] = useState("");
  const [trxGameData, setTrxGameData] = useState<TrxGameData | null>(null);
  const [trxTimer, setTrxxTimer] = useState(1);
  const [activeTab, setActiveTab] = useState("wingo");

  const durationsVal = [1, 3, 5, 10];
  const timerVal = [1, 3, 5, 10];
  const trxdurationVal = [1];

  const fetchGameData = async () => {
    if (!periodNumber) {
      setError("Please enter a period number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getColorReport(periodNumber, duration);
      if (response.success) {
        setGameData(response);
      } else {
        setError("Failed to fetch game data");
      }
    } catch (error) {
      setError("Error fetching game data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWingo5dData = async () => {
    if (!wingo5dPeriodNumber) {
      setError("Please enter a period number");
    }

    try {
      // setError(null);
      const response = await getwingo5dReport(wingo5dPeriodNumber, timer);
      if (response.success) {
        setWingoGameData(response);
      } else {
        setError("Failed to fetching game data");
      }
    } catch (error) {
      console.log(error, "Error fetching game data");
      setError("Failed to fetch Game data.");
    }
  };

  const fetchTrxGameData = async () => {
    if (!trxPeriodNumber) return setError("Please enter a period number");

    try {
      const response = await getTrxReport(trxPeriodNumber, trxTimer);
      if (response.success) {
        setTrxGameData(response);
      } else {
        setError("Failed to fetch Game data");
      }
    } catch (error) {
      console.log(error, "Failed to fetch game data");
      setError("Error fetching game data");
    }
  };

  const fetchUserReport = async () => {
    if (!userId) {
      setUserReportError("Please enter a user ID");
      return;
    }

    try {
      setUserReportLoading(true);
      setUserReportError(null);
      const response = await getUserReport(userId);
      if (response.success) {
        setUserReport(response);
      } else {
        setUserReportError("Failed to fetch user report");
      }
    } catch (error) {
      console.error("Error fetching user report:", error);
      setUserReportError("Error fetching user report");
    } finally {
      setUserReportLoading(false);
    }
  };

  const fetchTransactionReport = async () => {
    try {
      const data = await getTransactionsReport(startDate, endDate);
      setTransactionReport(data);
    } catch (error) {
      console.error("Error fetching transaction report:", error);
      setError("Error fetching transaction report");
    }
  };

  useEffect(() => {
    fetchUserReport();
  }, []);

  // const handleRefresh = () => {
  //   fetchGameData();
  // };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Reports</h1>

      {/* Report Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setReportType("daily")}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === "daily"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setReportType("weekly")}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === "weekly"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setReportType("monthly")}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === "monthly"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === "bar"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === "line"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            <LineChart size={20} />
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === "pie"
                ? "bg-purple-600"
                : "bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]"
            }`}
          >
            <PieChart size={20} />
          </button>
        </div>

        <button className="py-2 px-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-[#2f2f5a] transition-colors">
          <Calendar size={18} />
          <span>Date Range</span>
        </button>

        <button className="py-2 px-4 bg-green-600 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Revenue Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">WINGO Report</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {durationsVal.map((value) => (
                  <button
                    key={value}
                    onClick={() => setDuration(value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium border ${
                      duration === value
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-transparent text-gray-300 border-purple-500/30 hover:border-purple-500"
                    } transition-all`}
                  >
                    {value} min
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={periodNumber}
                  onChange={(e) => setPeriodNumber(e.target.value)}
                  placeholder="Enter Period Number"
                  className="w-40 py-2 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                {error && !periodNumber && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={fetchGameData}
                disabled={loading || !periodNumber}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loading || !periodNumber
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  "Fetch Report"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading game data...</p>
              </div>
            </div>
          ) : error && periodNumber ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchGameData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : gameData ? (
            <div className="space-y-6">
              {/* Period and Result */}
              {gameData && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Period Number</p>
                    <p className="text-white text-xl font-bold">
                      #{gameData.period_number}
                    </p>
                  </div>
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Winning Number</p>
                    <p className="text-white text-xl font-bold">
                      {gameData?.result?.winning_number}
                    </p>
                  </div>
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Winning Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          gameData.result?.winning_color === "red"
                            ? "bg-red-500"
                            : gameData.result?.winning_color === "green"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <p className="text-white text-xl font-bold capitalize">
                        {gameData.result?.winning_color}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Color Bets */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(gameData.color_bets).map(([color, data]) => (
                  <div
                    key={color}
                    className={`bg-[#1A1A2E] p-4 rounded-lg border ${
                      color === gameData.result?.winning_color
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-purple-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          color === "red"
                            ? "bg-red-500"
                            : color === "green"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <p className="text-white font-medium capitalize">
                        {color}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm">Total Bets</p>
                        <p className="text-white font-medium">
                          {data.total_bets}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white font-medium">
                          ₹{data.total_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Unique Users</p>
                        <p className="text-white font-medium">
                          {data.unique_users}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Bets</p>
                    <p className="text-white font-medium">
                      {gameData.summary.total_bets}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-medium">
                      ₹{gameData.summary.total_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Unique Users</p>
                    <p className="text-white font-medium">
                      {gameData.summary.total_unique_users}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">
                  Enter a period number and click "Fetch Report" to view game
                  data
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wingo 5d Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">WINGO5D Report</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {timerVal.map((value) => (
                  <button
                    key={value}
                    onClick={() => setTimer(value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium border ${
                      timer === value
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-transparent text-gray-300 border-purple-500/30 hover:border-purple-500"
                    } transition-all`}
                  >
                    {value} min
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={wingo5dPeriodNumber}
                  onChange={(e) => setWingo5dPeriodNumber(e.target.value)}
                  placeholder="Enter Period Number"
                  className="w-40 py-2 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                {error && !wingo5dPeriodNumber && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={fetchWingo5dData}
                disabled={loading || !wingo5dPeriodNumber}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loading || !wingo5dPeriodNumber
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  "Fetch Report"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading game data...</p>
              </div>
            </div>
          ) : error && periodNumber ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchWingo5dData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : wingoGameData ? (
            <div className="space-y-6">
              {/* Period and Result */}
              {wingoGameData && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Period Number</p>
                    <p className="text-white text-xl font-bold">
                      #{wingoGameData.period_number}
                    </p>
                  </div>
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Winning Number</p>
                    <p className="text-white text-xl font-bold">
                      {wingoGameData?.result?.draw_number}
                    </p>
                  </div>
                  <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                    <p className="text-gray-400 text-sm mb-1">Sum</p>
                    <p className="text-white text-xl font-bold capitalize">
                      {wingoGameData.result?.sum}
                    </p>
                  </div>
                </div>
              )}

              {/* Digit Results */}
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(wingoGameData.result?.digits || {}).map(
                  ([position, digit]) => {
                    return (
                      <div
                        key={position}
                        className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-white font-medium">
                            Position {position}
                          </p>
                          <span className="text-xl font-bold text-purple-400">
                            {digit}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Summary */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Bets</p>
                    <p className="text-white font-medium">
                      {wingoGameData.summary.total_bets}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-medium">
                      ₹{wingoGameData.summary.total_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Unique Users</p>
                    <p className="text-white font-medium">
                      {wingoGameData.summary.total_unique_users}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">
                  Enter a period number and click "Fetch Report" to view game
                  data
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trx gmae Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">TRX Report</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDuration(trxdurationVal[0])}
                  className={`px-3 py-1 rounded-md text-sm font-medium border ${
                    trxTimer === trxdurationVal[0]
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-transparent text-gray-300 border-purple-500/30 hover:border-purple-500"
                  } transition-all`}
                >
                  {durationsVal[0]} min
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={trxPeriodNumber}
                  onChange={(e) => setTrxPeriodNumber(e.target.value)}
                  placeholder="Enter Period Number"
                  className="w-40 py-2 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                {error && !trxPeriodNumber && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={fetchTrxGameData}
                disabled={loading || !trxPeriodNumber}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loading || !trxPeriodNumber
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  "Fetch Report"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading game data...</p>
              </div>
            </div>
          ) : error && trxPeriodNumber ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchTrxGameData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : trxGameData ? (
            <div className="space-y-6">
              {/* Period and Result */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Period Number</p>
                  <p className="text-white text-xl font-bold">
                    #{trxGameData.period_number}
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Winning Number</p>
                  <p className="text-white text-xl font-bold">
                    {trxGameData?.result?.number}
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Winning Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        trxGameData.result?.color === "red"
                          ? "bg-red-500"
                          : trxGameData.result?.color === "green"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <p className="text-white text-xl font-bold capitalize">
                      {trxGameData.result?.color}
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Bets */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(trxGameData.color_bets).map(([color, data]) => (
                  <div
                    key={color}
                    className={`bg-[#1A1A2E] p-4 rounded-lg border ${
                      color === trxGameData.result?.color
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-purple-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          color === "red"
                            ? "bg-red-500"
                            : color === "green"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <p className="text-white font-medium capitalize">
                        {color}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm">Total Bets</p>
                        <p className="text-white font-medium">
                          {data.total_bets}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white font-medium">
                          ₹{data.total_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Unique Users</p>
                        <p className="text-white font-medium">
                          {data.unique_users}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Size Bets */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(trxGameData.size_bets).map(([size, data]) => (
                  <div
                    key={size}
                    className={`bg-[#1A1A2E] p-4 rounded-lg border ${
                      size === trxGameData.result?.size
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-purple-500/10"
                    }`}
                  >
                    <p className="text-white font-medium capitalize mb-2">
                      {size}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm">Total Bets</p>
                        <p className="text-white font-medium">
                          {data.total_bets}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white font-medium">
                          ₹{data.total_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Unique Users</p>
                        <p className="text-white font-medium">
                          {data.unique_users}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Bets</p>
                    <p className="text-white font-medium">
                      {trxGameData.summary.total_bets}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-medium">
                      ₹{trxGameData.summary.total_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Unique Users</p>
                    <p className="text-white font-medium">
                      {trxGameData.summary.total_unique_users}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">
                  Enter a period number and click "Fetch Report" to view game
                  data
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">User Activity</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-40 py-2 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                {userReportError && !userId && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">
                    {userReportError}
                  </p>
                )}
              </div>
              <button
                onClick={fetchUserReport}
                disabled={userReportLoading || !userId}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  userReportLoading || !userId
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {userReportLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  "Fetch Report"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {userReportLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading user activity...</p>
              </div>
            </div>
          ) : userReportError && userId ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{userReportError}</p>
                <button
                  onClick={fetchUserReport}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : userReport ? (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Total Bets</p>
                  <p className="text-white text-xl font-bold">
                    {userReport?.statistics?.total_bets || 0}
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Total Bet Amount</p>
                  <p className="text-white text-xl font-bold">
                    ₹{userReport?.statistics?.total_bet_amount || 0}
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Total Winnings</p>
                  <p className="text-white text-xl font-bold">
                    ₹{userReport?.statistics?.total_winnings || 0}
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Total Wins</p>
                  <p className="text-white text-xl font-bold">
                    {userReport?.statistics?.total_wins || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                  <p className="text-white text-xl font-bold">
                    {userReport?.statistics?.win_rate || "0"}%
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
                  <p
                    className={`text-xl font-bold ${
                      (userReport?.statistics?.profit_loss || 0) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    ₹{Math.abs(userReport?.statistics?.profit_loss || 0)}
                  </p>
                </div>
              </div>

              {/* Bet Distribution */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">
                  Bet Distribution
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Color Bets</p>
                    <p className="text-white font-medium">
                      ₹{userReport?.statistics?.bet_distribution?.color || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Number Bets</p>
                    <p className="text-white font-medium">
                      ₹{userReport?.statistics?.bet_distribution?.number || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Size Bets</p>
                    <p className="text-white font-medium">
                      ₹{userReport?.statistics?.bet_distribution?.size || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Bets Table */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">Recent Bets</h3>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab("wingo")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === "wingo"
                        ? "bg-purple-600 text-white"
                        : "bg-transparent text-gray-400 border border-purple-500/30"
                    }`}
                  >
                    Wingo
                  </button>
                  <button
                    onClick={() => setActiveTab("other")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      activeTab === "other"
                        ? "bg-purple-600 text-white"
                        : "bg-transparent text-gray-400 border border-purple-500/30"
                    }`}
                  >
                    Other Games
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {activeTab === "wingo" ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm">
                          <th className="px-6 pb-3">Period</th>
                          <th className="px-6 pb-3">Type</th>
                          <th className="px-6 pb-3">Value</th>
                          <th className="px-6 pb-3">Amount</th>
                          <th className="px-6 pb-3">Winnings</th>
                          <th className="px-6 pb-3">Result</th>
                          <th className="px-6 pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReport?.recent_bets?.data?.length > 0 ? (
                          userReport.recent_bets.data.map((bet, index) => (
                            <tr
                              key={index}
                              className="border-t border-purple-500/10"
                            >
                              <td className="py-4 px-6 text-white">
                                #{bet.period_number}
                              </td>
                              <td className="py-4 px-6 text-white capitalize">
                                {bet.bet_type}
                              </td>
                              <td className="py-4 px-4 text-white capitalize">
                                {bet.bet_value}
                              </td>
                              <td className="py-4 px-6 text-white">
                                ₹ {bet.amount}
                              </td>
                              <td className="py-4 px-6 text-white">
                                ₹ {bet.winnings}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    bet.result === "won"
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-red-500/20 text-red-500"
                                  }`}
                                >
                                  {bet.result}
                                </span>
                              </td>
                              <td className="py-3 text-gray-400">
                                {new Date(bet.placed_at).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-4 text-center text-gray-400"
                            >
                              No recent bets found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                          <th className="px-6 pb-3">No.</th>
                          <th className="px-6 pb-3">Game ID</th>
                          <th className="px-6 pb-3">Amount</th>
                          <th className="px-6 pb-3">Winning Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReport?.other_game_stats?.game_distribution
                          ?.length > 0 ? (
                          userReport.other_game_stats.game_distribution.map(
                            (game, index) => (
                              <tr
                                key={index}
                                className="border-t border-purple-500/10"
                              >
                                <td className="py-4 px-6 text-white">
                                  {index + 1}
                                </td>
                                <td className="py-4 px-6 text-white">
                                  {game.gameId}
                                </td>
                                <td className="py-4 px-6 text-white">
                                  ₹ {game.total_bet_amount}
                                </td>
                                <td className="py-4 px-6 text-white">
                                  ₹ {game.total_win_amount}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-4 text-center text-gray-400"
                            >
                              No game stats found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">
                  Enter a user ID and click "Fetch Report" to view user activity
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Report Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        {/* Header + Filters */}
        <div className="p-4 border-b border-purple-500/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Transaction Reports
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-36 py-2 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-36 py-2 px-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={fetchTransactionReport}
                className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                Get Transaction
              </button>
              <button
                onClick={() => {
                  if (transactionReport) {
                    exportTransactionsToExcel(transactionReport);
                  }
                }}
                className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
              <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
              <p className="text-white text-xl font-bold">
                ₹{transactionReport?.total_deposits || 0}
              </p>
            </div>
            <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
              <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
              <p className="text-white text-xl font-bold">
                ₹{transactionReport?.total_withdrawals || 0}
              </p>
            </div>
            <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
              <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
              <p className="text-white text-xl font-bold">
                {transactionReport?.total_transactions || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-4 pb-6">
          <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10 mt-6">
            <h3 className="text-white font-medium mb-3">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Crypto</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionReport &&
                  transactionReport?.transactions?.length > 0 ? (
                    transactionReport?.transactions.map((txn, index) => (
                      <tr
                        key={index}
                        className="border-t border-purple-500/10 text-white"
                      >
                        <td className="py-3 capitalize">{txn.type}</td>
                        <td className="py-3">₹{txn.amount}</td>
                        <td className="py-3 uppercase">{txn.cryptoname}</td>
                        <td className="py-3">{txn.name}</td>
                        <td className="py-3">{txn.email}</td>
                        <td className="py-3">{txn.phone}</td>
                        <td className="py-3 text-gray-400">
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-gray-400"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Game Performance Chart */}
      {/* <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">Game Performance</h2>
        </div>
        <div className="p-6 h-80 flex items-center justify-center">
          <div className="w-full h-full bg-[#1A1A2E] rounded-lg border border-purple-500/10 flex items-center justify-center">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">Game performance chart visualization would appear here</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Withdrawal/Deposit Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">
            Withdrawals vs Deposits
          </h2>
        </div>
        <div className="p-6 h-80 flex items-center justify-center">
          <div className="w-full h-full bg-[#1A1A2E] rounded-lg border border-purple-500/10 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">
                Withdrawal/deposit chart visualization would appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
