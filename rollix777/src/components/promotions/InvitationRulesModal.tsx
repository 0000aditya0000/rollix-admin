import React from 'react';
import { X } from 'lucide-react';
import img from '../../assets/Agency Program.png'
interface InvitationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationRulesModal: React.FC<InvitationRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#252547] to-[#1A1A2E] rounded-2xl overflow-hidden animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/10">
          <h2 className="text-2xl font-bold text-white">Invitation Rules</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A2E] text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">01. Subordinate Levels</h3>
              <p className="text-gray-300 leading-relaxed">
                There are 6 subordinate levels in inviting friends. If A invites B, then B is a level 1 subordinate of A. 
                If B invites C, then C is a level 1 subordinate of B and also a level 2 subordinate of A. 
                If C invites D, then D is a level 1 subordinate of C, at the same time a level 2 subordinate of B 
                and also a level 3 subordinate of A.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">02. Invitation Process</h3>
              <p className="text-gray-300 leading-relaxed">
                When inviting friends to register, you must send the invitation link provided or enter the invitation 
                code manually so that your friends become your level 1 subordinates.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">03. Commission Eligibility</h3>
              <p className="text-gray-300 leading-relaxed">
                The invitee registers via the inviter's invitation code and completes the deposit, shortly after 
                that the commission will be received.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">04. Commission Calculation</h3>
              <p className="text-gray-300 leading-relaxed">
                The calculation of yesterday's commission starts every morning at 01:00. After the commission 
                calculation is completed, the commission is rewarded to the wallet and can be viewed through 
                the commission collection record.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">05. Commission Rates</h3>
              <p className="text-gray-300 leading-relaxed">
                Commission rates vary depending on your agency level on that day:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li>Number of Teams: How many downline deposits you have to date.</li>
                <li>Team Deposits: The total number of deposits made by your down-line in one day.</li>
                <li>Team Deposit: Your downline deposits within one day.</li>
              </ul>
            </div>

            <div className="flex justify-center p-4">
              <img
                src={img}
                alt="Commission Table"
                className="max-w-full h-auto rounded-lg border border-purple-500/20"
              />
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">06. Membership Level Benefits</h3>
              <p className="text-gray-300 leading-relaxed">
                The commission percentage depends on the membership level. The higher the membership level, 
                the higher the bonus percentage.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">07. TOP20 Bonus</h3>
              <p className="text-gray-300 leading-relaxed">
                TOP20 commission rankings will be randomly awarded with a separate bonus.
              </p>
            </div>

            <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-2">08. Final Interpretation</h3>
              <p className="text-gray-300 leading-relaxed">
                The final interpretation of this activity belongs to Rollix777.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationRulesModal; 