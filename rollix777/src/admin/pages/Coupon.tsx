import React, { useState, useEffect } from 'react';
import { Gift, Clock, Plus, Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createCoupon, getAllCoupons, getCouponHistory } from '../../lib/services/couponService';

interface Coupon {
  id: number;
  code: string;
  amount: string;
  usage_limit: number;
  expires_at: string;
  created_at: string;
  status: string;
  times_used: number;
  remaining_uses: number;
  current_status: string;
}

interface CouponRedemption {
  user_id: number;
  username: string;
  redeemed_at: string;
  amount_credited: string;
}

interface CouponHistoryResponse {
  code: string;
  amount: string;
  usage_limit: number;
  expires_at: string;
  total_redeems: number;
  remaining_uses: number;
  redemptions: CouponRedemption[];
}

function Coupon() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<CouponRedemption[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [couponName, setCouponName] = useState('');
  const [amount, setAmount] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Fetch all coupons on component mount
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponHistory, setCouponHistory] = useState<CouponHistoryResponse | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await getAllCoupons();
      if (response.success) {
        setCoupons(response.coupons);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponName || !amount || !maxRedemptions || !expiryDate) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Format the date to match required format: YYYY-MM-DD HH:mm:ss
      const formattedDate = new Date(expiryDate).toISOString()
        .replace('T', ' ')
        .slice(0, 19);

      const payload = {
        code: couponName.toUpperCase(),
        amount: Number(amount),
        usage_limit: Number(maxRedemptions),
        expires_at: formattedDate // Now sends date in format: 2025-05-22 18:07:42
      };

      const response = await createCoupon(payload);
      
      if (response.success) {
        toast.success('Coupon created successfully!');
        // Refresh the coupons list
        fetchCoupons();
        
        // Reset form
        setCouponName('');
        setAmount('');
        setMaxRedemptions('');
        setExpiryDate('');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCoupon = async () => {
    if (!searchCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const response = await getCouponHistory(searchCode);
      if (response.success) {
        setCouponHistory(response.data);
      } else {
        toast.error('Failed to fetch coupon details');
      }
    } catch (error) {
      toast.error('Failed to fetch coupon details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-8">
      <div className="w-full px-2">
        {/* Header with Create Coupon Form and History Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Gift className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Coupon</h2>
          </div>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
          >
            <Clock className="w-5 h-5" />
            Coupon History
          </button>
        </div>

        {/* Create Coupon Form */}
        <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 mb-8 shadow-lg">
          <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Coupon Code</label>
              <input
                type="text"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Max Redemptions</label>
              <input
                type="number"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                placeholder="Enter max redemptions"
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3.5 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20'
                } text-white`}
              >
                {loading ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>

        {/* Updated Created Coupons Table */}
        <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Created Coupons</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-purple-500/10">
                <th className="pb-4 text-gray-300 font-medium">ID</th>
                  <th className="pb-4 text-gray-300 font-medium">Code</th>
                  <th className="pb-4 text-gray-300 font-medium">Amount</th>
                  <th className="pb-4 text-gray-300 font-medium">Usage Limit</th>
                  <th className="pb-4 text-gray-300 font-medium">Times Used</th>
                  <th className="pb-4 text-gray-300 font-medium">Remaining</th>
                  <th className="pb-4 text-gray-300 font-medium">Expiry Date</th>
                  <th className="pb-4 text-gray-300 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 text-white font-medium">{coupon.id}</td>
                    <td className="py-4 text-white font-medium">{coupon.code}</td>
                    <td className="py-4 text-purple-400 font-medium">₹{coupon.amount}</td>
                    <td className="py-4 text-white">{coupon.usage_limit}</td>
                    <td className="py-4 text-white">{coupon.times_used}</td>
                    <td className="py-4 text-white">{coupon.remaining_uses}</td>
                    <td className="py-4 text-white">
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        coupon.current_status === 'active' ? 'bg-green-500/20 text-green-400' :
                        coupon.current_status === 'depleted' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {coupon.current_status.charAt(0).toUpperCase() + coupon.current_status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Coupon History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 w-full max-w-4xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Coupon Redemption History</h3>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setCouponHistory(null);
                  setSearchCode('');
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
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon ID"
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearchCoupon}
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

            {couponHistory && (
              <div className="space-y-6">
                {/* Coupon Details Card */}
                <div className="bg-[#1A1A2E] rounded-lg p-6 border border-purple-500/10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Coupon Code</p>
                      <p className="text-white font-medium">{couponHistory.code}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Amount</p>
                      <p className="text-purple-400 font-medium">₹{couponHistory.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Usage Limit</p>
                      <p className="text-white font-medium">{couponHistory.usage_limit}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Redeems</p>
                      <p className="text-white font-medium">{couponHistory.total_redeems}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Remaining Uses</p>
                      <p className="text-white font-medium">{couponHistory.remaining_uses}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
                      <p className="text-white font-medium">
                        {new Date(couponHistory.expires_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Redemptions Table */}
                <div className="bg-[#1A1A2E] rounded-lg p-6 border border-purple-500/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Redemption History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-purple-500/10">
                          <th className="pb-4 text-gray-400 font-medium">User ID</th>
                          <th className="pb-4 text-gray-400 font-medium">Username</th>
                          <th className="pb-4 text-gray-400 font-medium">Amount Credited</th>
                          <th className="pb-4 text-gray-400 font-medium">Redeemed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {couponHistory.redemptions.map((redemption, index) => (
                          <tr 
                            key={index}
                            className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                          >
                            <td className="py-4 text-white">{redemption.user_id}</td>
                            <td className="py-4 text-white font-medium">{redemption.username}</td>
                            <td className="py-4 text-purple-400">₹{redemption.amount_credited}</td>
                            <td className="py-4 text-gray-400">
                              {new Date(redemption.redeemed_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupon;
