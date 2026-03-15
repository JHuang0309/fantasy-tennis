# Quick Fix Template

## 🎯 Once you know the API response structure, use this template

### Step 1: Copy the first player from API response
From `api-response-rankings.json`, copy one player object here:

```json
PASTE FIRST PLAYER JSON HERE
```

### Step 2: Use this transformation function

Update `src/api/sportsApi.js` - `getTopPlayers()` function:

```javascript
export const getTopPlayers = async (gender = 'male') => {
  try {
    const endpoint = gender === 'female' ? '/api/rankings/wta' : '/api/rankings';
    const response = await api.get(endpoint);

    console.log('✅ API Response received');
    console.log('  Top-level keys:', Object.keys(response.data).join(', '));

    // TODO: Replace 'rankings' with actual key if different
    const rankingsArray = response.data.rankings; // <-- CHECK THIS

    if (!rankingsArray || rankingsArray.length === 0) {
      console.error('❌ No rankings found in response');
      console.log('Full response:', JSON.stringify(response.data));
      return [];
    }

    console.log(`  Found ${rankingsArray.length} players`);

    // Transform API data to app format
    const players = rankingsArray.map(apiPlayer => {
      // TODO: Update these field mappings based on actual API response
      return {
        id: apiPlayer.team?.id,              // <-- CHECK: Might be apiPlayer.id
        name: apiPlayer.team?.name,          // <-- CHECK: Might be apiPlayer.name
        rank: apiPlayer.ranking,             // <-- CHECK: Might be apiPlayer.rank
        country: apiPlayer.team?.country?.alpha2 || apiPlayer.team?.country?.name, // <-- CHECK
        age: null,                           // Not provided by rankings API
        points: 0,                           // Game points (will be calculated later)
        atpPoints: apiPlayer.points,         // ATP ranking points
        recentForm: null,                    // Will be fetched separately
      };
    });

    console.log('  First transformed player:', players[0]);

    return players;
  } catch (error) {
    console.error('Error fetching top players:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};
```

### Step 3: Update playersSlice.js

In `src/store/playersSlice.js`, update the API logic (line 35-72):

```javascript
// Real API logic
const topPlayersData = await getTopPlayers();

console.log('📥 Received players from API:', topPlayersData.length);

if (!topPlayersData || topPlayersData.length === 0) {
  console.error('❌ No players returned from getTopPlayers()');
  throw new Error('No players available from API');
}

const availablePlayers = topPlayersData.filter(
  player => !eliminatedPlayerIds.includes(player.id)
);

console.log('📊 Available players after filtering:', availablePlayers.length);

// Calculate prices for each player
const playersWithPrices = availablePlayers.map(player => {
  const price = calculatePlayerPrice(
    player,
    availablePlayers,
    roundBudget
  );

  return {
    ...player,
    price,
    upsetBonus: 0,
  };
});

console.log('✅ Players with prices calculated:', playersWithPrices.length);

return playersWithPrices;
```

### Step 4: Enable real API data

In `src/store/playersSlice.js`, line 7:
```javascript
const USE_MOCK_DATA = false; // Set to false
```

### Step 5: Test

1. Restart Expo: `npx expo start -c`
2. Reload app
3. Check console for logs:
   - ✅ "API Response received"
   - ✅ "Found X players"
   - ✅ "Players with prices calculated"
4. You should see real ATP players!

---

## 🔍 Common API Response Patterns

### Pattern 1: Nested in "data"
```javascript
// If response is: { data: { rankings: [...] } }
const rankingsArray = response.data.data.rankings;
```

### Pattern 2: Direct array
```javascript
// If response is: { rankings: [...] }
const rankingsArray = response.data.rankings;
```

### Pattern 3: Top-level array
```javascript
// If response is: [...]
const rankingsArray = response.data;
```

### Pattern 4: Different key name
```javascript
// If response is: { players: [...] } or { athletes: [...] }
const rankingsArray = response.data.players || response.data.athletes;
```

---

## 📋 Checklist

After running `debug-api.js` on the working laptop:

- [ ] API returns 200 status
- [ ] `api-response-rankings.json` file created
- [ ] Can see player objects in the JSON
- [ ] Identified the correct path to player array
- [ ] Identified the correct field names (id, name, rank, etc.)
- [ ] Updated `getTopPlayers()` with correct field mappings
- [ ] Added console.log statements for debugging
- [ ] Set `USE_MOCK_DATA = false`
- [ ] Restarted Expo with `npx expo start -c`
- [ ] App shows real players!

---

## 🆘 If Still Not Working

Add this at the TOP of `src/store/playersSlice.js` to force see what's happening:

```javascript
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async ({ roundBudget, eliminatedPlayerIds = [] }) => {
    try {
      console.log('🚀 fetchPlayers called');
      console.log('  USE_MOCK_DATA:', USE_MOCK_DATA);
      console.log('  roundBudget:', roundBudget);

      if (USE_MOCK_DATA) {
        console.log('  → Using mock data');
        // ... mock data code
      }

      console.log('  → Using real API');
      const topPlayersData = await getTopPlayers();
      console.log('  → getTopPlayers returned:', topPlayersData?.length, 'players');

      // ... rest of code

    } catch (error) {
      console.error('💥 fetchPlayers ERROR:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }
);
```

This will show exactly where it's failing!
