import React, { useState,useEffect } from "react";
import {
  X,
  Wallet,
  Bitcoin,
  DollarSign,
  CreditCard,
  ArrowDown,
  ChevronDown,
  IndianRupee,
  AlertCircle,
  Hexagon,
  Gem,
  CodeSquare,
} from "lucide-react";
import { fetchUserAllData } from '../lib/services/userService';
import {baseUrl} from '../lib/config/server'
import axios from "axios";
import toast from 'react-hot-toast';

interface BankAccount {
  id: number;
  accountname: string;
  accountnumber: string;
  ifsccode: string;
  branch: string;
  status: number;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainBalance: number;
  fetchData: () => void;
}

interface cryptoPayload {
  walletAddress: string;
  amount: string;
  cryptoname?: string;
  network?: string;
}

interface bankPayload {
  bankname: string;
  amount: string;
  currency: string;
}

interface errorCrypto {
  walletAddress: string;
  amount: string;
}
interface errorBank {
  bankname: string;
  amount: string;
  currency: string;
}

interface WithdrawPayload {
  type: "crypto" | "bank";
  userId: string | null;
  amount: string;
  [key: string]: any;
}



const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  mainBalance,
  fetchData,
}) => {
  const [activeTab, setActiveTab] = useState<"crypto" | "bank">("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState<"btc" | "eth" | "usdt">("btc");
  const [selectedNetwork, setSelectedNetwork] = useState<"trc20" | "erc20">("trc20");
  const [selectedCurrency, setSelectedCurrency] = useState("inr");
  const [error, setError] = useState<string>("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const userId = localStorage.getItem('userId');

  // Initial states
  const initialCryptoPayload: cryptoPayload = {
    walletAddress: "",
    amount: "",
    cryptoname: "",
    network: "trc20",
  };

  const initialBankPayload: bankPayload = {
    bankname: "",
    amount: "",
    currency: "",
  };

  const initialErrorState = {
    crypto: { walletAddress: "", amount: "" },
    bank: { bankname: "", amount: "", currency: "" }
  };

  const [cryptoPayload, setCryptoPayload] = useState<cryptoPayload>(initialCryptoPayload);
  const [bankPayload, setBankPayload] = useState<bankPayload>(initialBankPayload);
  const [errorCrypto, setErrorCrypto] = useState<errorCrypto>(initialErrorState.crypto);
  const [errorBank, setErrorBank] = useState<errorBank>(initialErrorState.bank);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  // Reset all states when modal closes
  const handleClose = () => {
    setCryptoPayload(initialCryptoPayload);
    setBankPayload(initialBankPayload);
    setErrorCrypto(initialErrorState.crypto);
    setErrorBank(initialErrorState.bank);
    setApiError("");
    setSelectedCrypto("btc");
    setSelectedNetwork("trc20");
    setSelectedCurrency("inr");
    onClose();
  };

  useEffect(() => {
    // Reset states when modal opens
    if (isOpen) {
      setBankPayload(initialBankPayload);
      setErrorCrypto(initialErrorState.crypto);
      setErrorBank(initialErrorState.bank);
      setApiError("");
      // Do not reset the entire cryptoPayload, just the amount
      setCryptoPayload(prev => ({
        ...prev,
        amount: ""
      }));
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && isOpen) {
        try {
          const response = await fetchUserAllData(userId);
          if (response.success) {
            console.log('data is coming',response.data)
            setBankAccounts(response.data.bankAccounts);
            const usdtAccount = response.data.bankAccounts.find(
              (account: any) => account.network === "TRC20" && account.usdt
            );
            console.log('usdtAccount',usdtAccount)
            if (usdtAccount) {
              setCryptoPayload(prev => ({
                ...prev,
                walletAddress: usdtAccount.usdt,
                network: selectedNetwork,
                cryptoname: selectedCrypto
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId, isOpen, selectedNetwork, selectedCrypto]);

  useEffect(() => {
    if (selectedCrypto === "usdt") {
      setCryptoPayload(prev => ({
        ...prev,
        network: selectedNetwork,
        cryptoname: "usdt"
      }));
    }
  }, [selectedNetwork, selectedCrypto]);

  const validateCryptoFields = (payload: cryptoPayload): { isValid: boolean; errors: errorCrypto } => {
    const errors = { ...initialErrorState.crypto };
    const amount = Number(payload.amount);

    if (!payload.walletAddress.trim()) {
      errors.walletAddress = "Wallet address is required";
    }
    if (!payload.amount.trim()) {
      errors.amount = "Amount is required";
    } else if (isNaN(amount) || amount <= 0) {
      errors.amount = "Please enter a valid amount";
    } else if (amount < 10) {
      errors.amount = "Minimum withdrawal amount is 10 USDT";
    }

    return {
      isValid: !errors.walletAddress && !errors.amount,
      errors
    };
  };

  const validateBankFields = (payload: bankPayload): { isValid: boolean; errors: errorBank } => {
    const errors = { ...initialErrorState.bank };
    const amount = Number(payload.amount.replace(/,/g, ""));

    if (!payload.bankname) errors.bankname = "Please select a bank account";
    if (!payload.currency) errors.currency = "Please select a currency";
    
    if (!payload.amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(amount) || amount <= 0) {
      errors.amount = "Please enter a valid amount";
    } else if (amount > mainBalance) {
      errors.amount = "Amount cannot exceed available balance";
    } else if (amount < 200) {
      errors.amount = "Minimum withdrawal amount is ₹200";
    }

    return {
      isValid: !errors.bankname && !errors.amount && !errors.currency,
      errors
    };
  };

  const makeWithdrawalRequest = async (payload: WithdrawPayload): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('payload',payload);
      const response = await axios.post(`${baseUrl}/api/wallet/withdrawl`, payload);
      if (response.data.success) {
        toast.success( 'Withdrawal request successful!');
        fetchData();
      } else {
        toast.error(response.data.message || 'Withdrawal request failed.');
      }
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const handleChangeOfCrypto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newPayload = { ...cryptoPayload, [name]: value };
    const { errors } = validateCryptoFields(newPayload);
    
    setCryptoPayload(newPayload);
    setErrorCrypto(errors);
  };

  const handleChangeOfBank = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "amount" && !/^\d*\.?\d{0,2}$/.test(value.replace(/,/g, ""))) return;
    
    const newPayload = { ...bankPayload, [name]: value };
    const { errors } = validateBankFields(newPayload);
    
    setBankPayload(newPayload);
    setErrorBank(errors);
  };

  const handleMaxAmount = () => {
    const maxAmount = Number(mainBalance || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    const newPayload = { ...bankPayload, amount: maxAmount.replace(/,/g, "") };
    const { errors } = validateBankFields(newPayload);
    
    setBankPayload(newPayload);
    setErrorBank(errors);
  };

  const handleWithdraw = async () => {
    setApiError("");
    let validationResult;
    let payload: WithdrawPayload | null = null;

    if (activeTab === "crypto") {
      validationResult = validateCryptoFields(cryptoPayload);
      setErrorCrypto(validationResult.errors);

      if (validationResult.isValid) {
        payload = {
          type: "crypto",
          ...cryptoPayload,
          cryptoname: selectedCrypto,
          network: selectedCrypto === "usdt" ? selectedNetwork : undefined,
          userId
        };
      } else {
        toast.error("Please fill all required fields correctly.");
        return;
      }
    } else {
      validationResult = validateBankFields(bankPayload);
      setErrorBank(validationResult.errors);

      if (validationResult.isValid) {
        payload = {
          type: "bank",
          ...bankPayload,
          balance: bankPayload.amount.replace(/,/g, ""),
          userId
        };
      } else {
        toast.error("Please fill all required fields correctly.");
        return;
      }
    }

    if (validationResult?.isValid && payload) {
      setIsLoading(true);
      const result = await makeWithdrawalRequest(payload);
      setIsLoading(false);

      if (result.success) {
        handleClose();
      } else {
        setApiError(result.message || "Withdrawal failed.");
      }
    }
  };

  const cryptoOptions = [
    { value: "usdt", label: "USDT", symbol: "₮", color: "green" },
    { value: "inr", label: "INR", symbol: "₹", color: "orange" },
  ];



  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/10">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "crypto"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => {
              setApiError("");
              setActiveTab("crypto")

            }}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign size={18} />
              <span>Cryptocurrency</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "bank"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => {
              setActiveTab("bank")
              setApiError("")
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard size={18} />
              <span>Bank Transfer</span>
            </div>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 ">
          {activeTab === "crypto" ? (
            <div className="space-y-4 ">
              <div className="flex gap-2">
                {/* <button
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                    selectedCrypto === "btc"
                      ? "bg-yellow-500/20 border border-yellow-500/30 text-white"
                      : "bg-[#1A1A2E] border border-gray-700 text-gray-400 hover:border-yellow-500/30"
                  }`}
                  onClick={() => setSelectedCrypto("btc")}
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                    ₿
                  </div>
                  <span>Bitcoin</span>
                </button> */}
               
                <button
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                    selectedCrypto === "usdt"
                      ? "bg-green-500/20 border border-green-500/30 text-white"
                      : "bg-[#1A1A2E] border border-gray-700 text-gray-400 hover:border-green-500/30"
                  }`}
                  onClick={() => setSelectedCrypto("usdt")}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                    ₮
                  </div>
                  <span>USDT</span>
                </button>
              </div>

              {selectedCrypto === "usdt" && (
                <div className="flex gap-2 mt-3">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                      selectedNetwork === "trc20"
                        ? "bg-purple-500/20 border border-purple-500/30 text-white"
                        : "bg-[#1A1A2E] border border-gray-700 text-gray-400 hover:border-purple-500/30"
                    }`}
                    onClick={() => setSelectedNetwork("trc20")}
                  >
                    <Hexagon className="w-4 h-4" />
                    <span>TRC20</span>
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                      selectedNetwork === "erc20"
                        ? "bg-purple-500/20 border border-purple-500/30 text-white"
                        : "bg-[#1A1A2E] border border-gray-700 text-gray-400 hover:border-purple-500/30"
                    }`}
                    onClick={() => setSelectedNetwork("erc20")}
                  >
                    <Gem className="w-4 h-4" />
                    <span>ERC20</span>
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Wallet Address</label>
                <input
                  type="text"
                  value={cryptoPayload.walletAddress}
                  onChange={handleChangeOfCrypto}
                  name="walletAddress"
                  disabled={!!cryptoPayload.walletAddress}
                  className={`w-full py-3 px-4 bg-[#1A1A2E] border ${
                    errorCrypto.walletAddress ? 'border-red-500' : 'border-purple-500/20'
                  } rounded-lg text-white focus:outline-none focus:border-purple-500 ${
                    cryptoPayload.walletAddress ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  placeholder={`Enter your ${selectedCrypto.toUpperCase()} wallet address`}
                />
                {errorCrypto.walletAddress && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorCrypto.walletAddress}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    name="amount"
                    value={cryptoPayload.amount}
                    onChange={handleChangeOfCrypto}
                    className={`w-full py-3 px-4 bg-[#1A1A2E] border ${
                      errorCrypto.amount ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg text-white focus:outline-none focus:border-purple-500`}
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400">
                      {selectedCrypto.toUpperCase()}
                    </span>
                  </div>
                </div>
                {errorCrypto.amount && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorCrypto.amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">
                    Available: 0.0042 {selectedCrypto.toUpperCase()}
                  </span>
                  <button className="text-purple-400">MAX</button>
                </div>
              </div>

              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white">
                    0.0001 {selectedCrypto.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">You will receive:</span>
                  <span className="text-white">
                    0.00 {selectedCrypto.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Add error message display */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                type="button"
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} transition-opacity`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Withdraw Now"
                )}
              </button>

              <div className="text-sm text-gray-400">
                <p className="mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Minimum withdrawal: 10 {selectedCrypto.toUpperCase()}
                  </li>
                  <li>Processing time: 10-30 minutes</li>
                  <li>Double-check your wallet address before confirming</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Currency Selector */}
              <div className="space-y-1 -mt-2">
                <label className="text-xs sm:text-sm text-gray-400">
                  Select Currency
                </label>
                <div className="relative">
                  <select
                    value={bankPayload.currency}
                    onChange={handleChangeOfBank}
                    name="currency"
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-[#1A1A2E] border ${
                      errorBank.currency ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg sm:rounded-xl text-base sm:text-lg text-white focus:outline-none focus:border-purple-500 appearance-none`}
                  >
                    <option value="">Select Currency</option>
                    {cryptoOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#1A1A2E]"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errorBank.currency && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorBank.currency}</span>
                  </div>
                )}
              </div>
              {/* Bank Account Selector */}
              <div className="space-y-1">
                <label className="text-xs sm:text-sm text-gray-400">
                  Select Bank Account
                </label>
                <div className="relative">
                  <select
                    value={bankPayload.bankname}
                    onChange={handleChangeOfBank}
                    name="bankname"
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 bg-[#1A1A2E] border ${
                      errorBank.bankname ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg sm:rounded-xl text-base sm:text-lg text-white focus:outline-none focus:border-purple-500 appearance-none`}
                  >
                    <option value="">Select a bank account</option>
                    {bankAccounts.map((account) => (
                      <option
                        key={account.id}
                        value={account.id}
                        className="bg-[#1A1A2E]"
                      >
                        {account.accountname} - {account.accountnumber}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errorBank.bankname && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorBank.bankname}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Amount (INR)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IndianRupee className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={`w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border ${
                      errorBank.amount ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg text-white focus:outline-none focus:border-purple-500`}
                    placeholder="100.00"
                    value={bankPayload.amount}
                    onChange={handleChangeOfBank}
                    name="amount"
                  />
                </div>
                {errorBank.amount && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorBank.amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">
                    Available: ₹{Number(mainBalance || 0).toLocaleString("en-IN")}
                  </span>
                  <button
                    className="text-purple-400"
                    onClick={handleMaxAmount}
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white">₹5.00</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">You will receive:</span>
                  <span className="text-white">₹0.00</span>
                </div>
              </div>

              {/* Add error message display */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              <button
              onClick={handleWithdraw}
                type="button"
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} transition-opacity`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Withdraw Now"
                )}
              </button>

              <div className="text-sm text-gray-400">
                <p className="mb-2">Important:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Minimum withdrawal: ₹200.00</li>
                  <li>Processing time: 1-3 business days</li>
                  <li>Bank transfer fees may apply</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
