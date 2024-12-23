import React from 'react';
import { ImBook } from 'react-icons/im';

const SessionResult = () => {
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Session Results
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section with Select Match, Select Session, and Result */}
      <div className="flex gap-6 mb-4">
        {/* Select Match Dropdown */}
        <div className="w-1/4">
          <label htmlFor="match" className="block text-md font-bold text-gray-700 mb-1 text-left">
            Select Match
          </label>
          <select
            id="match"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          >
            <option value="">Select Match</option>
            <option value="match1">Match 1</option>
            <option value="match2">Match 2</option>
            <option value="match3">Match 3</option>
          </select>
        </div>

        {/* Select Session Dropdown */}
        <div className="w-1/4">
          <label htmlFor="session" className="block text-md font-bold text-gray-700 mb-1 text-left">
            Select Session
          </label>
          <select
            id="session"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          >
            <option value="">Select Session</option>
            <option value="session1">Session 1</option>
            <option value="session2">Session 2</option>
            <option value="session3">Session 3</option>
          </select>
        </div>

        {/* Result Input and Submit Button */}
        <div className="w-2/4 flex items-end gap-4">
          <div className="w-1/2">
            <label htmlFor="result" className="block text-md font-bold text-gray-700 mb-1 text-left">
              Result
            </label>
            <input
              id="result"
              type="text"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            />
          </div>
          <button className="px-4 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>

      {/* Row Section with Search */}
      <div className="flex gap-6 mb-4 w-1/2">
        {/* Input Box */}
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          />
        </div>

        {/* Search Button */}
        <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">
          Search
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Session Name</th>
              <th className="px-4 py-2 text-left">Result</th>
              <th className="px-4 py-2 text-left">Edit/Update</th>
              <th className="px-4 py-2 text-left">Session ID</th>
              <th className="px-4 py-2 text-left">Coin Transferred</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Session Book</th>
              <th className="px-4 py-2 text-left">Transfer Coins</th>
              <th className="px-4 py-2 text-left">Coin Log</th>
              <th className="px-4 py-2 text-left">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Session 1</td>
              <td className="px-4 py-2">Result 1</td>
              <td className="px-4 py-2">Edit</td>
              <td className="px-4 py-2">123</td>
              <td className="px-4 py-2">500</td>
              <td className="px-4 py-2">2024-12-19</td>
              <td className="px-4 py-2">Book 1</td>
              <td className="px-4 py-2">100</td>
              <td className="px-4 py-2">Log 1</td>
              <td className="px-4 py-2">Passed</td>
            </tr>
            {/* Add more rows as necessary */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionResult;
