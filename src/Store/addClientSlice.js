import { createSlice } from "@reduxjs/toolkit";
import { saveClientApi } from "../Utils/LoginApi"; // Import the API function

const addClientSlice = createSlice({
  name: "client",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    saveClientStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveClientSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    saveClientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    closeDialog: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  saveClientStart,
  saveClientSuccess,
  saveClientFailure,
  closeDialog,
} = addClientSlice.actions;
