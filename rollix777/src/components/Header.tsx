import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Wallet,
  ChevronDown,
  Bell,
  LogOut,
  Home,
  Gamepad2,
  Gift,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal.tsx";
import SideNav from "./SideNav.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store.ts";
import { logout } from "../slices/authSlice.ts";
import { setWallets } from "../slices/walletSlice.ts";
import { fetchUserWallets } from "../lib/services/WalletServices.js";

interface CryptoType {
  name: string;
  symbol: string;
  color: string;
  cryptoname: string;
  balance: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  // const [wallets, setWallets] = useState([]);
  const { wallets } = useSelector((state: RootState) => state.wallet);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [selectedCurrency, setSelectedCurrency] = useState({
    name: "INR",
    symbol: "₹",
    color: "bg-black",
    balance: "0", // Initially 0 until API fetches data
  });
  // Ensure selected currency updates
  const dispatch = useDispatch();
  const handleCurrencySelect = (crypto: CryptoType) => {
    setSelectedCurrency({
      name: crypto.name,
      symbol: crypto.symbol,
      color: crypto.color,
      balance: crypto.balance,
    });
    setIsWalletOpen(false);
  };
// fetch user wallets data from api 
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
  const updatedCryptos = [
    { name: "Bitcoin", symbol: "₿", color: "bg-yellow-500", cryptoname: "BTC" },
    { name: "Litecoin", symbol: "Ł", color: "bg-gray-500", cryptoname: "LTC" },
    { name: "Ethereum", symbol: "E", color: "bg-blue-500", cryptoname: "ETH" },
    { name: "Tether", symbol: "₮", color: "bg-green-800", cryptoname: "USDT" },
    { name: "Solana", symbol: "◎", color: "bg-green-300", cryptoname: "SOL" },
    {
      name: "Dogecoin",
      symbol: "Ð",
      color: "bg-yellow-800",
      cryptoname: "DOGE",
    },
    {
      name: "Bitcoin Cash",
      symbol: "Ƀ",
      color: "bg-green-700",
      cryptoname: "BCH",
    },
    { name: "Ripple", symbol: "✕", color: "bg-gray-900", cryptoname: "XRP" },
    { name: "Tron", symbol: "Ṯ", color: "bg-pink-700", cryptoname: "TRX" },
    { name: "EOS", symbol: "ε", color: "bg-black", cryptoname: "EOS" },
    { name: "Rupees", symbol: "₹", color: "bg-black", cryptoname: "INR" },
  ].map((crypto) => {
    const wallet = wallets.find((w) => w.cryptoname === crypto.cryptoname);
    return { ...crypto, balance: wallet ? wallet.balance : "0" };
  });

  const walletRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        walletRef.current &&
        !walletRef.current.contains(event.target as Node)
      ) {
        setIsWalletOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openLoginModal = () => {
    setAuthMode("login");
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };
  // console.log("authmode", authMode);
  const toggleWallet = () => {
    setIsWalletOpen(!isWalletOpen);
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    dispatch(logout());
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // After fetching, set INR as default currency
    const inrWallet = wallets.find((w) => w.cryptoname === "INR");
    if (inrWallet) {
      setSelectedCurrency({
        name: "INR",
        symbol: "₹",
        color: "bg-black",
        balance: inrWallet.balance,
      });
    }
  }, [wallets]);

  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Gamepad2, label: "Games", path: "/games" },
    { icon: Gift, label: "Promotions", path: "/promotions" },
    { 
      icon: User, 
      label: isAuthenticated ? "Account" : "Login", 
      path: "/account" 
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#1A1A2E]/95 backdrop-blur-lg border-b border-purple-500/10">
          <div className="container mx-auto px-6">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rollix777
              </Link>

              {/* Center Section - Wallet */}
              {isAuthenticated && (
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="relative" ref={walletRef}>
                    <button
                      onClick={toggleWallet}
                      className="py-2 px-4 rounded-lg bg-[#252547] text-white font-medium hover:bg-[#2f2f5a] transition-colors flex items-center gap-2 border border-purple-500/20"
                    >
                      <Wallet className="w-4 h-4 text-purple-400" />
                      <span>{selectedCurrency.symbol} {selectedCurrency.balance}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isWalletOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isWalletOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-[#252547] rounded-xl border border-purple-500/20 shadow-lg animate-fadeIn z-50">
                        <div className="p-3 border-b border-purple-500/10">
                          <h3 className="text-white font-semibold">My Wallet</h3>
                        </div>
                        <div className="p-3 space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
                          {updatedCryptos.map((crypto, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 hover:bg-[#2f2f5a] rounded-lg cursor-pointer"
                              onClick={() => handleCurrencySelect(crypto)}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full ${crypto.color} flex items-center justify-center text-white font-bold`}
                                >
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
                          <Link
                          to="/wallet"
                            
                            className="block p-2 hover:bg-[#2f2f5a] rounded-lg cursor-pointer border-t border-purple-500/10 mt-2 pt-2"
                          >
                            <button className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                              <Wallet className="w-4 h-4 text-white font-bold" />
                              <span>Manage Wallet</span>
                            </button>
                          </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Section */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {/* Notification Bell */}
                  <button className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors border border-purple-500/10">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Hamburger Menu */}
                  <button
                    onClick={() => setIsSideNavOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors border border-purple-500/10"
                  >
                    <Menu size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openLoginModal}
                    className="py-2 px-4 rounded-lg bg-[#252547] text-purple-400 font-medium hover:bg-[#2f2f5a] transition-colors flex items-center gap-2 border border-purple-500/10"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Your existing mobile header code */}
      <header className="md:hidden fixed top-0 w-full max-w-[430px] z-40">
        <div className="px-4 py-3 bg-[#1A1A2E]/95 backdrop-blur-lg border-b border-purple-500/10">
          <div className="flex items-center justify-between">
            {isAuthenticated ? (
              // Logged in header
              <>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Rollix777
                </div>

                {/* Wallet in center */}
                <div className="relative" ref={walletRef}>
                  <button
                    onClick={toggleWallet}
                    className="py-2 px-4 rounded-lg bg-[#252547] text-white font-medium hover:bg-[#2f2f5a] transition-colors flex items-center gap-2 border border-purple-500/20"
                  >
                    <Wallet className="w-4 h-4 text-purple-400" />
                    <span>
                      {selectedCurrency.symbol} {selectedCurrency.balance}
                    </span>{" "}
                    {/* Show selected currency balance */}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isWalletOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isWalletOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-[#252547] rounded-xl border border-purple-500/20 shadow-lg animate-fadeIn z-50">
                      <div className="p-3 border-b border-purple-500/10">
                        <h3 className="text-white font-semibold">My Wallet</h3>
                      </div>
                      <div className="p-3 space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
                        {updatedCryptos.map((crypto, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 hover:bg-[#2f2f5a] rounded-lg cursor-pointer"
                            onClick={() => handleCurrencySelect(crypto)}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full ${crypto.color} flex items-center justify-center text-white font-bold`}
                              >
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
                        <Link
                          to="/wallet"
                          className="block p-2 hover:bg-[#2f2f5a] rounded-lg cursor-pointer border-t border-purple-500/10 mt-2 pt-2"
                        >
                          <button className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                            <Wallet className="w-4 h-4 text-white font-bold" />
                            <span>Manage Wallet</span>
                          </button>
                        </Link>
                    </div>
                  )}
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-3">
                  <button className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors border border-purple-500/10">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <button
                    onClick={toggleSideNav}
                    className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors border border-purple-500/10"
                  >
                    {isSideNavOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </>
            ) : (
              // Non-logged in header
              <>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Rollix777
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={openLoginModal}
                      className="py-2 px-4 rounded-lg bg-[#252547] text-purple-400 font-medium hover:bg-[#2f2f5a] transition-colors flex items-center gap-2 border border-purple-500/10"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={openRegisterModal}
                      className="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors border border-purple-500/10"
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && !isAuthenticated && (
          <div className="absolute top-full left-0 right-0 bg-[#1A1A2E]/95 backdrop-blur-lg border-b border-purple-500/10 p-4 flex flex-col gap-3 animate-fadeIn">
            <button
              onClick={openLoginModal}
              className="w-full py-3 px-4 rounded-lg bg-[#252547] text-purple-400 font-medium hover:bg-[#2f2f5a] transition-colors flex items-center justify-center gap-2 border border-purple-500/10"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={openRegisterModal}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <SideNav
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
