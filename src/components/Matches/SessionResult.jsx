import React, { useEffect, useState } from "react";
import { ImBook } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, selectSessions } from "../../Store/Slice/SessionSlice";
import { FaEdit } from "react-icons/fa";
import { getMatchList } from "../../Services/Newmatchapi";

const SessionResult = () => {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state);
  const [editingRow, setEditingRow] = useState(null);
  const [tempResult, setTempResult] = useState("");
  const [matchList, setMatchList] = useState([]); // Store the match list here
  const [matchLoading, setMatchLoading] = useState(false); // State for loading match list
  const [matchError, setMatchError] = useState(""); // State for error in match fetching

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleEditClick = (index, currentResult) => {
    setEditingRow(index);
    setTempResult(currentResult);
  };

  const handleResultChange = (e) => {
    setTempResult(e.target.value);
  };

  const handleSaveResult = (id) => {
    setEditingRow(null); // Exit edit mode
  };

  const handleMatchSelectFocus = async () => {
    if (matchList.length > 0) return;
    setMatchLoading(true);
    setMatchError("");
    try {
      const response = await getMatchList();
      console.log("responseresponseresponse",response)
      setMatchList(response || []);
    } catch (error) {
      console.error("Error fetching match list:", error);
      setMatchError("Error fetching match list.");
    } finally {
      setMatchLoading(false);
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
            onFocus={handleMatchSelectFocus} // Trigger API call on focus
            disabled={matchLoading} // Disable dropdown when loading
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
            <option value="session1">Session 1</option>
            <option value="session2">Session 2</option>
            <option value="session3">Session 3</option>
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
          <button className="px-4 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600">
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
                      onBlur={() => handleSaveResult(session.id)}
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
