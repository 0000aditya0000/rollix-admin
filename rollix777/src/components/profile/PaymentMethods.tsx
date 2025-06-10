import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  ArrowLeft,
  Plus,
  CreditCard,
  Trash2,
  Check,
  Loader2,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../lib/config/server";
import { toast } from "react-hot-toast";
import debounce from "lodash/debounce";

interface FormData {
  accountname: string;
  accountnumber: string;
  ifsccode: string;
  branch: string;
  type: string;
}

interface FormErrors {
  accountname: string;
  accountnumber: string;
  ifsccode: string;
  branch: string;
  type: string;
}

interface BankAccount {
  id: number;
  userId: number;
  accountname: string | null;
  accountnumber: string | null;
  ifsccode: string | null;
  branch: string | null;
  status: number;
  network: string | null;
  usdt: string | null;
}

interface USDTWalletCardProps {
  wallet: BankAccount;
  onEdit: (wallet: BankAccount) => void;

}

const USDTWalletCard = memo(({ wallet, onEdit, }: USDTWalletCardProps) => (
  <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Wallet className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-white font-medium text-base w-full sm:w-auto sm:truncate">
              USDT Wallet ({wallet.network})
            </h3>
          </div>
          <div className="space-y-0.5">
            <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <span className="text-purple-400/60">Address:</span>
              <span className="font-mono break-all">{wallet.usdt}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center sm:items-start gap-2 ml-16 sm:ml-0">
        <button
          onClick={() => onEdit(wallet)}
          className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
          title="Edit USDT Wallet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(wallet.id)}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          title="Remove USDT Wallet"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

// Separate components for better code splitting and performance
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
  </div>
));

const EmptyState = memo(() => (
  <div className="text-center py-8 text-gray-400">
    No bank accounts added yet
  </div>
));

interface BankAccountCardProps {
  account: BankAccount;
  statusInfo: {
    text: string;
    className: string;
  };

}

const BankAccountCard = memo(
  ({ account, statusInfo, }: BankAccountCardProps) => (
    <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-white font-medium text-base w-full sm:w-auto sm:truncate">
                {account.accountname}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.className} uppercase tracking-wider self-start sm:self-auto`}
              >
                {statusInfo.text}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <span className="text-purple-400/60">A/c :</span>
                <span className="font-mono">
                  •••• {account.accountnumber?.slice(-6)}
                </span>
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-2">
                <span className="text-purple-400/60 min-w-[40px]">IFSC :</span>
                <span className="font-mono">{account.ifsccode}</span>
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-2">
                <span className="text-purple-400/60 min-w-[40px]">
                  Branch :
                </span>
                <span className="truncate">{account.branch}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center sm:items-start gap-2 ml-16 sm:ml-0">
          <button
            onClick={() => onRemove(account.id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Remove Bank Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
);

const PaymentMethods: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [showAddUSDT, setShowAddUSDT] = useState<boolean>(false);
  const [showEditUSDT, setShowEditUSDT] = useState<boolean>(false);
  const [selectedWalletForEdit, setSelectedWalletForEdit] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState<FormData>({
    accountname: "",
    accountnumber: "",
    ifsccode: "",
    branch: "",
    type: "bank"
  });
  const [errors, setErrors] = useState<FormErrors>({
    accountname: "",
    accountnumber: "",
    ifsccode: "",
    branch: "",
    type: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usdtAddress, setUsdtAddress] = useState<string>("");
  const [usdtError, setUsdtError] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [networkError, setNetworkError] = useState<string>("");

  const userId = localStorage.getItem("userId");

  // Filter accounts based on type
  const bankAccounts = useMemo(() => accounts.filter(acc => !acc.network), [accounts]);
  const usdtWallets = useMemo(() => accounts.filter(acc => acc.network), [accounts]);

  // Fetch all accounts (both bank and USDT)
  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${baseUrl}/api/bankaccount/getone/user/${userId}`
      );

      if (Array.isArray(response.data)) {
        setAccounts(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleEditUSDT = useCallback((wallet: BankAccount) => {
    setSelectedWalletForEdit(wallet);
    setUsdtAddress(wallet.usdt || "");
    setSelectedNetwork(wallet.network || "");
    setShowEditUSDT(true);
  }, []);

  const handleUpdateUSDT = useCallback(async () => {
    return
    if (!usdtAddress.trim()) {
      setUsdtError("Wallet address is required");
      return;
    }

    if (!selectedNetwork) {
      setNetworkError("Please select a network");
      return;
    }

    if (!/^[0-9a-zA-Z]{34,}$/.test(usdtAddress.trim())) {
      setUsdtError("Invalid USDT wallet address");
      return;
    }

    try {
      if (!userId || !selectedWalletForEdit) {
        toast.error("Missing required information");
        return;
      }

      const payload = {
        id: selectedWalletForEdit.id,
        userId,
        type: "usdt",
        usdt: usdtAddress.trim(),
        network: selectedNetwork,
        status: 0
      };

      const response = await axios.put(
        `${baseUrl}/api/bankaccount/update/${selectedWalletForEdit.id}`,
        payload
      );

      if (response.data) {
        setUsdtAddress("");
        setSelectedNetwork("");
        setShowEditUSDT(false);
        setSelectedWalletForEdit(null);
        toast.success("USDT wallet updated successfully!");
        await fetchAccounts();
      } else {
        toast.error(response.data.message || "Failed to update USDT wallet");
      }
    } catch (error) {
      console.error("Error updating USDT wallet:", error);
      toast.error("An error occurred while updating USDT wallet");
    }
  }, [usdtAddress, selectedNetwork, userId, selectedWalletForEdit, fetchAccounts]);

  const handleAddUSDT = useCallback(async () => {
    if (!usdtAddress.trim()) {
      setUsdtError("Wallet address is required");
      return;
    }

    if (!selectedNetwork) {
      setNetworkError("Please select a network");
      return;
    }

    if (!/^[0-9a-zA-Z]{34,}$/.test(usdtAddress.trim())) {
      setUsdtError("Invalid USDT wallet address");
      return;
    }

    try {
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const payload = {
        userId,
        type: "usdt",
        usdt: usdtAddress.trim(),
        network: selectedNetwork
      };

      const response = await axios.post(
        `${baseUrl}/api/bankaccount/addnew`,
        payload
      );

      if (response.data.id) {
        setUsdtAddress("");
        setSelectedNetwork("");
        setShowAddUSDT(false);
        toast.success("USDT wallet added successfully!");
        await fetchAccounts();
      } else {
        toast.error(response.data.message || "Failed to add USDT wallet");
      }
    } catch (error) {
      console.error("Error adding USDT wallet:", error);
      toast.error("An error occurred while adding USDT wallet");
    }
  }, [usdtAddress, selectedNetwork, userId, fetchAccounts]);

  // const handleRemoveAccount = async (accountId: number) => {
  //   try {
  //     const confirmed = window.confirm(
  //       "Are you sure you want to remove this account?"
  //     );
  //     if (!confirmed) return;

  //     setIsLoading(true);
  //     await axios.delete(`${baseUrl}/api/bankaccount/delete/${accountId}`);

  //     toast.success("Account removed successfully");
  //     await fetchAccounts();
  //   } catch (error) {
  //     console.error("Error removing account:", error);
  //     toast.error("Failed to remove account");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Memoize form reset function
  const resetForm = useCallback(() => {
    setFormData({
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      branch: "",
      type: "bank"
    });
    setErrors({
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      branch: "",
      type: "",
    });
  }, []);

  // Memoize modal close handler
  const handleCloseModal = useCallback(() => {
    if (!isSubmitting) {
      setShowAddCard(false);
      resetForm();
    }
  }, [isSubmitting, resetForm]);

  // Memoize status info getter
  const getStatusInfo = useCallback((status: number) => {
    switch (status) {
      case 1:
        return {
          text: "Approved",
          className: "bg-green-500/20 text-green-400",
        };
      case 2:
        return {
          text: "Rejected",
          className: "bg-red-500/20 text-red-400",
        };
      default:
        return {
          text: "Pending",
          className: "bg-yellow-500/20 text-yellow-400",
        };
    }
  }, []);

  // Memoize form validation
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {
      accountname: "",
      accountnumber: "",
      ifsccode: "",
      branch: "",
      type: "",
    };

    if (!formData.accountname.trim()) {
      newErrors.accountname = "Account name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.accountname)) {
      newErrors.accountname = "Account name should only contain letters";
      isValid = false;
    }

    if (!formData.accountnumber) {
      newErrors.accountnumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{9,18}$/.test(formData.accountnumber)) {
      newErrors.accountnumber = "Account number should be 9-18 digits";
      isValid = false;
    }

    if (!formData.ifsccode) {
      newErrors.ifsccode = "IFSC code is required";
      isValid = false;
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsccode)) {
      newErrors.ifsccode = "Invalid IFSC code format";
      isValid = false;
    }

    if (!formData.branch.trim()) {
      newErrors.branch = "Branch name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Memoize submit handler
  const handleSubmit = useCallback(async () => {
    try {
      if (!validateForm()) {
        return;
      }

      if (!userId) {
        return;
      }

      setIsSubmitting(true);

      const payload = {
        ...formData,
        userId,
        status: 0,
        type: "bank"
      };

      const response = await axios.post(
        `${baseUrl}/api/bankaccount/addnew`,
        payload
      );

      if (response.data.id) {
        setShowAddCard(false);
        resetForm();
        toast.success(
          response.data.message || "Bank account added successfully!"
        );
        await fetchAccounts();
      } else {
        toast.error(response.data.message || "Failed to add bank account");
      }
    } catch (error) {
      toast.error("An error occurred while adding bank account");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, userId, resetForm, fetchAccounts]);

  // Memoize renderInput function
  const renderInput = useCallback(
    (
      label: string,
      name: keyof FormData,
      placeholder: string,
      maxLength?: number
    ) => (
      <div className="space-y-1" key={name}>
        <label className="text-sm text-gray-300">{label}</label>
        <input
          type="text"
          name={name}
          value={formData[name]}
          onChange={(e) => {
            const { value } = e.target;
            setFormData((prev) => ({
              ...prev,
              [name]: value,
            }));
            setErrors((prev) => ({
              ...prev,
              [name]: "",
            }));
          }}
          maxLength={maxLength}
          className={`w-full py-3 px-4 bg-[#1A1A2E] border ${
            errors[name] ? "border-red-500" : "border-purple-500/20"
          } rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors`}
          placeholder={placeholder}
          disabled={isSubmitting}
        />
        {errors[name] && (
          <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    ),
    [formData, errors, isSubmitting]
  );

  // Add Edit USDT Modal
  const renderUSDTModal = (isEdit: boolean) => {
    const modalTitle = isEdit ? "Edit USDT Wallet" : "Add New USDT Wallet";
    const handleAction = isEdit ? handleUpdateUSDT : handleAddUSDT;
    const closeModal = () => {
      if (isEdit) {
        setShowEditUSDT(false);
        setSelectedWalletForEdit(null);
      } else {
        setShowAddUSDT(false);
      }
      setUsdtAddress("");
      setSelectedNetwork("");
      setUsdtError("");
      setNetworkError("");
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        />
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Network Selection */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Select Network</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedNetwork("TRC20");
                      setNetworkError("");
                    }}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedNetwork === "TRC20"
                        ? "bg-purple-600 text-white"
                        : "bg-[#1A1A2E] text-gray-400 hover:bg-purple-600/20"
                    }`}
                  >
                    TRC20
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNetwork("ERC20");
                      setNetworkError("");
                    }}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedNetwork === "ERC20"
                        ? "bg-purple-600 text-white"
                        : "bg-[#1A1A2E] text-gray-400 hover:bg-purple-600/20"
                    }`}
                  >
                    ERC20
                  </button>
                </div>
                {networkError && (
                  <p className="text-red-400 text-xs mt-1">{networkError}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Wallet Address</label>
                <input
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => {
                    setUsdtAddress(e.target.value);
                    setUsdtError("");
                  }}
                  className={`w-full py-3 px-4 bg-[#1A1A2E] border ${
                    usdtError ? "border-red-500" : "border-purple-500/20"
                  } rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="Enter USDT wallet address"
                />
                {usdtError && (
                  <p className="text-red-400 text-xs mt-1">{usdtError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto sm:flex-1 py-3 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white hover:bg-purple-500/10 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="w-full sm:w-auto sm:flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                {isEdit ? "Update Wallet" : "Add Wallet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <Plus size={20} />
            <span>Add New Bank Account</span>
          </button>
          <button
            onClick={() => setShowAddUSDT(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Add New USDT Wallet</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bank Accounts Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Bank Accounts</h2>
            <div className="space-y-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : bankAccounts.length === 0 ? (
                <EmptyState />
              ) : (
                bankAccounts.map((account) => (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    statusInfo={getStatusInfo(account.status)}
                    // onRemove={handleRemoveAccount}
                  />
                ))
              )}
            </div>
          </div>

          {/* USDT Wallets Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">USDT Wallets</h2>
            <div className="space-y-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : usdtWallets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No USDT wallets added yet
                </div>
              ) : (
                usdtWallets.map(wallet => (
                  <USDTWalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onEdit={handleEditUSDT}
                    // onRemove={handleRemoveAccount}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Add New Bank Account
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {renderInput(
                    "Bank Name",
                    "accountname",
                    "Enter Bank Name",
                    50
                  )}
                  {renderInput(
                    "Account Number",
                    "accountnumber",
                    "Enter your account number",
                    18
                  )}
                  {renderInput("IFSC Code", "ifsccode", "Enter IFSC Code", 11)}
                  {renderInput(
                    "Branch Name",
                    "branch",
                    "Enter your branch name",
                    50
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto sm:flex-1 py-3 px-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white hover:bg-purple-500/10 transition-colors disabled:opacity-50 order-2 sm:order-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      "Add Account"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAddUSDT && renderUSDTModal(false)}
        {showEditUSDT && renderUSDTModal(true)}
      </div>
    </div>
  );
};

export default memo(PaymentMethods);
