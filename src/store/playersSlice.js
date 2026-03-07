import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getATPPlayers } from '../api/sportsApi';

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    const data = await getATPPlayers();
    return data;
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
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

export default playersSlice.reducer;