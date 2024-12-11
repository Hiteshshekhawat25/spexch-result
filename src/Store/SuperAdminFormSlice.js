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
  casinoDelay: "", 
  casinoMinStake: "",
  casinoMaxStake: "",
  casinoMaxProfit: "",
  oddsBetSlips: "",
  bookmarkerBetSlips: "",
  sessionBetSlips: "", 
  tossBetSlips: "",
  casinoBetSlips: "",
};

const superAdminFormSlice = createSlice({
  name: "superAdminForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = superAdminFormSlice.actions;
export default superAdminFormSlice.reducer;
