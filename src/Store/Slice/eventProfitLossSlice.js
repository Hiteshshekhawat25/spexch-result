import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Event Profit and Loss Information
  sportName: "", // Sport name like Football, Basketball, etc.
  uplineProfitLoss: 0, // Upline profit or loss
  downlineProfitLoss: 0, // Downline profit or loss
  commission: 0, // Commission related to the sport

  // Status and Error Handling
  status: "idle", // Status to manage loading, success, error
  error: null, // For storing errors
};

const eventProfitLossSlice = createSlice({
  name: "eventProfitLoss",
  initialState,
  reducers: {
    // Action to update event profit/loss data
    updateEventProfitLoss: (state, action) => {
      return {
        ...state,
        ...action.payload,
        status: "succeeded",
        error: null,
      };
    },

    // Action to set the event loading state
    setEventLoading: (state) => {
      state.status = "loading"; // Correct status value for loading state
    },

    setStatus: (state, action) => {
      state.status = action.payload; 
    },

    // Action to set the event error state
    setEventError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    // Action to update the upline profit/loss
    setUplineProfitLoss: (state, action) => {
      state.uplineProfitLoss = action.payload;
    },

    // Action to update the downline profit/loss
    setDownlineProfitLoss: (state, action) => {
      state.downlineProfitLoss = action.payload;
    },

    // Action to update the commission
    setCommission: (state, action) => {
      state.commission = action.payload;
    },
  },
});

// Export actions for use in components
export const {
  updateEventProfitLoss,
  setEventLoading,
  setEventError,
  setUplineProfitLoss,
  setDownlineProfitLoss,
  setCommission,
} = eventProfitLossSlice.actions;

// Selectors to access specific parts of the state
export const selectEventProfitLossData = (state) => state.eventProfitLoss;
export const selectEventStatus = (state) => state.eventProfitLoss.status;
export const selectEventError = (state) => state.eventProfitLoss.error;
export const selectUplineProfitLoss = (state) => state.eventProfitLoss.uplineProfitLoss;
export const selectDownlineProfitLoss = (state) => state.eventProfitLoss.downlineProfitLoss;
export const selectCommission = (state) => state.eventProfitLoss.commission;

export default eventProfitLossSlice.reducer;
