import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataSource: '',
  fromDate: '',   // From Date
  fromTime: '',   // From Time
  toDate: '',     // To Date
  toTime: '',     // To Time
};

const eventPLFilterSlice = createSlice({
  name: 'eventPLFilter',
  initialState,
  reducers: {
    setDataSource: (state, action) => {
      state.dataSource = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setFromTime: (state, action) => {
      state.fromTime = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setToTime: (state, action) => {
      state.toTime = action.payload;
    },
    resetFilters: (state) => {
      // Optional: Keep reset logic here for consistency, even if not used in EventPLFilter.
      state.dataSource = '';
      state.fromDate = '';
      state.fromTime = '';
      state.toDate = '';
      state.toTime = '';
    },
  },
});

export const { setDataSource, setFromDate, setFromTime, setToDate, setToTime, resetFilters } = eventPLFilterSlice.actions;

export const selectEventPLFilter = (state) => state.eventPLFilter;

export default eventPLFilterSlice.reducer;
