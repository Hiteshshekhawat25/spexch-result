import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
  sportName: "", 
  uplineProfitLoss: 0, 
  downlineProfitLoss: 0, 
  commission: 0, 
  status: "idle", 
  error: null, 
};

const eventProfitLossSlice = createSlice({
  name: "eventProfitLoss",
  initialState,
  reducers: {
    
    updateEventProfitLoss: (state, action) => {
      return {
        ...state,
        ...action.payload,
        status: "succeeded",
        error: null,
      };
    },

    
    setEventLoading: (state) => {
      state.status = "loading"; 
    },

    setStatus: (state, action) => {
      state.status = action.payload; 
    },

    
    setEventError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    
    setUplineProfitLoss: (state, action) => {
      state.uplineProfitLoss = action.payload;
    },

    
    setDownlineProfitLoss: (state, action) => {
      state.downlineProfitLoss = action.payload;
    },

    
    setCommission: (state, action) => {
      state.commission = action.payload;
    },
  },
});


export const {
  updateEventProfitLoss,
  setEventLoading,
  setEventError,
  setUplineProfitLoss,
  setDownlineProfitLoss,
  setCommission,
} = eventProfitLossSlice.actions;


export const selectEventProfitLossData = (state) => state.eventProfitLoss;
export const selectEventStatus = (state) => state.eventProfitLoss.status;
export const selectEventError = (state) => state.eventProfitLoss.error;
export const selectUplineProfitLoss = (state) => state.eventProfitLoss.uplineProfitLoss;
export const selectDownlineProfitLoss = (state) => state.eventProfitLoss.downlineProfitLoss;
export const selectCommission = (state) => state.eventProfitLoss.commission;

export default eventProfitLossSlice.reducer;
