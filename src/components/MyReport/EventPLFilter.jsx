import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataSource,
  setFromDate,
  setToDate,
  setFromTime,
  setToTime,
   resetFilters,
  selectEventPLFilter,
} from "../../Store/Slice/eventPLFilterSlice";
import { getProfitLossData } from "../../Services/Downlinelistapi"; // Import your API function

const EventPLFilter = ({
  setPLData,
  setTotalTransactions,
  setTotalPages,
  setIsDataFetched,
  entriesToShow,
  currentPage,
  setCurrentPage,
}) => {
  const dispatch = useDispatch();

  const eventPLFilterState = useSelector((state) => state.eventPLFilter);
  console.log('Redux State for eventPLFilter:', eventPLFilterState);

  // Destructure properties from the state
  const { dataSource, fromDate, toDate, fromTime, toTime } = eventPLFilterState || {};

  // const { dataSource, fromDate, toDate, fromTime, toTime } =
  //   useSelector(selectEventPLFilter);

  // Reset page to 1 when entriesToShow changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesToShow, setCurrentPage]);

  // Fetch P&L data when filters or pagination change
  useEffect(() => {
    if (fromDate && toDate) {
      console.log("Fetching P&L data due to filter or page change");
      handleGetPL();
    }
  }, [
    currentPage,
    fromDate,
    toDate,
    fromTime,
    toTime,
    dataSource,
    entriesToShow,
  ]);

  const handleGetPL = async () => {
    try {
      const url = `user/get-event-profit-loss?page=${currentPage}&limit=${entriesToShow}&fromDate=${
        fromDate || ""
      }&toDate=${toDate || ""}&fromTime=${fromTime || ""}&toTime=${
        toTime || ""
      }&dataSource=${dataSource || ""}`;
      console.log("Fetching data with URL:", url);

      const response = await getProfitLossData(url);
      console.log(response);

      if (response && response.data) {
        const { pagination, data } = response.data;

        setPLData(data); // Update parent state with fetched data
        setTotalTransactions(pagination?.totalRecords || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true); // Mark data as fetched
      } else {
        console.error("No data found in response");
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error("Error fetching P&L data:", error);
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

  const handleTimeChangeWithValidation = (
    time,
    type,
    dispatch,
    fromTime,
    toTime
  ) => {
    if (type === "fromTime") {
      if (toTime && time > toTime) {
        alert("From Time cannot be later than To Time");
        return;
      }
      dispatch(setFromTime(time));
    } else if (type === "toTime") {
      if (fromTime && time < fromTime) {
        alert("To Time cannot be earlier than From Time");
        return;
      }
      dispatch(setToTime(time));
    }
  };

  useEffect(() => {
    // Set default values if not already set
    if (!fromTime) dispatch(setFromTime("00:00"));
    if (!toTime) dispatch(setToTime("23:59"));
  }, [dispatch, fromTime, toTime]);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      {/* Data Source Dropdown */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-2">
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

      {/* Date and Time Filters */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Time</label>
        <input
          type="time"
          value={fromTime || "00:00"}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Time</label>
        <input
          type="time"
          value={toTime || "23:59"}
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

export default EventPLFilter;

