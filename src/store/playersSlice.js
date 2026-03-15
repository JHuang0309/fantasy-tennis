import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPlayerMatchHistory, getTopPlayers } from '../api/sportsApi';
import { mockPlayers } from '../utils/mockData';
import { calculatePlayerPrice, calculateRecentForm } from '../utils/pricing';

// Add a flag to switch between mock and real data
const USE_MOCK_DATA = true; // Set to false when ready to use real API

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async ({ roundBudget, eliminatedPlayerIds = [] }) => {
    if (USE_MOCK_DATA) {
      // Use mock data for testing
      const availablePlayers = mockPlayers.filter(
        player => !eliminatedPlayerIds.includes(player.id)
      );
      
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
      
      return playersWithPrices;
    }
    
    // Real API logic (keep for later)
    const topPlayers = await getTopPlayers();
    const availablePlayers = topPlayers.filter(
      player => !eliminatedPlayerIds.includes(player.id)
    );
    
    const playersWithPrices = await Promise.all(
      availablePlayers.map(async (player) => {
        try {
          const matchHistory = await getPlayerMatchHistory(player.id);
          const recentForm = calculateRecentForm(matchHistory);
          
          const price = calculatePlayerPrice(
            { ...player, recentForm },
            availablePlayers,
            roundBudget
          );
          
          return {
            ...player,
            recentForm,
            price,
            points: 0,
            upsetBonus: 0,
          };
        } catch (error) {
          console.error(`Error processing player ${player.id}:`, error);
          return {
            ...player,
            price: calculatePlayerPrice(player, availablePlayers, roundBudget),
            points: 0,
          };
        }
      })
    );
    
    return playersWithPrices;
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    list: [],
    eliminated: [],
    loading: false,
    error: null,
  },
  reducers: {
    markPlayerEliminated: (state, action) => {
      const playerId = action.payload;
      if (!state.eliminated.includes(playerId)) {
        state.eliminated.push(playerId);
      }
      state.list = state.list.filter(p => p.id !== playerId);
    },
    
    updatePlayerPrice: (state, action) => {
      const { playerId, newPrice, upsetBonus } = action.payload;
      const player = state.list.find(p => p.id === playerId);
      if (player) {
        player.price = newPrice;
        if (upsetBonus !== undefined) {
          player.upsetBonus = upsetBonus;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { markPlayerEliminated, updatePlayerPrice } = playersSlice.actions;
export default playersSlice.reducer;