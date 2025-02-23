import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataSource,
  setFromDate,
  setToDate,
  setFromTime,
  setToTime,
  resetFilters,
} from "../../Store/Slice/plFilterSlice";
import { getProfitLossData } from "../../Services/Downlinelistapi";

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
  const plFilterState = useSelector((state) => state.plFilter);
  const { dataSource, fromDate, toDate, fromTime, toTime } =
    plFilterState || {};

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Function to get past date based on months
  const getPastDate = (months) => {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - months);
    return pastDate.toISOString().split("T")[0];
  };

  // Function to get past date based on years
  const getPastYearDate = () => {
    const pastYearDate = new Date();
    pastYearDate.setFullYear(pastYearDate.getFullYear() - 1);
    return pastYearDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    let fromDateValue = today;

    if (dataSource === "old") {
      fromDateValue = getPastYearDate();
    } else if (dataSource === "backup") {
      fromDateValue = getPastDate(3);
    }

    dispatch(setFromDate(fromDateValue));
    dispatch(setToDate(today));
    dispatch(setFromTime("00:00"));
    dispatch(setToTime("23:59"));
  }, [dispatch, dataSource, today]);

  useEffect(() => {
    if (dataSource && fromDate && toDate) {
      handleGetPL();
    }
  }, [
    dataSource,
    fromDate,
    toDate,
    currentPage,
    fromTime,
    toTime,
    entriesToShow,
  ]);

  const handleGetPL = async () => {
    try {
      const url = `user/get-profit-loss?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&fromTime=${fromTime}&toTime=${toTime}&dataSource=${dataSource}`;
      console.log("Fetching data with URL:", url);

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

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(setDataSource("live"));
    dispatch(setFromDate(today));
    dispatch(setToDate(today));
    dispatch(setFromTime("00:00"));
    dispatch(setToTime("23:59"));
    setPLData([]);
    setTotalTransactions(0);
    setTotalPages(1);
    setIsDataFetched(false);
    setCurrentPage(1);
  };

  const initialState = {
    dataSource: "live", // Default to "live"
    fromDate: "",
    toDate: "",
    fromTime: "00:00",
    toTime: "23:59",
  };

  useEffect(() => {
    handleGetPL();
  }, [currentPage]);

  return (
    <div className="grid grid-cols-12  gap-2 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      <div className="flex flex-col col-span-12 sm:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom font-medium text-black mb-1">
          Data Source
        </label>
        <select
          value={dataSource || "live"} // Ensure "live" is selected by default
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="border w-full text-[12px] sm:text-sm rounded px-10 py-1"
        >
          <option value="live">LIVE DATA</option>
          <option value="backup">BACKUP DATA</option>
          <option value="old">OLD DATA</option>
        </select>
      </div>

      {/* Date and Time Filters */}
      <div className="flex flex-col col-span-8 sm:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom font-medium text-black mb-1">
          From Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border w-full rounded px-2 py-1 text-[12px] sm:text-sm"
        />
      </div>

      <div className="flex flex-col col-span-4 sm:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom font-medium text-black mb-1">
          From Time
        </label>
        <input
          type="time"
          value={fromTime}
          onChange={(e) => dispatch(setFromTime(e.target.value))}
          className="border w-full  rounded px-2 py-1 text-[12px] sm:text-sm"
        />
      </div>

      <div className="flex flex-col col-span-8 sm:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm font-custom font-medium text-black mb-1">
          To Date
        </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border  w-full rounded px-2 py-1 text-[12px] sm:text-sm"
        />
      </div>

      <div className="flex flex-col col-span-4 sm:col-span-2 items-start">
        <label className="text-[12px] sm:text-sm  font-custom font-medium text-black mb-1">
          To Time
        </label>
        <input
          type="time"
          value={toTime}
          onChange={(e) => dispatch(setToTime(e.target.value))}
          className="border w-full rounded px-2 py-1 text-[12px] sm:text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 col-span-12 sm:col-span-2 items-center mt-5">
        <button
          onClick={handleGetPL}
          className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm"
        >
          Get P & L
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PLFilter;
