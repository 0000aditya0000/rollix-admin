import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
} from "lucide-react";
import {
  getQueries,
  queryComment,
  queryStatus,
} from "../../lib/services/queryService";

// Mock data - replace with actual API data
const mockQueries = [
  {
    id: 1,
    title: "Login Issue",
    description: "User unable to login to the platform",
    status: "pending",
    createdAt: "2024-03-20",
    user: "John Doe",
    priority: "High",
  },
  {
    id: 2,
    title: "Payment Failed",
    description: "Transaction declined during checkout",
    status: "in_progress",
    createdAt: "2024-03-19",
    user: "Jane Smith",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Account Verification",
    description: "Need help with account verification process",
    status: "resolved",
    createdAt: "2024-03-18",
    user: "Mike Johnson",
    priority: "Low",
  },
  {
    id: 4,
    title: "Withdrawal Issue",
    description: "Unable to withdraw funds from account",
    status: "closed",
    createdAt: "2024-03-17",
    user: "Sarah Wilson",
    priority: "High",
  },
];

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  resolved: "bg-green-500/20 text-green-400",
  closed: "bg-gray-500/20 text-gray-400",
};

const priorityColors = {
  High: "bg-red-500/20 text-red-400",
  Medium: "bg-orange-500/20 text-orange-400",
  Low: "bg-green-500/20 text-green-400",
};

function QueryManagement() {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
  });
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // Fetch queries
  const fetchQueries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        search: searchTerm || undefined,
      };
      const response = await getQueries(params);
      setQueries(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch queries");
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and filter changes
  useEffect(() => {
    fetchQueries(1);
  }, [selectedStatus, selectedPriority]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQueries(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = async (queryId, newStatus) => {
    try {
      setLoading(true);
      await queryStatus(queryId, { status: newStatus });
      // Refresh the queries list to get updated data
      await fetchQueries(pagination.current_page);
    } catch (err) {
      console.error("Error updating status:", err);
      // Optionally show error to user
      setError(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuery(null);
  };

  const handleRefresh = () => {
    fetchQueries(pagination.current_page);
  };

  const handlePageChange = (newPage) => {
    fetchQueries(newPage);
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedQuery) return;

    try {
      setCommentLoading(true);
      setCommentError(null);

      await queryComment(selectedQuery.id, {
        comment: comment.trim(),
        is_admin: true,
      });

      // Refresh the query details after adding comment
      await fetchQueries(pagination.current_page);
      setComment("");
    } catch (err) {
      setCommentError(err.message || "Failed to add comment");
      console.error("Error adding comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const renderMobileCard = (query) => (
    <div className="bg-[#1e1e3f] rounded-lg overflow-hidden border border-[#2f2f5a]">
      <div className="flex justify-between items-center bg-[#252547] p-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">ID:</span>
          <span className="text-white font-medium">{query.id}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[query.status]
          }`}
        >
          {query.status.replace("_", " ")}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">Name</span>
            <p className="text-white font-medium truncate">{query.name}</p>
          </div>
          <div className="space-y-1">
            <span className="text-gray-400 text-xs">Type</span>
            <p className="text-white font-medium capitalize">
              {query.query_type}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Email</span>
          <p className="text-white">{query.email}</p>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 text-xs">Created At</span>
          <p className="text-white">
            {new Date(query.created_at).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => handleViewDetails(query)}
          className="w-full py-2.5 px-4 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 active:scale-98"
        >
          <div className="flex items-center justify-center gap-2">
            <Eye size={16} />
            <span>View Details</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderPagination = () => {
    if (pagination.total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-400">
          Showing{" "}
          {(pagination.current_page - 1) * pagination.items_per_page + 1} to{" "}
          {Math.min(
            pagination.current_page * pagination.items_per_page,
            pagination.total_items
          )}{" "}
          of {pagination.total_items} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-3 py-1 rounded-lg bg-[#252547] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2f2f5a]"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
            className="px-3 py-1 rounded-lg bg-[#252547] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2f2f5a]"
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
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Query Management
        </h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Refresh"}
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
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-4 rounded-lg text-white text-sm md:text-base transition-colors bg-[#252547] border border-purple-500/20 hover:bg-[#2f2f5a] focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full lg:overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-red-400">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-lg font-medium">No queries found</p>
            <p className="text-sm">
              There are no queries matching your filters
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden px-1 space-y-4 py-3">
              {queries.map((query) => renderMobileCard(query))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-[#1e1e3f] text-gray-300">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((query) => (
                    <tr
                      key={query.id}
                      className="border-b border-[#1e1e3f] hover:bg-[#2f2f5a]"
                    >
                      <td className="px-6 py-4">{query.id}</td>
                      <td className="px-6 py-4">{query.name}</td>
                      <td className="px-6 py-4">{query.email}</td>
                      <td className="px-6 py-4 capitalize">
                        {query.query_type}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={query.status}
                          onChange={(e) =>
                            handleStatusChange(query.id, e.target.value)
                          }
                          className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#252547] border-purple-500/20 text-white`}
                        >
                          {Object.keys(statusColors).map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#1e1e3f]"
                            >
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(query.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(query)}
                          className="p-1.5 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors"
                          title="View Details"
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

      {/* Details Modal */}
      {isModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn my-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-500/10">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Query Details - {selectedQuery.id}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Name:
                </span>
                <span className="text-sm text-white">{selectedQuery.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Email:
                </span>
                <span className="text-sm text-white">
                  {selectedQuery.email}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Phone:
                </span>
                <span className="text-sm text-white">
                  {selectedQuery.phone}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Telegram:
                </span>
                <span className="text-sm text-white">
                  {selectedQuery.telegram_id}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Type:
                </span>
                <span className="text-sm text-white capitalize">
                  {selectedQuery.query_type}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Message:
                </span>
                <span className="text-sm text-white">
                  {selectedQuery.message}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Status:
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[selectedQuery.status]
                  }`}
                >
                  {selectedQuery.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Created At:
                </span>
                <span className="text-sm text-white">
                  {new Date(selectedQuery.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm font-medium text-gray-400">
                  Comments:
                </span>
                <span className="text-sm text-white">
                  {selectedQuery.comment_count}
                </span>
              </div>

              {/* Comment Section */}
              <div className="mt-6 pt-6 border-t border-purple-500/10">
                <h3 className="text-lg font-medium text-white mb-4">
                  Add Comment
                </h3>
                {commentError && (
                  <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                    {commentError}
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment here..."
                    className="flex-1 min-h-[100px] p-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || commentLoading}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                  >
                    {commentLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryManagement;
