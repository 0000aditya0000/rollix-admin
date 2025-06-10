import React, { useState, useEffect } from 'react';
import { Search, Check, X, Loader2, AlertCircle, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '../../lib/config/server';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


interface User {
  name: string | null;
  username: string | null;
  email: string | null;
  mobile: string | null;
  kyc_status: string | null;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
}

interface CryptoDetails {
  usdtAddress: string;
  network: string;
}

interface Account {
  id: number;
  userId: number;
  status: number;
  user: User;
  accountType: 'bank' | 'crypto';
  bankDetails?: BankDetails;
  cryptoDetails?: CryptoDetails;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface ApiResponse {
  success: boolean;
  data: Account[];
  pagination: PaginationData;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const statusMap = {
  0: "pending",
  1: "approved",
  2: "rejected",
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "bg-green-500/20 text-green-400";
    case 0:
      return "bg-yellow-500/20 text-yellow-400";
    case 2:
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getTypeColor = (type: string | undefined) => {
  if (!type) return "text-gray-400";
  
  switch (type.toLowerCase()) {
    case 'bank':
      return "text-blue-400";
    case 'crypto':
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
};

const getFilterStyle = (value: string | number) => {
  switch (value) {
    case 0:
      return "border-yellow-500/50 hover:bg-yellow-500/20 hover:border-yellow-500 data-[active=true]:bg-yellow-500/30 data-[active=true]:border-yellow-500";
    case 1:
      return "border-green-500/50 hover:bg-green-500/20 hover:border-green-500 data-[active=true]:bg-green-500/30 data-[active=true]:border-green-500";
    case 2:
      return "border-red-500/50 hover:bg-red-500/20 hover:border-red-500 data-[active=true]:bg-red-500/30 data-[active=true]:border-red-500";
    default:
      return "border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-500 data-[active=true]:bg-purple-500/30 data-[active=true]:border-purple-500";
  }
};

const BankAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | number>("");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 20
  });
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'desc' });
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const fetchAccounts = async (page: number = 1) => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/bankaccount/getall?page=${page}&limit=20${
        statusFilter !== "" ? `&status=${statusFilter}` : ""
      }`;
      const response = await axios.get<ApiResponse>(url);
      setAccounts(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      toast.error("Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    fetchAccounts(page);
  };

  const handleUpdateStatus = async (accountId: number, newStatus: number) => {
    try {
      setUpdatingStatus(true);
      const response = await axios.put(`${baseUrl}/api/bankaccount/update-status/${accountId}`, {
        status: newStatus
      });

      if (response.data.success) {
        const actionMessage = newStatus === 1 
          ? "Bank account approved successfully"
          : "Bank account rejected successfully";
        toast.success(actionMessage);
        setIsViewModalOpen(false);
        setSelectedAccount(null);
        // Refresh the list with current filters
        fetchAccounts(pagination.currentPage);
      } else {
        const errorMessage = newStatus === 1 
          ? "Failed to approve bank account"
          : "Failed to reject bank account";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Failed to update status", error);
      const errorMessage = newStatus === 1 
        ? "Failed to approve bank account"
        : "Failed to reject bank account";
      toast.error(error.response?.data?.message || errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const ViewDetailsModal = ({ account }: { account: Account }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Account Type</p>
            <p className="text-white capitalize">{account.accountType}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(account.status)}`}>
              {statusMap[account.status as keyof typeof statusMap]}
            </span>
          </div>
        </div>

        {account.accountType === 'bank' && account.bankDetails && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-white">Bank Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Account Name</p>
                <p className="text-white">{account.bankDetails.accountName}</p>
              </div>
              <div>
                <p className="text-gray-400">Account Number</p>
                <p className="text-white">{account.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">IFSC Code</p>
                <p className="text-white">{account.bankDetails.ifscCode}</p>
              </div>
              <div>
                <p className="text-gray-400">Branch</p>
                <p className="text-white">{account.bankDetails.branch}</p>
              </div>
            </div>
          </div>
        )}

        {account.accountType === 'crypto' && account.cryptoDetails && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-white">Crypto Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">USDT Address</p>
                <p className="text-white break-all">{account.cryptoDetails.usdtAddress}</p>
              </div>
              <div>
                <p className="text-gray-400">Network</p>
                <p className="text-white">{account.cryptoDetails.network}</p>
              </div>
            </div>
          </div>
        )}

        {/* <div className="space-y-3">
          <h4 className="text-lg font-medium text-white">User Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-white">{account.user.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Username</p>
              <p className="text-white">{account.user.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white">{account.user.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Mobile</p>
              <p className="text-white">{account.user.mobile || 'N/A'}</p>
            </div>
          </div>
        </div> */}
      </div>
    );
  };

  // Add sorting function
  const sortData = (data: Account[]) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Account];
      let bValue: any = b[sortConfig.key as keyof Account];

      // Handle nested properties
      if (sortConfig.key === 'name') {
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
      } else if (sortConfig.key === 'mobile') {
        aValue = a.user?.mobile || '';
        bValue = b.user?.mobile || '';
      } else if (sortConfig.key === 'email') {
        aValue = a.user?.email || '';
        bValue = b.user?.email || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Replace the desktop table view with this enhanced version
  const sortedAccounts = sortData(accounts);

  return (
    <div className="p-1   sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Bank Accounts</h1>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {[
            { label: "All", value: "" },
            { label: "Pending", value: 0 },
            { label: "Approved", value: 1 },
            { label: "Rejected", value: 2 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setStatusFilter(item.value)}
              data-active={statusFilter === item.value}
              className={`py-2 px-4 rounded-lg text-white text-sm border transition-all duration-200 flex-1 sm:flex-none ${getFilterStyle(item.value)}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table/Cards */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {sortConfig.key === 'id' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('mobile')}
                >
                  <div className="flex items-center gap-2">
                    Mobile
                    {sortConfig.key === 'mobile' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('accountType')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    {sortConfig.key === 'accountType' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 font-medium">Account Details</th>
                <th 
                  className="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.map((account) => (
                <tr
                  key={account.id}
                  onMouseEnter={() => setHoveredRow(account.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`border-b border-purple-500/10 text-white transition-colors ${
                    hoveredRow === account.id ? 'bg-purple-500/5' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <span className="font-medium">#{account.id}</span>
                  </td>
                  <td className="py-4 px-6">{account.user?.name || "N/A"}</td>
                  <td className="py-4 px-6">{account.user?.mobile || "N/A"}</td>
                  <td className="py-4 px-6">{account.user?.email || "N/A"}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(account.accountType)} bg-opacity-20 capitalize`}>
                      {account.accountType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {account.accountType === 'bank' ? (
                      <span className="text-sm font-medium">
                        {account.bankDetails?.accountNumber}
                      </span>
                    ) : (
                      <span className="text-sm truncate max-w-[150px] block font-medium">
                        {account.cryptoDetails?.usdtAddress}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                      {statusMap[account.status as keyof typeof statusMap] || "unknown"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsViewModalOpen(true);
                        }}
                        className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      {account.status === 0 && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(account.id, 1)}
                            disabled={updatingStatus}
                            className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(account.id, 2)}
                            disabled={updatingStatus}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden py-3 space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-[#1e1e3f]/50 rounded-xl p-4 hover:bg-[#1e1e3f] transition-colors border border-purple-500/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-white font-medium">{account.user?.name || "N/A"}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-sm">#{account.id}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(account.status)}`}>
                      {statusMap[account.status as keyof typeof statusMap] || "unknown"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsViewModalOpen(true);
                  }}
                  className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Type</p>
                  <p className={`font-medium ${getTypeColor(account.accountType)} capitalize`}>
                    {account.accountType}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Mobile</p>
                  <p className="text-white">{account.user?.mobile || "N/A"}</p>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Account Details</p>
                  <p className="text-white font-medium truncate">
                    {account.accountType === 'bank' 
                      ? account.bankDetails?.accountNumber
                      : account.cryptoDetails?.usdtAddress}
                  </p>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Email</p>
                  <p className="text-white truncate">{account.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="text-center py-8">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-gray-400">No accounts found.</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-purple-500/10">
            <div className="text-sm text-gray-400 order-2 sm:order-1">
              Showing {((pagination?.currentPage || 1) - 1) * (pagination?.limit || 20) + 1} to{" "}
              {Math.min((pagination?.currentPage || 1) * (pagination?.limit || 20), pagination?.totalRecords || 0)} of{" "}
              {pagination?.totalRecords || 0} entries
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                disabled={pagination?.currentPage === 1}
                className={`p-2 rounded-lg ${
                  pagination?.currentPage === 1
                    ? "bg-purple-500/10 text-gray-500 cursor-not-allowed"
                    : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pagination?.currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                disabled={pagination?.currentPage === pagination?.totalPages}
                className={`p-2 rounded-lg ${
                  pagination?.currentPage === pagination?.totalPages
                    ? "bg-purple-500/10 text-gray-500 cursor-not-allowed"
                    : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isViewModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsViewModalOpen(false)}
          />
          <div className="relative w-full h-full sm:h-auto sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
            <div className="relative bg-[#1A1A2E] w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl shadow-lg overflow-hidden">
              <div className="sticky top-0 z-10 bg-[#1A1A2E] border-b border-purple-500/20 p-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Account Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <X className="text-gray-400" size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-64px)] sm:h-auto">
                <div className="p-4 space-y-6">
                  {/* Status and Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Account Type</p>
                      <p className={`text-base font-medium ${getTypeColor(selectedAccount.accountType)} capitalize`}>
                        {selectedAccount.accountType}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}>
                        {statusMap[selectedAccount.status as keyof typeof statusMap]}
                      </span>
                    </div>
                  </div>

                  {/* Account Details Section */}
                  {selectedAccount.accountType === 'bank' && selectedAccount.bankDetails && (
                    <div className="space-y-3 bg-purple-500/5 rounded-lg p-4">
                      <h4 className="text-base font-medium text-purple-400">Bank Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">Account Name</p>
                          <p className="text-white text-sm break-words">{selectedAccount.bankDetails.accountName}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">Account Number</p>
                          <p className="text-white text-sm font-medium">{selectedAccount.bankDetails.accountNumber}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">IFSC Code</p>
                          <p className="text-white text-sm font-medium">{selectedAccount.bankDetails.ifscCode}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">Branch</p>
                          <p className="text-white text-sm">{selectedAccount.bankDetails.branch}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crypto Details Section */}
                  {selectedAccount.accountType === 'crypto' && selectedAccount.cryptoDetails && (
                    <div className="space-y-3 bg-purple-500/5 rounded-lg p-4">
                      <h4 className="text-base font-medium text-purple-400">Crypto Details</h4>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">USDT Address</p>
                          <div className="bg-[#1A1A2E] rounded p-3 break-all">
                            <p className="text-white text-sm font-medium">{selectedAccount.cryptoDetails.usdtAddress}</p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-xs uppercase tracking-wider">Network</p>
                          <p className="text-white text-sm font-medium">{selectedAccount.cryptoDetails.network}</p>
                        </div>
                      </div>
                    </div>
                  )}

               

                  {/* Action Buttons for Pending Status */}
                  {selectedAccount.status === 0 && (
                    <div className="flex gap-3 pt-4 border-t border-purple-500/20">
                      <button
                        onClick={() => handleUpdateStatus(selectedAccount.id, 1)}
                        disabled={updatingStatus}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {updatingStatus ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Approving...</span>
                          </div>
                        ) : (
                          'Approve'
                        )}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAccount.id, 2)}
                        disabled={updatingStatus}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {updatingStatus ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Rejecting...</span>
                          </div>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccounts;
