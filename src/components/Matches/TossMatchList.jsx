import React from 'react';

const TossMatchList = () => {
  return (
    <div className="w-full p-4">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Toss Match List</h2>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-2 p-4 bg-gray-200 rounded mb-6">
        {/* Small Input Box */}
        <input
          type="text"
          // placeholder="Enter search term"
          className="w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        {/* Search Button */}
        <button className="px-4 py-2 bg-lightGray text-black font-semibold rounded border border-gray-400 hover:bg-blue-600">
  Search
</button>

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

export default TossMatchList;
