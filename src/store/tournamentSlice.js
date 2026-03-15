import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCompletedMatches, getMatchStatistics, getTournaments } from '../api/sportsApi';

export const fetchTournaments = createAsyncThunk(
  'tournament/fetchTournaments',
  async () => {
    const data = await getTournaments();
    return data;
  }
);

export const fetchMatchResults = createAsyncThunk(
  'tournament/fetchMatchResults',
  async (tournamentId) => {
    const matches = await getCompletedMatches(tournamentId);
    
    // Fetch detailed statistics for each match
    const matchesWithStats = await Promise.all(
      matches.map(async (match) => {
        try {
          const stats = await getMatchStatistics(match.id);
          return { ...match, stats };
        } catch (error) {
          console.error(`Error fetching stats for match ${match.id}:`, error);
          return match;
        }
      })
    );
    
    return matchesWithStats;
  }
);

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState: {
    activeTournament: null,
    currentRound: 1,
    tournaments: [],
    matches: [],
    loading: false,
    error: null,
    roundDeadline: null,
    lastUpdate: null,
  },
  reducers: {
    setActiveTournament: (state, action) => {
      state.activeTournament = action.payload;
      state.currentRound = 1;
    },
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
    },
    setRoundDeadline: (state, action) => {
      state.roundDeadline = action.payload;
    },
    advanceRound: (state) => {
      state.currentRound += 1;
    },
    updateLastFetchTime: (state) => {
      state.lastUpdate = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMatchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchMatchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setActiveTournament,
  setCurrentRound,
  setRoundDeadline,
  advanceRound,
  updateLastFetchTime,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;