import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataSource,
  setFromDate,
  setToDate,
  setFromTime,
  setToTime,
  selectEventPLFilter,
} from "../../Store/Slice/eventPLFilterSlice";

const EventPLFilter = () => {
  const dispatch = useDispatch();

  const { dataSource, fromDate, toDate, fromTime, toTime } =
    useSelector(selectEventPLFilter) || {};

  const handleGetPL = () => {
    console.log("Fetching Event P&L with:", {
      dataSource,
      fromDate,
      fromTime,
      toDate,
      toTime,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const calculateDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    switch (dataSource) {
      case "live":
        dispatch(setFromDate(today));
        dispatch(setToDate(today));
        break;
      case "backup":
        dispatch(setFromDate(calculateDate(3)));
        dispatch(setToDate(today));
        break;
      case "old":
        dispatch(setFromDate(calculateDate(12)));
        dispatch(setToDate(today));
        break;
      default:
        break;
    }
  }, [dataSource, dispatch, today]);

  return (
    <div className="flex space-x-4 items-center p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      {/* Data Source Dropdown */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">
          Data Source
        </label>
        <select
          value={dataSource}
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="border rounded px-10 py-2 "
        >
          <option value="">Data Source</option>
          <option value="live">LIVE DATA</option>
          <option value="backup">BACKUP DATA</option>
          <option value="old">OLD DATA</option>
        </select>
      </div>

      {/* From Date Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* From Time Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Time</label>
        <input
          type="time"
          value={fromTime || "00:00"}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* To Date Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* To Time Input */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Time</label>
        <input
          type="time"
          value={toTime || "23:59"}
          onChange={(e) => dispatch(setToTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 items-center ml-50% mt-5">
        <button
          onClick={handleGetPL}
          className="px-4 py-2 bg-darkgray text-white rounded-md text-sm"
        >
          Get P & L
        </button>
      </div>
    </div>
  );
};

export default EventPLFilter;
