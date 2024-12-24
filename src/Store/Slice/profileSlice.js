import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  commission: '',
  rollingCommission: '',
  agentRollingCommission: '',
  currency: '',
  partnership: '',
  mobileNumber: '',
  password: '',
  status: 'idle', // Status to manage loading, success, error
  error: null,    // For storing errors
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      // Merge payload into the state and set status to 'succeeded'
      return { 
        ...state, 
        ...action.payload, 
        status: 'succeeded', // Mark status as succeeded
        error: null // Clear any previous errors
      };
    },
    setProfileLoading: (state) => {
      // Set status to loading
      state.status = 'loading';
    },
    setProfileError: (state, action) => {
      // Set status to failed and store the error message
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { updateProfile, setProfileLoading, setProfileError } = profileSlice.actions;

// Selectors to access specific parts of the state
export const selectProfileData = (state) => state.profile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;


