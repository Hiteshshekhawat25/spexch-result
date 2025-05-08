import React, { useEffect, useState } from "react";
import { ImBook } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, selectSessions } from "../../Store/Slice/SessionSlice";
import { FaEdit } from "react-icons/fa";
import { getMatchList, RevertSessionCoins, transferSessionCoins, updateSessionResult } from "../../Services/Newmatchapi";
import { toast } from "react-toastify";
import SessionEditModal from "./SessionEditModal";

const SessionResult = () => {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state);
  const [editingRow, setEditingRow] = useState(null);
  const [tempResult, setTempResult] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
   const [loadings , setLoadings] = useState({
      result : false,
      transfer : false,
      revert : false
    })
  const [sortMatch,setSortMatch] = useState('new')
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    if (selectedMatch) {
      console.log('sortMatchsortMatchsortMatchsortMatchsortMatchsortMatchsortMatch')
      dispatch(fetchSessions(selectedMatch));
    }
  }, [dispatch, selectedMatch]);

  useEffect(() => {
    if (selectedMatch) {
      const match = matchList.find((match) => match._id === selectedMatch);
      const matchSessions = match?.Fancy?.Fancy || [];
      setFilteredSessions(matchSessions);
    } else {
      setFilteredSessions([]);
    }
  }, [selectedMatch, matchList]);

  const handleMatchChange = (e) => {
    setSelectedMatch(e.target.value);
  };


  const handleSortChange = (e) => {
    setSortMatch(e.target.value);
  };

  const handleResultChange = (e) => {
    setTempResult(e.target.value);
  };

  const handleSaveResult = (id) => {
    setEditingRow(null);
  };

  const handleRevertCoins = async (marketId) => {
   
    console.log("selectedMatch, marketId",selectedMatch, marketId);
    try {
      setLoadings((pre)=>({...pre,revert : true}))
      setTimeout(async()=>{
        await RevertSessionCoins(selectedMatch, marketId);
        setLoadings((pre)=>({...pre,revert : false}))
        toast.success("Revert successfully!");
        dispatch(fetchSessions(selectedMatch));
      },3000)
    } catch (error) {
      setLoadings((pre)=>({...pre,revert : false}))
      console.log({error})
      toast.error("Failed to update the session result. Please try again.");
    }
  };



  const handleTransferCoins = async (marketId) => {
   
    try {
      setLoadings((pre)=>({...pre,transfer : true}))
      setTimeout(async()=>{
        await transferSessionCoins(selectedMatch, marketId);
        setLoadings((pre)=>({...pre,transfer : false}))
        toast.success("transfer successfully!");
        dispatch(fetchSessions(selectedMatch));
      },3000)
    } catch (error) {
      setLoadings((pre)=>({...pre,transfer : false}))
      toast.error("Failed to update the session result. Please try again.");
    }
  };


console.log({sessions},'sessions')
 

  const handleMatchSelectFocus = async () => {
     setMatchLoading(true);
    setMatchError("");
    try {
      const response = await getMatchList(sortMatch);
      setMatchList(response || []);
    } catch (error) {
      console.error("Error fetching match list:", error);
      setMatchError("Error fetching match list.");
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    handleMatchSelectFocus();
  }, [sortMatch]);

  const handleEditClick = (index, result) => {
    setEditingRow(index);
    setTempResult(result);
  };
  const handleSubmit = async () => {
    if (!selectedSession || !tempResult) {
      toast.error("Please select a match & session and enter a result.");
      return;
    }

    try {
      setLoadings((pre)=>({...pre,result : true}))
      setTimeout(async()=>{
        await updateSessionResult(selectedMatch, selectedSession, tempResult);
      setLoadings((pre)=>({...pre,result : false}))
        setOpenModal(false);
        toast.success("Result updated successfully!");
        dispatch(fetchSessions(selectedMatch));
        setTempResult('')
      },3000)
      
    } catch (error) {
      setLoadings((pre)=>({...pre,result : false}))
      toast.error("Failed to update the session result. Please try again.");
    }
  };

  return (
    <div className="md:mx-0 mx-2 sm:mt-5 mt-3">
      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          Session Results
        </h1>
        <div className="md:p-4 p-3">
          {/* Row Section with Select Match, Select Session, and Result */}
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-3 mb-4">
            {/* Select Match Dropdown */}
            <div className="w-full">
              <label
                htmlFor="match"
                className="block text-sm md:text-md font-bold text-gray-800 mb-1 text-left"
              >
                Sort
              </label>
              <select
                id="match"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
                onChange={handleSortChange}
                value={sortMatch}
              >
                {  [{label : 'Old Matches', value : 'old'},{label : 'New Matches',value : 'new'}].map((match) => (
                    <option key={match?.label} value={match.value}>
                      {match.label} 
                    </option>
                ))
                }
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="match"
                className="block text-sm md:text-md font-bold text-gray-800 mb-1 text-left"
              >
                Select Match
              </label>
              <select
                id="match"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
                // onFocus={handleMatchSelectFocus}
                onChange={handleMatchChange}
                value={selectedMatch}
                // disabled={matchLoading}
              >
                <option value="">Select Match</option>
                {matchError ? (
                  <option>{matchError}</option> // Display error message
                ) : (
                  matchList.map((match) => (
                    <option key={match._id} value={match._id}>
                      {match.match} {match?.inPlay ? "(In Play)" : ""}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* Select Session Dropdown */}
            <div className="w-full">
              <label
                htmlFor="session"
                className="block text-sm md:text-md font-bold text-gray-800 mb-1 text-left"
              >
                Select Session
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                id="session"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              >
                <option value="">Select Session</option>
                {sessions.sessions.filter((item)=> !item.result).map((session, index) => {
                  console.log({session},'session')
                  return (
                  <option key={index} value={session.marketId}>
                    {session.marketName}
                  </option>
                )})}
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="result"
                className="block text-sm md:text-md font-bold text-gray-800 mb-1 text-left"
              >
                Result
              </label>
              <input
                id="result"
                value={openModal ? '' :tempResult}
                onChange={handleResultChange}
                type="number"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              />
            </div>
            <div className="w-full flex items-end gap-4">
              {loadings.result ? 
            <button
                className="px-4 py-2 bg-gradient-seablue text-sm text-white font-semibold rounded hover:bg-blue-600"
              >
              Loading...
              </button>
              :
              <button
                className="px-4 py-2 bg-gradient-seablue text-sm text-white font-semibold rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>}
            </div>
          </div>

          {/* Row Section with Search */}
          {/* <div className="flex gap-6 mb-4 w-1/2">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              />
            </div>

            <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">
              Search
            </button>
          </div> */}

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border text-center border-gray-30">
              <thead className="bg-gray-200">
                <tr className="text-nowrap">
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Match</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Session Name</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Result</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Edit/Update</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Session ID</th>
                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Coin Transferred</th> */}
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Date</th>
                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Session Book</th> */}
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Actions</th>
                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Coin Log</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Result Log</th> */}
                </tr>
              </thead>
              <tbody>
                {selectedMatch ? (
                  sessions?.sessions?.length ? (
                    sessions?.sessions
                      .filter((session) => session.result)
                      .map((session, index) => (
                        <tr key={session?.marketId}>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.match}</td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.marketName}</td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                            {openModal && editingRow == index ? (
                              <div className="gap-2 flex">
                                <input
                                  type="text"
                                  value={tempResult}
                                  onChange={handleResultChange}
                                  // onBlur={() => handleSaveResult(session.id)}
                                  className="px-2 py-1 border rounded"
                                  autoFocus
                                />
                                <button
                                  className="px-4 py-1 bg-lightblue text-white font-semibold rounded hover:bg-blue-600"
                                  onClick={handleSubmit}
                                >
                                  Submit
                                </button>
                              </div>
                            ) : (
                              session.result
                            )}
                          </td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                            <FaEdit
                              className="cursor-pointer text-blue-500"
                              // onClick={() => handleEditClick(index, session.result)}
                              onClick={() => {
                                setOpenModal(true);
                                setEditingRow(index)
                                setSelectedMatch(selectedMatch);
                                setSelectedSession(session?.marketId);
                                setTempResult(
                                  session?.result ? session?.result : 0
                                );
                              }}
                            />
                          </td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.marketId}</td>
                          {/* <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.coinTransferred}</td> */}
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.marketTime}</td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                        {!session?.transferredCoin ?  
                        loadings.transfer && (session.marketId == selectedSession) ? 
                         <button
                         className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center bg-lightblue font-semibold rounded hover:bg-blue-600 "
                       >
                        Loading...
                       </button>
                       :
                          <button
                              className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center bg-lightblue font-semibold rounded hover:bg-blue-600 "
                              onClick={() => handleTransferCoins(session.marketId)}
                            >
                              Transfer coins
                            </button>
                            :
                            loadings.revert && (session.marketId == selectedSession)  ? 
                            <button
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-blue-600 "
                            
                            >
                              Loading...
                             </button>
                            :
                            <button
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-blue-600 "
                              onClick={() => handleRevertCoins(session.marketId)}
                            
                            >
                              Revert coins
                            </button>
                            }
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                        No data found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={7} className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                      Please Select Match
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SessionResult;
