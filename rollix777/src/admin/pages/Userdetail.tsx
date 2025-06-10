import React, { useEffect, useState } from 'react';
import { 
  User, Wallet, Users, Shield, Copy, Loader2, ArrowLeft, Mail, Phone, Calendar,
  CreditCard, Building2, History, ChevronDown, ChevronUp, Building
} from 'lucide-react';
import { fetchUserAllData } from '../../lib/services/userService';
import { useParams, useNavigate } from 'react-router-dom';

interface WalletBalance {
  id: number;
  userId: number;
  balance: string;
  cryptoname: string;
}

interface Referral {
  id: number;
  referrer_id: number;
  referred_id: number;
  level: number;
  referred_username: string;
}

interface Withdrawal {
  id: number;
  userId: number;
  balance: string;
  cryptoname: string;
  status: string;
}

interface UserData {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    phone: string;
    dob: string | null;
    aadhar: string | null;
    pan: string | null;
    kycstatus: number;
    image: string;
    my_referral_code: string;
    referred_by: string | null;
  };
  wallet: WalletBalance[];
  bankAccounts: any[];
  referrals: Referral[];
  withdrawals: Withdrawal[];
  kyc: {
    status: number;
    aadhar: string | null;
    pan: string | null;
  };
}

const Userdetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    bankAccounts: false,
    referrals: false,
    withdrawals: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!userId) {
          setError('User ID is required');
          return;
        }
        setLoading(true);
        setError(null);
        const response = await fetchUserAllData(userId);
        if (response.success) {
          const userData: UserData = {
            user: response.data.user,
            wallet: response.data.wallet,
            bankAccounts: response.data.bankAccounts,
            referrals: response.data.referrals,
            withdrawals: response.data.withdrawals,
            kyc: response.data.kyc
          };
          setUserData(userData);
        } else {
          setError(response.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleCopyReferralCode = () => {
    if (userData?.user.my_referral_code) {
      navigator.clipboard.writeText(userData.user.my_referral_code);
      // You could add a toast notification here
      alert('Referral code copied');
    }
  };

  const getKycStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Not Verified</span>;
      case 1:
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Pending</span>;
      case 2:
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Verified</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">Unknown</span>;
    }
  };

  const toggleSection = (section: 'bankAccounts' | 'referrals' | 'withdrawals') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 max-w-md">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">No Data Found</h2>
          <p className="text-gray-400">Could not find user data for the specified ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:px-4 py-4 space-y-2 md:space-y-6">
      {/* Back Navigation Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 md:mb-6"
      >
        <ArrowLeft className="w-5 h-5 font-bold text-pink-600" />
        <span className='text-pink-600 font-bold'>Back</span>
      </button>

      {/* Profile Header - Responsive layout with stacked design on mobile */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-500 rounded-2xl border border-purple-500/20 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* User Avatar */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-[#1A1A2E] flex items-center justify-center">
              <User className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            </div>
          </div>

          {/* User Info - Full width on mobile */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {userData?.user.name || userData?.user.username || 'N/A'}
                </h1>
                <p className="text-gray-400">@{userData?.user.username}</p>
              </div>
              {getKycStatusBadge(userData?.kyc.status || 0)}
            </div>
            
            {/* Contact Info - Stack on mobile, grid on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">{userData?.user.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">{userData?.user.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">DOB: {userData?.user.dob || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Top Row - Wallet and KYC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column - Wallet Balances */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Wallet Balances</h2>
            </div>

            {/* Wallet Grid - 2 columns by default, 3 on larger screens */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {userData?.wallet.map((wallet) => (
                <div key={wallet.id} className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl border border-purple-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <span className="text-purple-400 font-medium text-sm md:text-base">{wallet.cryptoname}</span>
                    </div>
                    <span className="text-gray-400 text-xs md:text-sm">#{wallet.id}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-white font-medium text-base md:text-lg">{wallet.balance || '0'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - KYC & Referrals */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            {/* Referral Info Section */}
            <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">Referral Info</h2>
              </div>
              <div className="space-y-3">
                {/* My Referral Code */}
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2 md:px-3 py-2 bg-purple-500/10 rounded-lg text-purple-400 font-mono text-sm md:text-base overflow-x-auto">
                      {userData?.user.my_referral_code || 'N/A'}
                    </code>
                    <button 
                      onClick={handleCopyReferralCode}
                      className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                    >
                      <Copy className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Referred By */}
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-2">Referred By</p>
                  <p className="text-white font-medium text-sm md:text-base">
                    {userData?.user.referred_by || 'N/A'}
                  </p>
                </div>

                {/* Total Referrals */}
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-2">Total Referrals</p>
                  <p className="text-white font-medium text-sm md:text-base">
                    {userData?.referrals.length || '0'}
                  </p>
                </div>
              </div>
            </div>

            {/* KYC Details Section */}
            <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">KYC Details</h2>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Aadhar Card</p>
                  <p className="text-white font-medium text-sm md:text-base">
                    {userData?.kyc.aadhar || 'Not Provided'}
                  </p>
                </div>
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">PAN Card</p>
                  <p className="text-white font-medium text-sm md:text-base">
                    {userData?.kyc.pan || 'Not Provided'}
                  </p>
                </div>
                <div className="p-3 md:p-4 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">KYC Status</p>
                  <div className="text-white font-medium text-sm md:text-base">
                    {getKycStatusBadge(userData?.kyc.status || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('bankAccounts')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <Building className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Bank Accounts</h2>
            </div>
            {expandedSections.bankAccounts ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </div>
          
          {expandedSections.bankAccounts && (
            <div className="mt-4 space-y-3">
              {userData?.bankAccounts.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No bank accounts added yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData?.bankAccounts.map((account: any, index: number) => (
                    <div key={index} className="p-4 bg-[#1A1A2E] rounded-xl border border-purple-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium">Bank Name</span>
                        </div>
                      </div>
                      {/* Bank account details will be added here */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Referrals List Section */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('referrals')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Referral List</h2>
            </div>
            {expandedSections.referrals ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </div>
          
          {expandedSections.referrals && (
            <div className="mt-4 space-y-3">
              {userData?.referrals.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No referrals yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData?.referrals.map((referral: Referral) => (
                    <div key={referral.id} className="p-4 bg-[#1A1A2E] rounded-xl border border-purple-500/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-white font-medium truncate">
                              @{referral.referred_username}
                            </p>
                            <span className="text-xs text-purple-400 font-medium px-2 py-1 bg-purple-500/10 rounded-full ml-2">
                              Level {referral.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            ID: {referral.referred_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Withdrawals History Section */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-2xl border border-purple-500/20 p-4 md:p-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('withdrawals')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <History className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Withdrawal History</h2>
            </div>
            {expandedSections.withdrawals ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </div>
          
          {expandedSections.withdrawals && (
            <div className="mt-4">
              {userData?.withdrawals.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No withdrawal history
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-purple-500/10">
                        <th className="pb-4 text-gray-400 font-medium">ID</th>
                        <th className="pb-4 text-gray-400 font-medium">Amount</th>
                        <th className="pb-4 text-gray-400 font-medium">Currency</th>
                        <th className="pb-4 text-gray-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData?.withdrawals.map((withdrawal) => (
                        <tr 
                          key={withdrawal.id}
                          className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                        >
                          <td className="py-4 text-white">#{withdrawal.id}</td>
                          <td className="py-4 text-purple-400">₹{withdrawal.balance}</td>
                          <td className="py-4 text-white">{withdrawal.cryptoname}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              withdrawal.status === '0' ? 'bg-yellow-500/20 text-yellow-400' :
                              withdrawal.status === '1' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {withdrawal.status === '0' ? 'Pending' :
                               withdrawal.status === '1' ? 'Completed' :
                               'Failed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userdetail;