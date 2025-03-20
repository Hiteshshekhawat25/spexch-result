import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setType,
  setSport,
  setFromDate,
  setToDate,
  setDataSource,
  selectBetListFilter,
} from "../../Store/Slice/betListFilterSlice";
import { getBetlistData } from "../../Services/Betlistapi";
import { getCreateNewMatchAPIAuth } from "../../Services/Newmatchapi";

const BetListFilter = ({
  setBetlistData,
  setTotalBets,
  setTotalPages,
  entriesToShow,
  currentPage,
  setIsDataFetched,
  setCurrentPage,
  userID,
}) => {
  const dispatch = useDispatch();
  const { type, sport, fromDate, toDate, dataSource } = useSelector(selectBetListFilter);
  const [sportsOptions, setSportsOptions] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(setType("unsettled"));
    dispatch(setSport("Cricket"));
    dispatch(setFromDate(today));
    dispatch(setToDate(today));
  }, [dispatch, today]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("games/getgames");
        if (response.status === 200) {
          setSportsOptions(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };
    fetchSports();
  }, []);

  const handleGetHistory = async () => {
    if (!fromDate || !toDate || !type || !sport) {
      return;
    }

    try {
      const url = `user/get-bet-list?page=${currentPage}&limit=${entriesToShow}&dataSource=${dataSource}&fromDate=${fromDate}&toDate=${toDate}&type=${type}${
        sport ? `&sport=${sport}` : ""
      }${userID ? `&userId=${userID}` : ""}`;
      console.log("Fetching data with URL:", url);

      const response = await getBetlistData(url);

      if (response && response.data) {
        const { pagination, data } = response.data;

        setBetlistData(data);
        setTotalBets(pagination?.totalBets || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true);
      } else {
        console.error("No data found in response");
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error("Error fetching bet history data:", error);
      setIsDataFetched(false);
    }
  };

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
    if (fromDate && toDate) {
      console.log("Fetching data due to filter change or userID update");
      handleGetHistory();
    }
  }, [type, sport, fromDate, toDate, currentPage, entriesToShow, userID]);

  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-1 flex-wrap items-end gap-4 mb-4 md:p-4 p-3 bg-[#e0e6e6] border border-black rounded-md">
      
      {/* Show Data Source select box only for "settled" or "void" bet type */}
      {type !== "unsettled" && (
        <div className="flex flex-col  items-start">
          <label className="text-sm font-custom text-black mb-2">
            Data Source
          </label>
          <select
            value={dataSource || "live"}
            onChange={(e) => dispatch(setDataSource(e.target.value))}
            className="border rounded text-sm px-2 py-2 w-full outline-none"
          >
            <option value="">Data Source</option>
            <option value="live">LIVE DATA</option>
            <option value="backup">BACKUP DATA</option>
            <option value="old">OLD DATA</option>
          </select>
        </div>
      )}

      {/* Choose Type */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-[13px] font-medium text-black mb-1 font-custom">
          Choose Type
        </label>
        <select
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          className="border rounded px-2 py-2 text-sm w-full sm:w-auto sm:px-2 outline-none"
        >
          <option value="settled">Settle</option>
          <option value="unsettled">UnSettle</option>
          <option value="void">Void</option>
        </select>
      </div>

      {/* Choose Sport */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-[13px] font-medium text-black mb-1 font-custom">
          Choose Sport
        </label>
        <select
          value={sport}
          onChange={(e) => dispatch(setSport(e.target.value))}
          className="border rounded px-2 py-2 text-sm w-full sm:w-auto sm:px-2 outline-none"
        >
          <option value="">Select Sport</option>
          {sportsOptions.map((sport) => (
            <option key={sport._id} value={sport.name}>
              {sport.name}
            </option>
          ))}
        </select>
      </div>

      {/* From Date */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-[13px] font-medium text-black mb-1 font-custom">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-2 py-2 text-sm w-full sm:w-auto sm:px-2 outline-none"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-[13px] font-medium text-black mb-1 font-custom">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-2 py-2 text-sm w-full sm:w-auto sm:px-2 outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex w-full sm:w-auto sm:mt-0 mt-2">
        <button
          onClick={handleGetHistory}
          className="px-3 w-auto py-2 bg-gradient-seablue font-bold font-custom text-white rounded-md text-sm mb-0.5 sm:px-5"
        >
          Get History
        </button>
      </div>
    </div>
  );
};

export default BetListFilter;
