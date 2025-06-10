import React, { useState, useRef } from "react";
import { Flame, Search, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import axios from 'axios';
// Import all game data files
import apexGames from '../../gamesData/apex.json';
import amaticGames from '../../gamesData/amatic.json';
import ainsworthGames from '../../gamesData/ainsworth.json';
import apolloGames from '../../gamesData/apollo.json';
import aristocratGames from '../../gamesData/aristocrat.json';
import bingoGames from '../../gamesData/bingo.json';
import boomingGames from '../../gamesData/booming.json';
import egtGames from '../../gamesData/egt.json';
import firekirinGames from '../../gamesData/firekirin.json';
import fishGames from '../../gamesData/fish.json';
import gclubGames from '../../gamesData/gclub.json';
import habenaroGames from '../../gamesData/habenaro.json';
import holibetGames from '../../gamesData/holibet.json';
import igrosoftGames from '../../gamesData/igrosoft.json';
import igtGames from '../../gamesData/igt.json';
import jiliGames from '../../gamesData/jili.json';
import kjotGames from '../../gamesData/kjot.json';
import kenoGames from '../../gamesData/keno.json';
import merkurGames from '../../gamesData/merkur.json';
import microgamingGames from '../../gamesData/microgaming.json';
import netentGames from '../../gamesData/netent.json';
import novomaticGames from '../../gamesData/novomatic.json';
import playngoGames from '../../gamesData/playngo.json';
import pragmaticGames from '../../gamesData/pragmatic.json';
import quickspinGames from '../../gamesData/quickspin.json';
import rouletteGames from '../../gamesData/roulette.json';
import rubyplayGames from '../../gamesData/rubyplay.json';
import scientificgamesGames from '../../gamesData/scientificgames.json';
import sportbettingGames from '../../gamesData/sportbetting.json';
import spribeGames from '../../gamesData/spribe.json';
import vegasGames from '../../gamesData/vegas.json';
import wazdanGames from '../../gamesData/wazdan.json';
import zitroGames from '../../gamesData/zitro.json';
import pgsoftGames from '../../gamesData/pgsoft.json';

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

// Add new interface for JILI game format
interface JiliGame {
  gameID: string;
  gameNameEn: string;
  img: string;
  vendorId: number;
  vendorCode: string;
  imgUrl2: string | null;
  customGameType: number;
}

interface JiliGameData {
  data: {
    gameCustomTypeLists: any[];
    gameLists: JiliGame[];
  }
}

const AllGames: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const gameProviders: GameProvider[] = [
    { 
      id: 'jili', 
      name: 'JILI', 
      games: (jiliGames as JiliGameData).data.gameLists.map(game => ({
        id: game.gameID,
        name: game.gameNameEn,
        img: game.img,
        vendor: game.vendorCode
      }))
    },
    { 
      id: 'pgsoft', 
      name: 'PGSOFT', 
      games: pgsoftGames.map(game => ({
        id: game.id,
        name: game.name,
        img: game.img,
        vendor: 'PGSOFT'
      }))
    },
    { id: 'pragmatic', name: 'PRAGMATIC', games: pragmaticGames },
    { id: 'spribe', name: 'SPRIBE', games: spribeGames },
    { id: 'apollo', name: 'APOLLO', games: apolloGames },
    { id: 'booming', name: 'BOOMING', games: boomingGames },
    { id: 'fish', name: 'FISH', games: fishGames },
    { id: 'microgaming', name: 'MICROGAMING', games: microgamingGames },
    { id: 'netent', name: 'NETENT', games: netentGames },
    { id: 'novomatic', name: 'NOVOMATIC', games: novomaticGames },
    { id: 'rubyplay', name: 'RUBYPLAY', games: rubyplayGames },
    { id: 'scientificgames', name: 'SCIENTIFIC GAMES', games: scientificgamesGames },
    { id: 'wazdan', name: 'WAZDAN', games: wazdanGames },
    { id: 'apex', name: 'APEX', games: apexGames },
    { id: 'amatic', name: 'AMATIC', games: amaticGames },
    { id: 'ainsworth', name: 'AINSWORTH', games: ainsworthGames },
    { id: 'aristocrat', name: 'ARISTOCRAT', games: aristocratGames },
    { id: 'bingo', name: 'BINGO', games: bingoGames },
    { id: 'egt', name: 'EGT', games: egtGames },
    { id: 'firekirin', name: 'FIREKIRIN', games: firekirinGames },
    { id: 'gclub', name: 'GCLUB', games: gclubGames },
    { id: 'habenaro', name: 'HABENARO', games: habenaroGames },
    { id: 'holibet', name: 'HOLIBET', games: holibetGames },
    { id: 'igrosoft', name: 'IGROSOFT', games: igrosoftGames },
    { id: 'igt', name: 'IGT', games: igtGames },
    { id: 'kjot', name: 'KJOT', games: kjotGames },
    { id: 'keno', name: 'KENO', games: kenoGames },
    { id: 'merkur', name: 'MERKUR', games: merkurGames },
    { id: 'playngo', name: 'PLAY\'N GO', games: playngoGames },
    { id: 'quickspin', name: 'QUICKSPIN', games: quickspinGames },
    { id: 'roulette', name: 'ROULETTE', games: rouletteGames },
    { id: 'sportbetting', name: 'SPORT BETTING', games: sportbettingGames },
    { id: 'vegas', name: 'VEGAS', games: vegasGames },
    { id: 'zitro', name: 'ZITRO', games: zitroGames },
  ];

  const [activeProvider, setActiveProvider] = useState(gameProviders[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(0);
  // const gamesPerPage = 6;

  // Filter games based on search query
  const filteredGames = gameProviders
    .find(p => p.id === activeProvider)
    ?.games.filter((game) =>
      (game.name || game.game_name).toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  
  // const nextPage = () => {
  //   setCurrentPage((prev) => (prev + 1) % totalPages);
  // };
  
  // const prevPage = () => {
  //   setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  // };

  // const currentGames = filteredGames.slice(
  //   currentPage * gamesPerPage,
  //   (currentPage + 1) * gamesPerPage
  // );

  const openJsGame = async (id: string, vendor?: string): Promise<void> => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User ID not found. Please log in.");
        setIsLoading(false);
        return;
      }

      // Handle JILI games differently
      if (vendor === 'JILI') {
        const gameUrl = `https://fusion.imitator-host.site/post?gameId=${id}&mobile=${userId}&agentId=Imitatorbhai_Seamless&agentKey=118e35769483ef7508b4616c308d84458b26a5e7&referrerUrl=https://jili.rollix777.com/`;
        window.location.href = gameUrl;
        return;
      }

      // Original game launch logic for other providers
      const response = await axios.post("https://api.rollix777.com/api/color/launchGame", {
        userId,
        id,
      });

      if (response.data.success) {
        window.location.href = response.data.gameUrl;
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
    <div className="pt-16 pb-24 bg-[#1A1A2E]">
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

      {/* Header and Search - Mobile View */}
      <div className="md:hidden px-4 py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">All Games</h2>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#252547] text-white rounded-lg pl-10 pr-4 py-2 border border-purple-500/10 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Provider Tabs - Mobile */}
        <div className="w-full overflow-x-auto hide-scrollbar mb-6">
          <div className="flex gap-2">
            {gameProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  setActiveProvider(provider.id);
                  setCurrentPage(0);
                }}
                className={`
                  px-4 py-2 
                  rounded-lg 
                  text-xs 
                  font-medium 
                  whitespace-nowrap 
                  transition-colors
                  ${activeProvider === provider.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#252547] text-gray-400 hover:bg-[#2f2f5a]'
                  }
                `}
              >
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid - Mobile */}
        <div className="grid grid-cols-3 gap-3">
          {filteredGames.map((game) => (
            <div
              key={game.id || game.game_uid}
              className="flex flex-col items-center"
            >
              <div 
                onClick={() => openJsGame(game.id, game.vendor)}
                className="relative w-full h-[100px] bg-[#252547] rounded-xl border border-purple-500/10 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] mb-2 group"
              >
                <img
                  src={game.img || game.icon}
                  alt={game.name || game.game_name}
                  className="w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm text-center line-clamp-1">
                {game.name || game.game_name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block py-6 px-6 bg-[#1A1A2E] rounded-xl  border-purple-500/10  border">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">All Games</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#252547] text-white rounded-lg pl-10 pr-4 py-2 border border-purple-500/10 focus:outline-none focus:border-purple-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* <div className="flex items-center gap-3">
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
            </div> */}
          </div>
        </div>

        {/* Provider Tabs - Desktop */}
        <div className="w-full overflow-x-auto hide-scrollbar mb-6 ">
          <div className="flex gap-2">
          {gameProviders.map((provider) => (
            <button
              key={provider.id}
                onClick={() => {
                  setActiveProvider(provider.id);
                  setCurrentPage(0);
                }}
              className={`
                px-6 py-3 
                rounded-lg 
                text-sm 
                font-medium 
                whitespace-nowrap 
                transition-colors
                ${activeProvider === provider.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#252547] text-gray-400 hover:bg-[#2f2f5a]'
                }
              `}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

        {/* Games Grid - Desktop */}
        <div className="grid grid-cols-6 gap-6 ">
  {filteredGames.map((game) => (
    <div 
      key={game.id || game.game_uid} 
      className="flex flex-col items-center group"
    >
      <div 
        onClick={() => openJsGame(game.id, game.vendor)}
        className="relative w-full h-[240px] bg-[#252547] rounded-2xl border border-purple-500/10 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] mb-3 flex items-center justify-center group"
              >
                <img 
                  src={game.img || game.icon} 
                  alt={game.name || game.game_name}
          className="w-full h-full object-fit"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Play Now
          </button>
        </div>
      </div>
      <h3 className="text-gray-400 font-medium text-sm text-center line-clamp-1">
        {game.name || game.game_name}
      </h3>
    </div>
  ))}
</div>

      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default AllGames; 