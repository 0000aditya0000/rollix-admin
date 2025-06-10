import React, { useEffect } from 'react';
import { Copy, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import InvitationRulesModal from './InvitationRulesModal';

const AgentProgram: React.FC = () => {
  const [referralCode, setReferralCode] = React.useState('');
  const [isHovered, setIsHovered] = React.useState('');
  const [isRulesModalOpen, setIsRulesModalOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const referralCode = localStorage.getItem('referralCode');
    console.log(referralCode);
    setReferralCode(referralCode || '');
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Invitation code copied to clipboard');
  };

  const handleCopyLink = () => {
    const invitationLink = `https://www.rollix777.com/refer/${referralCode}`;
    navigator.clipboard.writeText(invitationLink);
    alert('Invitation link copied to clipboard');
  };

  const handleNavigateToCommissionDetails = () => {
    navigate('/promotions/commission-details', { state: { userId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F19] via-[#1A1A2E] to-[#252547]">
      {/* Header
      <div className="fixed top-10 left-0 right-0 z-10 bg-[#0F0F19]/90 backdrop-blur-lg border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 md:px-6 py-4 md:py-6 flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2.5 md:p-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 
                       transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="md:w-6 md:h-6" />
            </Link>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Agent Program</h1>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="pt-20 md:pt-24 pb-24 max-w-7xl mx-auto px-4 md:px-6">
        {/* Commission Card */}
        <div className="max-w-[430px] md:max-w-none mx-auto">
          <div className="bg-gradient-to-br from-purple-500/10 via-[#252547] to-[#1A1A2E] rounded-2xl 
                         border border-purple-500/20 overflow-hidden shadow-xl shadow-purple-500/5
                         transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/10">
            <div className="p-6 md:p-8 lg:p-10 text-center border-b border-purple-500/10
                          bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-purple-400 to-pink-400 mb-3">₹0</h2>
              <div className="inline-block bg-purple-500/10 rounded-full px-4 md:px-6 py-1.5 md:py-2 mb-2
                            backdrop-blur-sm">
                <span className="text-sm md:text-base text-white/90">Yesterday's total commission</span>
              </div>
              <p className="text-sm md:text-base text-white/60">
                Upgrade the level to increase commission income
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-purple-500/10">
              {/* Direct Subordinates */}
              <div className="col-span-1 md:col-span-2 p-4 md:p-6 lg:p-8">
                <h3 className="text-center text-white font-medium mb-4 md:mb-6">Direct subordinates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Number of register', value: '0' },
                    { label: 'Deposit number', value: '0' },
                    { label: 'Deposit amount', value: '0' },
                    { label: 'First deposit users', value: '0' }
                  ].map((item, index) => (
                    <div key={index} className="text-center group transition-all duration-300 hover:scale-105">
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-400 
                                  transition-colors duration-300">{item.value}</p>
                      <p className="text-sm text-white/60 mt-1 group-hover:text-white/80 
                                  transition-colors duration-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Subordinates */}
              <div className="col-span-1 md:col-span-2 p-4 md:p-6 lg:p-8">
                <h3 className="text-center text-white font-medium mb-4 md:mb-6">Team subordinates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Number of register', value: '0' },
                    { label: 'Deposit number', value: '0' },
                    { label: 'Deposit amount', value: '0' },
                    { label: 'First deposit users', value: '0' }
                  ].map((item, index) => (
                    <div key={index} className="text-center group transition-all duration-300 hover:scale-105">
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-400 
                                  transition-colors duration-300">{item.value}</p>
                      <p className="text-sm text-white/60 mt-1 group-hover:text-white/80 
                                  transition-colors duration-300">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Section */}
        <div className="mt-6 md:mt-8 lg:mt-10 max-w-[430px] md:max-w-none mx-auto">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Invitation Link Button */}
            <button 
              className="w-full py-4 md:py-5 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl 
                       text-white font-medium shadow-lg shadow-purple-500/20
                       transition-all duration-300 hover:shadow-purple-500/30 hover:scale-[1.02] 
                       active:scale-[0.98]"
              onMouseEnter={() => setIsHovered('button')}
              onMouseLeave={() => setIsHovered('')}
            >
              INVITATION LINK
            </button>

            {/* Invitation Link Card */}
            <div 
              className="bg-gradient-to-br from-purple-500/10 via-[#252547] to-[#1A1A2E] rounded-xl 
                       border border-purple-500/20 p-4 md:p-5 lg:p-6
                       transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg 
                       hover:shadow-purple-500/10"
              onMouseEnter={() => setIsHovered('link')}
              onMouseLeave={() => setIsHovered('')}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <p className="text-sm md:text-base text-white/60 mb-1 md:mb-2">Copy invitation link</p>
                  <p className="text-white font-medium break-all">
                    https://www.rollix777.com/refer/{referralCode}
                  </p>
                </div>
                <button 
                  onClick={handleCopyLink}
                  className={`p-2.5 md:p-3 rounded-xl bg-purple-500/10 text-purple-400 
                           transition-all duration-300 flex-shrink-0
                           ${isHovered === 'link' ? 'bg-purple-500/20 scale-110' : 'hover:bg-purple-500/15'}`}
                >
                  <Copy size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Copy Code Card */}
            <div 
              className="bg-gradient-to-br from-purple-500/10 via-[#252547] to-[#1A1A2E] rounded-xl 
                       border border-purple-500/20 p-4 md:p-5 lg:p-6
                       transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg 
                       hover:shadow-purple-500/10"
              onMouseEnter={() => setIsHovered('code')}
              onMouseLeave={() => setIsHovered('')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 
                                flex items-center justify-center">
                    <Copy className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-white/60">Copy invitation code</p>
                    <p className="text-white font-medium">{referralCode}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopyCode}
                  className={`p-2.5 md:p-3 rounded-xl bg-purple-500/10 text-purple-400 
                           transition-all duration-300
                           ${isHovered === 'code' ? 'bg-purple-500/20 scale-110' : 'hover:bg-purple-500/15'}`}
                >
                  <Copy size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            {[
              { title: 'Subordinate data', icon: '👥', route: '/promotions/team-report' },
              { title: 'Commission detail', icon: '💰', onClick: handleNavigateToCommissionDetails },
              { 
                title: 'Invitation rules', 
                icon: '📜', 
                onClick: () => setIsRulesModalOpen(true) 
              },
             
            ].map((item, index) => (
              <div
                key={index}
                onClick={item.onClick || (() => item.route && navigate(item.route))}
                className="block bg-gradient-to-br from-purple-500/10 via-[#252547] to-[#1A1A2E] 
                         rounded-xl border border-purple-500/20 overflow-hidden cursor-pointer
                         transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg 
                         hover:shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-full p-4 md:p-5 lg:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 
                                  flex items-center justify-center">
                      <span className="text-xl md:text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                  <span className="text-white/40 text-xl md:text-2xl">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InvitationRulesModal 
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};

export default AgentProgram;