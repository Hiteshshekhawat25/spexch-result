import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectBetListData,
  selectBetListLoading,
  selectBetListError,
} from "../../Store/Slice/betListSlice";
import { selectBetListFilter } from "../../Store/Slice/betListFilterSlice"; // Filter slice
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import UserHierarchyModal from "../Modal/UserHierarchyModal";

import BetListFilter from "./BetListFilter";
import { ClipLoader } from "react-spinners";
import { searchbetList } from "../../Services/Downlinelistapi";

const BetList = ({ Userid }) => {
  const dispatch = useDispatch();
  const data = useSelector(selectBetListData);
  const loading = useSelector(selectBetListLoading);
  const error = useSelector(selectBetListError);
  const filters = useSelector(selectBetListFilter);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [betlistData, setBetlistData] = useState([]);
  const [totalBets, setTotalBets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [roleId, setRoleId] = useState("");
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [searchData, setSearchData] = useState([]);
  console.log("Userid", Userid);

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  const handleBetlistUpdate = (newData) => {
    setBetlistData(newData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    setBetlistData(data);
    setCurrentPage(1);
  }, [data, filters]);

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  //   setCurrentPage(1);
  // };
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };
  const paginatedData = betlistData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  console.log("Paginated Data:", paginatedData);
  const handleFilterChange = (data) => {
    setTotalBets(data.pagination.totalTransactions || 0);
    setTotalPages(data.pagination.totalPages || 1);
    setBetlistData(data.data || []);
  };

  const handleMouseEnter = (item) => {
    // Set a timeout to show the modal after 500ms
    const timeout = setTimeout(() => {
      setSelectedUserId(item.createdBy);
      setSelectedUsername(item.username);
      setIsModalOpen(true);
    }, 500);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear the timeout if the user stops hovering
    // if (hoverTimeout) {
    //   clearTimeout(hoverTimeout);
    // }
    // setIsModalOpen(false);
    // setSelectedUserId(null);
    // setSelectedUsername(null);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...betlistData].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  useEffect(() => {}, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm?.length) {
      try {
        const res = await searchbetList(
          `user/get-bet-list?page=1&limit=10&search=${searchTerm}`
        );
        setSearchData(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>
            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>
            <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
              Loading...
            </div>
          </div>
        </div>
      ) : (
        <>
          <BetListFilter
            setTotalBets={(total) => setTotalBets(total)}
            setTotalPages={(total) => setTotalPages(total)}
            setBetlistData={handleBetlistUpdate}
            entriesToShow={entriesToShow}
            currentPage={currentPage}
            setIsDataFetched={(isFetched) => console.log(isFetched)}
            setCurrentPage={setCurrentPage}
            userID={Userid}
          />

          <div className="border border-gray-300 rounded-md bg-white">
            <h1 className="text-sm bg-gradient-seablue text-white font-bold p-2 rounded-t-md text-[15px]">
              Bet History
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:pb-0 pb-2 gap-4">
              <div className="flex items-center">
                <label className="mr-2 text-sm text-black">
                  Show
                </label>
                <select
                  value={entriesToShow}
                  onChange={handleEntriesChange}
                  className="border rounded px-2 py-1 border-gray-400 text-sm"
                >
                  {[10, 25, 50, 100].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <label className="ml-2 text-sm text-black">
                  entries
                </label>
              </div>
              <div className="flex items-center w-auto">
                <p className="mr-2 text-sm text-black">Search:</p>
                <input
                  type="text"
                  // placeholder="Search by username"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border rounded px-2 py-1 h-[32px] text-sm w-full md:w-auto"
                />
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto p-4">
                <table className="w-full table-auto border-collapse border border-gray-400 p-2">
                  <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                    <tr className="text-center">
                      {[
                        "username",
                        "sportName",
                        "event",
                        "market",
                        "selection",
                        "Type",
                        "oddsReq",
                        "stake",
                        "placeTime",
                        "settleTime",
                      ].map((key) => (
                        <th
                          key={key}
                          className="border border-gray-400 text-left px-4 text-sm font-medium text-black cursor-pointer p-1"
                          onClick={() => handleSort(key)}
                        >
                          <div className="flex flex-col border-b border-gray-300 pb-2">
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
                                  : key === "selection"
                                  ? "Selection"
                                  : key === "Type"
                                  ? "Type"
                                  : key === "oddsReq"
                                  ? "Odds Req."
                                  : key === "stake"
                                  ? "Stack"
                                  : key === "placeTime"
                                  ? "Place Time"
                                  : key === "settleTime"
                                  ? "Settle Time"
                                  : key}
                              </span>

                              <div className="flex flex-col items-center ml-2">
                                <FaSortUp
                                  className={`${
                                    sortConfig.key === key &&
                                    sortConfig.direction === "ascending"
                                      ? "text-black"
                                      : "text-gray-400"
                                  }`}
                                  style={{
                                    marginBottom: "-6px",
                                  }}
                                />
                                <FaSortDown
                                  className={`${
                                    sortConfig.key === key &&
                                    sortConfig.direction === "descending"
                                      ? "text-black"
                                      : "text-gray-400"
                                  }`}
                                  style={{
                                    marginTop: "-6px",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* <tbody className="text-center">
                  {(searchData.length > 0 ? searchData : sortedData).length > 0 ? (
    (searchData.length > 0 ? searchData : sortedData).map((item, index) => (
                        <tr key={index}>
                          <td
                           onMouseEnter={() => handleMouseEnter(item)}
                           onMouseLeave={handleMouseLeave}
                            onClick={() => {
                              setSelectedUserId(item.createdBy);
                              setSelectedUsername(item.username);
                              setIsModalOpen(true);
                            }}
                            className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer"
                          >
                            {item.username}
                          </td>

                          <td className="border border-gray-400 px-4 py-3">
                            {item.sport}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.event}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.market}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.selection}
                          </td>
                          <td
                            className={`border border-gray-400 px-4 py-3 font-bold ${
                              item.type === "no" ? "text-red-600" : "text-blue"
                            }`}
                          >
                            {item.type === "no" ? "Lay" : "Back"}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.oddsRequested}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 font-bold">
                            {item.stake?.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.placeTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.placeTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.settleTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.settleTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="border border-gray-400 px-4 py-3"
                        >
                          No data !
                        </td>
                      </tr>
                    )}
                  </tbody> */}
                  <tbody className="text-center">
                    {searchData.length > 0 ? (
                      // If search results exist, display searchData
                      searchData.map((item, index) => (
                        <tr key={index}>
                          <td
                            onMouseEnter={() => handleMouseEnter(item)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => {
                              setSelectedUserId(item.createdBy);
                              setSelectedUsername(item.username);
                              setIsModalOpen(true);
                            }}
                            className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer"
                          >
                            {item.username}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.sport}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.event}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.market}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.selection}
                          </td>
                          <td
                            className={`border border-gray-400 px-4 py-3 font-bold ${
                              item.type === "no" ? "text-red-600" : "text-blue"
                            }`}
                          >
                            {item.type === "no" ? "Lay" : "Back"}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.oddsRequested}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 font-bold">
                            {item.stake?.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.placeTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.placeTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.settleTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.settleTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))
                    ) : sortedData.length > 0 ? (
                      // If no search results but sortedData exists, display sortedData
                      sortedData.map((item, index) => (
                        <tr key={index}>
                          <td
                            onMouseEnter={() => handleMouseEnter(item)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => {
                              setSelectedUserId(item.createdBy);
                              setSelectedUsername(item.username);
                              setIsModalOpen(true);
                            }}
                            className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer"
                          >
                            {item.username}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.sport}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.event}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.market}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.selection}
                          </td>
                          <td
                            className={`border border-gray-400 px-4 py-3 font-bold ${
                              item.type === "no" ? "text-red-600" : "text-blue"
                            }`}
                          >
                            {item.type === "no" ? "Lay" : "Back"}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {item.oddsRequested}
                          </td>
                          <td className="border border-gray-400 px-4 py-3 font-bold">
                            {item.stake?.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.placeTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.placeTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="border border-gray-400 px-4 py-3">
                            {new Date(item.settleTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            {new Date(item.settleTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="border border-gray-400 px-4 py-3"
                        >
                          No data found!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between sm:items-center mt-1 flex-col sm:flex-row p-4">
              {/* Showing entries text */}
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing{" "}
                {totalBets === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
                {Math.min(currentPage * entriesToShow, totalBets)} of{" "}
                {totalBets} entries
              </div>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex space-x-2">
                  {/* First Button */}
                  <button
                    onClick={() => handlePageChange("first")}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    First
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                              currentPage === page
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-3 py-1 text-sm">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>

                  {/* Last Button */}
                  <button
                    onClick={() => handlePageChange("last")}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
          {isModalOpen && (
            <UserHierarchyModal
              userId={selectedUserId}
              username={selectedUsername}
              closeModal={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BetList;
