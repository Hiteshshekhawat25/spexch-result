import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataSource,
  setFromDate,
  setToDate,
  selectAccountStatementFilter,
} from "../../Store/Slice/accountStatementFilterSlice";
import { getAccountStatementData } from "../../Services/Downlinelistapi";

const AccountStatementFilter = ({
  setTotalTransactions,
  setTotalPages,
  setTransactions,
  entriesToShow,
  currentPage,
  setIsDataFetched,
  setCurrentPage,
  Userid,
}) => {
  const dispatch = useDispatch();
  const { dataSource, fromDate, toDate } = useSelector(
    selectAccountStatementFilter
  );

  const today = new Date().toISOString().split("T")[0];

  const calculateDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!dataSource) {
      dispatch(setDataSource("live"));
      dispatch(setFromDate(today));
      dispatch(setToDate(today));
    } else {
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
    }
  }, [dataSource, dispatch, today]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesToShow, setCurrentPage]);

  useEffect(() => {
    if (fromDate && toDate) {
      handleGetStatement();
    }
  }, [currentPage, fromDate, toDate, dataSource, entriesToShow]);

  const handleGetStatement = async () => {
    if (!fromDate || !toDate) {
      // alert("Please select both From Date and To Date");
      return;
    }

    try {
      // const url = `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&dataSource=${dataSource}`;
      const url = Userid
        ? `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&dataSource=${dataSource}&userId=${Userid}`
        : `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&dataSource=${dataSource}`;
      const response = await getAccountStatementData(url);

      if (response?.data) {
        const { pagination, data } = response.data;
        setTransactions(data);
        setTotalTransactions(pagination?.totalTransactions || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true);
      } else {
        setIsDataFetched(false);
      }
    } catch (error) {
      // console.error("Error fetching account statement data:", error);
      setIsDataFetched(false);
    }
  };

  const formatDateTime = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 flex-wrap items-end md:gap-4 gap-3.5 p-3 bg-[#e0e6e6] border border-black rounded-[4px] mb-4">
      <div className="flex flex-col items-start">
        <label className="text-[13px] font-custom text-black mb-2">
          Data Source
        </label>
        <select
          value={dataSource || "live"} // Default to "live" if dataSource is empty
          onChange={(e) => dispatch(setDataSource(e.target.value))}
          className="border rounded px-2 py-1 h-[38px] text-[14px] outline-none w-full"
        >
          <option value="">Data Source</option>
          <option value="live">LIVE DATA</option>
          <option value="backup">BACKUP DATA</option>
          <option value="old">OLD DATA</option>
        </select>
      </div>
      <div className="flex flex-col items-start">
        <label className="text-[13px] font-custom text-black mb-1">From</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-2 h-[38px] text-[14px] w-full"
        />
      </div>
      <div className="flex flex-col items-start">
        <label className="text-[13px] font-custom text-black mb-1">To</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-2 h-[38px] text-[14px] w-full"
        />
      </div>
      <div className="flex space-x-1 items-center mt-4">
        <button
          onClick={handleGetStatement}
          className="px-4 py-[9px] bg-gradient-seablue font-semibold text-white rounded-md text-sm"
        >
          Get Statement
        </button>
      </div>
    </div>
  );
};

export default AccountStatementFilter;
