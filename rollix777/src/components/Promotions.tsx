import React from 'react';
import { Gift, Sparkles, Zap, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Promotions = () => {
  return (
    <>
      {/* Mobile View */}
      <section className="md:hidden relative py-10 px-4 bg-[#0F0F1A] min-h-screen overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent_60%)]" />
        <div className="absolute w-64 h-64 blur-[120px] rounded-full bg-purple-500/20 -top-32 -right-32" />
        <div className="absolute w-64 h-64 blur-[120px] rounded-full bg-blue-500/20 -bottom-32 -left-32" />

        <div className="relative pb-8">
          <div className="flex items-center justify-between mb-8 mt-8">
            <div className="flex items-center gap-3">
            
              <Link to="/account" className="text-2xl font-bold text-white"><ArrowLeft className="w-6 h-6 text-purple-400 inline mr-2" />Rewards <Gift className="w-6 h-6 text-purple-400 inline ml-2" /></Link >
            </div>
            <button className="text-purple-400 text-sm flex items-center gap-2 hover:text-purple-300 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
      </div>

      <div className="space-y-4">
            {/* Welcome Bonus Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-sm">New</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome Package</h3>
                <p className="text-gray-400 text-sm mb-4">100% Match + 50 Free Spins</p>
                
              </div>
            </div>

            {/* Daily Rewards Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="px-3 py-1 bg-blue-500/10 rounded-full text-blue-400 text-sm">Daily</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cashback Rewards</h3>
                <p className="text-gray-400 text-sm mb-4">10% Daily Cashback + Bonuses</p>
             
              </div>
            </div>

            {/* Weekly Boost Card */}
            <div className="group relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <RefreshCw className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-sm">Weekly</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Weekly Boost</h3>
                <p className="text-gray-400 text-sm mb-4">50% Reload Bonus + VIP Rewards</p>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden md:block relative py-16 px-8 bg-[#0F0F1A] min-h-screen overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,0,255,0.15),transparent_70%)]" />
        <div className="absolute w-[500px] h-[500px] blur-[120px] rounded-full bg-purple-500/10 -top-64 right-0" />
        <div className="absolute w-[500px] h-[500px] blur-[120px] rounded-full bg-blue-500/10 bottom-0 -left-64" />

        <div className="relative container mx-auto max-w-7xl mt-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center mt-4 gap-4">
             
              <div>
                <Link to="/account" className="text-4xl font-bold text-white mb-2"><ArrowLeft className="w-8 h-8 text-purple-400 inline mr-2" />Exclusive Rewards <Gift className="w-8 h-8 text-purple-400 inline ml-2" /></Link >
                <p className="text-gray-400 ml-10">Unlock premium bonuses and special offers</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl flex items-center gap-2 transition-colors backdrop-blur-xl">
              View All Rewards <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Welcome Package Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-purple-500/10 rounded-xl">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <span className="px-4 py-1 bg-purple-500/10 rounded-full text-purple-400">New Users</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Welcome Package</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    100% First Deposit Match
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    50 Free Spins
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Up to $1,000 Bonus
                  </li>
                </ul>
               
              </div>
            </div>

            {/* Daily Rewards Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-blue-500/10 rounded-xl">
                    <Zap className="w-8 h-8 text-blue-400" />
                  </div>
                  <span className="px-4 py-1 bg-blue-500/10 rounded-full text-blue-400">Daily</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Cashback Rewards</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    10% Daily Cashback
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    No Wagering Required
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Instant Withdrawals
                  </li>
                </ul>
                
              </div>
            </div>

            {/* Weekly Boost Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-2xl blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-indigo-500/30 transition-colors duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-indigo-500/10 rounded-xl">
                    <RefreshCw className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="px-4 py-1 bg-indigo-500/10 rounded-full text-indigo-400">Weekly</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Weekly Boost</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    50% Reload Bonus
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Up to $500 Extra
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    VIP Rewards
                  </li>
                </ul>
             
              </div>
            </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Promotions;