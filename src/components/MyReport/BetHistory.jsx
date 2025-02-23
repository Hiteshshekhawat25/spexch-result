import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../Constant/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const BetHistory = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { matchId, selectionId, id } = useParams();
  const [totalTransactions, setTotalTransactions] = useState(0);
  const location = useLocation();
  // const { userId, matchId, selectionId } = location.state || {};
  console.log("bethistory url params", matchId, selectionId, id);

  const [sortConfig, setSortConfig] = useState({
    key: "sportName",
    direction: "descending",
  });
  const navigate = useNavigate();

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    return [...profitLossData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [profitLossData, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const totalData = {
    sportName: "Total",
    uplineProfitLoss: sortedData.reduce(
      (sum, row) => sum + row.uplineProfitLoss,
      0
    ),
    downlineProfitLoss: sortedData.reduce(
      (sum, row) => sum + row.downlineProfitLoss,
      0
    ),
    commission: sortedData.reduce((sum, row) => sum + row.commission, 0),
  };

  // const handleRowClick = (gameId) => {
  //   navigate(`/bet-history/${gameId}`);
  // };

  useEffect(() => {
    console.log("inside", matchId, id, selectionId);
    const fetchData = async () => {
      setLocalLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const url = `${BASE_URL}/user/get-user-bet?page=1&limit=200&matchId=${matchId}&userId=${selectionId}&selectionId=${id}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setProfitLossData(data.data);
        setTotalEntries(data.total);
        setTotalPages(data.totalPages);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [matchId, id]);

  return (
    <div className="p-4">
      {localLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>
            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>
            <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
              <ClipLoader />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="border border-gray-300 rounded-md bg-white">
            <h1 className="text-xl bg-gradient-blue text-white font-bold p-4">
              Bet History
            </h1>

            <div className="flex justify-between items-center mb-4 p-4">
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-black">
                  Show
                </label>
                <select
                  value={entriesToShow}
                  onChange={(e) => {
                    setEntriesToShow(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[10, 25, 50, 100].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <label className="ml-2 text-sm font-medium text-black">
                  entries
                </label>
              </div>
            </div>
            <div className="overflow-x-auto my-4 mx-4">
              <table className="w-full table-auto border-collapse border border-gray-400">
                <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                  <tr>
                    {[
                      "Sport Name",
                      "Event Name",
                      "Market Name",
                      "Runner Name",
                      "Bet Type",
                      "User Price",
                      "Amount",
                      "PL",
                      "Place Date",
                      "Match Date",
                      "Details",
                    ].map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex justify-between items-center text-center">
                          <span>{key}</span>
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
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profitLossData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-400 ${
                          item.betType === "no" || item.betType === "lay"
                            ? "bg-pink-300"
                            : item.betType === "Back" || item.betType === "yes"
                            ? "bg-lightblue"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.sport}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.match}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.marketNameTwo}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.marketNameTwo}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {/* {item.betType === "no" ? "Lay" : "Back"} */}
                          <td className="px-4 py-3 text-sm text-center">
                            {item.betType === "no"
                              ? "Lay"
                              : item.betType === "yes"
                              ? "Back"
                              : "Void"}
                          </td>
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {/* {(item.fancy/item.odds)} */}
                          {item.fancyOdds}/{item.odds}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {/* <span
                            style={{
                              color: item.totalProfitLoss < 0 ? "red" : "green",
                            }}
                          >
                            {item.totalProfitLoss}
                          </span>
                          &nbsp;
                          <span
                            style={{
                              color: item.totalProfitLoss < 0 ? "green" : "red",
                            }}
                          >
                            (
                            {item.totalProfitLoss > 0
                              ? `-${item.totalProfitLoss}`
                              : Math.abs(item.totalProfitLoss)}
                            )
                          </span> */}
                          <span className={`${item?.totalAmount < 0 ? "text-red-500" : "text-green-800"}`}>
                            {item?.totalAmount}
                          </span>
                          <span style={{ color: "red" }}>
                            {" "}
                            ({item?.totalProfitLoss ? `${item.totalProfitLoss}` : "0"})
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {new Date(item.placeTime).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {new Date(item.matchTime).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </td>

                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          <button className="text-EgyptianBlue">Info</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="px-4 py-3 text-sm text-center"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
              {/* Showing entries text */}
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing{" "}
                {totalTransactions === 0
                  ? 0
                  : (currentPage - 1) * entriesToShow + 1}{" "}
                to {Math.min(currentPage * entriesToShow, totalTransactions)} of{" "}
                {totalTransactions} entries
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
        </>
      )}
    </div>
  );
};

export default BetHistory;
