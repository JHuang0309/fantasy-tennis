import { createSlice } from '@reduxjs/toolkit';
import { applyLoyaltyBonus, calculateMatchPoints } from '../utils/points';
import { getRoundBudget } from '../utils/pricing';

const squadSlice = createSlice({
  name: 'squad',
  initialState: {
    currentRound: 1,
    players: [],
    budget: getRoundBudget(1),
    totalSpent: 0,
    totalPoints: 0,
    roundHistory: [], // Track players across rounds
  },
  reducers: {
    addPlayerToSquad: (state, action) => {
      const player = action.payload;
      if (state.totalSpent + player.price <= state.budget) {
        // Check if player was in previous round
        const previousRoundPlayer = state.roundHistory.find(
          h => h.playerId === player.id && h.round === state.currentRound - 1
        );
        
        const roundsKept = previousRoundPlayer ? previousRoundPlayer.roundsKept + 1 : 0;
        
        state.players.push({
          ...player,
          roundsKept,
          addedInRound: state.currentRound,
        });
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
    
    updatePlayerPoints: (state, action) => {
      const { playerId, matchStats, opponentRank } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player) {
        const basePoints = calculateMatchPoints(
          matchStats,
          player.rank,
          opponentRank,
          state.currentRound
        );
        
        const finalPoints = applyLoyaltyBonus(basePoints, player.roundsKept || 0);
        
        player.points = (player.points || 0) + finalPoints;
        player.lastMatchPoints = finalPoints;
        player.matchHistory = player.matchHistory || [];
        player.matchHistory.push({
          round: state.currentRound,
          points: finalPoints,
          matchStats,
        });
      }
      
      // Recalculate total points
      state.totalPoints = state.players.reduce((sum, p) => sum + (p.points || 0), 0);
    },
    
    startNewRound: (state, action) => {
      const newRound = action.payload;
      
      // Save current round to history
      state.players.forEach(player => {
        state.roundHistory.push({
          playerId: player.id,
          round: state.currentRound,
          points: player.points || 0,
          roundsKept: player.roundsKept || 0,
        });
      });
      
      // Reset for new round
      state.currentRound = newRound;
      state.players = [];
      state.budget = getRoundBudget(newRound);
      state.totalSpent = 0;
    },
    
    resetSquad: (state) => {
      state.players = [];
      state.totalSpent = 0;
    },
    
    lockSquad: (state) => {
      state.locked = true;
      state.lockedAt = new Date().toISOString();
    },
  },
});

export const {
  addPlayerToSquad,
  removePlayerFromSquad,
  updatePlayerPoints,
  startNewRound,
  resetSquad,
  lockSquad,
} = squadSlice.actions;

export default squadSlice.reducer;