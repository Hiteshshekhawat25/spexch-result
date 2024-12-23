import React from 'react';
import { ImBook } from 'react-icons/im';

const SessionPreBook = () => {
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Session Pre-Book
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section with Select Match and Select Session */}
      <div className="flex gap-6 mb-4 w-1/2">
        {/* Select Match Dropdown */}
        <div className="w-full">
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
        <div className="w-full">
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
      </div>
    </div>
  );
};

export default SessionPreBook;
