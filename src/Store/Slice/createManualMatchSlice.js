import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sport: '',
  league: '',
  match: '',
  marketType: '',
  marketID: '',
  eventId:'',
  team1: '',
  team2: '',

  team1Selectionid:'',
  team2Selectionid:'',

  runners:'',
  datetime:'',
  
  // Delays
  oddsDelay: '',
   oddsMinStake: '',
  oddsMaxStake: '',
  oddsMaxProfit: '',


  sessionDelay: '',
  sessionMinStake: '',
  sessionMaxStake: '',
  sessionMaxProfit: '',

  bookDelay: '',
  bookMinStake: '',
  bookMaxStake: '',  
  bookMaxProfit: '',
  
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
