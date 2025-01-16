import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fancy: 0,
  matka: 0,
  casino: 0,
  binary: 0,
  sportbook: 0,
  bookmaker: 0,
  password: "", // Add password to the state
};

const editRollingCommissionSlice = createSlice({
  name: "editRollingCommission",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value; // Update specific field
    },
    resetForm: () => initialState, // Reset the form to initial state
    setFormData: (state, action) => {
      return { ...state, ...action.payload }; // Set multiple fields at once
    },
  },
});

export const { updateField, resetForm, setFormData } = editRollingCommissionSlice.actions;
export default editRollingCommissionSlice.reducer;
