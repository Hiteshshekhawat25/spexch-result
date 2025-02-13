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
import { getCreateNewMatchAPIAuth, getMatchList } from '../../Services/Newmatchapi';
import { liabilityBook } from '../../Store/Slice/liabilitySlice';
import { matchListBook } from '../../Store/Slice/matchlistGameIdSlice';
import { fetchSessions } from '../../Store/Slice/SessionSlice';

function ManageBetFilter({
  setBetlistData,
  setTotalBets,
  remarkModal,
  setTotalPages,
  checkbox,
  handleDeleteBet,
  entriesToShow,
  selectFilterData,
  setSelectFilterData,
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
  const sessions = useSelector((state)=>state.sessions)
  const matchList = useSelector((state)=>state.matchlist.data)
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Set default values when component mounts
  useEffect(() => {
    dispatch(setType("unsettled"));
    dispatch(setSport("Cricket"));
    dispatch(setFromDate(today));
    dispatch(setToDate(today));
  }, [dispatch, today]);

   const handleSportChange = (e,name) => {
    if(name == 'sport'){
      const selectedSport = e.target.value;
      dispatch(setSport(selectedSport));
    }
    setSelectFilterData((pre)=>({...pre,[name] : e.target.value}))
    };

        
  useEffect(() => {
    dispatch(matchListBook({gameId: selectFilterData?.sport}))
  }, [
    selectFilterData?.sport
  ]);

  useEffect(()=>{
     dispatch(fetchSessions(selectFilterData?.match));
  },[selectFilterData?.match])

    
  useEffect(() => {
    if(remarkModal == false){
      dispatch(liabilityBook({
        page : currentPage,
        limit : 10,
        sport : selectFilterData?.sport == '4' ? 'Cricket' : selectFilterData?.sport == '2' ? 'Tennis' : 'Soccer' ,
        type : selectFilterData?.odds,
        matchId : selectFilterData?.match,
        sessionId : selectFilterData?.session,
       }))
    }
  }, [
    selectFilterData?.sport,
    selectFilterData?.match,
    selectFilterData?.odds,
    selectFilterData?.date1,
    selectFilterData?.date2,
    selectFilterData?.session,
    currentPage,
    remarkModal
  ]);


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



  console.log(sessions,'selectFilterData')
  return (
    <>
       <div className="grid grid-cols-12 gap-2 mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
          {/* Choose Type */}
        <div className=" col-span-6 sm:col-span-2 mb-1 sm:mb-6">
        <label className="text-[12px] sm:text-sm font-medium text-black mb-1">
              Select Sport
            </label>
            <select className="border text-[12px] sm:text-sm w-full p-2 rounded" 
            value={selectFilterData.sport} 
            onChange={(e)=>handleSportChange(e,'sport')}
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
          

          <div className="col-span-6 sm:col-span-2 !mt-0 mb-1 sm:mb-6">
        <label className="text-[12px] sm:text-sm font-medium text-black mb-1">
              Select Match
            </label>
            <select className="border text-[12px] sm:text-sm w-full p-2 rounded" 
            value={selectFilterData.match} 
            onChange={(e)=>handleSportChange(e,'match')}
            >
              <option value="">Select Match</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                matchList?.length > 0 ? (
                  matchList?.map((match) => (
                    <option key={match.id} value={match._id}>
                       {match.match} {match?.inPlay ? "(In Play)" : ""}
                    </option>
                  ))
                ) : (
                  <option value="">No Sports Available</option>
                )
              )}
            </select>
          </div>
          {/* Choose Sport */}
          <div className="col-span-6 sm:col-span-2 mb-1 sm:mb-6">
        <label className="text-[12px] sm:text-sm font-medium text-black mb-1">
              Select Odds
            </label>
            <select className="border text-[12px] sm:text-sm p-2 w-full rounded" 
            value={selectFilterData.odds} 
            onChange={(e)=>handleSportChange(e,'odds')}
            >
              <option value="">Select Odds</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                [{name : 'Match Odds',_id : 'odds'}, {name : 'Bookmakers',_id:'bookmakers'},{name : 'Fancy',_id :'fancy'},{name : 'Toss',_id :3}].map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))
              )}
            </select>
          </div>

     {sessions?.length > 0 ? 
      <div className="col-span-6 sm:col-span-2">
          <label className="text-[12px] sm:text-sm font-medium text-black mb-1">
              Select Sessions
            </label>
          <select
            value={selectFilterData.session}
            onChange={(e)=>handleSportChange(e,'session')}
            id="session"
            className="border w-full text-[12px] sm:text-sm p-2 rounded"
          >
            <option value="">Select Session</option>
            {filteredSessions.filter((session) => !session.result).map((session, index) => (
              <option key={index} value={session.marketId}>
                {session.marketName}
              </option>
            ))}
          </select>
        </div> : <></>}
    
         
          <div className="col-span-12 sm:col-span-2 justify-start sm:justify-center w-full sm:w-auto mt-6">
            <button
              onClick={()=>{
                dispatch(liabilityBook({
                  page : currentPage,
                  limit : 10,
                  sport : selectFilterData?.sport == '4' ? 'Cricket' : selectFilterData?.sport == '2' ? 'Tennis' : 'Soccer' ,
                  type : selectFilterData?.odds,
                  matchId : selectFilterData?.match,
                  sessionId : selectFilterData?.session,
                 }))
              }}
              className="px-4 py-2 bg-gradient-seablue text-white rounded-md text-sm w-full sm:w-auto sm:px-8"
            >
              Get Bets
            </button>
          </div>

          <div className=' sm:col-span-4 w-full mt-5 items-end col-span-12'>
            <div className='flex gap-x-4 justify-end'>
              <button disabled={checkbox?.length == 0 ? true : false}
               className='bg-red-500 text-white py-3 disabled:bg-red-400 px-5 text-center  rounded-md'
               onClick={handleDeleteBet}
               >
                Delete Bets 
              </button>
              <button disabled={checkbox?.length == 0 ? true : false} className='bg-lightblue text-white py-3 px-5 disabled:bg-bluehover text-center  rounded-md'>
                Revert Bets 
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default ManageBetFilter
