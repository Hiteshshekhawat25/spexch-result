import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataSource,
  setFromDate,
  setToDate,
  setFromTime,
  setToTime,
  resetFilters,
  selectPLFilter,
} from '../../Store/Slice/plFilterSlice';
import { getProfitLossData } from '../../Services/Downlinelistapi'; // Import your API function

const PLFilter = ({
  setPLData, 
  setTotalTransactions, 
  setTotalPages, 
  setIsDataFetched, 
  entriesToShow, 
  currentPage, 
  setCurrentPage, 
}) => {
  const dispatch = useDispatch();
  const { dataSource, fromDate, toDate, fromTime, toTime } = useSelector(selectPLFilter);

  // Reset page to 1 when entriesToShow changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesToShow, setCurrentPage]);

  // Fetch P&L data when filters or pagination change
  useEffect(() => {
    if (fromDate && toDate) {
      console.log('Fetching P&L data due to filter or page change');
      handleGetPL();
    }
  }, [currentPage, fromDate, toDate, fromTime, toTime, dataSource, entriesToShow]);

  const handleGetPL = async () => {
       try {
      const url = `user/get-profit-loss?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate || '' }&toDate=${toDate || ''}&fromTime=${fromTime || ''}&toTime=${toTime || ''}&dataSource=${dataSource || ''}`;
      console.log('Fetching data with URL:', url);

      const response = await getProfitLossData(url);
      console.log(response)

      if (response && response.data) {
        const { pagination, data } = response.data;

        setPLData(data); // Update parent state with fetched data
        setTotalTransactions(pagination?.
          totalRecords
           || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true); // Mark data as fetched
      } else {
        console.error('No data found in response');
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error('Error fetching P&L data:', error);
      setIsDataFetched(false);
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setPLData([]); // Clear parent data on reset
    setTotalTransactions(0);
    setTotalPages(1);
    setIsDataFetched(false);
    setCurrentPage(1); // Reset to page 1
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

      {/* Date and Time Filters */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Time</label>
        <input
          type="time"
          value={fromTime}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Time</label>
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

