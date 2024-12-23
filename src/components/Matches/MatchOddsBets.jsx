import React from 'react';
import { ImBook } from 'react-icons/im';

const MatchOddsBets = () => {
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Match Odds Bets
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section */}
      <div className="flex items-center gap-4 mb-4">
        {/* Delete Button */}
        <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600">
          Delete All Odds Bets
        </button>

        {/* Input Box */}
        <input
          type="text"
          placeholder="Enter search term"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Find Button */}
        <button className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600">
          Find
        </button>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-gray-300" />
    </div>
  );
};

export default MatchOddsBets;
