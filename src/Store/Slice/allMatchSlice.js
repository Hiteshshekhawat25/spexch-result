import { createSlice } from "@reduxjs/toolkit";

const allMatchSlice = createSlice({
  name: 'allMatch',
  initialState: {
    sport: '',
    searchTerm: '',
    matches: [],
    totalMatches: 0,
    totalPages: 0, // Include totalPages in the initial state
  },
  reducers: {
    setSport(state, action) {
      state.sport = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setMatches(state, action) {
      state.matches = action.payload.matches;
      state.totalMatches = action.payload.totalMatches;
      state.totalPages = action.payload.totalPages; // Update totalPages
    },
  },
});

export const { setSport, setSearchTerm, setMatches } = allMatchSlice.actions;
export default allMatchSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   matches: [],        // Holds the array of matches
//   totalMatches: 0,    // Total number of matches (pagination)
//   currentPage: 1,     // Current page for pagination
//   searchTerm: "",     // Search term for filtering matches
//   sport: null,        // Selected sport
// };

// const allMatchSlice = createSlice({
//   name: "allMatch",
//   initialState,
//   reducers: {
//     setMatches: (state, action) => {
//       state.matches = action.payload.matches; // Array of matches
//       state.totalMatches = action.payload.totalMatches; // Total matches for pagination
//     },
//     setSport: (state, action) => {
//       state.sport = action.payload;
//     },
//     setSearchTerm: (state, action) => {
//       state.searchTerm = action.payload;
//     },
//     setCurrentPage: (state, action) => {
//       state.currentPage = action.payload;
//     },
//   },
// });

// export const { setMatches, setSport, setSearchTerm, setCurrentPage } = allMatchSlice.actions;

// export default allMatchSlice.reducer;

// src/redux/allMatchSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   sport: '',             // Selected sport
//   searchTerm: '',        // Search term for EventID, MatchID, etc.
//   matches: [],           // Array to hold the list of matches
// };

// const allMatchSlice = createSlice({
//   name: 'allMatch',
//   initialState,
//   reducers: {
//     setSport(state, action) {
//       state.sport = action.payload;
//     },
//     setSearchTerm(state, action) {
//       state.searchTerm = action.payload;
//     },
//     setMatches(state, action) {
//       state.matches = action.payload;
//     },
//     resetForm(state) {
//       state.sport = '';
//       state.searchTerm = '';
//       state.matches = [];
//     },
//   },
// });

// export const { setSport, setSearchTerm, setMatches, resetForm } = allMatchSlice.actions;
// export default allMatchSlice.reducer;
