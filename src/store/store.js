import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './playersSlice';
import squadReducer from './squadSlice';
import tournamentReducer from './tournamentSlice';

export const store = configureStore({
  reducer: {
    squad: squadReducer,
    players: playersReducer,
    tournament: tournamentReducer,
  },
});