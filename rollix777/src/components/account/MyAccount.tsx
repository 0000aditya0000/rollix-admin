import React, { useEffect, useState } from 'react';
import { 
  User, 
  Wallet, 
  History, 
  Gift, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setWallets } from '../../slices/walletSlice';
import { fetchUserWallets } from '../../lib/services/WalletServices.js';
import { logout } from '../../slices/authSlice';

interface CryptoType {
  name: string;
  symbol: string;
  color: string;
  cryptoname: string;
  balance: string;
}

const MyAccount: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wallets } = useSelector((state: RootState) => state.wallet);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    name: "INR",
    symbol: "₹",
    color: "bg-black",
    balance: "0",
  });

  const updatedCryptos = [
    { name: "Bitcoin", symbol: "₿", color: "bg-yellow-500", cryptoname: "BTC" },
    { name: "Litecoin", symbol: "Ł", color: "bg-gray-500", cryptoname: "LTC" },
    { name: "Ethereum", symbol: "E", color: "bg-blue-500", cryptoname: "ETH" },
    { name: "Tether", symbol: "₮", color: "bg-green-800", cryptoname: "USDT" },
    { name: "Solana", symbol: "◎", color: "bg-green-300", cryptoname: "SOL" },
    { name: "Dogecoin", symbol: "Ð", color: "bg-yellow-800", cryptoname: "DOGE" },
    { name: "Bitcoin Cash", symbol: "Ƀ", color: "bg-green-700", cryptoname: "BCH" },
    { name: "Ripple", symbol: "✕", color: "bg-gray-900", cryptoname: "XRP" },
    { name: "Tron", symbol: "Ṯ", color: "bg-pink-700", cryptoname: "TRX" },
    { name: "EOS", symbol: "ε", color: "bg-black", cryptoname: "EOS" },
    { name: "Rupees", symbol: "₹", color: " bg-black", cryptoname: "INR" },
  ].map((crypto) => {
    const wallet = wallets.find((w) => w.cryptoname === crypto.cryptoname);
    return { ...crypto, balance: wallet ? wallet.balance : "0" };
  });

  const handleCurrencySelect = (crypto: CryptoType) => {
    setSelectedCurrency({
      name: crypto.name,
      symbol: crypto.symbol,
      color: crypto.color,
      balance: crypto.balance,
    });
    setIsWalletOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      if (user?.id) {
        try {
          const data = await fetchUserWallets(user.id);
          dispatch(setWallets(data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    const inrWallet = wallets.find((w) => w.cryptoname === "INR");
    if (inrWallet) {
      setSelectedCurrency({
        name: "INR",
        symbol: "₹",
        color: " bg-black",
        balance: inrWallet.balance,
      });
    }
  }, [wallets]);

  const menuItems = [
    { 
      icon: Wallet, 
      label: 'My Wallet', 
      route: '/wallet',
      description: 'Manage your balance and transactions',
      bgColor: 'from-purple-600/10 to-pink-500/10',
      hoverBg: 'from-purple-600/20 to-pink-500/20'
    },
    { 
      icon: History, 
      label: 'Transaction History', 
      route: '/bet-history',
      description: 'View your gaming history',
      bgColor: 'from-blue-600/10 to-cyan-500/10',
      hoverBg: 'from-blue-600/20 to-cyan-500/20'
    },
    { 
      icon: Gift, 
      label: 'My Rewards', 
      route: '/coupon',
      description: 'Check your rewards and bonuses',
      bgColor: 'from-amber-600/10 to-yellow-500/10',
      hoverBg: 'from-amber-600/20 to-yellow-500/20'
    },
    { 
      icon: User, 
      label: 'KYC Verification', 
      route: '/kyc-verification',
      description: 'Verify your identity',
      bgColor: 'from-indigo-600/10 to-violet-500/10',
      hoverBg: 'from-indigo-600/20 to-violet-500/20'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      route: '/settings',
      description: 'Account preferences and security',
      bgColor: 'from-emerald-600/10 to-teal-500/10',
      hoverBg: 'from-emerald-600/20 to-teal-500/20'
    },
    { 
      icon: HelpCircle, 
      label: 'Help Center', 
      route: '/support',
      description: '24/7 customer support',
      bgColor: 'from-rose-600/10 to-red-500/10',
      hoverBg: 'from-rose-600/20 to-red-500/20'
    },
  ];

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('referralCode');
    
    // Dispatch logout action
    dispatch(logout());
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] w-full lg:px-2 px-1">
      {/* Header Section */}
      <div className="w-full px-1">
        <div className="mt-10">
          <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Link 
              to="/" 
              className="p-2 sm:p-3 mt-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 transform"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mt-6">My Account</h1>
              <p className="text-sm sm:text-base text-purple-300/60 mt-2">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-1 pb-8">
        {/* Profile & Balance Card */}
        <div className="bg-[#1A1A2E] rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#1A1A2E] flex items-center justify-center">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                <p className="text-sm text-gray-400">ID: {user?.id || 'N/A'}</p>
              </div>
            </div>

            {/* Balance Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto md:flex-1">
              <div className="relative">
                <button
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                  className="w-full h-full py-4 px-6 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-between group hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${selectedCurrency.color} flex items-center justify-center text-white font-bold text-2xl`}>
                      {selectedCurrency.symbol} 
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-sm">Available Balance</p>
                      <h3 className="text-xl font-bold text-white">
                        {selectedCurrency.symbol} {selectedCurrency.balance}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isWalletOpen ? "rotate-180" : ""}`} />
                </button>

                {isWalletOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#252547] rounded-xl border border-purple-500/20 shadow-lg animate-fadeIn z-50">
                    <div className="p-4 border-b border-purple-500/10">
                      <h3 className="text-white font-semibold">My Wallet</h3>
                    </div>
                    <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
                      {updatedCryptos.map((crypto, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 hover:bg-[#2f2f5a] rounded-lg cursor-pointer"
                          onClick={() => handleCurrencySelect(crypto)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${crypto.color} flex items-center justify-center text-white font-bold`}>
                              {crypto.symbol}
                            </div>
                            <span className="text-white">{crypto.name}</span>
                          </div>
                          <span className="text-white">
                            {crypto.balance} {crypto.cryptoname}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bonus Balance */}
              <div className="py-4 px-6 rounded-xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 flex items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-sm">Bonus Balance</p>
                    <h3 className="text-xl font-bold text-white">
                      {selectedCurrency.symbol} {wallets.find(w => w.cryptoname === "CP")?.balance || "0"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white px-1">Services</h2>
            <div className="hidden md:block text-sm text-gray-400">5 services available</div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className="w-full flex items-center gap-4 p-4 bg-[#252547] rounded-xl hover:bg-[#2f2f5a] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-all">
                  <item.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </button>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-3 gap-6 ">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className={`group relative overflow-hidden bg-gradient-to-br ${item.bgColor} hover:${item.hoverBg} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:translate-x-20 transition-transform"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white transition-colors transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;