import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Profile Information
  name: "",
  commission: "",
  rollingCommission: {
    fancy: 0,
    matka: 0,
    casino: 0,
    binary: 10,
    bookmaker: 0,
    sportbook: 0,
  },
  agentRollingCommission: {
    username: "",
    commissionRates: {
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      bookmaker: 0,
      sportbook: 0,
    },
  },
  currency: "",
  partnership: "",
  mobileNumber: "",
  password: "",

  // Status and Error Handling
  status: "idle", // Status to manage loading, success, error
  error: null, // For storing errors

  // Change Password
  changePasswordStatus: "idle", // Status to manage change password process
  changePasswordError: null, // For storing errors related to password change
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Action to update the main profile data
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
        status: "succeeded",
        error: null,
      };
    },

    // Action to set the profile loading state
    setProfileLoading: (state) => {
      state.status = "loading";
    },

    // Action to set the profile error state
    setProfileError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    // Action to update the rolling commission rates
    setRollingCommission: (state, action) => {
      state.rollingCommission = action.payload;
    },

    // Action to update the agent's rolling commission rates
    setAgentRollingCommission: (state, action) => {
      const { username, commissionRates } = action.payload;
      state.agentRollingCommission.username = username;
      state.agentRollingCommission.commissionRates = commissionRates;
    },

    // Action to clear the agent's rolling commission data
    clearAgentRollingCommission: (state) => {
      state.agentRollingCommission = initialState.agentRollingCommission;
    },

    // Change Password Actions
    setChangePasswordLoading: (state) => {
      state.changePasswordStatus = "loading";
      state.changePasswordError = null;
    },

    setChangePasswordSuccess: (state) => {
      state.changePasswordStatus = "succeeded";
      state.changePasswordError = null;
    },

    setChangePasswordError: (state, action) => {
      state.changePasswordStatus = "failed";
      state.changePasswordError = action.payload;
    },
  },
});

// Export actions for use in components
export const {
  updateProfile,
  setProfileLoading,
  setProfileError,
  setRollingCommission,
  setAgentRollingCommission,
  clearAgentRollingCommission,
  setChangePasswordLoading,
  setChangePasswordSuccess,
  setChangePasswordError,
} = profileSlice.actions;

// Selectors to access specific parts of the state
export const selectProfileData = (state) => state.profile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;
export const selectRollingCommissionData = (state) => state.profile.rollingCommission;
export const selectAgentRollingCommission = (state) => state.profile.agentRollingCommission;

// Change Password Selectors
export const selectChangePasswordStatus = (state) => state.profile.changePasswordStatus;
export const selectChangePasswordError = (state) => state.profile.changePasswordError;

export default profileSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   // Profile Information
//   name: "",
//   commission: "",
//   rollingCommission: {
//     fancy: 0,
//     matka: 0,
//     casino: 0,
//     binary: 10,
//     bookmaker: 0,
//     sportbook: 0,
//   },
//   agentRollingCommission: {
//     username: "",
//     commissionRates: {
//       fancy: 0,
//       matka: 0,
//       casino: 0,
//       binary: 0,
//       bookmaker: 0,
//       sportbook: 0,
//     },
//   },
//   currency: "",
//   partnership: "",
//   mobileNumber: "",
//   password: "",

//   // Status and Error Handling
//   status: "idle", // Status to manage loading, success, error
//   error: null, // For storing errors
// };

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     // Action to update the main profile data
//     updateProfile: (state, action) => {
//       // Merge the profile payload into the state and set status to 'succeeded'
//       return {
//         ...state,
//         ...action.payload,
//         status: "succeeded", // Mark status as succeeded
//         error: null, // Clear any previous errors
//       };
//     },

//     // Action to set the profile loading state
//     setProfileLoading: (state) => {
//       state.status = "loading";
//     },

//     // Action to set the profile error state
//     setProfileError: (state, action) => {
//       state.status = "failed";
//       state.error = action.payload;
//     },

//     // Action to update the rolling commission rates
//     setRollingCommission: (state, action) => {
//       state.rollingCommission = action.payload;
//     },

//     // Action to update the agent's rolling commission rates
//     setAgentRollingCommission: (state, action) => {
//       const { username, commissionRates } = action.payload;
//       state.agentRollingCommission.username = username;
//       state.agentRollingCommission.commissionRates = commissionRates;
//     },

//     // Action to clear the agent's rolling commission data
//     clearAgentRollingCommission: (state) => {
//       state.agentRollingCommission = initialState.agentRollingCommission;
//     },
//   },
// });

// // Export actions for use in components
// export const {
//   updateProfile,
//   setProfileLoading,
//   setProfileError,
//   setRollingCommission,
//   setAgentRollingCommission,
//   clearAgentRollingCommission,
// } = profileSlice.actions;

// // Selectors to access specific parts of the state
// export const selectProfileData = (state) => state.profile;
// export const selectProfileStatus = (state) => state.profile.status;
// export const selectProfileError = (state) => state.profile.error;
// export const selectRollingCommissionData = (state) => state.profile.rollingCommission;
// export const selectAgentRollingCommission = (state) => state.profile.agentRollingCommission;

// export default profileSlice.reducer;
