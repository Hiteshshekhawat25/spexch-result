// src/redux/downlineSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
  startFetchData : false
};

const downlineSlice = createSlice({
  name: 'downline',
  initialState,
  reducers: {
    setDownlineData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStartFetchData : (state) => {
      state.startFetchData = true
    }
  },
});

export const { setDownlineData, setLoading, setError , setStartFetchData} = downlineSlice.actions;

export const selectDownlineData = (state) => state.downline.data;
export const selectDownlineLoading = (state) => state.downline.loading;
export const selectDownlineError = (state) => state.downline.error;

export default downlineSlice.reducer;
