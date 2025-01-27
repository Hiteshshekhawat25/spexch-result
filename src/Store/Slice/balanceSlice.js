import { createSlice } from '@reduxjs/toolkit';

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    totalBalance: 0,
    totalExposure: 0,
    availableBalance: 0,
    balance: 0,
    uplinePL: 0, // Assuming this is 0 initially
    totalavailbalance: 0,
    availableBalanceUpdated: 0,
  },
  reducers: {
    setBalanceData: (state, action) => {
      // Helper function to format the currency
      const formatBalance = (value) => (value ? parseFloat(value).toFixed(2) : '0.00');

      state.totalBalance = formatBalance(action.payload.totalBalance);
      state.totalExposure = formatBalance(action.payload.totalExposure);
      state.availableBalance = formatBalance(action.payload.allAvailableBalance); // Update this based on your API
      state.balance = formatBalance(action.payload.allAvailableBalance);
      state.uplinePL = formatBalance(action.payload.uplineProfitLoss); // Assuming uplinePL is not part of API response, set it as '0.00'
      state.totalavailbalance = formatBalance(action.payload.totalAvailableBalance);
      // state.availableBalanceUpdated = formatBalance(action.payload.totalAvailableBalance); // Assuming this uses the same field
    },
  },
});

export const { setBalanceData } = balanceSlice.actions;
export default balanceSlice.reducer;
