import { useState } from "react";
import { Dices } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ColorGame = () => {
  const auth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handlePlayNow = () => {
    if (!auth) {
      setAuthModalOpen(true);
    } else {
      navigate("/bigsmall");
    }
  };

  const handleOnClose = () => {
    setAuthModalOpen(false);
  };
  return (
    <>
      <section className="py-8 px-4">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Dices className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">WinGo</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-500 h-24 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-2xl font-bold text-white">Red</span>
            </div>
            <div className="bg-green-500 h-24 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-2xl font-bold text-white">Green</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4">Choose your color and win big!</p>
            <button
              onClick={handlePlayNow}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Play Now
            </button>
          </div>
        </div>
      </section>
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleOnClose}
        onLoginSuccess={handleOnClose}
      />
    </>
  );
};

export default ColorGame;
