import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, ChevronDown, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { referralService } from '../../lib/services/referralService';
import { filter } from 'framer-motion/client';

interface ReferralMember {
  id: number;
  name: string;
  username: string;
  email: string;
  level: number;
  depositAmount?: number;
  totalBet?: number;
  firstDeposit?: number;
  joinDate?: string;
}

interface ReferralResponse {
  userId: string;
  totalReferrals: number;
  referralsByLevel: {
    level1: ReferralMember[];
    level2: ReferralMember[];
    level3: ReferralMember[];
    level4: ReferralMember[];
    level5: ReferralMember[];
  };
}

const TeamReport: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('today');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [referralData, setReferralData] = useState<ReferralResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        // Get userId from localStorage or your auth context
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }

        const data = await referralService.getReferrals(userId);
        setReferralData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  // Helper function to generate mock members
  const generateMockMembers = (count: number, level: number): ReferralMember[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: level * 100 + i + 1,
      name: `User ${level * 100 + i + 1}`,
      username: `user${level * 100 + i + 1}`,
      email: `user${level * 100 + i + 1}@example.com`,
      level,
      depositAmount: Math.floor(Math.random() * 10000) + 1000,
      totalBet: Math.floor(Math.random() * 30000) + 5000,
      firstDeposit: Math.floor(Math.random() * 3000) + 500,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    }));
  };

  const getAllMembers = (): ReferralMember[] => {
    if (!referralData) return [];

    return [
      ...(referralData.referralsByLevel.level1 || []),
      ...(referralData.referralsByLevel.level2 || []),
      ...(referralData.referralsByLevel.level3 || []),
      ...(referralData.referralsByLevel.level4 || []),
      ...(referralData.referralsByLevel.level5 || []),
    ];
  };

  const calculateTotalStats = () => {
    const members = getAllMembers();
    return {
      depositAmount: members.reduce((sum, member) => sum + (member.depositAmount || 0), 0),
      totalBet: members.reduce((sum, member) => sum + (member.totalBet || 0), 0),
      firstDeposit: members.reduce((sum, member) => sum + (member.firstDeposit || 0), 0),
    };
  };

  const members = getAllMembers();
  const totals = calculateTotalStats();

  const filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'month', label: 'This Month' },
   
  ];

  const getActiveFilterLabel = () => {
    return filterOptions.find(option => option.value === activeFilter)?.label || 'Filter';
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white">
      {/* Header */}
      <div className="pt-16 mt-4 pb-8">
        <div className="px-4  space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/promotions" 
                className="p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-white">Team Report</h1>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 bg-[#252547] hover:bg-[#2f2f5a] text-white py-2 px-4 rounded-lg transition-colors"
                aria-haspopup="true"
                aria-expanded={showFilterDropdown}
              >
                <Calendar size={18} />
                <span className="text-sm">{getActiveFilterLabel()}</span>
                <ChevronDown size={18} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#252547] rounded-lg shadow-lg z-20 border border-purple-500/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeFilter === option.value
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-[#2f2f5a]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Total Deposit', value: `₹${totals.depositAmount.toLocaleString()}`, trend: 'up' },
                { title: 'Total Bet Amount', value: `₹${totals.totalBet.toLocaleString()}`, trend: 'up' },
                { title: 'First Deposit', value: `₹${totals.firstDeposit.toLocaleString()}`, trend: 'down' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                      <p className="text-white font-bold text-2xl">{stat.value}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs ${
                      stat.trend === 'up' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {stat.trend === 'up' ? '↑ 12%' : '↓ 5%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Members Table */}
            <div className="bg-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 bg-[#252547] px-6 py-3 text-gray-400 text-sm font-medium">
                <div className="col-span-4">Member</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2 text-right">Deposit</div>
                <div className="col-span-2 text-right">Total Bet</div>
                <div className="col-span-2 text-right">Joined</div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
                  <p>Loading team data...</p>
                </div>
              ) : members.length > 0 ? (
                <div className="divide-y divide-purple-500/10">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className="grid grid-cols-1 md:grid-cols-12 px-4 md:px-6 py-4 hover:bg-[#252547]/50 transition-colors"
                    >
                      {/* Mobile View */}
                      <div className="md:hidden">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{member.name}</h3>
                              <p className="text-gray-400 text-xs">@{member.username}</p>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                            Level {member.level}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-[#252547]/50 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">Deposit</p>
                            <p className="text-white font-medium">₹{member.depositAmount?.toLocaleString()}</p>
                          </div>
                          <div className="bg-[#252547]/50 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">Total Bet</p>
                            <p className="text-white font-medium">₹{member.totalBet?.toLocaleString()}</p>
                          </div>
                          <div className="bg-[#252547]/50 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">Joined</p>
                            <p className="text-white font-medium text-sm">{member.joinDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop View - Member Info */}
                      <div className="hidden md:flex items-center col-span-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{member.name}</h3>
                          <p className="text-gray-400 text-xs">@{member.username}</p>
                        </div>
                      </div>
                      
                      {/* Level */}
                      <div className="hidden md:flex items-center col-span-2 text-gray-300">
                        Level {member.level}
                      </div>
                      
                      {/* Desktop View - Deposit */}
                      <div className="hidden md:flex items-center justify-end col-span-2">
                        <div className="text-white">₹{member.depositAmount?.toLocaleString()}</div>
                      </div>
                      
                      {/* Desktop View - Total Bet */}
                      <div className="hidden md:flex items-center justify-end col-span-2">
                        <div className="text-white">₹{member.totalBet?.toLocaleString()}</div>
                      </div>
                      
                      {/* Desktop View - Join Date */}
                      <div className="hidden md:flex items-center justify-end col-span-2 text-gray-300 text-sm">
                        {member.joinDate}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="mx-auto w-16 h-16 bg-[#252547] rounded-full flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No team members found</h3>
                  <p className="text-sm max-w-md mx-auto">You don't have any referrals yet. Share your referral link to start building your team.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeamReport;