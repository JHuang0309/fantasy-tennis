// STORE = the main container holding all your app's state. 
// It allows you to access the state, dispatch actions, and subscribe to changes. 
// In Redux Toolkit, we use configureStore to create the store and combine our reducers.
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