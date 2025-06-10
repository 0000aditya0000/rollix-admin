import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Bitcoin, DollarSign, Copy, Check,IndianRupee, AlertCircle } from 'lucide-react';
import { depositService } from '../services/api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setWallets } from '../slices/walletSlice';
import { fetchUserWallets } from '../lib/services/WalletServices';
import { button } from 'framer-motion/client';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DepositRequest {
  userId: number;
  amount: number;
  cryptoname: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'crypto' | 'usdt'>('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'eth' | 'usdt' | 'inr'>('btc');
  const [selectedServer, setSelectedServer] = useState<'server1' | 'server2'>('server1');
  const [copied, setCopied] = useState(false);
  const [amount1, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  const [cardError, setCardError] = useState<string>('');

  // Clear states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal closes
      setAmount('');
      setCardAmount('');
      setError('');
      setCardError('');
      setActiveTab('crypto');
      setSelectedServer('server1');
      setLoading(false);
    }
  }, [isOpen]);

  // Clear states when changing tabs
  useEffect(() => {
    // Reset states specific to each tab
    setAmount('');
    setCardAmount('');
    setError('');
    setCardError('');
  }, [activeTab]);
  const [usdtAmount, setUsdtAmount] = useState<string>('');
  const [usdtLoading, setUsdtLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'trc20' | 'erc20'>('trc20');

  if (!isOpen) return null;

  const cryptoOptions = [
    { value: 'inr', label: 'INR', symbol: '₹', color: 'orange' }
  ];

  const cryptoAddresses = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    usdt: 'TKrx8cXrpYM1iaVvU3mVMzMUEtXw1Lj8gu',
    inr: 'INR34C0532925U3mVMzMUEtXw1Lj8gu'
  };

  const currencySymbols = {
    inr: '₹'
  };

  const networkAddresses = {
    trc20: 'TKrx8cXrpYM1iaVvU3mVMzMUEtXw1Lj8gu',
    erc20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cryptoAddresses[selectedCrypto]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateAmount = (value: string, type: 'upi' | 'card') => {
    const amount = parseFloat(value);
    if (!value) {
      return type === 'upi' ? 'Amount is required' : 'Card amount is required';
    }
    if (isNaN(amount) || amount <= 0) {
      return 'Please enter a valid amount';
    }
    if (type === 'upi' && amount < 100) {
      return 'Minimum deposit amount is 100 INR';
    }
    if (type === 'card' && amount < 10) {
      return 'Minimum deposit amount is 10 USDT';
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'upi' | 'card') => {
    const value = e.target.value;
    if (type === 'upi') {
      setAmount(value);
      setError(validateAmount(value, 'upi'));
    } else {
      setCardAmount(value);
      setCardError(validateAmount(value, 'card'));
    }
  };

  const handleTabChange = (tab: 'crypto' | 'usdt') => {
    setActiveTab(tab);
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      
      // Convert amount to number and ensure it's a valid number
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        toast.error('Invalid amount');
        return;
      }

      // Get the correct cryptoname mapping
      const cryptoMapping: { [key: string]: string } = {
        'btc': 'BTC',
        'eth': 'ETH',
        'usdt': 'USDT',
        'inr': 'INR'
      };
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const requestData: DepositRequest = {
        userId: parseInt(userId),
        amount: numericAmount,
        cryptoname: cryptoMapping[selectedCrypto] || selectedCrypto.toUpperCase()
      };

      console.log('Sending deposit request:', requestData);
      const response = await depositService.deposit(requestData);

      // Refresh wallet data after successful deposit
      const updatedWallets = await fetchUserWallets(parseInt(userId));
      dispatch(setWallets(updatedWallets));

      console.log('Deposit response:', response);
      toast.success(response.message || 'Deposit processed successfully');
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process deposit. Please try again.';
      toast.error(errorMessage);
      console.error('Deposit error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const launchGateway = () => {
    const validationError = validateAmount(amount1, 'upi');
    if (validationError) {
      setError(validationError);
      return;
    }

    const uid = localStorage.getItem('userId');
    if (!uid) {
      toast.error('Please Login First');
      return;
    }
    const amount = parseFloat(amount1);
    const phone = 1234567890;
    
    // Different URLs for different servers
    const serverUrls = {
      server1: `https://pay.rollix777.com/index.php?uid=${uid}&amount=${amount}&phone=${phone}`,
      server2: `https://pay.rollix777.com/novapay.php?uid=${uid}&amount=${amount}&phone=${phone}&tyid=1`
    };
    window.location.href = serverUrls[selectedServer];
  }

  const handleModalClose = () => {
    // Reset all states before closing
    setAmount('');
    setCardAmount('');
    setError('');
    setCardError('');
    setActiveTab('crypto');
    setSelectedServer('server1');
    setLoading(false);
    onClose();
  };

  const handleUsdtDeposit = () => {
    if (!usdtAmount || isNaN(Number(usdtAmount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(usdtAmount);
    if (amount < 10) {
      toast.error('Minimum deposit amount is 10 USDT');
      return;
    }

    const uid = localStorage.getItem('userId');
    if (!uid) {
      toast.error('Please Login First');
      return;
    }

    // tyid: 1 for TRC20, 2 for ERC20
    const tyid = selectedNetwork === 'trc20' ? 1 : 2;
    
    // Redirect to the USDT payment gateway
    window.location.href = `https://cryptousdt.rollix777.com/?uid=${uid}&amount=${amount}&tyid=${tyid}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 mt-12">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleModalClose}></div>
      
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-green-500/10">
          <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
          <button 
            onClick={handleModalClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-green-500/10">
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'crypto' 
                ? 'text-white border-b-2 border-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('crypto')}
          >
            <div className="flex items-center justify-center gap-2">
              <IndianRupee size={18} />
              <span>UPI</span>
            </div>
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'usdt' 
                ? 'text-white border-b-2 border-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('usdt')}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign size={18} />
              <span>USDT</span>
            </div>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5">
          {activeTab === 'crypto' ? (
            <div className="space-y-4 ">
              {/* Server Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setSelectedServer('server1')}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedServer === 'server1'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-[#1A1A2E] border-green-500/20 text-gray-400 hover:border-green-500/40'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">Server 1</span>
                    <span className="text-xs">Recommended</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedServer('server2')}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedServer === 'server2'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-[#1A1A2E] border-green-500/20 text-gray-400 hover:border-green-500/40'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">Server 2</span>
                    <span className="text-xs">Alternative</span>
                  </div>
                </button>
              </div>

              {/* Existing crypto selection */}
              <div className="relative">
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value as 'btc' | 'eth' | 'usdt' | 'inr')}
                  className="w-full py-3 px-4 bg-[#1A1A2E] border border-green-500/20 rounded-lg text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                >
                  {cryptoOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#1A1A2E]">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className={`w-6 h-6 rounded-full bg-${cryptoOptions.find(opt => opt.value === selectedCrypto)?.color}-500 flex items-center justify-center text-white font-bold text-xs`}>
                    {currencySymbols[selectedCrypto]}
                  </div>
                </div>
              </div>

              {/* Amount input */}
              <div className="p-4 bg-[#1A1A2E] rounded-lg border border-green-500/20">
                <div className="mt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Amount (INR)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount1}
                      onChange={(e) => handleAmountChange(e, 'upi')}
                      className={`w-full py-3 px-4 bg-[#252547] border ${error ? 'border-red-500' : 'border-green-500/20'} rounded-lg text-white focus:outline-none focus:border-green-500`}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={launchGateway}
                  disabled={loading || !!error}
                  className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    loading || !!error
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90'
                  }`}
                >
                  {loading ? 'Processing...' : `Deposit via ${selectedServer === 'server1' ? 'Server 1' : 'Server 2'}`}
                </button>
              </div>

              {/* Important notes */}
              <div className="p-4 bg-[#1A1A2E] rounded-lg border border-green-500/20 text-sm text-gray-400">
                <p className="mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Send only via UPI Method</li>
                  <li>Minimum deposit: 100 INR</li>
                  <li>Deposits are credited instantly</li>
                  <li>Choose server based on your location</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4  ">
              {/* Network Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setSelectedNetwork('trc20')}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedNetwork === 'trc20'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-[#1A1A2E] border-green-500/20 text-gray-400 hover:border-green-500/40'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">TRC20</span>
                    <span className="text-xs">Recommended</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedNetwork('erc20')}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedNetwork === 'erc20'
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : 'bg-[#1A1A2E] border-green-500/20 text-gray-400 hover:border-green-500/40'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">ERC20</span>
                    <span className="text-xs">Alternative</span>
                  </div>
                </button>
              </div>

              {/* USDT Amount Input */}
              <div className="p-4 bg-[#1A1A2E] rounded-lg border border-green-500/20">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Amount (USDT)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <input 
                        type="number"
                        value={usdtAmount}
                        onChange={(e) => setUsdtAmount(e.target.value)}
                        className="w-full py-3 pl-10 pr-4 bg-[#252547] border border-green-500/20 rounded-lg text-white focus:outline-none focus:border-green-500"
                        placeholder="Enter amount in USDT"
                        min="10"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUsdtDeposit}
                    disabled={usdtLoading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                      usdtLoading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90'
                    }`}
                  >
                    {usdtLoading ? 'Processing...' : `Deposit via ${selectedNetwork.toUpperCase()}`}
                  </button>
                </div>
                {cardError && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{cardError}</span>
                  </div>
                )}
              </div>

              {/* Important notes for USDT */}
              <div className="p-4 bg-[#1A1A2E] rounded-lg border border-green-500/20 text-sm text-gray-400">
                <p className="mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Minimum deposit: 10 USDT</li>
                  <li>Deposits are credited instantly</li>
                  <li>Make sure to send the exact amount</li>
                  <li>Double-check the network before sending</li>
                  <li>TRC20 has lower fees than ERC20</li>
                  <li>Send only USDT tokens</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;