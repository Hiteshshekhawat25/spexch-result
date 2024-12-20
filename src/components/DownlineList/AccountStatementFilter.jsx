// AccountStatementFilter.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataSource,
  setFromDate,
  setToDate,
  selectAccountStatementFilter,
} from '../../Store/Slice/accountStatementFilterSlice'

const AccountStatementFilter = () => {
  const dispatch = useDispatch();
  const { dataSource, fromDate, toDate } = useSelector(selectAccountStatementFilter);

  const handleGetStatement = () => {
    // Logic to fetch account statement
    console.log("Fetching Account Statement with:", { dataSource, fromDate, toDate });
  };

  

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
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

      {/* Buttons */}
      <div className="flex space-x-2 items-center ml-auto">
        <button
          onClick={handleGetStatement}
          className="px-4 py-2 bg-gradient-blue text-white rounded-md text-sm"
        >
          Get Statement
        </button>
       
      </div>
    </div>
  );
};

export default AccountStatementFilter;
