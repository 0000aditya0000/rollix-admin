import React, { useState } from "react";
import rubyplayGames from "../gamesData/rubyplay.json";
import netentGames from "../gamesData/netent.json";
import microgamingGames from "../gamesData/microgaming.json";
import axios from "axios";
import AuthModal from "./AuthModal";
import { Flame, Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameCarouselProps {
  title: string;
  type: "featured" | "popular";
}

const GameCarousel: React.FC<GameCarouselProps> = ({ title }) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const gamesPerPage = 6;

  // Mix games from different providers
  const mixedGames = [
    ...rubyplayGames.slice(0, 3),
    ...netentGames.slice(0, 3),
    ...microgamingGames.slice(0, 3)
  ];

  // Filter games based on search query
  const filteredGames = mixedGames.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentGames = filteredGames.slice(
    currentPage * gamesPerPage,
    (currentPage + 1) * gamesPerPage
  );

  const openJsGame = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setAuthModalOpen(true);
        setIsLoading(false);
        return;
      }

      const response = await axios.post("https://api.rollix777.com/api/color/launchGame", {
        userId,
        id,
      });

      if (response.data.success) {
        // Use navigate for internal routes
        if (response.data.gameUrl.startsWith('/')) {
          navigate(response.data.gameUrl);
        } else {
          // For external URLs, open in new tab
          window.open(response.data.gameUrl, '_blank');
        }
      } else {
        alert("Failed to launch game.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error launching game:", error);
      alert("An error occurred while launching the game.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center gap-8">
            {/* Main Loading Animation */}
            <div className="relative w-32 h-32">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
              {/* Middle Ring */}
              <div className="absolute inset-2 border-4 border-orange-500/40 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
              {/* Inner Ring */}
              <div className="absolute inset-4 border-4 border-orange-500 rounded-full animate-[spin_1s_linear_infinite] border-t-transparent"></div>
              {/* Center Circle */}
              <div className="absolute inset-6 flex items-center justify-center">
                <div className="w-full h-full bg-orange-500/10 rounded-full animate-pulse"></div>
              </div>
              {/* Orbiting Dots */}
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Text and Dots */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <h2 className="text-3xl font-bold text-white tracking-wider">Game Launching</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500/30 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-orange-500 rounded-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-orange-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile View */}
      <section className="md:hidden py-8 px-4 bg-[#1A1A2E]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
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
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="flex flex-col items-center"
            >
              <div 
                onClick={() => openJsGame(game.id)}
                className="relative w-full h-[100px] bg-[#252547] rounded-xl border border-purple-500/10 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] mb-2 group"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm text-center line-clamp-1">
                {game.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop View */}
      <section className="hidden md:block py-6 px-6 bg-[#1A1A2E] relative rounded-xl border border-purple-500/10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
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
        
        {/* Game grid - Using grid layout like Hero.tsx */}
        <div className="grid grid-cols-6 gap-4">
          {currentGames.map((game) => (
            <div 
              key={game.id} 
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-200 max-w-[200px] mx-auto w-full"
              onClick={() => openJsGame(game.id)}
            >
              {/* Game Image */}
              <div className="relative overflow-hidden bg-gray-800">
                <img 
                  src={game.img} 
                  alt={game.name}
                  className="w-full h-52 object-fill"
                  style={{ objectPosition: 'center' }}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
              
              {/* Game Title on Black Background */}
            
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

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
          }
        `}
      </style>
    </>
  );
};

export default GameCarousel;