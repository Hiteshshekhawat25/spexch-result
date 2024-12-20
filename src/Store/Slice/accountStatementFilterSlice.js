// Store/Slice/accountStatementFilterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataSource: '',
  fromDate: '',
  toDate: '',
};

const accountStatementFilterSlice = createSlice({
  name: 'accountStatementFilter',
  initialState,
  reducers: {
    setDataSource: (state, action) => {
      state.dataSource = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    resetFilters: (state) => {
      state.dataSource = '';
      state.fromDate = '';
      state.toDate = '';
    },
  },
});

export const {
  setDataSource,
  setFromDate,
  setToDate,
  resetFilters,
} = accountStatementFilterSlice.actions;

export const selectAccountStatementFilter = (state) =>
  state.accountStatementFilter;

export default accountStatementFilterSlice.reducer;
