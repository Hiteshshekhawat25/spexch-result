import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [], // Stores logs for the current page
  totalRecords: 0, // Total number of logs available
  totalPages: 0, // Total number of pages available
  status: 'idle', // Tracks the API request status
  error: null, // Stores error messages if any
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    // Updates logs and metadata when API call succeeds
    setActivityLogs: (state, action) => {
      state.logs = action.payload.logs; // Logs for the current page
      state.totalRecords = action.payload.totalRecords; // Total logs
      state.totalPages = action.payload.totalPages; // Total pages
      state.status = 'succeeded'; // Marks status as succeeded
    },

    // Marks status as loading during API call
    setActivityLogsLoading: (state) => {
      state.status = 'loading';
    },

    // Handles errors in API call
    setActivityLogsError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload; // Stores error message
    },

    // Optionally adds a single log entry
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

// Selectors for accessing slice state
export const selectActivityLogs = (state) => state.activityLog.logs;
export const selectActivityLogsStatus = (state) => state.activityLog.status;
export const selectActivityLogsError = (state) => state.activityLog.error;
export const selectTotalRecords = (state) => state.activityLog.totalRecords;
export const selectTotalPages = (state) => state.activityLog.totalPages;

export default activityLogSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   logs: [], 
//   status: 'idle', 
//   error: null, 
// };

// const activityLogSlice = createSlice({
//   name: 'activityLog',
//   initialState,
//   reducers: {
    
//     setActivityLogs: (state, action) => {
//       state.logs = action.payload; 
//       state.status = 'succeeded'; 
//     },

    
//     setActivityLogsLoading: (state) => {
//       state.status = 'loading';
//     },

   
//     setActivityLogsError: (state, action) => {
//       state.status = 'failed';
//       state.error = action.payload; 
//     },

    
//     addLog: (state, action) => {
//       state.logs.push(action.payload);
//     },
//   },
// });


// export const {
//   setActivityLogs,
//   setActivityLogsLoading,
//   setActivityLogsError,
//   addLog,
// } = activityLogSlice.actions;

// // Export the selector to select the logs from the store
// export const selectActivityLogs = (state) => state.activityLog.logs;
// export const selectActivityLogsStatus = (state) => state.activityLog.status;
// export const selectActivityLogsError = (state) => state.activityLog.error;

// export default activityLogSlice.reducer;
