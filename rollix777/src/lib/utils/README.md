# Game Lookup Utility

This utility provides fast game name lookups by searching through all game data JSON files in the GamesData folder.

## Features

- **Fast Lookup**: Uses a Map for O(1) lookup performance
- **Comprehensive Coverage**: Searches through all 35+ game provider JSON files
- **Error Handling**: Graceful fallbacks and error logging
- **Type Safety**: Full TypeScript support

## Usage

### Basic Game Name Lookup

```typescript
import { getGameNameById } from './gameLookup';

// Get game name by ID
const gameName = getGameNameById('14156'); // Returns "6 Jokers"
const gameName2 = getGameNameById(14156);  // Also works with numbers
```

### With Fallback

```typescript
import { getGameNameByIdWithFallback } from './gameLookup';

// Get game name with custom fallback
const gameName = getGameNameByIdWithFallback('99999', 'Unknown Game');
// Returns "Unknown Game" if game ID not found
```

### Check Game Existence

```typescript
import { gameExists } from './gameLookup';

// Check if a game exists
const exists = gameExists('14156'); // Returns true
const notExists = gameExists('99999'); // Returns false
```

### Get Statistics

```typescript
import { getTotalGamesCount } from './gameLookup';

// Get total number of games
const totalGames = getTotalGamesCount(); // Returns total count
```

## Supported Game Providers

The utility automatically loads games from all JSON files in the GamesData folder:

- Ainsworth
- Amatic
- Apex
- Apollo
- Aristocrat
- Bingo
- Booming
- EGT
- Exclusive
- FireKirin
- Fish
- GClub
- Habenaro
- Holibet
- Igrosoft
- IGT
- Jili
- Keno
- KJOT
- Merkur
- Microgaming
- NetEnt
- Novomatic
- PGSoft
- Play'n GO
- Pragmatic Play
- Quickspin
- Roulette
- Ruby Play
- Scientific Games
- Sport Betting
- Spribe
- Vegas
- Wazdan
- Zitro

## Performance

- **Initialization**: Loads all game data once at startup
- **Lookup Time**: O(1) constant time using Map
- **Memory Usage**: Approximately 2-5MB depending on game count
- **Cache**: All games are cached in memory for instant access

## Error Handling

The utility includes comprehensive error handling:

- Invalid game IDs return fallback values
- Missing games are logged for debugging
- Network errors are gracefully handled
- Console warnings for missing game IDs

## Example Output

```typescript
// Found game
getGameNameById('14156') // "6 Jokers"

// Not found game
getGameNameById('99999') // "Game ID: 99999"

// Invalid input
getGameNameById('') // "Unknown Game"
getGameNameById(null) // "Unknown Game"
```

## Integration

This utility is designed to work seamlessly with the Userdetail component to display human-readable game names instead of numeric game IDs in bet history tables.





