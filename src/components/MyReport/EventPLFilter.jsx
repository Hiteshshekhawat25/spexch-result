import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataSource,
  setFromDate,
  setToDate,
  setFromTime,
  setToTime,
  resetFilters,
} from "../../Store/Slice/eventPLFilterSlice";
import { getProfitLossData } from "../../Services/Downlinelistapi";

const EventPLFilter = ({
  setPLData,
  setTotalTransactions,
  setTotalPages,
  setIsDataFetched,
  entriesToShow,
  currentPage,
  Userid,
  setCurrentPage,
  setLocalLoading,
}) => {
  const dispatch = useDispatch();
  const eventPLFilterState = useSelector((state) => state.eventPLFilter);
  const [localLoading, setLocalLoadingState] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setLocalLoading(localLoading);
  }, [localLoading, setLocalLoading]);

  const { dataSource, fromDate, toDate, fromTime, toTime } =
    eventPLFilterState || {};

  // Function to dynamically calculate date range based on data source
  const getDateRange = (source) => {
    const today = new Date();
    let fromDate, toDate;

    switch (source) {
      case "live":
        fromDate = today.toISOString().split("T")[0];
        toDate = today.toISOString().split("T")[0];
        break;
      case "backup":
        toDate = today.toISOString().split("T")[0];
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        fromDate = threeMonthsAgo.toISOString().split("T")[0];
        break;
      case "old":
        toDate = today.toISOString().split("T")[0];
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        fromDate = oneYearAgo.toISOString().split("T")[0];
        break;
      default:
        fromDate = today.toISOString().split("T")[0];
        toDate = today.toISOString().split("T")[0];
    }

    return { fromDate, toDate };
  };

  // Set default values when component mounts
  useEffect(() => {
    if (!dataSource) {
      dispatch(setDataSource("live"));
    }
    if (!fromDate) dispatch(setFromDate(today));
    if (!toDate) dispatch(setToDate(today));
    if (!fromTime) dispatch(setFromTime("00:00"));
    if (!toTime) dispatch(setToTime("23:59"));
  }, [dataSource, fromDate, toDate, fromTime, toTime, dispatch]);

  // Update fromDate and toDate when dataSource changes
  useEffect(() => {
    const { fromDate, toDate } = getDateRange(dataSource);
    dispatch(setFromDate(fromDate));
    dispatch(setToDate(toDate));
  }, [dataSource, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesToShow, setCurrentPage]);

  useEffect(() => {
    if (fromDate && toDate) {
      handleGetPL();
      setLocalLoadingState(false);
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
      const url = `user/get-user-event-profit-loss?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&fromTime=${fromTime}&toTime=${toTime}&userId=${Userid}`;
      const response = await getProfitLossData(url);

      if (response && response.data) {
        const { pagination, data } = response.data;
        setPLData(data);
        setTotalTransactions(pagination?.totalRecords || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true);
      } else {
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error("Error fetching P&L data:", error);
      setIsDataFetched(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-2">
          Data Source
        </label>
        <select
          value={dataSource || "live"}
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="border rounded px-10 py-2"
        >
          <option value="live">LIVE DATA</option>
          <option value="backup">BACKUP DATA</option>
          <option value="old">OLD DATA</option>
        </select>
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">From Time</label>
        <input
          type="time"
          value={fromTime || "00:00"}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">To Time</label>
        <input
          type="time"
          value={toTime || "23:59"}
          onChange={(e) => dispatch(setToTime(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex space-x-2 items-center">
        <button
          onClick={handleGetPL}
          className="px-4 py-2 `bg-gradient-seablue` text-white rounded-md text-sm"
        >
          Get P & L
        </button>
      </div>
    </div>
  );
};

export default EventPLFilter;
