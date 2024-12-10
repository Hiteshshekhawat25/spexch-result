import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDialogOpen: false,
  clientData: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isDialogOpen = true;
    },
    closeDialog: (state) => {
      state.isDialogOpen = false;
    },
    saveClient: (state, action) => {
      state.clientData = action.payload;
    },
  },
});

export const { openDialog, closeDialog, saveClient } = clientSlice.actions;
export default clientSlice.reducer;
