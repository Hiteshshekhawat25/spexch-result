// Store/Slice/activityLogSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [
    {
      loginDateTime: '2024-12-20 10:30 AM',
      loginStatus: 'Success',
      ipAddress: '192.168.1.1',
      isp: 'ISP Provider',
      location: 'New York, NY, USA',
    },
    {
      loginDateTime: '2024-12-19 9:45 PM',
      loginStatus: 'Failed',
      ipAddress: '192.168.1.2',
      isp: 'ISP Provider',
      location: 'Los Angeles, CA, USA',
    },
  ],
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    addLog: (state, action) => {
      state.logs.push(action.payload);
    },
  },
});

export const { addLog } = activityLogSlice.actions;
export const selectActivityLogs = (state) => state.activityLog.logs;
export default activityLogSlice.reducer;
