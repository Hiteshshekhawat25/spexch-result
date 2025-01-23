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
      alert("Please select both From Date and To Date");
      return;
    }

    try {
      const url = `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&dataSource=${dataSource}`;
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
      console.error("Error fetching account statement data:", error);
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
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-2">
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

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">From</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-8 py-2"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-custom text-black mb-1">To</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-8 py-2"
        />
      </div>

      <div className="flex space-x-1 items-center ml-12 mt-4">
        <button
          onClick={handleGetStatement}
          className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm"
        >
          Get Statement
        </button>
      </div>
    </div>
  );
};

export default AccountStatementFilter;
