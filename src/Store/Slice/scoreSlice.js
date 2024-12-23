import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scoreId: "",
  team1: "",
  team2: "",
};

const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    updateScore: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetScore: () => initialState,
    setScoreData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateScore, resetScore, setScoreData } = scoreSlice.actions;
export default scoreSlice.reducer;
