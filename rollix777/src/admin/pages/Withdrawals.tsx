import React, { useState, useEffect } from 'react';
import { Search, Check, X, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '../../lib/config/server';
import { toast } from 'react-hot-toast';

interface WithdrawalStatus {
  code: string;
  status: string;
}

interface User {
  username: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface BankDetails {
  accountName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  branch: string | null;
  bankAccountStatus: string | null;
}

interface CryptoDetails {
  walletAddress: string | null;
  networkType: string | null;
}

interface Withdrawal {
  withdrawalId: number;
  amount: string;
  cryptoname: string;
  requestDate: string;
  withdrawalStatus: WithdrawalStatus;
  user: User;
  withdrawalDetails: BankDetails | CryptoDetails;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: Withdrawal[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const STATUS_CODES = {
  PENDING: '0',
  APPROVED: '1',
  REJECTED: '2',
  ALL: '3'
} as const;

type StatusCode = typeof STATUS_CODES[keyof typeof STATUS_CODES];

const STATUS_LABELS: Record<StatusCode, string> = {
  [STATUS_CODES.PENDING]: 'Pending',
  [STATUS_CODES.APPROVED]: 'Approved',
  [STATUS_CODES.REJECTED]: 'Rejected',
  [STATUS_CODES.ALL]: 'All'
};

const ITEMS_PER_PAGE = 20;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCryptoColor = (cryptoname: string) => {
  switch (cryptoname.toUpperCase()) {
    case 'BTC':
      return 'text-orange-400';
    case 'ETH':
      return 'text-blue-400';
    case 'USDT':
      return 'text-green-400';
    case 'INR':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

const formatAmount = (amount: string | null | undefined, cryptoname: string) => {
  if (!amount) return 'N/A';
  return (
    <div className="flex items-center gap-1">
      <span className="text-white">{Number(amount).toLocaleString()}</span>
      <span className={`${getCryptoColor(cryptoname)} font-medium`}>
        {cryptoname.toUpperCase()}
      </span>
    </div>
  );
};

const formatUserInfo = (user: User) => {
  if (!user) return 'N/A';
  return user.name || user.email || user.username || user.phone || 'N/A';
};

const formatAccountDetails = (details: BankDetails | CryptoDetails) => {
  if (!details) return 'N/A';
  
  if ('walletAddress' in details) {
    if (!details.walletAddress) return 'N/A';
    return (
      <div className="flex flex-col">
        <span className="text-blue-400 font-medium">{details.walletAddress}</span>
        {/* <span className="text-xs text-gray-400">Network: {details.networkType || 'N/A'}</span> */}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <span className="text-emerald-400 font-medium">{details.accountNumber || 'N/A'}</span>
      <span className="text-xs text-gray-400">
        {/* Bank: {details.bankAccountStatus || 'N/A'}  */}
      </span>
    </div>
  );
};

const getMethodColor = (method: string) => {
  return method === 'Crypto' ? 'text-purple-400' : 'text-orange-400';
};

const Withdrawals = () => {
  const [statusFilter, setStatusFilter] = useState<StatusCode>(STATUS_CODES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [comment, setComment] = useState('');
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

  const fetchWithdrawals = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<PaginatedResponse>(
        `${baseUrl}/api/wallet/withdrawl-requests/${statusFilter}?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      
      if (response.data.success) {
        setWithdrawals(response.data.data || []);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalRecords);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.data.message || 'Failed to fetch withdrawals');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch withdrawals';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(1);
  }, [statusFilter]); // Refetch when status filter changes

  const handleStatusChange = async (withdrawalId: number, newStatus: StatusCode) => {
    try {
      setProcessingId(withdrawalId);
      setError(null);
      
      const response = await axios.put(`${baseUrl}/api/wallet/withdrawal/approve/${withdrawalId}`, {
        status: newStatus === STATUS_CODES.APPROVED ? '1' : '2',
        note: comment
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchWithdrawals(currentPage);
        handleCloseCommentModal();
      } else {
        throw new Error(response.data.message || `Failed to update withdrawal status`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      toast.error(errorMessage);
      console.error('Error updating withdrawal status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchWithdrawals(page);
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case STATUS_CODES.APPROVED:
        return 'text-green-400';
      case STATUS_CODES.REJECTED:
        return 'text-red-400';
      case STATUS_CODES.PENDING:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startRecord = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    const getPageNumbers = () => {
      const delta = window.innerWidth < 640 ? 1 : 2; // Show fewer page numbers on mobile
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-[#1e1e3f] border-t border-[#2f2f5a] gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-sm w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#252547] px-4 py-2 rounded-lg w-full sm:w-auto justify-center">
            <span className="text-gray-400 hidden sm:inline">Showing</span>
            <div className="flex items-center gap-1">
              <span className="text-purple-400 font-medium">{startRecord}</span>
              <span className="text-gray-400">-</span>
              <span className="text-purple-400 font-medium">{endRecord}</span>
            </div>
            <span className="text-gray-400 hidden sm:inline">of</span>
            <span className="text-purple-400 font-medium">{totalItems}</span>
            <span className="text-gray-400 hidden sm:inline">records</span>
          </div>
          <div className="flex items-center gap-2 bg-[#252547] px-4 py-2 rounded-lg w-full sm:w-auto justify-center">
            <span className="text-gray-400">Page</span>
            <span className="text-purple-400 font-medium">{currentPage}</span>
            <span className="text-gray-400">of</span>
            <span className="text-purple-400 font-medium">{totalPages}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-2 sm:pb-0">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          {getPageNumbers().map((pageNum) => (
            <button
              key={typeof pageNum === 'number' ? `page-${pageNum}` : `ellipsis-${Math.random()}`}
              onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
              disabled={loading || typeof pageNum !== 'number'}
              className={`min-w-[40px] h-10 rounded-lg transition-all duration-200 flex-shrink-0 ${
                currentPage === pageNum
                  ? 'bg-purple-600 text-white font-medium shadow-lg shadow-purple-500/25'
                  : typeof pageNum === 'number'
                  ? 'bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400'
                  : 'bg-transparent text-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 rounded-lg bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            title="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="text-lg font-medium">No withdrawals found</p>
      <p className="text-sm">There are no withdrawal requests matching your filters</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-red-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="text-lg font-medium">Error loading withdrawals</p>
      <p className="text-sm">{error}</p>
      <button 
        onClick={() => fetchWithdrawals(currentPage)}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const handleOpenCommentModal = (withdrawal: Withdrawal, action: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setPendingAction(action);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedWithdrawal(null);
    setPendingAction(null);
    setComment('');
  };

  const handleSubmitComment = () => {
    if (!selectedWithdrawal || !pendingAction || !comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    handleStatusChange(
      selectedWithdrawal.withdrawalId,
      pendingAction === 'approve' ? STATUS_CODES.APPROVED : STATUS_CODES.REJECTED
    );
  };

  const renderCommentModal = () => {
    if (!showCommentModal || !selectedWithdrawal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseCommentModal}></div>
        
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <div className="flex justify-between items-center p-4 border-b border-purple-500/10">
            <h2 className="text-lg font-bold text-white">
              {pendingAction === 'approve' ? 'Approve' : 'Reject'} Withdrawal
            </h2>
            <button
              onClick={handleCloseCommentModal}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                Add Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
                className="w-full h-24 px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseCommentModal}
                className="flex-1 py-2.5 px-4 bg-[#1A1A2E] text-gray-400 rounded-lg hover:bg-[#252547] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!comment.trim() || processingId === selectedWithdrawal.withdrawalId}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-colors ${
                  pendingAction === 'approve'
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                } disabled:opacity-50`}
              >
                {processingId === selectedWithdrawal.withdrawalId ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {pendingAction === 'approve' ? <Check size={16} /> : <X size={16} />}
                    <span>{pendingAction === 'approve' ? 'Approve' : 'Reject'}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileCard = (withdrawal: Withdrawal) => (
    <div className="bg-[#1e1e3f] rounded-lg overflow-hidden border border-[#2f2f5a]">
      {/* Header with ID and Status */}
      <div className="flex justify-between items-center bg-[#252547] p-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">ID:</span>
          <span className="text-white font-medium">#{withdrawal.withdrawalId}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          withdrawal.withdrawalStatus.code === STATUS_CODES.APPROVED ? 'bg-green-500/20 text-green-400' :
          withdrawal.withdrawalStatus.code === STATUS_CODES.REJECTED ? 'bg-red-500/20 text-red-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {STATUS_LABELS[withdrawal.withdrawalStatus.code as StatusCode]}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* User and Amount Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">User</span>
            <p className="text-white font-medium truncate">{formatUserInfo(withdrawal.user)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">Amount</span>
            <div className="font-medium">{formatAmount(withdrawal.amount, withdrawal.cryptoname)}</div>
          </div>
        </div>

        {/* Method Section */}
        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Method</span>
          <p className={`font-medium uppercase ${getMethodColor('walletAddress' in withdrawal.withdrawalDetails ? 'Crypto' : 'Bank Transfer')}`}>
            {'walletAddress' in withdrawal.withdrawalDetails ? 'CRYPTO' : 'BANK TRANSFER'}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Details</span>
          <div>{formatAccountDetails(withdrawal.withdrawalDetails)}</div>
        </div>

        {/* Date Section */}
        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Date</span>
          <p className="text-white">{withdrawal.requestDate ? formatDate(withdrawal.requestDate) : 'N/A'}</p>
        </div>

        {/* Actions Section */}
        {withdrawal.withdrawalStatus.code === STATUS_CODES.PENDING && (
          <div className="flex gap-3 pt-3 border-t border-[#2f2f5a] mt-3">
            <button
              onClick={() => handleOpenCommentModal(withdrawal, 'approve')}
              disabled={processingId === withdrawal.withdrawalId}
              className="flex-1 py-2.5 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 active:scale-98"
            >
              {processingId === withdrawal.withdrawalId ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Check size={16} />
                  <span>Approve</span>
                </div>
              )}
            </button>
            <button
              onClick={() => handleOpenCommentModal(withdrawal, 'reject')}
              disabled={processingId === withdrawal.withdrawalId}
              className="flex-1 py-2.5 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 active:scale-98"
            >
              <div className="flex items-center justify-center gap-2">
                <X size={16} />
                <span>Reject</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 lg:p-6 ">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Withdrawals</h1>
        <button
          onClick={() => fetchWithdrawals(currentPage)}
          disabled={loading}
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            'Refresh'
          )}
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:flex gap-2">
          {[
            { id: 'all', value: STATUS_CODES.ALL, label: STATUS_LABELS[STATUS_CODES.ALL] },
            { id: 'pending', value: STATUS_CODES.PENDING, label: STATUS_LABELS[STATUS_CODES.PENDING] },
            { id: 'approved', value: STATUS_CODES.APPROVED, label: STATUS_LABELS[STATUS_CODES.APPROVED] },
            { id: 'rejected', value: STATUS_CODES.REJECTED, label: STATUS_LABELS[STATUS_CODES.REJECTED] }
          ].map(({ id, value, label }) => (
            <button 
              key={id}
              onClick={() => setStatusFilter(value as StatusCode)}
              className={`py-2 px-4 rounded-lg text-white text-sm md:text-base transition-colors ${
                statusFilter === value
                  ? value === STATUS_CODES.APPROVED ? 'bg-green-600' : 
                    value === STATUS_CODES.PENDING ? 'bg-yellow-600' : 
                    value === STATUS_CODES.REJECTED ? 'bg-red-600' : 'bg-purple-600'
                  : 'bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-[#252547] rounded-lg overflow-hidden ">
        <div className=" w-full lg:overflow-x-auto ">
          {loading ? (
            <div className="flex items-center justify-center p-8 ">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : error ? (
            renderErrorState()
          ) : withdrawals.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden px-1 space-y-4 py-3">
                {withdrawals.map((withdrawal) => renderMobileCard(withdrawal))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="w-full text-sm text-left text-white">
                  <thead className="text-xs uppercase bg-[#1e1e3f] text-gray-300">
                    <tr>
                      <th className="px-6 py-4">User ID</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.withdrawalId} className="border-b border-[#1e1e3f] hover:bg-[#2f2f5a]">
                        <td className="px-6 py-4">#{withdrawal.withdrawalId}</td>
                        <td className="px-6 py-4">
                          {formatUserInfo(withdrawal.user)}
                        </td>
                        <td className="px-6 py-4">
                          {formatAmount(withdrawal.amount, withdrawal.cryptoname)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium uppercase ${getMethodColor('walletAddress' in withdrawal.withdrawalDetails ? 'Crypto' : 'Bank Transfer')}`}>
                            {'walletAddress' in withdrawal.withdrawalDetails ? 'CRYPTO' : 'BANK TRANSFER'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {formatAccountDetails(withdrawal.withdrawalDetails)}
                        </td>
                        <td className="px-6 py-4">
                          {withdrawal.requestDate ? formatDate(withdrawal.requestDate) : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${getStatusColor(withdrawal.withdrawalStatus.code)}`}>
                            {STATUS_LABELS[withdrawal.withdrawalStatus.code as StatusCode]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {withdrawal.withdrawalStatus.code === STATUS_CODES.PENDING && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenCommentModal(withdrawal, 'approve')}
                                disabled={processingId === withdrawal.withdrawalId}
                                className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                title="Approve withdrawal"
                              >
                                {processingId === withdrawal.withdrawalId ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleOpenCommentModal(withdrawal, 'reject')}
                                disabled={processingId === withdrawal.withdrawalId}
                                className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                title="Reject withdrawal"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
      {renderCommentModal()}
    </div>
  );
};

export default Withdrawals;
