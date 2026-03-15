import { SPORTS_API_BASE_URL, SPORTS_API_KEY } from '@env';
import axios from 'axios';

// Debug: Check if environment variables are loaded
console.log('🔍 API Configuration:');
console.log('  Base URL:', SPORTS_API_BASE_URL || '❌ NOT LOADED');
console.log('  API Key:', SPORTS_API_KEY ? `✅ Loaded (${SPORTS_API_KEY.substring(0, 10)}...)` : '❌ NOT LOADED');

const api = axios.create({
  baseURL: SPORTS_API_BASE_URL,
  headers: {
    'x-api-key': SPORTS_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Get top ATP players with rankings
export const getTopPlayers = async (gender = 'male') => {
  try {
    // IMPORTANT: The V2 API has SWAPPED endpoints!
    // /api/rankings = WTA (women)
    // /api/rankings/wta = ATP (men)
    const endpoint = gender === 'female' ? '/api/rankings' : '/api/rankings/wta';
    const response = await api.get(endpoint);

    console.log('✅ API Response received');
    console.log('  Endpoint:', endpoint);
    console.log('  Top-level keys:', Object.keys(response.data).join(', '));

    // V2 API structure: { success: true, data: { rankings: [...] } }
    if (!response.data.data || !response.data.data.rankings) {
      console.error('❌ Unexpected API structure:', response.data);
      return [];
    }

    const rankingsArray = response.data.data.rankings;
    console.log(`  Found ${rankingsArray.length} players`);
    console.log(`  First player: ${rankingsArray[0]?.team?.name} (Gender: ${rankingsArray[0]?.team?.gender})`);

    // Transform API data to app format
    const players = rankingsArray
      .filter(apiPlayer => {
        // Filter by gender if specified
        const playerGender = apiPlayer.team?.gender;
        if (gender === 'male' && playerGender !== 'M') return false;
        if (gender === 'female' && playerGender !== 'F') return false;
        return true;
      })
      .map(apiPlayer => ({
        id: apiPlayer.team?.id,
        name: apiPlayer.team?.name,
        rank: apiPlayer.ranking,
        country: apiPlayer.team?.country?.alpha2 || apiPlayer.team?.country?.name,
        age: null, // Not provided by rankings API
        points: 0, // Game points (will be calculated later)
        atpPoints: apiPlayer.points,
        gender: apiPlayer.team?.gender, // 'M' or 'F'
      }));

    console.log(`  After gender filter: ${players.length} players`);
    console.log(`  First transformed:`, players[0]);

    return players;
  } catch (error) {
    console.error('Error fetching top players:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Get player details including recent form
// Note: Use Team ID from rankings response
export const getPlayerDetails = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player details:', error);
    throw error;
  }
};

// Get player match history for form calculation
// NOTE: V2 endpoint needs verification - may be /api/teams/{teamId}/events or similar
export const getPlayerMatchHistory = async (teamId) => {
  try {
    // TODO: Verify correct V2 endpoint for player match history
    const response = await api.get(`/api/teams/${teamId}/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player match history:', error);
    throw error;
  }
};

// Get current tournament matches
export const getLiveMatches = async () => {
  try {
    const response = await api.get('/api/live');
    return response.data;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    throw error;
  }
};

// Get completed matches
// NOTE: V2 uses tournament-specific endpoints
// Use: /api/tournament/{id}/season/{sid}/events/last/{page}
export const getCompletedMatches = async (tournamentId, seasonId, page = 0) => {
  try {
    if (!tournamentId || !seasonId) {
      throw new Error('Tournament ID and Season ID are required for V2 API');
    }
    const response = await api.get(`/api/tournament/${tournamentId}/season/${seasonId}/events/last/${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching completed matches:', error);
    throw error;
  }
};

// Get match statistics
export const getMatchStatistics = async (matchId) => {
  try {
    const response = await api.get(`/api/match/${matchId}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    throw error;
  }
};

// Get tournament/competition details
export const getTournaments = async () => {
  try {
    const response = await api.get('/api/live-tournaments');
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

// Get ATP rankings (same as getTopPlayers)
export const getRankings = async (gender = 'male') => {
  try {
    // IMPORTANT: The V2 API has SWAPPED endpoints!
    // /api/rankings = WTA (women)
    // /api/rankings/wta = ATP (men)
    const endpoint = gender === 'female' ? '/api/rankings' : '/api/rankings/wta';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
};

// ===== NEW V2 ENDPOINTS =====

// Get today's matches
export const getTodaysMatches = async () => {
  try {
    const response = await api.get('/api/today');
    return response.data;
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
    throw error;
  }
};

// Get schedule by specific date
export const getScheduleByDate = async (date) => {
  try {
    // date format: YYYY-MM-DD
    const response = await api.get(`/api/schedule/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

// Get trending players
export const getTrendingPlayers = async () => {
  try {
    const response = await api.get('/api/trending-players');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending players:', error);
    throw error;
  }
};

// Get full match details
export const getMatchDetails = async (matchId) => {
  try {
    const response = await api.get(`/api/match/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

// Get match scores
export const getMatchScores = async (matchId) => {
  try {
    const response = await api.get(`/api/match/${matchId}/scores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match scores:', error);
    throw error;
  }
};

// Get head-to-head between two players
export const getHeadToHead = async (matchId) => {
  try {
    const response = await api.get(`/api/match/${matchId}/h2h`);
    return response.data;
  } catch (error) {
    console.error('Error fetching head-to-head:', error);
    throw error;
  }
};

// Get player pre-game form
export const getPreGameForm = async (matchId) => {
  try {
    const response = await api.get(`/api/match/${matchId}/pregame-form`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pre-game form:', error);
    throw error;
  }
};

// Get ATP Doubles rankings
export const getDoublesRankings = async (gender = 'male') => {
  try {
    const endpoint = gender === 'female' ? '/api/rankings/wta-doubles' : '/api/rankings/doubles';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching doubles rankings:', error);
    throw error;
  }
};

// Search for players/tournaments
export const search = async (query) => {
  try {
    const response = await api.get('/api/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// Get tournament information
export const getTournamentInfo = async (tournamentId) => {
  try {
    const response = await api.get(`/api/tournament/${tournamentId}/info`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament info:', error);
    throw error;
  }
};

// Get tournament seasons (needed for season-specific calls)
export const getTournamentSeasons = async (tournamentId) => {
  try {
    const response = await api.get(`/api/tournament/${tournamentId}/seasons`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament seasons:', error);
    throw error;
  }
};

export default api;