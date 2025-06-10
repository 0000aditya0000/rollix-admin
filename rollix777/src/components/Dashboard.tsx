import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowDown, Clock, Trophy, Gamepad2, History, ChevronRight } from 'lucide-react';
import ImageSlider from './ImageSlider';
import ColorGame from './ColorGame';
import GameCarousel from './GameCarousel';
import TrendingGames from './TrendingGames';
import HotGames from './HotGames';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import LatestGames from './LatestGames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setWallets } from '../slices/walletSlice';
import { fetchUserWallets } from '../lib/services/WalletServices.js';

const Dashboard = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const userName = localStorage.getItem('userName') || '';
  const userId = Number(localStorage.getItem('userId')) || 0;
  const dispatch = useDispatch();
  const { wallets } = useSelector((state: RootState) => state.wallet);
  const navigate = useNavigate();
  async function fetchData() {
    if (userId) {
      try {
        const data = await fetchUserWallets(userId);
        if (data) {
          dispatch(setWallets(data));
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, [userId, dispatch]);
  // function launchGame() {
  //   window.location.href = "https://fusion.imitator-host.site/post?gameId=229&mobile=52&agentId=Imitatorbhai_Seamless&agentKey=118e35769483ef7508b4616c308d84458b26a5e7&referrerUrl=https://jili.rollix777.com";
  // }
  
  const mainBalance = wallets?.find(w => w?.cryptoname === "INR")?.balance || "0.00";

  return (
    <div className="min-h-screen bg-[#0F0F19] w-full">
      {/* Mobile View */}
      <div className="md:hidden w-full mx-auto px-0">
        <div className="pt-16 pb-20">
          {/* User Stats - Mobile */}
          <div className="px-4 py-4 bg-[#151525]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Welcome Back!</h2>
                <p className="text-sm text-gray-400">{userName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-lg font-bold text-white">₹{mainBalance}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="py-2.5 px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Deposit</span>
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="py-2.5 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Quick Stats - Mobile */}
          <div className="grid grid-cols-2 gap-3 px-4 py-4">
            <div className="bg-[#151525] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-gray-400">Games Won</p>
              </div>
              <p className="text-xl font-bold text-white">0</p>
            </div>
            <div className="bg-[#151525] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-400">Total Played</p>
              </div>
              <p className="text-xl font-bold text-white">0</p>
            </div>
          </div>

          <ImageSlider />
          <ColorGame />
          <LatestGames title="Latest Games" type="latest" />
          <GameCarousel title="Popular Games" type="popular" />
          <TrendingGames title="Trending Games" type="trending" />
          <HotGames title="Hot Games" type="hot" />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full mt-12">
        <div className="w-full lg:px-2">
          {/* Top Bar */}
         
          <div className="w-full bg-[#151525] border-b border-gray-800/50 ">
            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between py-6">
                <div className="flex items-center gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                    <p className="text-gray-400 text-sm">{userName}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-800/50"></div>
                  <div>
                    <p className="text-gray-400 text-sm">Balance</p>
                    <p className="text-2xl font-bold text-white">₹{mainBalance}</p>
                  </div>
                  {/* <button onClick={launchGame}>JILI GAME Launch</button> */}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="py-3 px-6 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Deposit</span>
                  </button>
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <ArrowDown className="w-5 h-5" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
            <div className="grid grid-cols-9 gap-6">
              {/* Main Content Column */}
              <div className="col-span-9">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#151525] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-6 h-6 text-purple-500" />
                      <p className="text-sm text-gray-400">Games Won</p>
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-[#151525] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="w-6 h-6 text-blue-500" />
                      <p className="text-sm text-gray-400">Total Played</p>
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-[#151525] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-6 h-6 text-green-500" />
                      <p className="text-sm text-gray-400">Active Games</p>
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-[#151525] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-6 h-6 text-pink-500" />
                      <p className="text-sm text-gray-400">Time Played</p>
                    </div>
                    <p className="text-2xl font-bold text-white">0h</p>
                  </div>
                </div>

                {/* Featured Section */}
                <div className="bg-[#151525] rounded-xl overflow-hidden mb-6">
                  <ImageSlider />
                </div>

                {/* Latest Games and Recent Games Section */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                  {/* Latest Games */}
                  <div className="bg-[#151525] rounded-xl overflow-hidden">
                    <div className="p-3 border-b border-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-500" />
                          <h3 className="text-sm font-bold text-white">Latest Games</h3>
                        </div>
                        <button  onClick={() => navigate('/games')} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                          View All
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <LatestGames title="" type="latest" compact />
                    </div>
                  </div>

                  {/* Recent Games */}
                  <div className="bg-[#151525] rounded-xl overflow-hidden">
                    <ColorGame/>
                    {/* <div className="p-3 border-b border-gray-800/50">
                      <h3 className="text-sm font-bold text-white">Recent Games</h3>
                    </div>
                    <div className="p-3">
                      <div className="space-y-2">
                        {[1, 2, 3].map((_, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                            <div>
                              <p className="text-xs font-medium text-white">Game Name</p>
                              <p className="text-[10px] text-gray-400">2 hours ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Games Sections */}
                <div className="space-y-6 w-full">
                  <GameCarousel title="Popular Games" type="popular" />
                  <TrendingGames title="Trending Games" type="trending" />
                  <HotGames title="Hot Games" type="hot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {userId > 0 && (
        <>
          <DepositModal 
            isOpen={isDepositModalOpen} 
            onClose={() => setIsDepositModalOpen(false)}
            userId={userId}
          />
          <WithdrawModal 
            isOpen={isWithdrawModalOpen} 
            onClose={() => setIsWithdrawModalOpen(false)} 
            mainBalance={Number(mainBalance)}
            fetchData={fetchData}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;