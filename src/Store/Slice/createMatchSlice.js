import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sport: '',
  league: '',
  match: '',
  marketType: '',
  marketID: '',
  team1: '',
  team2: '',
  runners: '',
  
  // Delays
  oddsDelay: '',
  sessionDelay: '',
  bookDelay: '',
  tossDelay: '',

  // Stakes
  oddsMinStake: '',
  oddsMaxStake: '',
  sessionMinStake: '',
  sessionMaxStake: '',
  bookMinStake: '',
  bookMaxStake: '',
  tossMinStake: '',
  tossMaxStake: '',

  // Profits
  oddsMaxProfit: '',
  sessionMaxProfit: '',
  bookMaxProfit: '',
  tossMaxProfit: '',

  // Messages
  oddsMessage: '',
  bookmakerMessage: '',
  sessionMessage: '',
  tossMessage: '',

  scoreId: '',
  tvUrl: '',

  // Statuses
  matchStatus: 'active',
  sessionStatus: 'active',
  bookmakerStatus: 'active',
  tossStatus: 'active',
  oddsStatus: 'active',
};

const createMatchSlice = createSlice({
  name: 'createMatch',
  initialState,
  reducers: {
    updateField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { updateField, resetForm } = createMatchSlice.actions;
export default createMatchSlice.reducer;



// const initialState = {
//   sport: '',
//   league: '',
//   match: '',
//   marketType: '',
//   marketID: '',
//   team1: '',
//   team2: '',
//   runners:'',
//   delays: {
//     odds: '',
//     session: '',
//     book: '',
//     toss: '',
//   },
//   stakes: {
//     oddsMin: '',
//     oddsMax: '',
//     sessionMin: '',
//     sessionMax: '',
//     bookMin: '',
//     bookMax: '',
//     tossMin: '',
//     tossMax: '',
//   },
//   profits: {
//     oddsMax: '',
//     sessionMax: '',
//     bookMax: '',
//     tossMax: '',
//   },
//   messages: {
//     odds: '',
//     bookmaker: '',
//     session: '',
//     toss: '',
//   },
//   scoreId: '',
//   tvUrl: '',
//   statuses: {
//     match: 'active',
//     session: 'active',
//     bookmaker: 'active',
//     toss: 'active',
//     odds: 'active',
//   },
// };

// const createMatchSlice = createSlice({
//   name: 'createMatch',
//   initialState,
//   reducers: {
//     updateField(state, action) {
//       const { field, value } = action.payload;
//       state[field] = value;
//     },
//     updateNestedField(state, action) {
//       const { section, field, value } = action.payload;
//       state[section][field] = value;
//     },
//     resetForm(state) {
//       Object.assign(state, initialState);
//     },
//   },
// });

// export const { updateField, updateNestedField, resetForm } = createMatchSlice.actions;
// export default createMatchSlice.reducer;
