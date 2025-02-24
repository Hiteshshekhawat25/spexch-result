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
  Userid,
  currentPage,
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
        // For live data, use today's date
        fromDate = today.toISOString().split("T")[0];
        toDate = today.toISOString().split("T")[0];
        break;
      case "backup":
        // For backup data, use the last 3 months
        toDate = today.toISOString().split("T")[0];
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        fromDate = threeMonthsAgo.toISOString().split("T")[0];
        break;
      case "old":
        // For old data, use the last 1 year
        toDate = today.toISOString().split("T")[0];
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        fromDate = oneYearAgo.toISOString().split("T")[0];
        break;
      default:
        // Default to today's date
        fromDate = today.toISOString().split("T")[0];
        toDate = today.toISOString().split("T")[0];
    }

    return { fromDate, toDate };
  };

  // Set default values when component mounts or dataSource changes
  useEffect(() => {
    const { fromDate: adjustedFromDate, toDate: adjustedToDate } =
      getDateRange(dataSource);

    dispatch(setFromDate(adjustedFromDate));
    dispatch(setToDate(adjustedToDate));

    // Set default times
    dispatch(setFromTime("00:00"));
    dispatch(setToTime("23:59"));
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

  useEffect(() => {
    dispatch(setDataSource("live"));
  }, [dispatch]);

  const handleGetPL = async () => {
    try {
      const { fromDate: adjustedFromDate, toDate: adjustedToDate } =
        getDateRange(dataSource);

      const url = `user/get-event-profit-loss?page=${currentPage}&limit=${entriesToShow}&fromDate=${adjustedFromDate}&toDate=${adjustedToDate}&fromTime=${fromTime}&toTime=${toTime}${
        Userid ? `&userId=${Userid}` : ""
      }`;
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
    <div className="grid grid-cols-12 gap-y-2 gap-x-2 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      <div className=" gap-2  col-span-12 md:col-span-3 items-start">
        <label className="text-[12px] sm:text-sm font-custom text-black mb-2">
          Data Source
        </label>
        <select
          value={dataSource || "live"}
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="text-[12px] sm:text-sm border w-full rounded px-10 py-1"
        >
          <option value="live">LIVE DATA</option>
          <option value="backup">BACKUP DATA</option>
          <option value="old">OLD DATA</option>
        </select>
      </div>

      <div className="flex flex-col  col-span-8 md:col-span-2  items-start">
        <label className="text-[12px] sm:text-sm font-custom text-black mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded w-full px-1 py-1 text-sm"
          disabled={dataSource !== "live"}
        />
      </div>

      <div className="flex flex-col col-span-4 md:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom text-black mb-1">
          From Time
        </label>
        <input
          type="time"
          value={fromTime || "00:00"}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border w-full rounded px-2 py-1 text-sm"
          disabled={dataSource !== "live"}
        />
      </div>

      <div className="flex flex-col col-span-8 md:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom text-black mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border w-full rounded px-2 py-1 text-sm"
          disabled={dataSource !== "live"}
        />
      </div>

      <div className="flex flex-col  col-span-4 md:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom text-black mb-1">
          To Time
        </label>
        <input
          type="time"
          value={toTime || "23:59"}
          onChange={(e) => dispatch(setToTime(e.target.value))}
          className="border w-full rounded px-2 py-1 text-sm"
          disabled={dataSource !== "live"}
        />
      </div>

      <div className="flex col-span-6 md:col-span-2 space-x-2  items-center">
        <button
          onClick={handleGetPL}
          className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm"
        >
          Get P & L
        </button>
      </div>
    </div>
  );
};

export default EventPLFilter;
