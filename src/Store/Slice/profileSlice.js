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
      return { ...state, ...action.payload };
    },
    setProfileLoading: (state) => {
      state.status = 'loading';
    },
    setProfileError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { updateProfile, setProfileLoading, setProfileError } = profileSlice.actions;
export const selectProfileData = (state) => state.profile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;

// // Store/Slice/profileSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   name: 'John Doe',
//   commission: 5,
//   rollingCommission: 10,
//   agentRollingCommission: 15,
//   currency: 'USD',
//   partnership: 'Standard',
//   mobileNumber: '123-456-7890',
//   password: '******',
// };

// const profileSlice = createSlice({
//   name: 'profile',
//   initialState,
//   reducers: {
//     updateProfile: (state, action) => {
//       return { ...state, ...action.payload };
//     },
//   },
// });

// export const { updateProfile } = profileSlice.actions;
// export const selectProfileData = (state) => state.profile;
// export default profileSlice.reducer;
