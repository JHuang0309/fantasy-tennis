# API Debugging Instructions

## 🎯 Purpose
This script will help diagnose why "No players available" appears even though the API is working.

## 📋 Steps to Run

### 1. Git Push and Pull on Other Laptop
```bash
# On current laptop
git add .
git commit -m "Add API debugging script"
git push

# On laptop that can access API
git pull
```

### 2. Install Dependencies (if needed)
```bash
cd /path/to/fantasy-tennis
npm install
```

### 3. Verify .env File
Make sure your `.env` has the correct API key:
```
SPORTS_API_BASE_URL=https://v2.tennis.sportsapipro.com
SPORTS_API_KEY=your-actual-working-api-key-here
```

### 4. Run the Debug Script
```bash
node debug-api.js
```

### 5. Review Output

The script will:
- ✅ Test the `/api/rankings` endpoint
- ✅ Show the actual response structure from the API
- ✅ Compare API data format vs what the app expects
- ✅ Test other endpoints (live matches, today's matches, etc.)
- ✅ Save full API responses to JSON files

### 6. Check Generated Files

After running, you'll have these files:
- `api-response-rankings.json` - Full rankings response
- `api-response-*.json` - Other endpoint responses

**Review these files** to understand the exact data structure.

---

## 🔍 What to Look For

### Check 1: Does the API return data?
Look for:
```json
{
  "rankings": [
    {
      "ranking": 1,
      "points": 9500,
      "team": {
        "id": 12345,
        "name": "Novak Djokovic",
        "country": { ... }
      }
    }
  ]
}
```

### Check 2: What's the structure?
The script will show you the mapping needed:

**API Returns:**
```javascript
{
  ranking: 1,
  points: 9500,
  team: {
    id: 12345,
    name: "Novak Djokovic",
    country: { alpha2: "SRB" }
  }
}
```

**App Expects:**
```javascript
{
  id: 1,
  name: "Novak Djokovic",
  rank: 1,
  country: "SRB",
  points: 0
}
```

### Check 3: Are the fields available?
The script will tell you if critical fields are missing.

---

## 🛠️ Likely Issues & Fixes

### Issue 1: Data structure mismatch
**Symptom:** API returns data but app shows "No players available"

**Fix:** Update `getTopPlayers()` in `src/api/sportsApi.js` to transform the data:

```javascript
export const getTopPlayers = async (gender = 'male') => {
  try {
    const endpoint = gender === 'female' ? '/api/rankings/wta' : '/api/rankings';
    const response = await api.get(endpoint);

    // Transform API response to match app's expected format
    const players = response.data.rankings.map(player => ({
      id: player.team?.id,
      name: player.team?.name,
      rank: player.ranking,
      country: player.team?.country?.alpha2 || player.team?.country?.name,
      points: 0, // Game points (will be calculated)
      atpPoints: player.points, // ATP ranking points
    }));

    return players;
  } catch (error) {
    console.error('Error fetching top players:', error);
    throw error;
  }
};
```

### Issue 2: Empty response
**Symptom:** `response.data.rankings` is undefined or empty

**Fix:** Check the console output from the debug script to see the actual response structure. It might be:
- `response.data.data.rankings`
- `response.data.players`
- Or something else entirely

### Issue 3: USE_MOCK_DATA still true
**Symptom:** Script shows API works, but app still shows mock data

**Fix:** In `src/store/playersSlice.js`, line 7:
```javascript
const USE_MOCK_DATA = false; // Change to false
```

---

## 📤 Sending Results Back

### Option 1: Create a summary file
After running the debug script, create a file with your findings:

```bash
# On the laptop that can access the API
cat api-response-rankings.json | head -50 > api-summary.txt
git add api-summary.txt api-response-rankings.json
git commit -m "API debug results"
git push
```

### Option 2: Copy console output
1. Run `node debug-api.js > debug-output.txt`
2. Git add and push the output file
3. Review on other laptop

### Option 3: Share specific findings
In the terminal output, look for the section:
```
🔄 Mapping needed:
  API → App
```

Copy this section and share it so we can update the code accordingly.

---

## 🚀 Quick Test Commands

### Test just the rankings endpoint:
```bash
node -e "
const axios = require('axios');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/SPORTS_API_KEY=(.+)/)[1].trim();

axios.get('https://v2.tennis.sportsapipro.com/api/rankings', {
  headers: { 'x-api-key': key }
}).then(r => {
  console.log('Keys:', Object.keys(r.data).join(', '));
  console.log('Players:', r.data.rankings?.length);
  console.log('First:', JSON.stringify(r.data.rankings?.[0], null, 2));
}).catch(e => console.log('Error:', e.message));
"
```

### Save just the first player:
```bash
node -e "
const axios = require('axios');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/SPORTS_API_KEY=(.+)/)[1].trim();

axios.get('https://v2.tennis.sportsapipro.com/api/rankings', {
  headers: { 'x-api-key': key }
}).then(r => {
  fs.writeFileSync('first-player.json', JSON.stringify(r.data.rankings[0], null, 2));
  console.log('Saved to first-player.json');
});
" && cat first-player.json
```

---

## 📞 What to Report Back

After running the script, share:

1. **Does the API call succeed?** (✅ or ❌)
2. **What's in `response.data`?** (Copy the top-level keys)
3. **What's the structure of one player?** (From `api-response-rankings.json`)
4. **Are there any errors?** (Copy error messages)

With this info, I can update the code to properly transform the API response!
