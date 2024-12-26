import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setType, setSport, setFromDate, setToDate, selectBetListFilter } from '../../Store/Slice/betListFilterSlice';

const BetListFilter = () => {
  const dispatch = useDispatch();
  const { type, sport, fromDate, toDate } = useSelector(selectBetListFilter);

  // Function to fetch Bet History data
  const handleGetHistory = () => {
    console.log("Fetching Bet History with:", { type, sport, fromDate, toDate });
  };

  return (
    <div className="flex flex-wrap space-x-4 items-center mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
      {/* Choose Type Dropdown */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">Choose Type</label>
        <select
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        >
          <option value="">Select Type</option>
          <option value="type1">Type 1</option>
          <option value="type2">Type 2</option>
          <option value="type3">Type 3</option>
        </select>
      </div>

      {/* Choose Sport Dropdown */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">Choose Sport</label>
        <select
          value={sport}
          onChange={(e) => dispatch(setSport(e.target.value))}
          className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        >
          <option value="">Select Sport</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option>
        </select>
      </div>

      {/* From Date Input */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        />
      </div>

      {/* To Date Input */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 items-center sm:ml-auto w-full sm:w-auto">
        <button
          onClick={handleGetHistory}
          className="px-4 py-2 bg-darkgray text-white rounded-md text-sm w-full sm:w-auto"
        >
          Get History
        </button>
      </div>
    </div>
  );
};

export default BetListFilter;
