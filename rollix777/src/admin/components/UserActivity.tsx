import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchUserLogins,
  disableUserAccount,
  blockIpAddress,
} from "../../lib/services/userActivityService.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface UserLogin {
  id: number;
  user_id: number;
  phone: string;
  ip_address: string;
  login_datetime: string;
}

interface UserActivityResponse {
  success: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  data: UserLogin[];
}

const UserActivity = () => {
  const [activityData, setActivityData] = useState<UserLogin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showIPAddressModal, setShowIPAddressModal] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [ipUsers, setIpUsers] = useState<UserLogin[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UserActivityResponse = await fetchUserLogins();

      if (response.success) {
        setActivityData(response.data);
      } else {
        throw new Error("Failed to fetch user activity");
      }
    } catch (err: any) {
      const message = err.message || "Failed to fetch user activity.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const exportToExcel = () => {
    const worksheetData = activityData.map((entry) => ({
      ID: entry.id,
      "User ID": entry.user_id,
      Phone: entry.phone,
      "IP Address": entry.ip_address,
      "Login Date": new Date(entry.login_datetime).toLocaleDateString("en-IN", {
        dateStyle: "medium",
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Logins");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "user_login_activity.xlsx");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleBanUserModal = () => {
    setShowIPAddressModal(true);
  };

  // Search IP Users
  const handleSearchByIP = () => {
    if (!ipInput) {
      toast.error("Please enter an IP address");
      return;
    }

    const filteredUsers = activityData.filter(
      (user) => user.ip_address === ipInput.trim()
    );

    if (filteredUsers.length > 0) {
      setIpUsers(filteredUsers);
    } else {
      toast.error("No users found for this IP");
      setIpUsers([]);
    }
  };

  // Ban single user
  const handleBanSingleUser = async (userId: number) => {
    try {
      console.log(userId, "userid");
      await disableUserAccount(userId, true);
      toast.success(`User ${userId} banned successfully`);
      setIpUsers((prev) => prev.filter((u) => u.user_id !== userId));
      setIpInput("");
      setShowIPAddressModal(false);
    } catch {
      toast.error("Failed to ban user");
    }
  };

  // Ban all users
  const handleBanAllUsers = async () => {
    console.log("working");
    try {
      console.log("ip block", ipInput);
      await blockIpAddress(ipInput, true);
      toast.success("All users with this IP banned successfully");
      setIpUsers([]);
      setIpInput("");
      setShowIPAddressModal(false);
    } catch {
      toast.error("Failed to ban all users");
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-white">User Login Activity</h1>
          <div className="flex">
            <button
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
              onClick={exportToExcel}
            >
              Download
            </button>
            <button
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors ml-6"
              onClick={handleBanUserModal}
            >
              Ban User
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="bg-[#1e1e3f] text-gray-300">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Login Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#2f2f5a] hover:bg-[#2f2f5a]"
                  >
                    <td className="px-6 py-3">{entry.id}</td>
                    <td className="px-6 py-3">{entry.user_id}</td>
                    <td className="px-6 py-3">{entry.phone}</td>
                    <td className="px-6 py-3">{entry.ip_address}</td>
                    <td className="px-6 py-3">
                      {formatDate(entry.login_datetime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* IP address Modal */}
      {showIPAddressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-[#252547] rounded-xl border border-purple-500/10 p-8 w-full max-w-3xl shadow-2xl 
                    max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Search Users by IP Address
              </h3>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                  setShowIPAddressModal(false);
                  setIpInput("");
                  setIpUsers([]);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search input */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter IP Address"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                disabled={searching}
                onClick={handleSearchByIP}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  searching
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20"
                } text-white`}
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Scrollable Results */}
            {ipUsers.length > 0 && (
              <div className="flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#252547] py-2">
                  <h4 className="text-lg text-white">
                    Users with IP Address
                    {/* {ipInput} */}
                  </h4>
                  <button
                    onClick={handleBanAllUsers}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Ban All Users
                  </button>
                </div>

                <table className="w-full text-sm text-left text-white">
                  <thead className="bg-[#1e1e3f] text-gray-300 sticky top-0">
                    <tr>
                      <th className="px-6 py-4">User ID</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipUsers.map((user, index) => (
                      <tr
                        key={`${user.user_id}-${user.ip_address}-${index}`}
                        className="border-b border-[#2f2f5a] hover:bg-[#2f2f5a]"
                      >
                        <td className="px-6 py-3">{user.user_id}</td>
                        <td className="px-6 py-3">{user.phone}</td>
                        <td className="px-6 py-3">{user.ip_address}</td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => handleBanSingleUser(user.user_id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                          >
                            Ban User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserActivity;
