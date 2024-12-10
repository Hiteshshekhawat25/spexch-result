import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Current logged-in user information
  roles: [], // List of roles in the system
  settings: {}, // Global application settings
  isLoading: false, // Global loading state
  error: null, // Global error state
};

const masterSlice = createSlice({
  name: 'master', // Slice name
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  setRoles,
  setSettings,
  setLoading,
  setError,
  clearError,
} = masterSlice.actions;

export default masterSlice.reducer;
