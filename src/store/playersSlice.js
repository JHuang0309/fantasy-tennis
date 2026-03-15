import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPlayerMatchHistory, getTopPlayers } from '../api/sportsApi';
import { calculatePlayerPrice, calculateRecentForm } from '../utils/pricing';

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async ({ roundBudget, eliminatedPlayerIds = [] }) => {
    const topPlayers = await getTopPlayers();
    
    // Filter out eliminated players
    const availablePlayers = topPlayers.filter(
      player => !eliminatedPlayerIds.includes(player.id)
    );
    
    // Fetch additional details and calculate prices
    const playersWithPrices = await Promise.all(
      availablePlayers.map(async (player) => {
        try {
          // Get match history for form calculation
          const matchHistory = await getPlayerMatchHistory(player.id);
          const recentForm = calculateRecentForm(matchHistory);
          
          // Calculate price
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