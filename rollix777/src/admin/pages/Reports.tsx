import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart, PieChart, Download, Calendar } from 'lucide-react';
import { getColorReport, getUserReport } from '../../lib/services/reportService';

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

interface RecentBet {
  period_number: number;
  bet_type: string;
  bet_value: string;
  amount: number;
  winnings: number;
  result: 'won' | 'lost';
  placed_at: string;
}

interface UserReport {
  success: boolean;
  statistics: Statistics;
  recent_bets: RecentBet[];
}

const Reports = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periodNumber, setPeriodNumber] = useState<string>('');
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [userReportLoading, setUserReportLoading] = useState(false);
  const [userReportError, setUserReportError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  
  const fetchGameData = async () => {
    if (!periodNumber) {
      setError('Please enter a period number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getColorReport(periodNumber);
      if (response.success) {
        setGameData(response);
      } else {
        setError('Failed to fetch game data');
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      setError('Error fetching game data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReport = async () => {
    if (!userId) {
      setUserReportError('Please enter a user ID');
      return;
    }

    try {
      setUserReportLoading(true);
      setUserReportError(null);
      const response = await getUserReport(userId);
      if (response.success) {
        setUserReport(response);
      } else {
        setUserReportError('Failed to fetch user report');
      }
    } catch (error) {
      console.error('Error fetching user report:', error);
      setUserReportError('Error fetching user report');
    } finally {
      setUserReportLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReport();
  }, []);

  const handleRefresh = () => {
    fetchGameData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Reports</h1>
      
      {/* Report Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setReportType('daily')}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === 'daily' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Daily
          </button>
          <button 
            onClick={() => setReportType('weekly')}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === 'weekly' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setReportType('monthly')}
            className={`py-2 px-4 rounded-lg text-white transition-colors ${
              reportType === 'monthly' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            Monthly
          </button>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button 
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === 'bar' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === 'line' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
            }`}
          >
            <LineChart size={20} />
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-lg text-white transition-colors ${
              chartType === 'pie' 
                ? 'bg-purple-600' 
                : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
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
              <div className="relative">
                <input
                  type="text"
                  value={periodNumber}
                  onChange={(e) => setPeriodNumber(e.target.value)}
                  placeholder="Enter Period Number"
                  className="w-40 py-2 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                {error && !periodNumber && (
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{error}</p>
                )}
              </div>
              <button
                onClick={fetchGameData}
                disabled={loading || !periodNumber}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loading || !periodNumber
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  'Fetch Report'
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
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Period Number</p>
                  <p className="text-white text-xl font-bold">#{gameData.period_number}</p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Winning Number</p>
                  <p className="text-white text-xl font-bold">{gameData.result.winning_number}</p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Winning Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        gameData.result.winning_color === 'red' ? 'bg-red-500' :
                        gameData.result.winning_color === 'green' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}
                    />
                    <p className="text-white text-xl font-bold capitalize">{gameData.result.winning_color}</p>
                  </div>
                </div>
              </div>

              {/* Color Bets */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(gameData.color_bets).map(([color, data]) => (
                  <div 
                    key={color}
                    className={`bg-[#1A1A2E] p-4 rounded-lg border ${
                      color === gameData.result.winning_color 
                        ? 'border-green-500/50 bg-green-500/5' 
                        : 'border-purple-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          color === 'red' ? 'bg-red-500' :
                          color === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                      />
                      <p className="text-white font-medium capitalize">{color}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm">Total Bets</p>
                        <p className="text-white font-medium">{data.total_bets}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white font-medium">₹{data.total_amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Unique Users</p>
                        <p className="text-white font-medium">{data.unique_users}</p>
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
                    <p className="text-white font-medium">{gameData.summary.total_bets}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-medium">₹{gameData.summary.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Unique Users</p>
                    <p className="text-white font-medium">{gameData.summary.total_unique_users}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">Enter a period number and click "Fetch Report" to view game data</p>
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
                  <p className="absolute -bottom-6 left-0 text-red-400 text-sm">{userReportError}</p>
                )}
              </div>
              <button
                onClick={fetchUserReport}
                disabled={userReportLoading || !userId}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  userReportLoading || !userId
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {userReportLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fetching...</span>
                  </div>
                ) : (
                  'Fetch Report'
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
                    {userReport?.statistics?.win_rate || '0'}%
                  </p>
                </div>
                <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                  <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
                  <p className={`text-xl font-bold ${
                    (userReport?.statistics?.profit_loss || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ₹{Math.abs(userReport?.statistics?.profit_loss || 0)}
                  </p>
                </div>
              </div>

              {/* Bet Distribution */}
              <div className="bg-[#1A1A2E] p-4 rounded-lg border border-purple-500/10">
                <h3 className="text-white font-medium mb-3">Bet Distribution</h3>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="pb-3">Period</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Value</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Winnings</th>
                        <th className="pb-3">Result</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userReport?.recent_bets && userReport.recent_bets.length > 0 ? (
                        userReport.recent_bets.map((bet, index) => (
                          <tr key={index} className="border-t border-purple-500/10">
                            <td className="py-3 text-white">#{bet.period_number}</td>
                            <td className="py-3 text-white capitalize">{bet.bet_type}</td>
                            <td className="py-3 text-white capitalize">{bet.bet_value}</td>
                            <td className="py-3 text-white">₹{bet.amount}</td>
                            <td className="py-3 text-white">₹{bet.winnings}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                bet.result === 'won' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                              }`}>
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
                          <td colSpan={7} className="py-4 text-center text-gray-400">
                            No recent bets found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">Enter a user ID and click "Fetch Report" to view user activity</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Game Performance Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
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
      </div>
      
      {/* Withdrawal/Deposit Chart */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">Withdrawals vs Deposits</h2>
        </div>
        <div className="p-6 h-80 flex items-center justify-center">
          <div className="w-full h-full bg-[#1A1A2E] rounded-lg border border-purple-500/10 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-purple-400 mb-4" />
              <p className="text-gray-400">Withdrawal/deposit chart visualization would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;