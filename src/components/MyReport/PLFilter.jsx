import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDataSource, setFromDate, setToDate, setFromTime, setToTime, resetFilters, selectPLFilter } from '../../Store/Slice/plFilterSlice';

const PLFilter = () => {
  const dispatch = useDispatch();
  const { dataSource, fromDate, toDate, fromTime, toTime } = useSelector(selectPLFilter);

  // Function to fetch Profit and Loss data
  const handleGetPL = () => {
    // This is where you would trigger the API or data fetch for Profit & Loss
    console.log("Fetching P&L with:", { dataSource, fromDate, fromTime, toDate, toTime });
  };

  // Function to reset the filters
  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="flex space-x-4 items-center p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      {/* Data Source Dropdown */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Data Source</label>
        <select
          value={dataSource}
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Select Data Source</option>
          <option value="api1">API 1</option>
          <option value="api2">API 2</option>
          <option value="api3">API 3</option>
        </select>
      </div>

      {/* From Date Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* From Time Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Time</label>
        <input
          type="time"
          value={fromTime}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* To Date Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* To Time Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Time</label>
        <input
          type="time"
          value={toTime}
          onChange={(e) => dispatch(setToTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 items-center ml-auto">
        <button
          onClick={handleGetPL}
          className="px-4 py-2 bg-darkgray text-white rounded-md text-sm"
        >
          Get P & L
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gradient-blue text-white rounded-md text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PLFilter;
