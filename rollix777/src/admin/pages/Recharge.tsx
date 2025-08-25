import React, { useState, useEffect } from "react";
import {
  Wallet,
  Search,
  X,
  Clock,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getAllRecharges,
  getRechargeByOrderId,
  getSortedRecharges,
} from "../../lib/services/rechargeService";
import { current } from "@reduxjs/toolkit";

interface Recharge {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time: string;
  data: any[];
}

interface RechargeDetail {
  recharge_id: number;
  order_id: string;
  userId: number;
  amount: string;
  type: string;
  mode: string;
  status: string;
  date: string;
  time: string;
  user_name?: string;
  email?: string;
  phone?: string;
  transaction_id?: string;
  id?: number;
  recharge_amount?: string;
  recharge_type?: string;
  payment_mode?: string;
  recharge_status?: string;
}

function Recharge() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchResult, setSearchResult] = useState<RechargeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "success"
  >("all");
  const [showSortModeDropdown, setShowSortModeDropdown] = useState(false);
  const [showSortTypeDropdown, setShowSortTypeDropdown] = useState(false);
  const [activeSortType, setActiveSortType] = useState<string | null>(null);
  const [activeSortMode, setActiveSortMode] = useState<string | null>(null);
  const [totalRecharges, setTotalRecharges] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const recordsPerPage = 15;

  const sortModeOptions = [
    { value: "apay", label: "Sort by APAY" },
    { value: "sunpay", label: "Sort by Sunpay" },
  ];

  const sortByTypeOptions = [
    { value: "INR", label: "Sort by INR" },
    { value: "USDT", label: "Sort by USDT" },
  ];

  const getSortByMode = () => {
    return (
      sortModeOptions.find((option) => option.value === activeSortMode)
        ?.label || "Sort By Mode"
    );
  };

  const getSortByType = () => {
    return (
      sortByTypeOptions.find((option) => option.value === activeSortType)
        ?.label || "Sort by Type"
    );
  };

  const sortDataByDate = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // First sort by date (most recent first)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }

      // If dates are the same, sort by time (most recent first)
      const timeA = a.time || "00:00:00";
      const timeB = b.time || "00:00:00";
      return timeB.localeCompare(timeA);
    });
  };

  useEffect(() => {
    fetchRecharges();
  }, [activeSortMode, activeSortType, activeFilter, currentPage]);

  const fetchRecharges = async () => {
    try {
      let response;

      if (activeSortMode || activeSortType) {
        response = await getSortedRecharges(
          activeSortType || "",
          activeSortMode || "",
          currentPage,
          recordsPerPage,
          activeFilter !== "all" ? activeFilter : undefined
        );
      } else {
        response = await getAllRecharges(
          currentPage,
          recordsPerPage,
          activeFilter !== "all" ? activeFilter : undefined
        );
      }

      console.log("Recharge Response:", response);

      // Handle different possible response structures
      if (response && response.success !== false) {
        // Case 1: response.data is an array
        if (response.data && Array.isArray(response.data)) {
          setRecharges(sortDataByDate([...response.data]));
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.totalRecharges || response.data.length);
        }
        // Case 2: response.recharges is an array
        else if (response.recharges && Array.isArray(response.recharges)) {
          setRecharges(sortDataByDate([...response.recharges]));
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.totalRecharges || response.recharges.length);
        }
        // Case 3: response itself is an array
        else if (Array.isArray(response)) {
          setRecharges(sortDataByDate([...response]));
          setTotalPages(1);
          setTotalItems(response.length);
        }
        // Case 4: response has a different structure but contains data
        else if (response && typeof response === "object") {
          // Try to find the data array in the response
          const dataArray =
            response.data ||
            response.recharges ||
            response.records ||
            response.items;
          if (Array.isArray(dataArray)) {
            setRecharges(sortDataByDate([...dataArray]));
            setTotalPages(response.totalPages || response.pages || 1);
            setTotalItems(
              response.totalRecharges || response.total || dataArray.length
            );
          } else {
            console.error("No valid data array found in response:", response);
            toast.error("Invalid response format");
          }
        } else {
          console.error("Unexpected response structure:", response);
          toast.error("Invalid response format");
        }
      } else {
        // Handle error response
        const errorMessage = response?.message || "Failed to fetch recharges";
        console.error("API Error:", response);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      const errorMessage = error?.message || "Failed to fetch recharges";
      toast.error(errorMessage);
    }
  };

  const handleSearchRecharge = async () => {
    if (!searchOrderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setLoading(true);
    try {
      const response = await getRechargeByOrderId(searchOrderId);
      console.log("Search Response:", response);

      // Handle different possible response structures for search
      if (response && response.success !== false) {
        // Case 1: response.recharge contains the data
        if (response.recharge) {
          setSearchResult(response.recharge);
        }
        // Case 2: response itself contains the recharge data
        else if (response && typeof response === "object") {
          setSearchResult(response);
        }
        // Case 3: response.data contains the recharge data
        else if (response.data) {
          setSearchResult(response.data);
        } else {
          console.error("No valid recharge data found in response:", response);
          toast.error("Invalid response format");
        }
      } else {
        // Handle error response
        const errorMessage =
          response?.message || "Failed to fetch recharge details";
        console.error("Search API Error:", response);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      const errorMessage = error?.message || "Failed to fetch recharge details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add a debug log to check the recharges state
  useEffect(() => {
    console.log("Current recharges:", recharges);
  }, [recharges]);

  const filteredRecharges = recharges.filter((recharge) => {
    if (activeFilter === "all") return true;
    return recharge.status.toLowerCase() === activeFilter;
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(Math.min(page, totalPages));
  };

  console.log(filteredRecharges, "recharge");

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalItems);

    const getPageNumbers = () => {
      const delta = window.innerWidth < 640 ? 1 : 2;
      const range: (number | string)[] = [];
      const rangeWithDots: (number | string)[] = [];
      let l: number | undefined;

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
          if (typeof i === "number" && i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (typeof i === "number" && i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = typeof i === "number" ? i : l;
      }

      return rangeWithDots;
    };

    console.log(totalRecharges, "total rech");

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
          {getPageNumbers().map((pageNum, idx) => (
            <button
              key={
                typeof pageNum === "number"
                  ? `page-${pageNum}`
                  : `ellipsis-${idx}`
              }
              onClick={() =>
                typeof pageNum === "number" && handlePageChange(pageNum)
              }
              disabled={loading || typeof pageNum !== "number"}
              className={`min-w-[40px] h-10 rounded-lg transition-all duration-200 flex-shrink-0 ${
                currentPage === pageNum
                  ? "bg-purple-600 text-white font-medium shadow-lg shadow-purple-500/25"
                  : typeof pageNum === "number"
                  ? "bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400"
                  : "bg-transparent text-gray-400"
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
    <div className="min-h-screen bg-[#1A1A2E] py-8">
      <div className="w-full px-2">
        {/* Header with Title and Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Wallet className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Recharge Management
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setActiveSortMode("");
                  setActiveSortType("");
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "all"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("success")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "success"
                    ? "bg-green-500 text-white"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                }`}
              >
                Pending
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortModeDropdown(!showSortModeDropdown)}
                className="flex items-center gap-2 hover:bg-[#2f2f5a] text-white py-2 px-4 rounded-lg transition-colors bg-purple-500 mt-1"
                aria-haspopup="true"
                aria-expanded={showSortModeDropdown}
              >
                <span className="text-sm">{getSortByMode()}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    showSortModeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSortModeDropdown && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-[#252547] rounded-lg shadow-lg z-20 border border-purple-500/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sortModeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveSortMode(option.value);
                        setShowSortModeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeSortMode === option.value
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:bg-[#2f2f5a]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortTypeDropdown(!showSortTypeDropdown)}
                className="flex items-center gap-2 hover:bg-[#2f2f5a] text-white py-2 px-4 rounded-lg transition-colors bg-purple-500 mt-1"
                aria-haspopup="true"
                aria-expanded={showSortTypeDropdown}
              >
                <span className="text-sm">{getSortByType()}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    showSortTypeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSortTypeDropdown && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-[#252547] rounded-lg shadow-lg z-20 border border-purple-500/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sortByTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setActiveSortType(option.value);
                        setShowSortTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeSortType === option.value
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:bg-[#2f2f5a]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
            >
              <Clock className="w-5 h-5" />
              Recharge History
            </button>
          </div>
        </div>

        {/* Recharges Table */}
        <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-purple-500/10">
                  <th className="pb-4 text-gray-300 font-medium">Order ID</th>
                  <th className="pb-4 text-gray-300 font-medium">User ID</th>
                  <th className="pb-4 text-gray-300 font-medium">Amount</th>
                  <th className="pb-4 text-gray-300 font-medium">Type</th>
                  <th className="pb-4 text-gray-300 font-medium">Mode</th>
                  <th className="pb-4 text-gray-300 font-medium">Status</th>
                  <th className="pb-4 text-gray-300 font-medium">Date</th>
                  <th className="pb-4 text-gray-300 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecharges && filteredRecharges.length > 0 ? (
                  filteredRecharges.map((recharge) => (
                    <tr
                      key={recharge.recharge_id}
                      className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                    >
                      <td className="py-4 text-white font-medium">
                        {recharge.order_id}
                      </td>
                      <td className="py-4 text-white">{recharge.userId}</td>
                      <td className="py-4 text-purple-400 font-medium">
                        {recharge.type === "INR" ? "₹ " : "$ "}
                        {recharge.amount}
                      </td>
                      <td className="py-4 text-white">{recharge.type}</td>
                      <td className="py-4 text-white">{recharge.mode}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            recharge.status.toLowerCase() === "success"
                              ? "bg-green-500/20 text-green-400"
                              : recharge.status.toLowerCase() === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {recharge.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">
                        {new Date(recharge.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-gray-400">{recharge.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-400">
                      No recharges found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      </div>

      {/* Recharge History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Recharge History</h3>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSearchResult(null);
                  setSearchOrderId("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  placeholder="Enter Order ID"
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearchRecharge}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20"
                } text-white`}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {searchResult && (
              <div className="bg-[#1A1A2E] rounded-lg p-6 border border-purple-500/10 hover:border-purple-500/20 transition-colors">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Order ID</p>
                    <p className="text-white font-medium">
                      {searchResult.order_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">User ID</p>
                    <p className="text-white font-medium">{searchResult.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-purple-400 font-medium">
                      ₹{searchResult.recharge_amount || searchResult.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-white font-medium">
                      {searchResult.recharge_type || searchResult.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Mode</p>
                    <p className="text-white font-medium">
                      {searchResult.payment_mode || searchResult.mode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        (
                          searchResult.recharge_status || searchResult.status
                        ).toLowerCase() === "success"
                          ? "bg-green-500/20 text-green-400"
                          : (
                              searchResult.recharge_status ||
                              searchResult.status
                            ).toLowerCase() === "pending"
                          ? "bg-red-500/20 text-yellow-400"
                          : "bg-yellow-500/20 text-red-400"
                      }`}
                    >
                      {searchResult.recharge_status || searchResult.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date</p>
                    <p className="text-white font-medium">
                      {new Date(searchResult.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Time</p>
                    <p className="text-white font-medium">
                      {searchResult.time}
                    </p>
                  </div>
                  {searchResult.user_name && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">User Name</p>
                      <p className="text-white font-medium">
                        {searchResult.user_name}
                      </p>
                    </div>
                  )}
                  {searchResult.email && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white font-medium">
                        {searchResult.email}
                      </p>
                    </div>
                  )}
                  {searchResult.phone && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white font-medium">
                        {searchResult.phone}
                      </p>
                    </div>
                  )}
                  {searchResult.transaction_id && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Transaction ID
                      </p>
                      <p className="text-white font-medium">
                        {searchResult.transaction_id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recharge;
