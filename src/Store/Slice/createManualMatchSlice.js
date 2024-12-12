import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sport: '',
  league: '',
  match: '',
  marketType: '',
  marketID: '',
  eventID: '',
  team1: '',
  team2: '',
  team1SelectionID: '',
  team2SelectionID: '',
  runners: '',
  dateTime: '',
  delays: {
    odds: '',
    session: '',
    book: '',
  },
  stakes: {
    oddsMin: '',
    oddsMax: '',
    sessionMin: '',
    sessionMax: '',
    bookMin: '',
    bookMax: '',
  },
  profits: {
    oddsMax: '',
    sessionMax: '',
    bookMax: '',
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

const createManualMatchSlice = createSlice({
  name: 'createManualMatch',
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

export const { updateField, updateNestedField, resetForm } = createManualMatchSlice.actions;
export default createManualMatchSlice.reducer;
