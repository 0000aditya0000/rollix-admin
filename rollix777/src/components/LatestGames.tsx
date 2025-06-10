import React, { useState, useRef } from "react";
import { Zap, ChevronRight } from "lucide-react";
import CryptoJS from "crypto-js";
import rubyplayGames from "../gamesData/rubyplay.json";
import netentGames from "../gamesData/netent.json";
import microgamingGames from "../gamesData/microgaming.json";
import AuthModal from "./AuthModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LatestGamesProps {
  title: string;
  type: "featured" | "latest";
}

const aesKey = "126c2e86c418427c4aa717f971063e0e";
const serverUrl = "https://api.workorder.icu/proxy";

const encryptAES256 = (data: string, key: string) => {
  const key256 = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(data, key256, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

const generateRandom10Digits = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const openJsGame = async (id: string): Promise<void> => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    const response = await axios.post("https://api.rollix777.com/api/color/launchGame", {
      userId,
      id,
    });

    if (response.data.success) {
      window.location.href = response.data.gameUrl;
    } else {
      alert("Failed to launch game.");
    }
  } catch (error) {
    console.error("Error launching game:", error);
    alert("An error occurred while launching the game.");
  }
};

const LatestGames: React.FC<LatestGamesProps> = ({ title, type }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Get 3 random games from each provider
  const getRandomGames = (games: any[], count: number) => {
    const shuffled = [...games].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Combine games from all providers
  const latestGames = [
    ...getRandomGames(rubyplayGames, 3),
    ...getRandomGames(netentGames, 3),
    ...getRandomGames(microgamingGames, 3)
  ];

  const gamesPerPage = 3;
  const totalPages = Math.ceil(latestGames.length / gamesPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentGames = latestGames.slice(
    currentPage * gamesPerPage,
    (currentPage + 1) * gamesPerPage
  );

  return (
    <section className="py-8 px-4 bg-[#1A1A2E]">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={() => navigate('/games')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 ml-2"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {latestGames.map((game) => (
            <div
              key={game.id}
              className="flex flex-col items-center"
            >
              <div 
                onClick={() => openJsGame(game.id)}
                className="relative w-full h-[100px] bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/40 mb-2 group shadow-lg"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-1.5">
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 text-xs font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Play Now
                  </button>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm text-center line-clamp-1 hover:text-purple-300 transition-colors">
                {game.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <section className="hidden md:block py-6 px-6 bg-[#1A1A2E] relative rounded-xl border border-purple-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={() => navigate('/games')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 ml-2"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                className="text-white bg-purple-900/20 p-2 rounded-full transition-colors hover:bg-purple-700 flex items-center justify-center w-8 h-8"
              >
                &lt;
              </button>
              <button
                onClick={nextPage}
                className="text-white bg-purple-900/20 p-2 rounded-full transition-colors hover:bg-purple-700 flex items-center justify-center w-8 h-8"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        
        {/* Game grid - Single row with pagination */}
        <div className="grid grid-cols-3 gap-6">
          {currentGames.map((game) => (
            <div 
              key={game.id} 
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-200 w-full"
              onClick={() => openJsGame(game.id)}
            >
              {/* Game Image */}
              <div className="relative overflow-hidden bg-gray-800">
                <img 
                  src={game.img} 
                  alt={game.name}
                  className="w-full h-36 object-cover"
                  style={{ objectPosition: 'center' }}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
        onLoginSuccess={() => setAuthModalOpen(false)}
      />
    </section>
  );
};

export default LatestGames;