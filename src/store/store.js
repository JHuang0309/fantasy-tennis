import { configureStore } from '@reduxjs/toolkit';
import squadReducer from './squadSlice';
import playersReducer from './playersSlice';

export const store = configureStore({
  reducer: {
    squad: squadReducer,
    players: playersReducer,
  },
});