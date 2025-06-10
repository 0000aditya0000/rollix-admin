import React, { useState, useEffect } from "react";
import { 
  Star, 
  Users, 
  Trophy, 
  Play,
  Crown,
  Heart,
  ChevronRight,
  Search,
  Menu,
  Bell,
  Gamepad2,
  ArrowRight,
  Flame
} from "lucide-react";
import WingoGame from "./WingoGame";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import games data
import rubyplayGames from "../gamesData/rubyplay.json";
import netentGames from "../gamesData/netent.json";
import microgamingGames from "../gamesData/microgaming.json";

interface GameData {
  game_name: string;
  game_uid: string;
  game_type: string;
  icon: string;
  game_category: string;
}

interface FeaturedGame {
  id: string;
  title: string;
  image: string;
  provider: string;
  category: string;
}

const Hero: React.FC = () => {
  const [featuredGames, setFeaturedGames] = useState<FeaturedGame[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const gamesPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    // Get 3 random games from each provider
    const getRandomGames = (games: any[], count: number) => {
      return [...games]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    };

    const rubyplayRandom = getRandomGames(rubyplayGames, 3);
    const netentRandom = getRandomGames(netentGames, 3);
    const microgamingRandom = getRandomGames(microgamingGames, 3);

    // Combine all random games
    const allRandomGames = [
      ...rubyplayRandom,
      ...netentRandom,
      ...microgamingRandom
    ].map(game => ({
      id: game.id,
      title: game.name,
      image: game.img,
      provider: game.title,
      category: game.categories
    }));
    
    setFeaturedGames(allRandomGames);
  }, []);

  const totalPages = Math.ceil(featuredGames.length / gamesPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentGames = featuredGames.slice(
    currentPage * gamesPerPage,
    (currentPage + 1) * gamesPerPage
  );

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'slots', name: 'Slots' },
    { id: 'live', name: 'Live Casino' },
    { id: 'table', name: 'Table Games' },
    { id: 'sports', name: 'Sports' }
  ];

const openJsGame = async (id: string): Promise<void> => {
  try {
      setIsLoading(true);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please log in.");
        setIsLoading(false);
      return;
    }

      const response = await axios.post("https://api.rollix777.com/api/color/launchGame", {
      userId,
      id,
    });

    if (response.data.success) {
      window.open(response.data.gameUrl, "_blank");
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
      {/* Loading Overlay */}
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

      {/* Mobile Hero - Old Design */}
      <section className="md:hidden pt-20 px-4 pb-12 bg-[#1A1A2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-pink-600/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border border-purple-500/20">
                <Gamepad2 size={32} className="text-purple-400" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Play & Win
            </span>
          </h1>
          <p className="text-gray-400 text-center mb-8 text-lg">
            Join millions of players worldwide
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#252547] p-3 rounded-xl text-center border border-purple-500/10">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">50K+</p>
              <p className="text-xs text-gray-400">Players</p>
            </div>
            <div className="bg-[#252547] p-3 rounded-xl text-center border border-purple-500/10">
              <Trophy className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <p className="text-white font-semibold">$100K</p>
              <p className="text-xs text-gray-400">Prize Pool</p>
            </div>
            <div className="bg-[#252547] p-3 rounded-xl text-center border border-purple-500/10">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-semibold">4.9/5</p>
              <p className="text-xs text-gray-400">Rating</p>
            </div>
          </div>

          <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg hover:opacity-90 transition-opacity relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
            <span className="relative">Start Playing Now</span>
          </button>
        </div>
      </section>

      {/* Desktop Hero - New Design */}
      <div className="hidden md:block min-h-screen bg-[#0F0F1E] ">
        {/* Navigation Bar */}
        <nav className="bg-[#1A1A2E]/80 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-white">Rollix777</h1>
                <div className="hidden md:flex items-center space-x-6">
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`text-sm font-medium transition-colors ${
                        activeCategory === cat.id 
                          ? 'text-purple-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
            ))}
          </div>
        </div>

              <div className="flex items-center space-x-6">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search games..."
                    className="w-64 py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-white">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="md:hidden">
                  <Menu className="w-6 h-6 text-white" />
                </button>
                <div className="hidden md:flex items-center space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400 transition-colors">
                    Sign In
                  </button>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-sm font-medium text-white rounded-lg transition-colors">
                    Register
                  </button>
                </div>
                  </div>
                  </div>
                  </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-10">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12  mb-16">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-medium">
                  <Crown className="w-5 h-5" />
                  <span>Welcome to Rollix777</span>
                </div>
                <h1 className="text-5xl font-bold text-white leading-tight">
                  Experience the Next Level of{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Online Gaming
                  </span>
                </h1>
                <p className="text-lg text-gray-400 max-w-lg">
                  Join millions of players worldwide in the most thrilling gaming experience. Play, win, and become a legend.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Start Playing</span>
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors">
                  Explore Games
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-[#1A1A2E] rounded-xl border border-white/10">
                  <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
                  <div className="text-2xl font-bold text-white">$1M+</div>
                  <div className="text-sm text-gray-400">Total Winnings</div>
                  </div>
                <div className="p-6 bg-[#1A1A2E] rounded-xl border border-white/10">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Active Players</div>
                            </div>
                <div className="p-6 bg-[#1A1A2E] rounded-xl border border-white/10">
                  <Star className="w-8 h-8 text-pink-400 mb-3" />
                  <div className="text-2xl font-bold text-white">4.9/5</div>
                  <div className="text-sm text-gray-400">User Rating</div>
                            </div>
                          </div>
                        </div>

            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
              <WingoGame />
                        </div>
                      </div>

          {/* Popular Games Section - Mobile */}
          <div className="md:hidden py-8 px-4 bg-[#1A1A2E]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Popular Games</h2>
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
              {featuredGames.map(game => (
                <div
                  key={game.id}
                  className="flex flex-col items-center"
                >
                  <div 
                    onClick={() => openJsGame(game.id)}
                    className="relative w-full h-[100px] bg-[#252547] rounded-xl border border-purple-500/10 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] mb-2 group"
                  >
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-fit"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
                        Play Now
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm text-center line-clamp-1">
                    {game.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Games Section - Desktop */}
          <div className="hidden md:block py-6 px-6 bg-[#1A1A2E] relative rounded-xl border border-purple-500/10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Popular Games</h2>
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

            {/* Desktop View */}
            <div className="grid grid-cols-6 gap-4">
              {currentGames.slice(0, 6).map(game => (
                <div
                  key={game.id}
                  className="group cursor-pointer transform hover:scale-105 transition-transform duration-200 max-w-[200px] mx-auto w-full"
                  onClick={() => openJsGame(game.id)}
                >
                  {/* Game Image */}
                  <div className="relative overflow-hidden bg-gray-800">
                    <img 
                      src={game.image} 
                      alt={game.title}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

export default Hero;