import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  oddsDelay: "",
  oddsMinStake: "",
  oddsMaxStake: "",
  oddsMaxProfit: "",
  sessionDelay: "",
  sessionMinStake: "",
  sessionMaxStake: "",
  sessionMaxProfit: "",
  bookDelay: "",
  bookMinStake: "",
  bookMaxStake: "",
  bookMaxProfit: "",
  tossDelay: "",
  tossMinStake: "",
  tossMaxStake: "",
  tossMaxProfit: "",
};

const editStakeSlice = createSlice({
  name: "editStake",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetForm: () => initialState,
    setFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateField, resetForm, setFormData } = editStakeSlice.actions;
export default editStakeSlice.reducer;
