// Game lookup utility to find game names by ID from GamesData JSON files
import ainsworth from '../../gamesData/ainsworth.json';
import amatic from '../../gamesData/amatic.json';
import apex from '../../gamesData/apex.json';
import apollo from '../../gamesData/apollo.json';
import aristocrat from '../../gamesData/aristocrat.json';
import bingo from '../../gamesData/bingo.json';
import booming from '../../gamesData/booming.json';
import egt from '../../gamesData/egt.json';
import exclusive from '../../gamesData/exclusive.json';
import firekirin from '../../gamesData/firekirin.json';
import fish from '../../gamesData/fish.json';
import gclub from '../../gamesData/gclub.json';
import habenaro from '../../gamesData/habenaro.json';
import holibet from '../../gamesData/holibet.json';
import igrosoft from '../../gamesData/igrosoft.json';
import igt from '../../gamesData/igt.json';
import jili from '../../gamesData/jili.json';
import keno from '../../gamesData/keno.json';
import kjot from '../../gamesData/kjot.json';
import merkur from '../../gamesData/merkur.json';
import microgaming from '../../gamesData/microgaming.json';
import netent from '../../gamesData/netent.json';
import novomatic from '../../gamesData/novomatic.json';
import pgsoft from '../../gamesData/pgsoft.json';
import playngo from '../../gamesData/playngo.json';
import pragmatic from '../../gamesData/pragmatic.json';
import quickspin from '../../gamesData/quickspin.json';
import roulette from '../../gamesData/roulette.json';
import rubyplay from '../../gamesData/rubyplay.json';
import scientificgames from '../../gamesData/scientificgames.json';
import sportbetting from '../../gamesData/sportbetting.json';
import spribe from '../../gamesData/spribe.json';
import vegas from '../../gamesData/vegas.json';
import wazdan from '../../gamesData/wazdan.json';
import zitro from '../../gamesData/zitro.json';

// Helper function to extract games from different JSON structures
const extractGamesFromProvider = (providerData: any, providerName: string): Array<{id: string, name: string}> => {
  try {
    // Handle JILI format: { data: { gameLists: [...] } }
    if (providerData?.data?.gameLists && Array.isArray(providerData.data.gameLists)) {
      const games = providerData.data.gameLists.map((game: any) => ({
        id: game.gameID?.toString() || '',
        name: game.gameNameEn || game.gameName || ''
      })).filter((game: any) => game.id && game.name);
      return games;
    }
    
    // Handle standard format: [ { id: "...", name: "..." } ]
    if (Array.isArray(providerData)) {
      const games = providerData.map((game: any) => ({
        id: game.id?.toString() || '',
        name: game.name || ''
      })).filter((game: any) => game.id && game.name);
      return games;
    }
    
    // Handle other possible nested structures
    if (providerData?.games && Array.isArray(providerData.games)) {
      const games = providerData.games.map((game: any) => ({
        id: game.id?.toString() || game.gameId?.toString() || '',
        name: game.name || game.gameName || game.title || ''
      })).filter((game: any) => game.id && game.name);
      return games;
    }
    
    console.warn(`Unknown structure for provider ${providerName}`);
    return [];
  } catch (error) {
    console.error(`Error extracting games from ${providerName}:`, error);
    return [];
  }
};

// Extract games from each provider with proper error handling
const allGames = [
  ...extractGamesFromProvider(ainsworth, 'ainsworth'),
  ...extractGamesFromProvider(amatic, 'amatic'),
  ...extractGamesFromProvider(apex, 'apex'),
  ...extractGamesFromProvider(apollo, 'apollo'),
  ...extractGamesFromProvider(aristocrat, 'aristocrat'),
  ...extractGamesFromProvider(bingo, 'bingo'),
  ...extractGamesFromProvider(booming, 'booming'),
  ...extractGamesFromProvider(egt, 'egt'),
  ...extractGamesFromProvider(exclusive, 'exclusive'),
  ...extractGamesFromProvider(firekirin, 'firekirin'),
  ...extractGamesFromProvider(fish, 'fish'),
  ...extractGamesFromProvider(gclub, 'gclub'),
  ...extractGamesFromProvider(habenaro, 'habenaro'),
  ...extractGamesFromProvider(holibet, 'holibet'),
  ...extractGamesFromProvider(igrosoft, 'igrosoft'),
  ...extractGamesFromProvider(igt, 'igt'),
  ...extractGamesFromProvider(jili, 'jili'),
  ...extractGamesFromProvider(keno, 'keno'),
  ...extractGamesFromProvider(kjot, 'kjot'),
  ...extractGamesFromProvider(merkur, 'merkur'),
  ...extractGamesFromProvider(microgaming, 'microgaming'),
  ...extractGamesFromProvider(netent, 'netent'),
  ...extractGamesFromProvider(novomatic, 'novomatic'),
  ...extractGamesFromProvider(pgsoft, 'pgsoft'),
  ...extractGamesFromProvider(playngo, 'playngo'),
  ...extractGamesFromProvider(pragmatic, 'pragmatic'),
  ...extractGamesFromProvider(quickspin, 'quickspin'),
  ...extractGamesFromProvider(roulette, 'roulette'),
  ...extractGamesFromProvider(rubyplay, 'rubyplay'),
  ...extractGamesFromProvider(scientificgames, 'scientificgames'),
  ...extractGamesFromProvider(sportbetting, 'sportbetting'),
  ...extractGamesFromProvider(spribe, 'spribe'),
  ...extractGamesFromProvider(vegas, 'vegas'),
  ...extractGamesFromProvider(wazdan, 'wazdan'),
  ...extractGamesFromProvider(zitro, 'zitro'),
];

// Create a map for O(1) lookup performance
const gameIdToNameMap = new Map<string, string>();

// Populate the map
allGames.forEach((game) => {
  if (game.id && game.name) {
    gameIdToNameMap.set(game.id.toString(), game.name);
  }
});

// Log the total number of games loaded for debugging
console.log(`Game lookup utility initialized with ${gameIdToNameMap.size} games`);

/**
 * Get game name by game ID
 * @param gameId - The game ID to look up
 * @returns The game name if found, or the original game ID if not found
 */
export const getGameNameById = (gameId: string | number): string => {
  if (!gameId) return 'Unknown Game';
  
  try {
    const gameName = gameIdToNameMap.get(gameId.toString());
    if (gameName) {
      return gameName;
    } else {
      // Log missing games for debugging
      console.warn(`Game ID not found: ${gameId}`);
      return `Game ID: ${gameId}`;
    }
  } catch (error) {
    console.error(`Error looking up game ID ${gameId}:`, error);
    return `Game ID: ${gameId}`;
  }
};

/**
 * Get game name by game ID with fallback
 * @param gameId - The game ID to look up
 * @param fallback - Fallback text if game not found
 * @returns The game name if found, or the fallback text
 */
export const getGameNameByIdWithFallback = (gameId: string | number, fallback: string = 'Unknown Game'): string => {
  if (!gameId) return fallback;
  
  try {
    const gameName = gameIdToNameMap.get(gameId.toString());
    return gameName || fallback;
  } catch (error) {
    console.error(`Error looking up game ID ${gameId}:`, error);
    return fallback;
  }
};

/**
 * Check if a game ID exists in the database
 * @param gameId - The game ID to look up
 * @returns True if the game exists, false otherwise
 */
export const gameExists = (gameId: string | number): boolean => {
  if (!gameId) return false;
  return gameIdToNameMap.has(gameId.toString());
};

/**
 * Get total number of games in the database
 * @returns Total number of games
 */
export const getTotalGamesCount = (): number => {
  return gameIdToNameMap.size;
};

export default {
  getGameNameById,
  getGameNameByIdWithFallback,
  gameExists,
  getTotalGamesCount,
};
