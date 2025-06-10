import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertCircle, ChevronDown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { referralService } from '../../lib/services/referralService';
import { baseUrl } from '../../lib/config/server';

const VALID_CRYPTOS = ['BTC', 'ETH', 'LTC', 'USDT', 'SOL', 'DOGE', 'BCH', 'XRP', 'TRX', 'EOS', 'INR', 'CP'] as const;
type CryptoName = typeof VALID_CRYPTOS[number];

interface PendingCommission {
  cryptoname: string;
  pending_amount: number;
  commission_count: number;
}

interface Referral {
  id: number;
  name: string;
  username: string;
  email: string;
  level: number;
  status?: 'active' | 'pending' | 'inactive';
  earnings: number;
  joinedAt?: string;
}

const CommissionDetails: React.FC = () => {
  // Commission states
  const [pendingCommissions, setPendingCommissions] = useState<PendingCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoName | 'ALL'>('ALL');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingNote, setPendingNote] = useState<string | null>(null);

  // Referral states
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [referralsError, setReferralsError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId') || '';

  const fetchPendingCommissions = async () => {
    try {
      setPendingMessage(null);
      setPendingNote(null);

      const response = await fetch(`${baseUrl}/api/user/pending-commissions/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending commissions');
      }

      const data = await response.json();
      if (data.pendingCommissions && data.pendingCommissions.length > 0) {
        console.log(data.pendingCommissions[0].pending_amount);
      }
      setPendingMessage(data.message);
      setPendingCommissions(data.pendingCommissions || []);
      setPendingNote(data.note);

    } catch (err) {
      console.error('Error fetching pending commissions:', err);
      setPendingMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
      setPendingCommissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async () => {
    try {
      setReferralsLoading(true);
      setReferralsError(null);

      const data = await referralService.getReferrals(userId);
      let flatReferrals: Referral[] = [];
      if (data.referralsByLevel) {
        flatReferrals = Object.values(data.referralsByLevel)
          .flat()
          .filter(Boolean) as Referral[];
      } else if (Array.isArray(data.referrals)) {
        flatReferrals = data.referrals;
      }
      setReferrals(flatReferrals);

    } catch (err) {
      console.error('Error fetching referrals:', err);
      setReferralsError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setReferrals([]);
    } finally {
      setReferralsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCommissions();
    fetchReferrals();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) { 
    return (
      <div className="pt-16 pb-24 flex items-center justify-center">
        <div className="text-white">Loading commission data...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link 
            to="/promotions" 
            className="p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Commission Details</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="w-full max-w-xs">
              <label className="block text-sm text-gray-400 mb-2">Filter by Cryptocurrency</label>
              <div className="relative">
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value as CryptoName | 'ALL')}
                  className="w-full appearance-none bg-[#1A1A2E] text-white rounded-lg border border-purple-500/20 
                  py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                >
                  <option value="ALL">All Cryptocurrencies</option>
                  {VALID_CRYPTOS.map((crypto) => (
                    <option key={crypto} value={crypto}>{crypto}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Pending Commissions */}
          <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-purple-500/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Pending Commissions</h2>
              <div className="p-2 bg-fuchsia-500/20 rounded-lg">
                <Clock size={20} className="text-fuchsia-400" />
              </div>
            </div>
            <div className="p-4">
              {pendingMessage && (
                <div className="p-4 rounded-lg bg-[#1A1A2E] border border-purple-500/20 text-center mb-4">
                  <p className="text-fuchsia-200">{pendingMessage}</p>
                </div>
              )}

              <div className="space-y-4">
                {pendingCommissions && pendingCommissions.length > 0 ? (
                  pendingCommissions
                    .filter(commission => selectedCrypto === 'ALL' || commission.cryptoname === selectedCrypto)
                    .map((commission, index) => {
                      const amount = typeof commission.pending_amount === 'string'
                        ? parseFloat(commission.pending_amount)
                        : commission.pending_amount;
                      
                      const formattedAmount = commission.cryptoname === 'INR' 
                        ? new Intl.NumberFormat('en-IN', { 
                            style: 'currency', 
                            currency: 'INR',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(amount)
                        : `${amount.toFixed(8)} ${commission.cryptoname}`;

                      return (
                        <div 
                          key={`${commission.cryptoname}-${index}`}
                          className="p-4 rounded-lg bg-[#1A1A2E] border border-purple-500/20 hover:bg-fuchsia-500/10 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-medium text-white">
                                {commission.cryptoname}
                              </p>
                              <p className="text-sm text-fuchsia-300/70">
                                Pending Transactions: {commission.commission_count}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-fuchsia-400">
                                {formattedAmount}
                              </p>
                              <p className="text-sm text-fuchsia-400">{commission.cryptoname}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="p-4 rounded-lg bg-[#1A1A2E] border border-purple-500/20 text-center">
                    <p className="text-fuchsia-200">No pending commissions found</p>
                  </div>
                )}
              </div>

              {pendingNote && (
                <div className="mt-6 p-4 rounded-lg bg-[#1A1A2E] border border-purple-500/20">
                  <p className="text-sm text-fuchsia-200/80">{pendingNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-4 border-b border-purple-500/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Referral Network</h2>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users size={20} className="text-purple-400" />
            </div>
          </div>
          <div className="p-4">
            {referralsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : referralsError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p>{referralsError}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Total Commission Summary */}
                <div className="mb-6 p-4 rounded-lg bg-[#1A1A2E] border border-purple-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-fuchsia-300/70">Total Pending</p>
                      <p className="text-xl font-bold text-fuchsia-400">
                        ₹{pendingCommissions.find(p => p.cryptoname === 'INR')?.pending_amount || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300/70">Total Referrals</p>
                      <p className="text-xl font-bold text-purple-400">{referrals.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300/70">Active Referrals</p>
                      <p className="text-xl font-bold text-purple-400">
                        {referrals.filter(ref => ref.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-purple-300 text-sm border-b border-purple-500/10">
                        <th className="py-3 px-4 font-medium">Level</th>
                        <th className="py-3 px-4 font-medium">Name</th>
                        <th className="py-3 px-4 font-medium">Username</th>
                        <th className="py-3 px-4 font-medium">Email</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium text-right">Commission</th>
                        <th className="py-3 px-4 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.length > 0 ? (
                        referrals.map((referral) => (
                          <tr key={referral.id} className="border-b border-purple-500/10 text-white hover:bg-purple-500/10 transition-colors">
                            <td className="py-4 px-4">Level {referral.level}</td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{referral.name}</div>
                            </td>
                            <td className="py-4 px-4 text-purple-300">@{referral.username}</td>
                            <td className="py-4 px-4">
                              <div className="text-sm truncate max-w-[180px]">{referral.email}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full 
                                ${referral.status === 'active' 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : referral.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-red-500/10 text-red-400'
                                  }`}
                              >
                                {referral.status
                                  ? referral.status.charAt(0).toUpperCase() + referral.status.slice(1)
                                  : 'Active'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-medium text-purple-400">
                              <div>₹{referral.earnings?.toFixed(2) ?? '0.00'}</div>
                              {pendingCommissions.find(p => p.cryptoname === 'INR') && (
                                <div className="text-sm text-fuchsia-400">
                                  Pending: ₹{pendingCommissions.find(p => p.cryptoname === 'INR')?.pending_amount ?? '0.00'}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-sm text-purple-300/80">
                              {referral.joinedAt ? new Date(referral.joinedAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center mb-4">
                              <Users size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-lg font-medium text-purple-200 mb-1">No referrals yet</h3>
                            <p className="text-purple-300/70 max-w-md mx-auto">
                              You haven't referred anyone yet. Share your referral link to start earning commissions.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetails;