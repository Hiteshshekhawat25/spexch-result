import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setType,
  setSport,
  setFromDate,
  setToDate,
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
  userID, // userID is passed as a prop
}) => {
  const dispatch = useDispatch();
  const { type, sport, fromDate, toDate } = useSelector(selectBetListFilter);

  const [sportsOptions, setSportsOptions] = useState([]);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Set default values when component mounts
  useEffect(() => {
    dispatch(setType("unsettled"));
    dispatch(setSport("Cricket"));
    dispatch(setFromDate(today));
    dispatch(setToDate(today));
  }, [dispatch, today]);

  useEffect(() => {
    // Fetch sports options
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("games/getgames");
        if (response.status === 200) {
          setSportsOptions(response.data.data || []); // Adjust based on API response
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
      const url = `user/get-bet-list?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate}&toDate=${toDate}&type=${type}${
        sport ? `&sport=${sport}` : ""
      }${userID ? `&userId=${userID}` : ""}`;
      console.log("Fetching data with URL:", url);

      const response = await getBetlistData(url);

      if (response && response.data) {
        console.log("Fetched data:", response.data);
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

  useEffect(() => {
    if (fromDate && toDate) {
      console.log("Fetching data due to filter change or userID update");
      handleGetHistory();
    }
  }, [type, sport, fromDate, toDate, currentPage, entriesToShow, userID]); // Add userID to the dependency array

  return (
    <div className="flex flex-wrap items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
      {/* Choose Type */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-sm font-medium text-black mb-1">
          Choose Type
        </label>
        <select
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          className="border rounded px-4 py-2 text-sm w-full sm:w-auto sm:px-8"
        >
          <option value="settled">Settle</option>
          <option value="unsettled">UnSettle</option>
          <option value="void">Void</option>
        </select>
      </div>

      {/* Choose Sport */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-sm font-medium text-black mb-1">
          Choose Sport
        </label>
        <select
          value={sport}
          onChange={(e) => dispatch(setSport(e.target.value))}
          className="border rounded px-4 py-2 text-sm w-full sm:w-auto sm:px-8"
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
        <label className="text-sm font-medium text-black mb-1">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => dispatch(setFromDate(e.target.value))}
          className="border rounded px-4 py-2 text-sm w-full sm:w-auto sm:px-8"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-sm font-medium text-black mb-1">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => dispatch(setToDate(e.target.value))}
          className="border rounded px-4 py-2 text-sm w-full sm:w-auto sm:px-8"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-start sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
        <button
          onClick={handleGetHistory}
          className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm w-full sm:w-auto sm:px-8"
        >
          Get History
        </button>
      </div>
    </div>
  );
};

export default BetListFilter;
