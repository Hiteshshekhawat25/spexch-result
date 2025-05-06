import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { getMatchSportbookList, RevertSportbookCoins, transferSportbookCoins, updateSportbookResult } from "../../Services/Newmatchapi";
import { toast } from "react-toastify";
import { fetchSportBook } from "../../Store/Slice/sportbookSlice";
import moment from "moment/moment";

const SportsBookResult = () => {
  const dispatch = useDispatch();
//   const { sessions, loading, error } = useSelector((state) => state);
  const { sportbook } = useSelector((state) => state)
  const [editingRow, setEditingRow] = useState(null);
  const [tempResult, setTempResult] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [runnerId,setRunnerId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [loading,setLoading] = useState({
    transferLoader : false,
    revertLoader : false,
    resultLoader : false
  })
  const [matchError, setMatchError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [sortMatch,setSortMatch] = useState('new')
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    if (selectedMatch) {
      console.log('sortMatchsortMatchsortMatchsortMatchsortMatchsortMatchsortMatch')
      dispatch(fetchSportBook(selectedMatch));
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
        setLoading((pre)=>({...pre,revertLoader : true}))
        setTimeout(async()=>{
            await RevertSportbookCoins(selectedMatch, marketId);
            setLoading((pre)=>({...pre,revertLoader : false}))
            toast.success("Revert successfully!");
            dispatch(fetchSportBook(selectedMatch));
        },3000)
    } catch (error) {
      console.log({error})
      setLoading((pre)=>({...pre,revertLoader : false}))
      toast.error("Failed to update the session result. Please try again.");
    }
  };



  const handleTransferCoins = async (marketId) => {
    try {
        setLoading((pre)=>({...pre,transferLoader : true}))
        setTimeout(async()=>{
            setLoading((pre)=>({...pre,transferLoader : false}))
            await transferSportbookCoins(selectedMatch, marketId);
            toast.success("transfer successfully!");
            dispatch(fetchSportBook(selectedMatch));
        },3000)
    } catch (error) {
        setLoading((pre)=>({...pre,transferLoader : false}))
      toast.error("Failed to update the session result. Please try again.");
    }
  };
 

  const handleMatchSelectFocus = async () => {
     setMatchLoading(true)
    setMatchError("");
    try {
      const response = await getMatchSportbookList(sortMatch);
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
    console.log({selectedMatch, selectedSession, tempResult,runnerId})
    // if (!selectedSession ||( !tempResult && !runnerId)) {
    //   toast.error("Please select a match & session and enter a result.");
    //   return;
    // }
   let type = sportbook?.sportbook?.filter((item)=> item?.marketId == selectedSession)?.[0]?.type
    try {
        setLoading((pre)=>({...pre,resultLoader : true}))
        setTimeout(async()=>{
            await updateSportbookResult(selectedMatch, selectedSession, tempResult,runnerId,type)
            setLoading((pre)=>({...pre,resultLoader : false}))
            setOpenModal(false)
            toast.success("Result updated successfully!")
            dispatch(fetchSportBook(selectedMatch))
            setTempResult('')
        },3000)
    } catch (error) {
        setLoading((pre)=>({...pre,resultLoader : false}))
        toast.error("Failed to update the session result. Please try again.");
    }
  };


  console.log(sportbook?.sportbook?.filter((item)=>  item?.marketId == selectedSession  ||  item?.type !== 'PRIME_ODDS'),'ruuununnun')

  return (
    <div className="md:mx-0 mx-2 sm:mt-5 mt-3">
      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          SportBook Results
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
                { matchError ? (
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
                Select Market
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                id="session"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              >
                <option value="">Select Market</option>
                {sportbook?.sportbook?.filter((item)=> !item.resultDeclared)?.map((session, index) => {
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
              {/* {sportbook?.sportbook?.filter((item)=> !item.result && item?.type == 'PRIME_ODDS')?.length > 0 ?
              <input
                id="result"
                value={openModal ? '' :tempResult}
                onChange={handleResultChange}
                type="number"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              />
              :  */}
              <select
                value={runnerId}
                onChange={(e) => setRunnerId(e.target.value)}
                id="session"
                className="px-2 py-2 border border-gray-300 rounded outline-none text-sm w-full"
              >
                <option value="">Select</option>
                {sportbook?.sportbook?.filter((item)=> item?.marketId == selectedSession )?.[0]?.runners?.map((session, index) => {
                  console.log({session},'session')
                  return (
                  <option key={index} value={session.runnerId}>
                    {session.runnerName}
                  </option>
                )})}
              </select>
              {/* } */}
            </div>
            <div className="w-full flex items-end gap-4">
                {loading.resultLoader ? 
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
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Market Name</th>
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
                  sportbook?.sportbook?.length ? (
                    sportbook?.sportbook
                    ?.filter((item)=> item.resultDeclared)
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
                              session.runners?.filter((item)=>item.status == 'WINNER')?.[0]?.runnerName
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
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{moment(session.lastUpdate).format('LLL')}</td>
                          <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                        {!session?.transferCoin ?  
                        loading.transferLoader
                        ? 

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

                          loading.revertLoader ?  
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
export default SportsBookResult;
