import React, { useState, useEffect } from 'react';
import { Wallet, Search, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllRecharges, getRechargeByOrderId } from '../../lib/services/rechargeService';

interface Recharge {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time: string;
}

interface RechargeDetail {
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

function Recharge() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchResult, setSearchResult] = useState<RechargeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'success'>('all');

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const response = await getAllRecharges();
      console.log('Recharge Response:', response); // Debug log
      
      // Check if response has the correct structure
      if (response && Array.isArray(response)) {
        setRecharges(response);
      } else if (response && response.recharges) {
        setRecharges(response.recharges);
      } else {
        console.error('Unexpected response structure:', response);
        toast.error('Invalid response format');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch recharges');
    }
  };

  const handleSearchRecharge = async () => {
    if (!searchOrderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await getRechargeByOrderId(searchOrderId);
      console.log('Search Response:', response);
      
      if (response && response.recharge) {
        setSearchResult(response.recharge);
      } else if (response) {
        setSearchResult(response);
      } else {
        console.error('Unexpected search response:', response);
        toast.error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to fetch recharge details');
    } finally {
      setLoading(false);
    }
  };

  // Add a debug log to check the recharges state
  useEffect(() => {
    console.log('Current recharges:', recharges);
  }, [recharges]);

  const filteredRecharges = recharges.filter(recharge => {
    if (activeFilter === 'all') return true;
    return recharge.status.toLowerCase() === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-8">
      <div className="w-full px-2">
        {/* Header with Title and Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Wallet className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Recharge Management</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('success')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                }`}
              >
                Pending
              </button>
            </div>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
            >
              <Clock className="w-5 h-5" />
              Recharge History
            </button>
          </div>
        </div>

        {/* Recharges Table */}
        <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-purple-500/10">
                  <th className="pb-4 text-gray-300 font-medium">Order ID</th>
                  <th className="pb-4 text-gray-300 font-medium">User ID</th>
                  <th className="pb-4 text-gray-300 font-medium">Amount</th>
                  <th className="pb-4 text-gray-300 font-medium">Type</th>
                  <th className="pb-4 text-gray-300 font-medium">Mode</th>
                  <th className="pb-4 text-gray-300 font-medium">Status</th>
                  <th className="pb-4 text-gray-300 font-medium">Date</th>
                  <th className="pb-4 text-gray-300 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecharges && filteredRecharges.length > 0 ? (
                  filteredRecharges.map((recharge) => (
                    <tr key={recharge.recharge_id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                      <td className="py-4 text-white font-medium">{recharge.order_id}</td>
                      <td className="py-4 text-white">{recharge.userId}</td>
                      <td className="py-4 text-purple-400 font-medium">₹{recharge.amount}</td>
                      <td className="py-4 text-white">{recharge.type}</td>
                      <td className="py-4 text-white">{recharge.mode}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          recharge.status.toLowerCase() === 'success' ? 'bg-green-500/20 text-green-400' :
                          recharge.status.toLowerCase() === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {recharge.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">
                        {new Date(recharge.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-gray-400">{recharge.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-400">
                      No recharges found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recharge History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Recharge History</h3>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSearchResult(null);
                  setSearchOrderId('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearchRecharge}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20'
                } text-white`}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResult && (
              <div className="bg-[#1A1A2E] rounded-lg p-6 border border-purple-500/10 hover:border-purple-500/20 transition-colors">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Order ID</p>
                    <p className="text-white font-medium">{searchResult.order_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">User ID</p>
                    <p className="text-white font-medium">{searchResult.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-purple-400 font-medium">₹{searchResult.recharge_amount || searchResult.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-white font-medium">{searchResult.recharge_type || searchResult.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Mode</p>
                    <p className="text-white font-medium">{searchResult.payment_mode || searchResult.mode}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      (searchResult.recharge_status || searchResult.status).toLowerCase() === 'success' ? 'bg-green-500/20 text-green-400' :
                      (searchResult.recharge_status || searchResult.status).toLowerCase() === 'pending' ? 'bg-red-500/20 text-yellow-400' :
                      'bg-yellow-500/20 text-red-400'
                    }`}>
                      {searchResult.recharge_status || searchResult.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date</p>
                    <p className="text-white font-medium">
                      {new Date(searchResult.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Time</p>
                    <p className="text-white font-medium">{searchResult.time}</p>
                  </div>
                  {searchResult.user_name && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">User Name</p>
                      <p className="text-white font-medium">{searchResult.user_name}</p>
                    </div>
                  )}
                  {searchResult.email && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white font-medium">{searchResult.email}</p>
                    </div>
                  )}
                  {searchResult.phone && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white font-medium">{searchResult.phone}</p>
                    </div>
                  )}
                  {searchResult.transaction_id && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
                      <p className="text-white font-medium">{searchResult.transaction_id}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recharge;

