import React from 'react';

const AllSessionList = () => {
  return (
    <div className="p-6">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">All Session List</h2>
      </div>


      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2">Session ID</th>
              <th className="px-4 py-2">Session Name</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row - Replace with dynamic data */}
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Match 1</td>
              <td className="px-4 py-2">2024-12-20</td>
              <td className="px-4 py-2">2024-12-20</td>
              <td className="px-4 py-2">
                <button className="py-1 px-3 rounded-full text-white bg-green-500">
                  Active
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">2</td>
              <td className="px-4 py-2">Match 2</td>
              <td className="px-4 py-2">2024-12-21</td>
              <td className="px-4 py-2">2024-12-21</td>
              <td className="px-4 py-2">
                <button className="py-1 px-3 rounded-full text-white bg-red-500">
                  Inactive
                </button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSessionList;
