import React, { useEffect, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {betHistory} from '../lib/services/betService'

interface Bet {
  betId: string;
  amount: number;
  amountReceived: number;
  betValue: string;
  periodNumber: string;
  status: 'won' | 'lost' | 'pending';
  date: string;
}

const BetHistory = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [bets, setBets] = useState<Bet[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const response = await betHistory({ userId: userId });
        const betData = response.betHistory || [];
        if (!Array.isArray(betData)) {
          console.error("Unexpected data format:", betData);
          setBets([]);
          return;
        }
        setBets(betData as Bet[]);
      } catch (err: any) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      }
    };

    fetchBetHistory();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Filter and pagination logic
  const filteredBets = bets.filter(bet => 
    statusFilter === 'all' ? true : bet.status === statusFilter
  );
  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBets.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBets.length / recordsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-500/20 text-green-400';
      case 'lost':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getColorBadge = (color: string) => {
    // Ensure color is a string and convert it to lowercase
    const colorLower = typeof color === 'string' ? color.toLowerCase() : '';

    switch (colorLower) {
      case 'red':
        return 'bg-red-500 w-4 h-4 rounded-full';
      case 'green':
        return 'bg-green-500 w-4 h-4 rounded-full';
      default:
        return 'bg-gray-500 w-4 h-4 rounded-full';
    }
  };

  // Calculate total won and total lost
  const totalWon = bets
    .filter(bet => bet.status === "won")
    .reduce((sum, bet) => sum + parseFloat(bet.amountReceived || 0), 0);

  const totalLost = bets
    .filter(bet => bet.status === "lost")
    .reduce((sum, bet) => sum + parseFloat(bet.amount || 0), 0);

  if (error) {
    return (
      <div className="pt-16 pb-24 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 w-full ">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-8">
        {/* Header - Mobile design for small screens, enhanced for desktop */}
        <div className="flex mt-4 items-center gap-4 md:bg-gradient-to-r md:from-purple-900/50 md:to-[#252547] md:rounded-2xl md:p-6">
          <Link 
            to="/account" 
            className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-[#252547] md:bg-white/10 text-purple-400 hover:bg-[#2f2f5a] md:hover:bg-white/20 transition-colors md:transition-all md:duration-200 md:backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl  font-bold text-white">Bet History</h1>
            <p className="hidden md:block text-gray-400 text-sm">Track all your betting activities</p>
          </div>
        </div>

        {/* Stats Cards - Simple for mobile, enhanced for desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-green-500/20 p-4 md:p-6 md:hover:border-green-500/40 md:transition-all md:duration-200">
            <p className="text-gray-400 text-sm md:mb-2">Total Won</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">₹{totalWon.toFixed(2)}</p>
            <div className="hidden md:block mt-2 text-green-400/60 text-sm">+2.5% from last week</div>
          </div>
          <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-red-500/20 p-4 md:p-6 md:hover:border-red-500/40 md:transition-all md:duration-200">
            <p className="text-gray-400 text-sm md:mb-2">Total Lost</p>
            <p className="text-2xl md:text-3xl font-bold text-red-400">₹{totalLost.toFixed(2)}</p>
            <div className="hidden md:block mt-2 text-red-400/60 text-sm">-1.2% from last week</div>
          </div>
          <div className="hidden md:block bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-200">
            <p className="text-gray-400 text-sm mb-2">Total Bets</p>
            <p className="text-3xl font-bold text-purple-400">{bets.length}</p>
            <div className="mt-2 text-purple-400/60 text-sm">Last 30 days</div>
          </div>
          <div className="hidden md:block bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-200">
            <p className="text-gray-400 text-sm mb-2">Win Rate</p>
            <p className="text-3xl font-bold text-blue-400">
              {bets.length > 0 ? ((bets.filter(bet => bet.status === "won").length / bets.length) * 100).toFixed(1) : 0}%
            </p>
            <div className="mt-2 text-blue-400/60 text-sm">Overall success rate</div>
          </div>
        </div>

        {/* Filters - Simple for mobile, enhanced for desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="relative flex-1 max-w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search bets..."
              className="w-full py-2 md:py-3 pl-10 md:pl-11 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg md:rounded-xl text-white focus:outline-none focus:border-purple-500 md:focus:border-purple-500/50 md:focus:ring-2 md:focus:ring-purple-500/20 md:transition-all md:duration-200"
            />
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="flex gap-2 md:gap-3">
            {['all', 'won', 'lost'].map((status) => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-white transition-colors ${
                  statusFilter === status
                    ? status === 'won' 
                      ? 'bg-green-600 md:shadow-lg md:shadow-green-600/20' 
                      : status === 'lost' 
                        ? 'bg-red-600 md:shadow-lg md:shadow-red-600/20' 
                        : 'bg-purple-600 md:shadow-lg md:shadow-purple-600/20'
                    : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a] md:hover:border-purple-500/40'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table - Simple for mobile, enhanced for desktop */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden md:shadow-xl md:shadow-purple-900/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                  <th className="py-4 md:py-5 px-6 font-medium">No.</th>
                  <th className="py-4 md:py-5 px-6 font-medium">ID</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Game</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Amount</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Bet Type</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Result</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Status</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Payout</th>
                  <th className="py-4 md:py-5 px-6 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((bet, index) => (
                  <tr key={bet.betId} className="border-b border-purple-500/10 text-white hover:bg-purple-500/5 transition-colors duration-150">
                    <td className="py-4 px-6 text-gray-400">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="py-4 px-6 text-purple-400">BET-{bet.betId}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400">WinGo</span>
                    </td>
                    <td className="py-4 px-6">₹{bet.amount}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`${getColorBadge(bet.betValue)} md:ring-2 md:ring-white/10`}></div>
                        <span>{bet.betValue}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`${getColorBadge(bet.periodNumber)} md:ring-2 md:ring-white/10`}></div>
                        <span>{bet.periodNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs ${getStatusColor(bet.status)}`}>
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={bet.status === 'won' ? 'text-green-400' : 'text-red-400'}>
                        ₹{bet.amountReceived}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{bet.date}</td>
                  </tr>
                ))}
                {currentRecords.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - Simple for mobile, enhanced for desktop */}
          <div className="p-4 md:p-6 border-t border-purple-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-medium">{filteredBets.length > 0 ? indexOfFirstRecord + 1 : 0}</span> to{' '}
                <span className="text-white font-medium">
                  {Math.min(indexOfLastRecord, filteredBets.length)}
                </span>{' '}
                of <span className="text-white font-medium">{filteredBets.length}</span> bets
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`hidden md:flex items-center px-3 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'border-purple-500/10 text-gray-500 cursor-not-allowed'
                      : 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                  } transition-colors`}
                >
                  First
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'border-purple-500/10 text-gray-500 cursor-not-allowed'
                      : 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                  } transition-colors`}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(num => {
                      if (totalPages <= 5) return true;
                      if (num === 1 || num === totalPages) return true;
                      return Math.abs(currentPage - num) <= 1;
                    })
                    .map((number, index, array) => {
                      if (index > 0 && array[index - 1] !== number - 1) {
                        return [
                          <span key={`ellipsis-${number}`} className="px-3 py-2 text-gray-400">...</span>,
                          <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-3 py-2 rounded-lg border ${
                              currentPage === number
                                ? 'bg-purple-500/20 border-purple-500/40 text-white font-medium'
                                : 'border-purple-500/20 text-gray-400 hover:text-white hover:border-purple-500/40'
                            } transition-colors min-w-[40px]`}
                          >
                            {number}
                          </button>
                        ];
                      }
                      return (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`px-3 py-2 rounded-lg border ${
                            currentPage === number
                              ? 'bg-purple-500/20 border-purple-500/40 text-white font-medium'
                              : 'border-purple-500/20 text-gray-400 hover:text-white hover:border-purple-500/40'
                          } transition-colors min-w-[40px]`}
                        >
                          {number}
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`flex items-center px-3 py-2 rounded-lg border ${
                    currentPage === totalPages || totalPages === 0
                      ? 'border-purple-500/10 text-gray-500 cursor-not-allowed'
                      : 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                  } transition-colors`}
                >
                  Next
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`hidden md:flex items-center px-3 py-2 rounded-lg border ${
                    currentPage === totalPages || totalPages === 0
                      ? 'border-purple-500/10 text-gray-500 cursor-not-allowed'
                      : 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                  } transition-colors`}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetHistory;