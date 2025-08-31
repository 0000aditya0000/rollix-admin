import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
  Download,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(30);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://api.rollix777.com/api/user/allusers"
        );
        setUsers(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://api.rollix777.com/api/user/user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Add New User
  const addNewUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://api.rollix777.com/api/admin/user",
        userData
      );
      setUsers((prevUsers) => [...prevUsers, response.data]);
      alert("User added successfully.");
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user.");
    }
  };

  // Update User
  const updateUser = async (id, userData) => {
    try {
      const response = await axios.put(
        `https://api.rollix777.com/api/user/user/${id}`,
        userData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? response.data : user))
      );
      alert("User updated successfully.");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "inactive":
        return "bg-gray-500/20 text-gray-400";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleNameClick = (userId) => {
    console.log(userId, "userId");
    navigate(`/admin/user-detail/${userId}`);
  };

  if (loading) {
    return <div className="text-white text-center py-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        Error: {error.message}
      </div>
    );
  }

  // Pagination functions
  const getTotalPages = () => {
    const dataToPaginate = isSearching ? searchResults : users;
    return Math.ceil(dataToPaginate.length / recordsPerPage);
  };

  const getPaginatedUsers = () => {
    const dataToPaginate = isSearching ? searchResults : users;
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return dataToPaginate.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Search function that only searches by exact user ID match
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }

    // Search through all users by exact ID match only
    const results = users.filter((user) => 
      user.id.toString() === searchTerm
    );

    setSearchResults(results);
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = () => {
    handleSearch();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
    });
  };

  const exportUsersToExcel = () => {
    const worksheetData = users.map((user: any) => {
      // Convert wallets array into an object { CP: 0, INR: 3733.34, ... }
      const walletData = user.wallets.reduce((acc: any, wallet: any) => {
        acc[wallet.cryptoname] = wallet.balance;
        return acc;
      }, {});

      return {
        ID: user.id,
        Username: user.username,
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        "Referral Code": user.my_referral_code,
        "Referred By": user.referred_by || "-",
        "Created At": new Date(user.created_at).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        }),
        "Withdrawal Blocked": user.is_withdrawal_blocked ? "Yes" : "No",
        "Login Disabled": user.is_login_disabled ? "Yes" : "No",
        // Spread wallet balances into separate columns
        ...walletData,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "users.xlsx");
  };

  // Popup Component for Adding User
  const Popup = ({ onClose, onAddUser }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

      const userData = {
        username,
        email,
        password,
        phone,
        dob,
      };

      await onAddUser(userData);
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-[#1A1A2E] p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Add User</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="email"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="password"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="tel"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="date"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Popup Component
  const EditPopup = ({ onClose, onUpdateUser, user }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState(user.phone);
    const [dob, setDob] = useState(user.dob);

    const handleSubmit = async (e) => {
      e.preventDefault();

      const userData = {
        username,
        email,
        password,
        phone,
        dob,
      };

      await onUpdateUser(user.id, userData);
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-[#1A1A2E] p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="email"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="password"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="tel"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-300">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="date"
                  className="w-full py-3 pl-10 pr-4 bg-[#1A1A2E] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <div className="flex">
          <button
            onClick={() => setShowPopup(true)}
            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Add User</span>
          </button>

          <button
            onClick={() => exportUsersToExcel()}
            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity ml-4"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} onAddUser={addNewUser} />
      )}
      {showEditPopup && (
        <EditPopup
          onClose={() => setShowEditPopup(false)}
          onUpdateUser={updateUser}
          user={selectedUser}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter exact user ID (e.g., 1012)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full py-2 pl-10 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <button
          onClick={handleSearch}
          className="py-2 px-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-[#2f2f5a] transition-colors"
        >
          <Search size={18} />
          <span>Search</span>
        </button>
        {isSearching && (
          <button
            onClick={() => {
              setSearchTerm("");
              setIsSearching(false);
              setSearchResults([]);
              setCurrentPage(1);
            }}
            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-purple-500/10">
                <th className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Contact</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Balance</th>
                <th className="py-4 px-6 font-medium">Joined</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedUsers().map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-purple-500/10 text-white hover:bg-purple-500/5"
                >
                  <td className="py-4 px-6">#{user.id}</td>
                  <td
                    onClick={() => handleNameClick(user.id)}
                    className="py-4 px-6 cursor-pointer hover:text-purple-400 active:text-purple-500 transition-colors"
                  >
                    <span className="hover:underline decoration-purple-500/50">
                      {user.username}
                    </span>
                  </td>
                  <td className="py-4 px-6">{user.phone}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const balance = user.wallets?.find(
                        (wallet: any) => wallet.cryptoname === "INR"
                      )?.balance;
                      return balance ? Number(balance).toFixed(2) : "0.00";
                    })()}
                  </td>
                  <td className="py-4 px-6">{formatDate(user.created_at)}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNameClick(user.id)}
                        className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditPopup(true);
                        }}
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-purple-500/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                {isSearching ? (
                  <>
                    Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, searchResults.length)} of {searchResults.length} search results
                    <br />
                    <span className="text-purple-400">Total users: {users.length}</span>
                  </>
                ) : (
                  `Showing ${((currentPage - 1) * recordsPerPage) + 1} to ${Math.min(currentPage * recordsPerPage, users.length)} of ${users.length} users`
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? "bg-purple-600 text-white font-medium shadow-lg shadow-purple-500/25"
                        : "bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === getTotalPages()}
                  className="px-3 py-2 rounded-lg bg-[#252547] text-gray-400 hover:bg-[#2f2f5a] hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
