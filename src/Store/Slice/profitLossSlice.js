import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    { username: 'KRISH', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
    { username: 'RINKU8', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
    { username: 'RINKUMASTER1', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
    { username: 'RINKUMASTER2', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
    { username: 'RINKUUSER1', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
  ],
  loading: false,
  error: null,
};

const profitLossSlice = createSlice({
  name: 'profitLoss',
  initialState,
  reducers: {
    setProfitLossData: (state, action) => {
      state.data = action.payload;
    },

      
    setEventLoading: (state) => {
      state.status = "loading"; 
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProfitLossData, setEventLoading, setError } = profitLossSlice.actions;

export const selectProfitLossData = (state) => state.profitLoss.data;
export const selectProfitLossLoading = (state) => state.profitLoss.loading;
export const selectProfitLossError = (state) => state.profitLoss.error;

export default profitLossSlice.reducer;
