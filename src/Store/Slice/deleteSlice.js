
import { createSlice } from "@reduxjs/toolkit";

const deleteSlice = createSlice({
  name: "delete",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    deleteStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetDeleteState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
});

export const { deleteStart, deleteSuccess, deleteFailure, resetDeleteState } = deleteSlice.actions;

export default deleteSlice.reducer;
