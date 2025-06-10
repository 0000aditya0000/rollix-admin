import React, { useState, useEffect } from 'react';
import { Gift, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setWallets } from '../../slices/walletSlice';
import { fetchUserWallets } from '../../lib/services/WalletServices';
import { userCouponHistory } from '../../lib/services/userService';

interface CouponHistoryItem {
  code: string;
  amount: string;
  redeemed_at: string;
  amount_credited: string;
  coupon_status: string;
}

interface CouponStatistics {
  total_coupons_redeemed: number;
  total_amount_credited: number;
}

function Coupon() {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponHistory, setCouponHistory] = useState<CouponHistoryItem[]>([]);
  const [statistics, setStatistics] = useState<CouponStatistics>({
    total_coupons_redeemed: 0,
    total_amount_credited: 0
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCouponHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login to view coupon history');
        return;
      }

      try {
        const response = await userCouponHistory(userId);
        console.log('Coupon history response:', response); // Debug log
        
        if (response.success) {
          setCouponHistory(response.redemption_history || []);
          setStatistics(response.statistics || {
            total_coupons_redeemed: 0,
            total_amount_credited: 0
          });
        } else {
          toast.error('Failed to fetch coupon history');
        }
      } catch (error) {
        console.error('Error fetching coupon history:', error);
        toast.error('Failed to fetch coupon history');
      }
    };

    fetchCouponHistory();
  }, []);

  const handleRedeem = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to redeem coupon');
      return;
    }

    setLoading(true);
    try {
      const raw = JSON.stringify({
        userId: parseInt(userId),
        code: couponCode.trim()
      });

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("http://localhost:5000/api/coupons/redeem", requestOptions);
      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message || 'Coupon redeemed successfully!');
        setCouponCode('');
        
        // Update wallet balance after successful redemption
        try {
          const walletData = await fetchUserWallets(userId);
          dispatch(setWallets(walletData));
        } catch (error) {
          console.error('Error updating wallet:', error);
        }
      } else {
        toast.error(result.message || 'Failed to redeem coupon');
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      toast.error('Failed to redeem coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] py-8 px-4 md:px-8 mt-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Coupon Redemption */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/10 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Redeem Coupon</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
                  } text-white`}
                >
                  {loading ? 'Processing...' : 'Redeem Coupon'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - History and Statistics */}
          <div className="lg:col-span-2">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-gray-400">Total Coupons Redeemed</p>
                </div>
                <p className="text-white text-3xl font-bold">{statistics.total_coupons_redeemed}</p>
              </div>
              <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-gray-400">Total Amount Credited</p>
                </div>
                <p className="text-white text-3xl font-bold">₹{statistics.total_amount_credited}</p>
              </div>
            </div>

            {/* Coupon History */}
            <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Coupon History</h2>
                </div>
                <div className="text-sm text-purple-400">
                  {couponHistory.length} Coupons
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {couponHistory.map((coupon, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1A2E] rounded-lg p-4 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{coupon.code}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(coupon.redeemed_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {coupon.coupon_status === 'active' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-purple-400 font-medium">₹{coupon.amount_credited}</p>
                      <span className={`text-sm ${
                        coupon.coupon_status === 'active' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {coupon.coupon_status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-purple-500/10">
                      <th className="pb-4 text-gray-400 font-medium">Code</th>
                      <th className="pb-4 text-gray-400 font-medium">Amount</th>
                      <th className="pb-4 text-gray-400 font-medium">Status</th>
                      <th className="pb-4 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponHistory.map((coupon, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-purple-500/10 hover:bg-[#1A1A2E] transition-colors"
                      >
                        <td className="py-4 text-white font-medium">{coupon.code}</td>
                        <td className="py-4 text-purple-400">₹{coupon.amount_credited}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 ${
                            coupon.coupon_status === 'active' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {coupon.coupon_status === 'active' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {coupon.coupon_status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">
                          {new Date(coupon.redeemed_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coupon;
