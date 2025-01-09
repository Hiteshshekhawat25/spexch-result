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
}) => {
  const dispatch = useDispatch();
  const { type, sport, fromDate, toDate } = useSelector(selectBetListFilter);

  const [sportsOptions, setSportsOptions] = useState([]);

  const today = new Date().toISOString().split("T")[0];

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
      }`;
      console.log("Fetching data with URL:", url);

      const response = await getBetlistData(url);

      if (response && response.data) {
        console.log("Fetched data:", response.data);
        const { pagination, data } = response.data;

        setBetlistData(data); // Set the fetched data to the Parent state
        setTotalBets(pagination?.totalBets || 0); // Update total transactions
        setTotalPages(pagination?.totalPages || 1); // Update total pages
        setIsDataFetched(true); // Mark that data has been fetched
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
      console.log("Fetching data due to filter change");
      handleGetHistory();
    }
  }, [type, sport, fromDate, toDate, currentPage, entriesToShow]);

  return (
    <div className="flex flex-wrap space-x-4 items-center mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
      {/* Filter Inputs */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">
          Choose Type
        </label>
        <select
          value={type}
          onChange={(e) => {
            dispatch(setType(e.target.value));
            console.log("Type selected:", e.target.value);
          }}
          className="border rounded px-8 py-2 text-sm w-full sm:w-auto"
        >
          {/* <option value="">Select Type</option> */}
          <option value="settled">Settled</option>
          <option value="unsettled">Unsettled</option>
          <option value="void">Void</option>
        </select>
      </div>

      {/* Choose Sport */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">
          Choose Sport
        </label>
        <select
          value={sport}
          onChange={(e) => {
            dispatch(setSport(e.target.value));
            console.log("Sport selected:", e.target.value);
          }}
          className="border rounded px-8 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">Select Sport</option>
          {sportsOptions.map((sport) => (
            <option key={sport._id} value={sport.name}>
              {sport.name} 
            </option>
          ))}
        </select>
      </div>

      {/* Date Filters */}
      {/* From Date */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">From</label>
        <input
          type="date"
          value={fromDate || today}
          onChange={(e) => {
            dispatch(setFromDate(e.target.value));
            console.log("From Date selected:", e.target.value);
          }}
          className="border rounded px-8 py-2 text-sm w-full sm:w-auto"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col items-start w-full sm:w-auto mb-4 sm:mb-0">
        <label className="text-sm font-medium text-black mb-1">To</label>
        <input
          type="date"
          value={toDate || today}
          onChange={(e) => {
            dispatch(setToDate(e.target.value));
            console.log("To Date selected:", e.target.value);
          }}
          className="border rounded px-8 py-2 text-sm w-full sm:w-auto"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 items-center sm:ml-auto w-full sm:w-auto mt-6">
        <button
          onClick={handleGetHistory}
          className="px-4 py-2 bg-darkgray text-white rounded-md text-sm w-full sm:w-auto"
        >
          Get History
        </button>
      </div>
    </div>
  );
};

export default BetListFilter;
