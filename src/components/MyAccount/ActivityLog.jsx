// // ActivityLog.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectActivityLogs, setActivityLogs, setActivityLogsLoading, setActivityLogsError } from '../../Store/Slice/activityLogSlice';
 // Adjust import path if necessary
import { getUserData } from '../../Services/Downlinelistapi';

const ActivityLog = () => {
  const dispatch = useDispatch();
  const logs = useSelector(selectActivityLogs);
  const activityLogsStatus = useSelector(state => state.activityLog.status); // Assuming you have a status in your slice
  const activityLogsError = useSelector(state => state.activityLog.error); // Assuming you have an error in your slice

  let userData = JSON.parse(localStorage.getItem('userData'));
  const userId = userData?.data?._id;

  useEffect(() => {
    if (activityLogsStatus === 'idle' && userId) {
      console.log('Setting activity logs to loading...');
      dispatch(setActivityLogsLoading());

      const fetchActivityLogs = async () => {
        try {
          const response = await getUserData(`user/login-activity/${userId}?page=2&limit=3`);
          console.log('API Response:', response.data);
          dispatch(setActivityLogs(response.data.data));
        } catch (error) {
          console.error('Fetch Activity Logs Error:', error);
          dispatch(setActivityLogsError(error.message || 'Failed to fetch activity logs'));
        }
      };

      fetchActivityLogs();
    }
  }, [activityLogsStatus, dispatch, userId]);

  // Handle loading and error states
  if (activityLogsStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (activityLogsStatus === 'failed') {
    return <div>Error: {activityLogsError}</div>;
  }

  return (
    <div className="border border-gray-400 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-blue text-white py-3 px-4 rounded-t-lg">
        <h1 className="text-xl font-semibold">Activity Log</h1>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2 text-left">Login Date & Time</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Login Status</th>
              <th className="border border-gray-400 px-4 py-2 text-left">IP Address</th>
              <th className="border border-gray-400 px-4 py-2 text-left">ISP</th>
              <th className="border border-gray-400 px-4 py-2 text-left">City/State/Country</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-400 px-4 py-2">{log.loginDateTime}</td>
                <td className="border border-gray-400 px-4 py-2">{log.loginStatus}</td>
                <td className="border border-gray-400 px-4 py-2">{log.ipAddress}</td>
                <td className="border border-gray-400 px-4 py-2">{log.isp}</td>
                <td className="border border-gray-400 px-4 py-2">{log.city}/{log.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;

