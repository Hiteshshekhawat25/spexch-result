// Store/Slice/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'John Doe',
  commission: 5,
  rollingCommission: 10,
  agentRollingCommission: 15,
  currency: 'USD',
  partnership: 'Standard',
  mobileNumber: '123-456-7890',
  password: '******',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile } = profileSlice.actions;
export const selectProfileData = (state) => state.profile;
export default profileSlice.reducer;
