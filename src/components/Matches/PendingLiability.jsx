import React from 'react';
import { FaRegMoneyBillAlt } from 'react-icons/fa';

const PendingLiability = () => {
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <FaRegMoneyBillAlt />
          Pending Liability
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Market Type Section */}
      <div className="text-center mb-4">
        <p className="mb-2 font-medium">Select Market Type</p>
        <div className="flex justify-center items-center gap-4">
          {/* Dropdown */}
          <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300">
            <option value="">Select Option</option>
            <option value="market1">Market Type 1</option>
            <option value="market2">Market Type 2</option>
            <option value="market3">Market Type 3</option>
          </select>

          {/* Button */}
          <button className="px-6 py-2 bg-gray-200 text-black font-semibold rounded hover:bg-gray-300">
            Find
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-2 text-left">Column 1</th>
              <th className="px-4 py-2 text-left">Column 2</th>
              <th className="px-4 py-2 text-left">Column 3</th>
              <th className="px-4 py-2 text-left">Column 4</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            <tr className="border-t border-gray-300">
              <td className="px-4 py-2">Row 1 Data 1</td>
              <td className="px-4 py-2">Row 1 Data 2</td>
              <td className="px-4 py-2">Row 1 Data 3</td>
              <td className="px-4 py-2">Row 1 Data 4</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="px-4 py-2">Row 2 Data 1</td>
              <td className="px-4 py-2">Row 2 Data 2</td>
              <td className="px-4 py-2">Row 2 Data 3</td>
              <td className="px-4 py-2">Row 2 Data 4</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="px-4 py-2">Row 3 Data 1</td>
              <td className="px-4 py-2">Row 3 Data 2</td>
              <td className="px-4 py-2">Row 3 Data 3</td>
              <td className="px-4 py-2">Row 3 Data 4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingLiability;
