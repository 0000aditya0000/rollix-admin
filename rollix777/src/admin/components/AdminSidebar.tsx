import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowDown, 
  BarChart3, 
  Image, 
  Gamepad2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Tag,
  FileCheck
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onNavigate: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar, onNavigate }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <CreditCard size={20} />, label: 'Bank Accounts', path: '/admin/bank-accounts' },
    { icon: <Tag size={20} />, label: 'Coupon', path: '/admin/coupon' },
    { icon: <CreditCard size={20} />, label: 'Recharge', path: '/admin/recharge' },
    { icon: <ArrowDown size={20} />, label: 'Withdrawals', path: '/admin/withdrawals' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/admin/reports' },
    { icon: <Image size={20} />, label: 'Sliders', path: '/admin/sliders' },
    { icon: <Gamepad2 size={20} />, label: 'Games', path: '/admin/games' },
    { icon: <FileCheck size={20} />, label: 'KYC Requests', path: '/admin/kyc-requests' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      onNavigate();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-[#1A1A2E]/80 backdrop-blur-md border-r border-purple-500/10 transition-all duration-300 z-50
          ${isOpen ? 'w-64' : 'w-20'} md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-4 border-b border-purple-500/10 flex ${isOpen ? 'justify-between' : 'justify-center'} items-center`}>
            {isOpen ? (
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rollix777 Admin
              </div>
            ) : (
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                R7
              </div>
            )}
            
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-lg bg-[#252547] text-purple-400 hover:bg-[#2f2f5a] transition-colors hidden md:block"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      onClick={handleNavigation}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/20' 
                          : 'text-gray-400 hover:bg-[#252547] hover:text-white'}`}
                    >
                      <span className={`${isActive ? 'text-purple-400' : ''}`}>{item.icon}</span>
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-purple-500/10">
            <Link
              to="/"
              onClick={handleNavigation}
              className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-[#252547] hover:text-white transition-colors"
            >
              <span>🏠</span>
              {isOpen && <span>Back to Main Site</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;