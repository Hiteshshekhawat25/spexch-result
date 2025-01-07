import React, { useEffect, useState } from "react";
import { ImBook } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, selectSessions,updateSession } from "../../Store/Slice/SessionSlice";
import { FaEdit } from "react-icons/fa";
import { getMatchList, updateSessionResult } from "../../Services/Newmatchapi";

const SessionResult = () => {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state);
  const [editingRow, setEditingRow] = useState(null);
  const [tempResult, setTempResult] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [filteredSessions, setFilteredSessions] = useState([]);
  



  useEffect(()=>{
    dispatch(fetchSessions());
  },[dispatch])


  useEffect(() => {
    if (selectedMatch) {
      const match = matchList.find((match) => match._id === selectedMatch);
      const matchSessions = match?.Fancy?.Fancy || [];
      console.log("matchSessions",matchSessions);
      setFilteredSessions(matchSessions);
    } else {
      setFilteredSessions([]); 
    }
  }, [selectedMatch, matchList]);
  
  const handleMatchChange = (e) => {
    setSelectedMatch(e.target.value);
  };

  const handleResultChange = (e) => {
    setTempResult(e.target.value);
  };

  const handleSaveResult = (sessionId) => {
    if (!tempResult.trim()) {
      console.warn("No result provided for the update.");
      return;
    }
  
    console.log("Updating session result...");

    console.log("New Result:", tempResult);
  
    // Dispatch the action to update the Redux store
    dispatch(updateSession({ sessionId,  result: tempResult }));
  
    // Send the updated result to the server
    updateSessionResult(sessionId,  tempResult)
      .then(() => {
        console.log(`Session result updated successfully.`);
      
        console.log("Updated Result:", tempResult);
        alert("Session result updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update session result:", error);
        alert("Failed to update session result on the server.");
      });
  
    // Reset editing state
    setEditingRow(null);
    setTempResult("");
  };
  
  
  

  const handleMatchSelectFocus = async () => {
    if (matchList.length > 0) return;
    setMatchLoading(true);
    setMatchError("");
    try {
      const response = await getMatchList();
      setMatchList(response || []);
    } catch (error) {
      console.error("Error fetching match list:", error);
      setMatchError("Error fetching match list.");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleEditClick = (index, result) => {
    setEditingRow(index);
    setTempResult(result);
  };
  const handleSubmit = async () => {
    console.log("selectedSession",selectedSession)
    // if (!selectedSession || !tempResult) {
    //   alert("Please select a session and enter a result.");
    //   return;
    // }

    try {
      await updateSessionResult(selectedSession, tempResult);
      alert("Result updated successfully!");
      dispatch(fetchSessions());
    } catch (error) {
      alert("Failed to update the session result. Please try again.");
    }
  };

  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Session Results
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section with Select Match, Select Session, and Result */}
      <div className="flex gap-6 mb-4">
        {/* Select Match Dropdown */}
        <div className="w-1/4">
          <label
            htmlFor="match"
            className="block text-md font-bold text-gray-700 mb-1 text-left"
          >
            Select Match
          </label>
          <select
            id="match"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            onFocus={handleMatchSelectFocus}
            onChange={handleMatchChange}
            disabled={matchLoading}
          >
            <option value="">Select Match</option>
            {matchLoading ? (
              <option>Loading...</option> // Display loading text
            ) : matchError ? (
              <option>{matchError}</option> // Display error message
            ) : (
              matchList.map((match) => (
                <option key={match._id} value={match._id}>
                  {match.match}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Select Session Dropdown */}
        {console.log("matchhhhhhh",matchList)}
        <div className="w-1/4">
          <label
            htmlFor="session"
            className="block text-md font-bold text-gray-700 mb-1 text-left"
          >
            Select Session
          </label>
          <select
            id="session"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          >
            <option value="">Select Session</option>
            {filteredSessions.map((session, index) => (
              <option key={index} value={session.marketId}>
                {session.marketName}
              </option>
            ))}
          </select>
        </div>

        {/* Result Input and Submit Button */}
        <div className="w-2/4 flex items-end gap-4">
          <div className="w-1/2">
            <label
              htmlFor="result"
              className="block text-md font-bold text-gray-700 mb-1 text-left"
            >
              Result
            </label>
            <input
              id="result"
              type="text"
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            />
          </div>
          <button className="px-4 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {/* Row Section with Search */}
      <div className="flex gap-6 mb-4 w-1/2">
        {/* Input Box */}
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          />
        </div>

        {/* Search Button */}
        <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">
          Search
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Session Name</th>
              <th className="px-4 py-2 text-left">Result</th>
              <th className="px-4 py-2 text-left">Edit/Update</th>
              <th className="px-4 py-2 text-left">Session ID</th>
              <th className="px-4 py-2 text-left">Coin Transferred</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Session Book</th>
              <th className="px-4 py-2 text-left">Transfer Coins</th>
              <th className="px-4 py-2 text-left">Coin Log</th>
              <th className="px-4 py-2 text-left">Result Log</th>
            </tr>
          </thead>
          <tbody>
            {sessions?.sessions?.map((session, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{session.id}</td>
                <td className="px-4 py-2">{session.marketName}</td>
                <td className="px-4 py-2">
                  {editingRow === index ? (
                    <input
                    type="text"
                    value={tempResult}
                    onChange={handleResultChange}
                    onBlur={() => handleSaveResult(session.marketId)} // Pass selectionId here
                    className="px-2 py-1 border rounded"
                    autoFocus
                  />                 

                  ) : (
                    session.result
                  )}
                </td>
                <td className="px-4 py-2">
                  <FaEdit
                    className="cursor-pointer text-blue-500"
                    onClick={() => handleEditClick(index, session.result)}
                  />
                </td>
                <td className="px-4 py-2">{session.marketId}</td>
                <td className="px-4 py-2">{session.coinTransferred}</td>
                <td className="px-4 py-2">{session.marketTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SessionResult;
