// src/redux/allMatchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sport: '',             // Selected sport
  searchTerm: '',        // Search term for EventID, MatchID, etc.
  matches: [],           // Array to hold the list of matches
};

const allMatchSlice = createSlice({
  name: 'allMatch',
  initialState,
  reducers: {
    setSport(state, action) {
      state.sport = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setMatches(state, action) {
      state.matches = action.payload;
    },
    resetForm(state) {
      state.sport = '';
      state.searchTerm = '';
      state.matches = [];
    },
  },
});

export const { setSport, setSearchTerm, setMatches, resetForm } = allMatchSlice.actions;
export default allMatchSlice.reducer;
