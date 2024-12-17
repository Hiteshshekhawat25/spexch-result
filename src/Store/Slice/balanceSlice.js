import { createSlice } from '@reduxjs/toolkit';

const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    totalBalance: 'IRP 0',
    totalExposure: 'IRP 0',
    availableBalance: 'IRP 0',
    balance: 'IRP 0',
    uplinePL: 'IRP 0',
    totalavailbalance: 'IRP 0',
    availableBalanceUpdated: 'IRP 0',
  },
  reducers: {
    setBalanceData: (state, action) => {
      // Transform API response to match UI state and round values to two decimal places
      const formatBalance = (value) => (value ? `IRP ${parseFloat(value).toFixed(2)}` : 'IRP 0');

      state.totalBalance = formatBalance(action.payload.totalBalance);
      state.totalExposure = formatBalance(action.payload.totalExposure);
      state.availableBalance = formatBalance(action.payload.totalProfitLoss);
      state.balance = formatBalance(action.payload.allAvailableBalance);
      state.uplinePL = 'IRP 0'; // Assuming uplinePL is not in API response
      state.totalavailbalance = formatBalance(action.payload.totalAvailableBalance);
      state.availableBalanceUpdated = formatBalance(action.payload.totalAvailableBalance); // Assuming this uses the same field
    },
  },
});

export const { setBalanceData } = balanceSlice.actions;
export default balanceSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const balanceSlice = createSlice({
//   name: 'balance',
//   initialState: {
//     totalBalance: 'IRP 0',
//     totalExposure: 'IRP 0',
//     availableBalance: 'IRP 0',
//     balance: 'IRP 0',
//     uplinePL: 'IRP 0',
//     totalavailbalance: 'IRP 0',
//     availableBalanceUpdated: 'IRP 0',
//   },
//   reducers: {
//     setBalanceData: (state, action) => {
//       // Transform API response to match UI state
//       state.totalBalance = `IRP ${action.payload.totalBalance}`;
//       state.totalExposure = `IRP ${action.payload.totalExposure}`;
//       state.availableBalance = `IRP ${action.payload.totalProfitLoss}`;
//       state.balance = `IRP ${action.payload.allAvailableBalance}`;
//       state.uplinePL = `IRP 0`; // Assuming uplinePL is not in API response
//       state.totalavailbalance = `IRP ${action.payload.totalAvailableBalance}`;
//       state.availableBalanceUpdated = `IRP ${action.payload.totalAvailableBalance}`; // Assuming this uses the same field
//     },
//   },
// });

// export const { setBalanceData } = balanceSlice.actions;
// export default balanceSlice.reducer;

