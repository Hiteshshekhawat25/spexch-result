import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectBetListData, selectBetListLoading, selectBetListError } from "../../Store/Slice/betListSlice";
import { selectBetListFilter } from "../../Store/Slice/betListFilterSlice"; // Filter slice
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import BetListFilter from "./BetListFilter";

const BetList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectBetListData); // Data fetched from Redux store
  const loading = useSelector(selectBetListLoading);
  const error = useSelector(selectBetListError);
  const filters = useSelector(selectBetListFilter); // Access filters from Redux

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [betlistData, setBetlistData] = useState([]); // Initialize betlistData with empty array
  const [totalBets, setTotalBets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  // Handle BetListFilter data update
  const handleBetlistUpdate = (newData) => {
    setBetlistData(newData);
  };

  useEffect(() => {
    // Set betlist data whenever Redux data or filters change
    setBetlistData(data);
    setCurrentPage(1); // Reset page when data or filters change
  }, [data, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on entries change
  };

  

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "first") {
      setCurrentPage(1);
    } else if (direction === "last") {
      setCurrentPage(totalPages);
    }
  };

  const paginatedData = betlistData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...paginatedData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="p-4">
      {/* Pass necessary state management functions to BetListFilter */}
      <BetListFilter 
        setTotalBets={(total) => setTotalBets(total)} 
        setTotalPages={(total) => setTotalPages(total)} 
        setBetlistData={handleBetlistUpdate} 
        entriesToShow={entriesToShow}
        currentPage={currentPage}
        setIsDataFetched={(isFetched) => console.log(isFetched)} // Just an example, replace with the actual logic
        setCurrentPage={setCurrentPage}
      />

      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-blue text-white font-bold">Bet List</h1>

        {/* Search and Entries Per Page */}
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-black">Show</label>
            <select
              value={entriesToShow}
              onChange={handleEntriesChange}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <label className="ml-2 text-sm font-medium text-black">entries</label>
          </div>
          <div className="flex items-center">
            <p>Search:</p>
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-400 p-2">
              <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                <tr className="text-center">
                  {[ 
                    "username",
                    "sportName",
                    "event",
                    "market",
                    "selectionType",
                    "odds",
                    "reqPL",
                    "result",
                    "placeTime",
                    "settleTime",
                  ].map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {key === "username"
                            ? "Username"
                            : key === "sportName"
                            ? "Sport Name"
                            : key === "event"
                            ? "Event"
                            : key === "market"
                            ? "Market"
                            : key === "selectionType"
                            ? "Selection Type"
                            : key === "odds"
                            ? "Odds"
                            : key === "reqPL"
                            ? "Required P&L"
                            : key === "result"
                            ? "Result"
                            : key === "placeTime"
                            ? "Place Time"
                            : "Settle Time"}
                        </span>
                        <div className="flex flex-col items-center space-y-0.5 ml-2">
                          <FaSortUp
                            className={`text-sm ${
                              sortConfig.key === key && sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                          />
                          <FaSortDown
                            className={`text-sm ${
                              sortConfig.key === key && sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center">
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-4 py-3">{item.username}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.sportName}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.event}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.market}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.selectionType}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.odds}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.reqPL}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.result}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.placeTime}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.settleTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="border border-gray-400 px-4 py-3">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {/* Pagination */}
<div className="flex justify-end items-center py-2 space-x-2">
  <button
    onClick={() => handlePageChange("first")}
    disabled={currentPage === 1}
    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
  >
    First
  </button>
  <button
    onClick={() => handlePageChange("prev")}
    disabled={currentPage === 1}
    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
  >
    Prev
  </button>
  <button
    onClick={() => handlePageChange("next")}
    disabled={currentPage === totalPages}
    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
  >
    Next
  </button>
  <button
    onClick={() => handlePageChange("last")}
    disabled={currentPage === totalPages}
    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
  >
    Last
  </button>
</div>

      </div>
    </div>
  );
};

export default BetList;
