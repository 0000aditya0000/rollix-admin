import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Eye, Check, X, User,IndianRupeeIcon } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'withdrawals'>('kyc');
  const [users, setUsers] = useState([]); // State to store fetched users
    const [error, setError] = useState(null); 
     
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.rollix777.com/api/user/allusers');
        setUsers(response.data); // Set the fetched data to the state

      } catch (error) {
        setError(error); // Set error if the request fails
      }
    };

    fetchUsers();
  }, []);
  // Dummy data
  const totalUsers = users.length;

  const totalTransactions = '₹1,245,789.00';
  
  const kycRequests = [
    { id: 'KYC-001', user: 'John Doe', email: 'john@example.com', date: '2025-04-10', status: 'pending' },
    { id: 'KYC-002', user: 'Jane Smith', email: 'jane@example.com', date: '2025-04-09', status: 'pending' },
    { id: 'KYC-003', user: 'Robert Johnson', email: 'robert@example.com', date: '2025-04-08', status: 'pending' },
    { id: 'KYC-004', user: 'Emily Davis', email: 'emily@example.com', date: '2025-04-07', status: 'pending' },
    { id: 'KYC-005', user: 'Michael Wilson', email: 'michael@example.com', date: '2025-04-06', status: 'pending' },
  ];
  
  const withdrawalRequests = [
    { id: 'WD-001', user: 'Alice Cooper', amount: '$500.00', method: 'Bitcoin', date: '2025-04-10', status: 'pending' },
    { id: 'WD-002', user: 'Bob Marley', amount: '$1,200.00', method: 'Bank Transfer', date: '2025-04-09', status: 'pending' },
    { id: 'WD-003', user: 'Charlie Puth', amount: '$350.00', method: 'Ethereum', date: '2025-04-08', status: 'pending' },
    { id: 'WD-004', user: 'David Guetta', amount: '$780.00', method: 'USDT', date: '2025-04-07', status: 'pending' },
    { id: 'WD-005', user: 'Eva Mendes', amount: '$2,500.00', method: 'Bank Transfer', date: '2025-04-06', status: 'pending' },
  ];
// Display error state
  if (error) {
    return <div className="text-red-500 text-center py-6">Error: {error.message}</div>;
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Card */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Users</p>
                <h2 className="text-3xl font-bold text-white">{totalUsers?.toLocaleString()}</h2>
                <p className="text-green-400 text-sm mt-2">+124 this week</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <button className="mt-4 py-2 px-4 bg-[#1A1A2E] text-purple-400 rounded-lg text-sm hover:bg-purple-500/10 transition-colors flex items-center gap-2">
              <Eye size={16} />
              <span>View All Users</span>
            </button>
          </div>
        </div>
        
        {/* Transactions Card */}
        <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Transactions</p>
                <h2 className="text-3xl font-bold text-white">{totalTransactions}</h2>
                <p className="text-green-400 text-sm mt-2">+₹45,678 this week</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <IndianRupeeIcon className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <button className="mt-4 py-2 px-4 bg-[#1A1A2E] text-green-400 rounded-lg text-sm hover:bg-green-500/10 transition-colors flex items-center gap-2">
              <Eye size={16} />
              <span>View All Transactions</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Pending Requests */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="border-b border-purple-500/10">
          <div className="flex">
            <button 
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'kyc' 
                  ? 'text-white border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('kyc')}
            >
              KYC Requests
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'withdrawals' 
                  ? 'text-white border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('withdrawals')}
            >
              Withdrawal Requests
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'kyc' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Email</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kycRequests.map((request) => (
                    <tr key={request.id} className="border-t border-purple-500/10 text-white">
                      <td className="py-4">{request.id}</td>
                      <td className="py-4">{request.user}</td>
                      <td className="py-4">{request.email}</td>
                      <td className="py-4">{request.date}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Check size={16} />
                          </button>
                          <button className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            <X size={16} />
                          </button>
                          <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Method</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request) => (
                    <tr key={request.id} className="border-t border-purple-500/10 text-white">
                      <td className="py-4">{request.id}</td>
                      <td className="py-4">{request.user}</td>
                      <td className="py-4">{request.amount}</td>
                      <td className="py-4">{request.method}</td>
                      <td className="py-4">{request.date}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Check size={16} />
                          </button>
                          <button className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            <X size={16} />
                          </button>
                          <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;