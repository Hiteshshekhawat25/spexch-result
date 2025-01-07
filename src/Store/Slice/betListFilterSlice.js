import { createSlice } from '@reduxjs/toolkit';

// Get the current date in 'YYYY-MM-DD' format
const currentDate = new Date().toISOString().split('T')[0];

const initialState = {
  type: '',
  sport: '',
  fromDate: currentDate,  // Set current date as the default fromDate
  toDate: currentDate,    // Set current date as the default toDate
};

const betListFilterSlice = createSlice({
  name: 'betListFilter',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSport: (state, action) => {
      state.sport = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    resetBetFilters: (state) => {
      state.type = '';
      state.sport = '';
      state.fromDate = currentDate; // Reset to current date
      state.toDate = currentDate;   // Reset to current date
    },
  },
});

export const { setType, setSport, setFromDate, setToDate, resetBetFilters } = betListFilterSlice.actions;

export const selectBetListFilter = (state) => state.betListFilter;

export default betListFilterSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   type: '',
//   sport: '',
//   fromDate: '',
//   toDate: '',
// };

// const betListFilterSlice = createSlice({
//   name: 'betListFilter',
//   initialState,
//   reducers: {
//     setType: (state, action) => {
//       state.type = action.payload;
//     },
//     setSport: (state, action) => {
//       state.sport = action.payload;
//     },
//     setFromDate: (state, action) => {
//       state.fromDate = action.payload;
//     },
//     setToDate: (state, action) => {
//       state.toDate = action.payload;
//     },
//     resetBetFilters: (state) => {
//       state.type = '';
//       state.sport = '';
//       state.fromDate = '';
//       state.toDate = '';
//     },
//   },
// });

// export const { setType, setSport, setFromDate, setToDate, resetBetFilters } = betListFilterSlice.actions;

// export const selectBetListFilter = (state) => state.betListFilter;

// export default betListFilterSlice.reducer;
