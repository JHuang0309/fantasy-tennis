# Tennis API Documentation

## API Provider
**Name:** SportsAPI Pro - Tennis V2 API
**Base URL:** `https://v2.tennis.sportsapipro.com`
**Documentation:** https://docs.sportsapipro.com/api-reference/tennis-v2/overview
**Total Endpoints:** 105 endpoints across 8 categories

⚠️ **IMPORTANT:** Your code currently uses V1 (`https://v1.tennis.sportsapipro.com`), but you should migrate to V2.
Note: V1 and V2 share the same daily quota.

---

## Authentication

**Method:** API Key in Header
**Header Name:** `x-api-key`
**Header Value:** `YOUR-API-KEY`

### Example Request
```bash
curl -X GET "https://v2.tennis.sportsapipro.com/api/live" \
  -H "x-api-key: YOUR-API-KEY"
```

---

## V2 API Key Differences from V1
- **URL Style:** V2 uses path parameters (e.g., `/api/match/123`) instead of query strings
- **Base Path:** All endpoints start with `/api/`
- **Player IDs:** Two types exist:
  - **Team ID:** Used for `/api/teams/:id` endpoints (returned in rankings/matches)
  - **Player Entity ID:** Found inside team responses; used for `/api/players/:id` career endpoints

---

## 📍 Live & Schedule Endpoints (8 endpoints)

### 1.1 Get Live Matches
**Endpoint:** `/api/live`
**Method:** GET
**Description:** Returns currently ongoing tennis matches

### 1.2 Get All Live Matches
**Endpoint:** `/api/live/all`
**Method:** GET
**Description:** Returns all live matches across all tournaments

### 1.3 Get Today's Games
**Endpoint:** `/api/today`
**Method:** GET
**Description:** Returns all matches scheduled for today

### 1.4 Get Schedule by Date
**Endpoint:** `/api/schedule/{date}`
**Method:** GET
**Path Parameters:**
- `date` (required): Date in YYYY-MM-DD format (e.g., "2026-03-16")

### 1.5 Get Live Tournaments
**Endpoint:** `/api/live-tournaments`
**Method:** GET
**Description:** Returns tournaments with live matches

### 1.6 Get Scheduled Tournaments by Date
**Endpoint:** `/api/scheduled-tournaments/{date}`
**Method:** GET
**Path Parameters:**
- `date` (required): Date in YYYY-MM-DD format

### 1.7 Get Newly Added Events
**Endpoint:** `/api/newly-added-events`
**Method:** GET
**Description:** Returns recently added matches/events

### 1.8 Get Event Count
**Endpoint:** `/api/event-count`
**Method:** GET
**Description:** Returns total number of events

---

## 📊 Rankings Endpoints (5 endpoints)

### 2.1 Get ATP Singles Rankings ⭐
**Endpoint:** `/api/rankings`
**Method:** GET
**Description:** Returns current ATP Singles rankings (up to 500 players)
**Note:** Tennis-unique feature — not available in football or basketball APIs

### 2.2 Get ATP Doubles Rankings
**Endpoint:** `/api/rankings/doubles`
**Method:** GET
**Description:** Returns current ATP Doubles rankings

### 2.3 Get WTA Singles Rankings
**Endpoint:** `/api/rankings/wta`
**Method:** GET
**Description:** Returns current WTA Singles rankings

### 2.4 Get WTA Doubles Rankings
**Endpoint:** `/api/rankings/wta-doubles`
**Method:** GET
**Description:** Returns current WTA Doubles rankings

### 2.5 Get Rankings by Type
**Endpoint:** `/api/rankings/type/{typeId}`
**Method:** GET
**Path Parameters:**
- `typeId` (number, required): The ranking type identifier

**Response Note:** Rankings return Team IDs. Use `GET /api/teams/:teamId` to get the `player.id` for career endpoints.

---

## 🔍 Search & Discovery Endpoints (7 endpoints)

### 3.1 Search
**Endpoint:** `/api/search`
**Method:** GET
**Query Parameters:**
- `q` (required): Search query string

### 3.2 Get Countries/Categories
**Endpoint:** `/api/countries`
**Method:** GET

### 3.3 Get All Countries
**Endpoint:** `/api/countries/all`
**Method:** GET

### 3.4 Get Category Tournaments
**Endpoint:** `/api/categories/{categoryId}/tournaments`
**Method:** GET
**Path Parameters:**
- `categoryId` (required): Category identifier

### 3.5 Get Trending Players
**Endpoint:** `/api/trending-players`
**Method:** GET

### 3.6 Get News
**Endpoint:** `/api/news`
**Method:** GET
**Query Parameters:**
- `lang` (optional): Language code (default: "en")

### 3.7 Get Country Flag
**Endpoint:** `/api/country/{code}/flag`
**Method:** GET
**Path Parameters:**
- `code` (required): Country code

---

## 🎾 Match Endpoints (26 endpoints)

### 4.1 Get Full Match Details
**Endpoint:** `/api/match/{matchId}`
**Method:** GET
**Path Parameters:**
- `matchId` (number, required): Match identifier

### 4.2 Get Match Scores
**Endpoint:** `/api/match/{matchId}/scores`

### 4.3 Get Point-by-Point Data
**Endpoint:** `/api/match/{matchId}/point-by-point`

### 4.4 Get Match Statistics ⭐
**Endpoint:** `/api/match/{matchId}/statistics`
**Description:** Detailed match stats (aces, double faults, serve percentages, etc.)

### 4.5 Get Match Incidents
**Endpoint:** `/api/match/{matchId}/incidents`

### 4.6 Get All Player Statistics
**Endpoint:** `/api/match/{matchId}/player-statistics`

### 4.7 Get Individual Player Statistics
**Endpoint:** `/api/match/{matchId}/player/{playerId}/statistics`
**Path Parameters:**
- `matchId` (number, required)
- `playerId` (number, required)

### 4.8 Get Best Players
**Endpoint:** `/api/match/{matchId}/best-players`

### 4.9 Get Match Award
**Endpoint:** `/api/match/{matchId}/award`

### 4.10 Get Head to Head
**Endpoint:** `/api/match/{matchId}/h2h`

### 4.11 Get Momentum Graph
**Endpoint:** `/api/match/{matchId}/graph`

### 4.12 Get Pre-Game Form
**Endpoint:** `/api/match/{matchId}/pregame-form`

### 4.13 Get Streaks
**Endpoint:** `/api/match/{matchId}/streaks`

### 4.14 Get Lineups
**Endpoint:** `/api/match/{matchId}/lineups`

### 4.15 Get Highlights
**Endpoint:** `/api/match/{matchId}/highlights`

### 4.16 Get Media
**Endpoint:** `/api/match/{matchId}/media`

### 4.17 Get TV Channels
**Endpoint:** `/api/match/{matchId}/channels`

### 4.18 Get Managers/Coaches
**Endpoint:** `/api/match/{matchId}/managers`

### 4.19 Get Venue
**Endpoint:** `/api/match/{matchId}/venue`

### 4.20 Get Referee/Umpire
**Endpoint:** `/api/match/{matchId}/referee`

### 4.21 Get Fan Votes
**Endpoint:** `/api/match/{matchId}/votes`

### 4.22 Get Odds (Featured)
**Endpoint:** `/api/match/{matchId}/odds`

### 4.23 Get All Odds
**Endpoint:** `/api/match/{matchId}/odds/all`

### 4.24 Get Pre-Match Odds
**Endpoint:** `/api/match/{matchId}/odds/pre-match`

### 4.25 Get Live Odds
**Endpoint:** `/api/match/{matchId}/odds/live`

### 4.26 Get Winning Odds
**Endpoint:** `/api/match/{matchId}/winning-odds`

---

## 🏆 Tournament Endpoints (21 endpoints)

### 5.1 Get Tournament Info
**Endpoint:** `/api/tournament/{id}/info`
**Description:** Returns tournament details: name, category, surface, prize money

### 5.2 Get Tournament Seasons ⭐
**Endpoint:** `/api/tournament/{id}/seasons`
**Description:** Retrieves all seasons; returns `seasonId` for season-specific calls

### 5.3 Get Tournament Image
**Endpoint:** `/api/tournament/{id}/image`

### 5.4 Get Featured Events
**Endpoint:** `/api/tournament/{id}/featured-events`

### 5.5 Get Tournament Media
**Endpoint:** `/api/tournament/{id}/media`

### Season-Specific Endpoints (16 endpoints)
**Pattern:** `/api/tournament/{id}/season/{sid}/...`

**Path Parameters:**
- `id`: Tournament ID
- `sid`: Season ID (from `/api/tournament/{id}/seasons`)

| Endpoint | Query Params | Notes |
|----------|--------------|-------|
| `/standings` | `type` (total, home, away) | Season standings |
| `/top-players` | `type` (overall) | Top performers |
| `/rounds` | — | Round information |
| `/statistics` | `type` (overall) | Season statistics |
| `/statistics/info` | — | Statistics metadata |
| `/knockout` | — | Knockout stage bracket |
| `/draw` | — | Tournament draw (tennis-specific) |
| `/media` | — | Season media |
| `/info` | — | Season details |
| `/player-statistics/types` | — | Available stat types |
| `/events/round/{round}` | — | Events by round |
| `/events/last/{page}` | `page` (0-indexed) | Recent events paginated |
| `/venues` | — | Tournament venues |
| `/top-ratings` | `type` (overall) | Top-rated players |
| `/player-of-the-season` | — | Season MVP |
| `/team-events` | `type` (total) | Team-related events |

---

## 👤 Team/Player Endpoints (11 endpoints)
**Note:** Need official docs to complete. Expected endpoints:
- `/api/teams/{teamId}` - Player profile (team ID from rankings)
- `/api/teams/{teamId}/...` - Various team/player stats

---

## 🎯 Player Entity Endpoints (19 endpoints)
**Note:** Uses Player Entity ID (different from Team ID). Need official docs to complete.
Expected endpoints include:
- Career statistics
- Head-to-head records
- Rankings history
- Tournament performance history

---

## ⚙️ Officials Endpoints (8 endpoints)
**Note:** Need official docs to complete. Expected endpoints for umpires and venue information.

---

## Rate Limits
⚠️ **V1 and V2 share the same daily quota**
- Check your plan details at SportsAPI Pro dashboard
- Requests to both API versions count against the same limit

## Error Codes
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid or missing API key)
- `404` - Not Found (endpoint or resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 📝 Notes for Claude Code

### 🔴 CRITICAL ISSUES IN CURRENT CODE

1. **WRONG BASE URL**
   - Current: `https://v1.tennis.sportsapipro.com`
   - Should be: `https://v2.tennis.sportsapipro.com`

2. **WRONG AUTHENTICATION**
   - Current: Using `Authorization: Bearer {token}`
   - Should be: `x-api-key: {key}` header

3. **WRONG ENDPOINTS**
   - `/athletes/top` → Use `/api/rankings` or `/api/rankings/wta`
   - `/athletes/{id}` → Use `/api/teams/{id}` (for Team ID from rankings)
   - `/athletes/games` → Need to find correct V2 endpoint
   - `/games/current` → Use `/api/live` or `/api/today`
   - `/games/results` → Need tournament-specific endpoint
   - `/games/state` → Use `/api/match/{matchId}/statistics`
   - `/competitions` → Need to use tournament endpoints

### ✅ Recommended Endpoints for Fantasy Tennis App

**For Getting Top Players:**
```javascript
GET /api/rankings              // ATP Singles (up to 500 players)
GET /api/rankings/wta          // WTA Singles
GET /api/trending-players      // Popular players
```

**For Live Matches:**
```javascript
GET /api/live                  // Current live matches
GET /api/today                 // Today's schedule
GET /api/schedule/{date}       // Schedule by specific date
```

**For Match Details:**
```javascript
GET /api/match/{matchId}                // Full match info
GET /api/match/{matchId}/statistics     // Match stats
GET /api/match/{matchId}/pregame-form   // Player form
```

**For Player Info:**
```javascript
GET /api/teams/{teamId}        // Player profile (teamId from rankings)
// Then use player.id for career endpoints:
GET /api/players/{playerId}/... // Career stats, history, etc.
```

**For Tournaments:**
```javascript
GET /api/live-tournaments               // Active tournaments
GET /api/tournament/{id}/seasons        // Get seasonId
GET /api/tournament/{id}/season/{sid}/top-players
```

### 🔄 Migration Checklist

- [ ] Update `.env` file: Change base URL from V1 to V2
- [ ] Fix authentication in `sportsApi.js`: Change from Bearer to x-api-key
- [ ] Update all endpoint paths to V2 format (add `/api/` prefix, use path params)
- [ ] Test `/api/rankings` endpoint (replaces broken `/athletes/top`)
- [ ] Update response parsing (V2 may have different response structure)
- [ ] Handle Team ID vs Player Entity ID correctly
- [ ] Add error handling for rate limits

### 📁 Configuration Files
- API key: `.env` file
- Environment variables:
  - `SPORTS_API_BASE_URL` → Change to `https://v2.tennis.sportsapipro.com`
  - `SPORTS_API_KEY` → Keep same (works across V1/V2)
- Implementation: `src/api/sportsApi.js`

### 💡 Quick Fixes

**Fix 404 on `/athletes/top`:**
```javascript
// OLD (V1 - BROKEN):
await api.get('/athletes/top', { params: { sport: 'tennis', gender: 'male' }})

// NEW (V2 - WORKS):
await api.get('/api/rankings')  // ATP Singles
await api.get('/api/rankings/wta')  // WTA Singles
```

**Fix authentication:**
```javascript
// OLD:
headers: { 'Authorization': `Bearer ${SPORTS_API_KEY}` }

// NEW:
headers: { 'x-api-key': SPORTS_API_KEY }
```
