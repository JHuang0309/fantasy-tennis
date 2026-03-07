import { createSlice } from '@reduxjs/toolkit';
import { BUDGET } from '../constants/theme';

const squadSlice = createSlice({
  name: 'squad',
  initialState: {
    players: [],
    budget: BUDGET.initial,
    totalSpent: 0,
  },
  reducers: {
    addPlayerToSquad: (state, action) => {
      const player = action.payload;
      if (state.totalSpent + player.price <= state.budget) {
        state.players.push(player);
        state.totalSpent += player.price;
      }
    },
    removePlayerFromSquad: (state, action) => {
      const playerId = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        state.players = state.players.filter(p => p.id !== playerId);
        state.totalSpent -= player.price;
      }
    },
    resetSquad: (state) => {
      state.players = [];
      state.totalSpent = 0;
    },
  },
});

export const { addPlayerToSquad, removePlayerFromSquad, resetSquad } = squadSlice.actions;
export default squadSlice.reducer;