// Store/Slice/accountStatementSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const accountStatementSlice = createSlice({
  name: 'accountStatement',
  initialState,
  reducers: {
    setAccountStatementData: (state, action) => {
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

export const {
  setAccountStatementData,
  setLoading,
  setError,
} = accountStatementSlice.actions;

export const selectAccountStatementData = (state) => state.accountStatement.data;
export const selectAccountStatementLoading = (state) => state.accountStatement.loading;
export const selectAccountStatementError = (state) => state.accountStatement.error;

export default accountStatementSlice.reducer;
