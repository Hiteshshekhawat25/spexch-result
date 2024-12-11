import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sport: '',
  league: '',
  match: '',
  marketType: '',
  marketID: '',
  team1: '',
  team2: '',
  delays: {
    odds: '',
    session: '',
    book: '',
    toss: '',
  },
  stakes: {
    oddsMin: '',
    oddsMax: '',
    sessionMin: '',
    sessionMax: '',
    bookMin: '',
    bookMax: '',
    tossMin: '',
    tossMax: '',
  },
  profits: {
    oddsMax: '',
    sessionMax: '',
    bookMax: '',
    tossMax: '',
  },
  messages: {
    odds: '',
    bookmaker: '',
    session: '',
    toss: '',
  },
  scoreId: '',
  tvUrl: '',
  statuses: {
    match: 'active',
    session: 'active',
    bookmaker: 'active',
    toss: 'active',
    odds: 'active',
  },
};

const createMatchSlice = createSlice({
  name: 'createMatch',
  initialState,
  reducers: {
    updateField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateNestedField(state, action) {
      const { section, field, value } = action.payload;
      state[section][field] = value;
    },
    resetForm(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { updateField, updateNestedField, resetForm } = createMatchSlice.actions;
export default createMatchSlice.reducer;
