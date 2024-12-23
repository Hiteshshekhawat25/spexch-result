// editMatchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oddsMessage: '',
  sessionMessage: '',
  eventId: '',
  bookmakerMessage: '',
  tossMessage: '',
  marketId: '',
};

const editMatchSlice = createSlice({
  name: 'editMatch',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = editMatchSlice.actions;
export default editMatchSlice.reducer;
