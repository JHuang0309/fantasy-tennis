# Run on Laptop with API Access

## 📦 What Was Created

I've created several debugging files to help diagnose the "No players available" issue:

### 1. **save-api-response.js** ⭐ START HERE
**Simplest script** - Just saves the API response to JSON files.

**Run:**
```bash
node save-api-response.js
```

**Creates:**
- `api-response-full.json` - Complete API response
- `api-response-sample.json` - First 3 players + metadata

**Then:**
```bash
git add api-response-*.json
git commit -m "API response structure"
git push
```

---

### 2. **debug-api.js** (Comprehensive)
**Full diagnostic script** - Tests multiple endpoints and shows detailed analysis.

**Run:**
```bash
node debug-api.js
```

**Output:**
- Console output with analysis
- Multiple JSON files with responses
- Data mapping suggestions

---

### 3. **FIX-TEMPLATE.md**
**Code templates** - Ready-to-use code once you know the API structure.

Contains:
- Transformation function template
- Common API response patterns
- Checklist for fixing

---

### 4. **API-DEBUG-README.md**
**Detailed instructions** - Full guide for running and interpreting results.

---

## 🚀 Quick Start (3 Steps)

### Step 1: On Laptop with API Access
```bash
git pull
node save-api-response.js
git add api-response-*.json
git commit -m "API response structure"
git push
```

### Step 2: On Current Laptop
```bash
git pull
cat api-response-sample.json
```

### Step 3: Share Results
Send me the contents of `api-response-sample.json` and I'll write the fix!

---

## 🔍 What I Need to See

From `api-response-sample.json`, I need to know:

1. **Top-level keys** - What's in `response.data`?
2. **Array location** - Where are the players? (`rankings`, `data.rankings`, `players`?)
3. **Player structure** - What fields does each player have?
4. **ID field** - Where is the player ID? (`id`, `team.id`, `player.id`?)

### Example of what to share:
```json
{
  "totalPlayers": 500,
  "topLevelKeys": ["rankings", "metadata"],
  "firstPlayerKeys": ["ranking", "points", "team"],
  "samplePlayers": [
    {
      "ranking": 1,
      "points": 9500,
      "team": {
        "id": 12345,
        "name": "Novak Djokovic",
        "country": { "alpha2": "SRB" }
      }
    }
  ]
}
```

---

## 🎯 Why "No Players Available"

Most likely causes:

1. **Wrong data path**
   - Code looks for `response.data.rankings`
   - API returns `response.data.data.rankings`

2. **Wrong field names**
   - Code expects `player.id`
   - API returns `player.team.id`

3. **Empty filter**
   - Data exists but gets filtered out
   - Check `eliminatedPlayerIds`

4. **Still using mock data**
   - `USE_MOCK_DATA` still `true`

---

## 📁 Files Created

```
fantasy-tennis/
├── save-api-response.js     ⭐ Run this first
├── debug-api.js              🔧 Full diagnostics
├── API-DEBUG-README.md       📖 Detailed guide
├── FIX-TEMPLATE.md           💻 Code templates
└── RUN-ON-OTHER-LAPTOP.md    📋 This file
```

---

## ⚡ Alternative: Share Console Output

If you can't git push the JSON files, just run this and copy the output:

```bash
node -e "
const axios = require('axios');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/SPORTS_API_KEY=(.+)/)[1].trim();

axios.get('https://v2.tennis.sportsapipro.com/api/rankings', {
  headers: { 'x-api-key': key }
}).then(r => {
  console.log('TOP-LEVEL KEYS:', Object.keys(r.data).join(', '));
  console.log('');
  console.log('FIRST PLAYER:');
  console.log(JSON.stringify(r.data.rankings?.[0] || r.data[0] || r.data, null, 2));
}).catch(e => console.log('ERROR:', e.message));
"
```

Copy the output and share it. That's all I need to fix the code! 🎉
