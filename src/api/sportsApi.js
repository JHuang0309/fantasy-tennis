import axios from 'axios';
import { SPORTS_API_BASE_URL, SPORTS_API_KEY } from '@env';

const api = axios.create({
  baseURL: SPORTS_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SPORTS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Get ATP players
export const getATPPlayers = async () => {
  try {
    const response = await api.get('/tennis/players'); // Adjust endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching ATP players:', error);
    throw error;
  }
};

// Get tournament data
export const getTournament = async (tournamentId) => {
  try {
    const response = await api.get(`/tennis/tournaments/${tournamentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
};

// Get match results
export const getMatchResults = async (tournamentId) => {
  try {
    const response = await api.get(`/tennis/tournaments/${tournamentId}/matches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match results:', error);
    throw error;
  }
};

export default api;