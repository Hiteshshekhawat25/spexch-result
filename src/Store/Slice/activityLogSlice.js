import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [], 
  status: 'idle', 
  error: null, 
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    
    setActivityLogs: (state, action) => {
      state.logs = action.payload; 
      state.status = 'succeeded'; 
    },

    
    setActivityLogsLoading: (state) => {
      state.status = 'loading';
    },

   
    setActivityLogsError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload; 
    },

    
    addLog: (state, action) => {
      state.logs.push(action.payload);
    },
  },
});


export const {
  setActivityLogs,
  setActivityLogsLoading,
  setActivityLogsError,
  addLog,
} = activityLogSlice.actions;

// Export the selector to select the logs from the store
export const selectActivityLogs = (state) => state.activityLog.logs;
export const selectActivityLogsStatus = (state) => state.activityLog.status;
export const selectActivityLogsError = (state) => state.activityLog.error;

export default activityLogSlice.reducer;
