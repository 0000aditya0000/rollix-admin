import React, { useState, useEffect } from 'react';
import { Search, Check, X, Loader2, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '../../lib/config/server';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface KYCStatus {
  code: number;
  text: string;
}

interface Documents {
  aadharfront: string | null;
  aadharback: string | null;
  pan: string | null;
}

interface KYCRequest {
  user_id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  referral_code: string;
  kyc_status: KYCStatus;
  documents: Documents;
  created_at: string;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  total_items: number;
  total_pages: number;
  current_page: number;
  items_per_page: number;
  status: number;
  status_text: string;
  data: KYCRequest[];
}

interface KYCActionResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    new_status: number;
    status_text: string;
    documents: {
      aadhar: string;
      pan: string;
    }
  }
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

const KYCRequest = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusCode>(STATUS_CODES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycRequests, setKYCRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');

  const fetchKYCRequests = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL('api/user/pending-kyc', baseUrl);
      url.searchParams.append('status', statusFilter);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

      const response = await axios.get<PaginatedResponse>(url.toString());
      
      if (response.data.success) {
        setKYCRequests(response.data.data || []);
        setTotalPages(response.data.total_pages);
        setTotalItems(response.data.total_items);
        setCurrentPage(response.data.current_page);
      } else {
        throw new Error(response.data.message || 'Failed to fetch KYC requests');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch KYC requests';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCRequests(1);
  }, [statusFilter]);

  const handleApproveReject = async (userId: number, isApprove: boolean) => {
    try {
      setProcessingId(userId);
      
      const url = new URL(`${baseUrl}/api/user/kyc/approve/${userId}`);
      const response = await axios.put<KYCActionResponse>(url.toString(), {
        status: isApprove ? 1 : 2,
        page: currentPage,
        note: comment
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchKYCRequests(currentPage);
        handleCloseModal();
        setComment('');
      } else {
        throw new Error(response.data.message || `Failed to ${isApprove ? 'approve' : 'reject'} KYC`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isApprove ? 'approve' : 'reject'} KYC`;
      toast.error(errorMessage);
      console.error('Error updating KYC status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchKYCRequests(page);
  };

  const getStatusColor = (code: number) => {
    switch (code.toString()) {
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

  const handleViewDetails = (request: KYCRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setShowModal(false);
    setComment('');
  };

  const renderDocumentModal = () => {
    if (!selectedRequest || !showModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseModal}></div>
        
        <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn my-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-purple-500/10">
            <h2 className="text-lg sm:text-xl font-bold text-white">KYC Documents - {selectedRequest.name}</h2>
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Aadhar Front */}
              <div className="bg-[#1A1A2E] rounded-lg overflow-hidden border border-purple-500/20">
                <div className="p-3 border-b border-purple-500/10">
                  <h3 className="text-sm sm:text-base text-white font-medium">Aadhar Card (Front)</h3>
                </div>
                <div className="p-3">
                  {selectedRequest.documents.aadharfront ? (
                    <div className="relative w-full h-36 sm:h-40">
                      <img 
                        src={selectedRequest.documents.aadharfront}
                        alt="Aadhar Front"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-36 sm:h-40 bg-[#252547] rounded-lg">
                      <p className="text-gray-400 text-sm">Not Available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Aadhar Back */}
              <div className="bg-[#1A1A2E] rounded-lg overflow-hidden border border-purple-500/20">
                <div className="p-3 border-b border-purple-500/10">
                  <h3 className="text-sm sm:text-base text-white font-medium">Aadhar Card (Back)</h3>
                </div>
                <div className="p-3">
                  {selectedRequest.documents.aadharback ? (
                    <div className="relative w-full h-36 sm:h-40">
                      <img 
                        src={selectedRequest.documents.aadharback}
                        alt="Aadhar Back"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-36 sm:h-40 bg-[#252547] rounded-lg">
                      <p className="text-gray-400 text-sm">Not Available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PAN Card */}
              <div className="bg-[#1A1A2E] rounded-lg overflow-hidden border border-purple-500/20">
                <div className="p-3 border-b border-purple-500/10">
                  <h3 className="text-sm sm:text-base text-white font-medium">PAN Card</h3>
                </div>
                <div className="p-3">
                  {selectedRequest.documents.pan ? (
                    <div className="relative w-full h-36 sm:h-40">
                      <img 
                        src={selectedRequest.documents.pan}
                        alt="PAN Card"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-36 sm:h-40 bg-[#252547] rounded-lg">
                      <p className="text-gray-400 text-sm">Not Available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Comment Box */}
            <div className="mt-6">
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

            {selectedRequest.kyc_status.code === 0 && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    if (!comment.trim()) {
                      toast.error('Please add a comment before approving');
                      return;
                    }
                    handleApproveReject(selectedRequest.user_id, true);
                  }}
                  disabled={processingId === selectedRequest.user_id || !comment.trim()}
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {processingId === selectedRequest.user_id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check size={16} />
                      <span>Approve KYC</span>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (!comment.trim()) {
                      toast.error('Please add a comment before rejecting');
                      return;
                    }
                    handleApproveReject(selectedRequest.user_id, false);
                  }}
                  disabled={processingId === selectedRequest.user_id || !comment.trim()}
                  className="flex-1 py-2.5 sm:py-3 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X size={16} />
                    <span>Reject KYC</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="text-lg font-medium">No KYC requests found</p>
      <p className="text-sm">There are no KYC requests matching your filters</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-red-400">
      <AlertCircle size={48} className="mb-4" />
      <p className="text-lg font-medium">Error loading KYC requests</p>
      <p className="text-sm">{error}</p>
      <button 
        onClick={() => fetchKYCRequests(currentPage)}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderMobileCard = (request: KYCRequest) => (
    <div className="bg-[#1e1e3f] rounded-lg overflow-hidden border border-[#2f2f5a]">
      <div className="flex justify-between items-center bg-[#252547] p-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">ID:</span>
          <span className="text-white font-medium">#{request.user_id}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          request.kyc_status.code === 1 ? 'bg-green-500/20 text-green-400' :
          request.kyc_status.code === 2 ? 'bg-red-500/20 text-red-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {request.kyc_status.text}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">Username</span>
            <p className="text-white font-medium truncate">{request.username}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">Mobile</span>
            <p className="text-white truncate">{request.phone}</p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Email</span>
          <p className="text-white">{request.email}</p>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Referral Code</span>
          <p className="text-white">{request.referral_code}</p>
        </div>

        <button
          onClick={() => handleViewDetails(request)}
          className="w-full py-2.5 px-4 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 active:scale-98"
        >
          <div className="flex items-center justify-center gap-2">
            <Eye size={16} />
            <span>View Documents</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startRecord = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
    const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    const getPageNumbers = () => {
      const delta = window.innerWidth < 640 ? 1 : 2;
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
        <div className="flex items-center gap-2">
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
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 lg:p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">KYC Requests</h1>
        <button
          onClick={() => fetchKYCRequests(currentPage)}
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
      
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex flex-wrap gap-2">
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

      <div className="w-full lg:overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : error ? (
          renderErrorState()
        ) : kycRequests.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden px-1 space-y-4 py-3">
              {kycRequests.map((request) => renderMobileCard(request))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-[#1e1e3f] text-gray-300">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Referral Code</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {kycRequests.map((request) => (
                    <tr key={request.user_id} className="border-b border-[#1e1e3f] hover:bg-[#2f2f5a]">
                      <td className="px-6 py-4">#{request.user_id}</td>
                      <td className="px-6 py-4">{request.username}</td>
                      <td className="px-6 py-4">{request.phone}</td>
                      <td className="px-6 py-4">{request.email}</td>
                      <td className="px-6 py-4">{request.referral_code}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${getStatusColor(request.kyc_status.code)}`}>
                          {request.kyc_status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="p-1.5 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors"
                          title="View Documents"
                        >
                          <Eye size={16} />
                        </button>
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
      {renderDocumentModal()}
    </div>
  );
};

export default KYCRequest;
