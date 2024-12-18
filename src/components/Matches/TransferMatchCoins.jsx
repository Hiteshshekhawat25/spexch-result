import React from 'react';
import { ImBook } from 'react-icons/im';

const TransferMatchCoins = () => {
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Transfer Match Coins
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Dropdown */}
        <div className="flex-1">
          <select className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300">
            <option value="">Select Option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Button */}
        <div className="mx-4">
          <button className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600">
            Declare Winner
          </button>
        </div>

        {/* Transfer Coins */}
        <div className="flex-1 text-right">
          <button className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-green-600">
            Transfer Coins
          </button>
        </div>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-gray-300" />
    </div>
  );
};

export default TransferMatchCoins;
