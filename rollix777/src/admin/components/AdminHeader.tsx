import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#1A1A2E]/80 backdrop-blur-md border-b border-purple-500/10 sticky top-0 z-30 h-16">
      <div className="flex items-center justify-between px-4 py-3 h-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors md:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 bg-[#252547] border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#252547] rounded-xl border border-purple-500/20 shadow-lg z-50">
                <div className="p-3 border-b border-purple-500/10">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-purple-500/10 hover:bg-purple-500/10 cursor-pointer">
                    <p className="text-white text-sm font-medium">New KYC request</p>
                    <p className="text-gray-400 text-xs">User #12345 submitted documents</p>
                    <p className="text-gray-500 text-xs mt-1">10 minutes ago</p>
                  </div>
                  <div className="p-3 border-b border-purple-500/10 hover:bg-purple-500/10 cursor-pointer">
                    <p className="text-white text-sm font-medium">Withdrawal request</p>
                    <p className="text-gray-400 text-xs">User #54321 requested $500</p>
                    <p className="text-gray-500 text-xs mt-1">25 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-purple-500/10 cursor-pointer">
                    <p className="text-white text-sm font-medium">System alert</p>
                    <p className="text-gray-400 text-xs">High traffic detected</p>
                    <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="p-2 border-t border-purple-500/10 text-center">
                  <button className="text-purple-400 text-sm hover:text-purple-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#252547] text-white hover:bg-[#2f2f5a] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="hidden md:inline">Admin</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#252547] rounded-xl border border-purple-500/20 shadow-lg z-50">
                <div className="p-3 border-b border-purple-500/10">
                  <p className="text-white font-semibold">Admin User</p>
                  <p className="text-gray-400 text-xs">admin@rollix777.com</p>
                </div>
                <div>
                  <button className="w-full text-left p-3 hover:bg-purple-500/10 flex items-center gap-2 text-gray-300">
                    <User size={16} className="text-purple-400" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left p-3 hover:bg-purple-500/10 flex items-center gap-2 text-gray-300 border-t border-purple-500/10">
                    <LogOut size={16} className="text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;