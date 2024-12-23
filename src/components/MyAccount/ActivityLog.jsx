// ActivityLog.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectActivityLogs } from '../../Store/Slice/activityLogSlice';

const ActivityLog = () => {
  const logs = useSelector(selectActivityLogs);

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
                <td className="border border-gray-400 px-4 py-2">{log.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
