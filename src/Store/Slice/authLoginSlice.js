// src/slices/authSlice.js
// src/Store/Slice/authLoginSlice.js
// src/Store/Slice/authLoginSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  username: "",
  token: null,
};

const authLoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = authLoginSlice.actions;
export default authLoginSlice.reducer;
