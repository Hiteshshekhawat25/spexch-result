import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  setType,
  setSport,
  setFromDate,
  setToDate,
  selectBetListFilter,
} from "../../Store/Slice/betListFilterSlice";
import { getBetlistData } from '../../Services/Betlistapi';
import { getCreateNewMatchAPIAuth } from '../../Services/Newmatchapi';

function ManageBetFilter({
  setBetlistData,
  setTotalBets,
  setTotalPages,
  entriesToShow,
  currentPage,
  setIsDataFetched,
  setCurrentPage,
  userID, // userID is passed as a prop
}) {


  const dispatch = useDispatch();
  const { type, sport, fromDate, toDate } = useSelector(selectBetListFilter);

  const [sportsOptions, setSportsOptions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession,setSelectedSession] = useState('')
  const [loading,setLoading] = useState(false)

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Set default values when component mounts
  useEffect(() => {
    dispatch(setType("unsettled"));
    dispatch(setSport("Cricket"));
    dispatch(setFromDate(today));
    dispatch(setToDate(today));
  }, [dispatch, today]);


   const handleSportChange = (e) => {
      const selectedSport = e.target.value;
      dispatch(setSport(selectedSport));
    };

  useEffect(() => {
    // Fetch sports options
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("games/getgames");
        console.log({response})
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
    <>
       <div className="flex flex-wrap items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
          {/* Choose Type */}
        <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-black mb-1">
              Select Sport
            </label>
            <select className="border p-2 rounded" 
            value={sport} 
            onChange={handleSportChange}
            >
              <option value="">Select Sport</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                sportsOptions?.length > 0 ? (
                  sportsOptions.map((sportOption) => (
                    <option key={sportOption.id} value={sportOption.gameId}>
                      {sportOption.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Sports Available</option>
                )
              )}
            </select>
          </div>
          

          <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-black mb-1">
              Select Match
            </label>
            <select className="border p-2 rounded" 
            value={sport} 
            onChange={handleSportChange}
            >
              <option value="">Select Match</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                sportsOptions?.length > 0 ? (
                  sportsOptions.map((sportOption) => (
                    <option key={sportOption.id} value={sportOption.gameId}>
                      {sportOption.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Sports Available</option>
                )
              )}
            </select>
          </div>
          {/* Choose Sport */}
          <div className="flex flex-col mb-6">
        <label className="text-sm font-medium text-black mb-1">
              Select Odds
            </label>
            <select className="border p-2 rounded" 
            value={sport} 
            onChange={handleSportChange}
            >
              <option value="">Select Odds</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                [{name : 'Match Odds',_id : 1}, {name : 'Bookmakers',_id:2},{name : 'Toss',_id :3}].map((sport) => (
                  <option key={sport._id} value={sport.name}>
                    {sport.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col">
          <label className="text-sm font-medium text-black mb-1">
              Select Odds
            </label>
          <select
            value={setSelectedSession}
            onChange={(e)=>setSelectedSession(e.target.value)}
            id="session"
            className="border p-2 rounded"
          >
            <option value="">Select Session</option>
            {filteredSessions.filter((session) => !session.result).map((session, index) => (
              <option key={index} value={session.marketId}>
                {session.marketName}
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
    </>
  )
}

export default ManageBetFilter
