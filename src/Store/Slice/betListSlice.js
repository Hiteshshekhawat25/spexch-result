// betListSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const betListSlice = createSlice({
  name: 'betList',
  initialState,
  reducers: {
    setBetListData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBetListData, setLoading, setError } = betListSlice.actions;

export const selectBetListData = (state) => state.betList.data;
export const selectBetListLoading = (state) => state.betList.loading;
export const selectBetListError = (state) => state.betList.error;

export default betListSlice.reducer;
