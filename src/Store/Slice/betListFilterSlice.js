import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: '',
  sport: '',
  fromDate: '',
  toDate: '',
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
      state.fromDate = '';
      state.toDate = '';
    },
  },
});

export const { setType, setSport, setFromDate, setToDate, resetBetFilters } = betListFilterSlice.actions;

export const selectBetListFilter = (state) => state.betListFilter;

export default betListFilterSlice.reducer;
