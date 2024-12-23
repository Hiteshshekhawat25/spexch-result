import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchUserDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDataSuccess: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    },
    fetchUserDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchUserDataStart,
  fetchUserDataSuccess,
  fetchUserDataFailure,
  clearUserData,
} = userSlice.actions;
export default userSlice.reducer;