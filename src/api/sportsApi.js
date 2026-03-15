import { SPORTS_API_BASE_URL, SPORTS_API_KEY } from '@env';
import axios from 'axios';

const api = axios.create({
  baseURL: SPORTS_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SPORTS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Get top ATP players with rankings
export const getTopPlayers = async () => {
  try {
    const response = await api.get('/athletes/top', {
      params: {
        sport: 'tennis',
        gender: 'male', // or 'female' for WTA
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top players:', error);
    throw error;
  }
};

// Get player details including recent form
export const getPlayerDetails = async (playerId) => {
  try {
    const response = await api.get(`/athletes/${playerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player details:', error);
    throw error;
  }
};

// Get player match history for form calculation
export const getPlayerMatchHistory = async (playerId) => {
  try {
    const response = await api.get(`/athletes/games`, {
      params: {
        id: playerId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching player match history:', error);
    throw error;
  }
};

// Get current tournament matches
export const getLiveMatches = async () => {
  try {
    const response = await api.get('/games/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    throw error;
  }
};

// Get completed matches
export const getCompletedMatches = async (tournamentId) => {
  try {
    const response = await api.get('/games/results', {
      params: {
        competition_id: tournamentId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completed matches:', error);
    throw error;
  }
};

// Get match statistics
export const getMatchStatistics = async (matchId) => {
  try {
    const response = await api.get('/games/state', {
      params: {
        id: matchId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching match statistics:', error);
    throw error;
  }
};

// Get tournament/competition details
export const getTournaments = async () => {
  try {
    const response = await api.get('/competitions', {
      params: {
        sport: 'tennis',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

// Get ATP rankings
export const getRankings = async () => {
  try {
    const response = await api.get('/standings', {
      params: {
        sport: 'tennis',
        gender: 'male',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
};

export default api;