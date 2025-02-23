import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../../Constant/Api";
import { useNavigate, useParams } from "react-router-dom";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const ProfitLossUser = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { selectionId, id } = useParams();
  console.log("selection", selectionId, id);

  const [sortConfig, setSortConfig] = useState({
    key: "sportName",
    direction: "ascending",
  });
  const navigate = useNavigate();

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

  const handleRowClick = (matchId, id, selectionId) => {
    navigate(`/bet-history/${matchId}/${selectionId}/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${BASE_URL}/user/get-selection-bet-profit-loss?page=1&limit=200&selectionId=${id}&matchId=${selectionId}`,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log({ data }, "data");
        setProfitLossData(data.data);
        setTotalEntries(data?.pagination?.totalRecords);
        setTotalPages(data?.pagination?.totalPages);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };

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
              Profit Loss User
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
                      "User Name",
                      "Sport Name",
                      "Event Name",
                      "Market Name",
                      "Result",
                      "Profit/Loss",
                      "Commission",
                      "SettleTime",
                    ].map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex justify-between items-center text-center">
                          <span>
                            {key === "User Name"
                              ? "User Name"
                              : key === "Sport Name"
                              ? "Sport Name"
                              : key === "Event Name"
                              ? "Event Name"
                              : key === "Market Name"
                              ? "Market Name"
                              : key === "Result"
                              ? "Result"
                              : key === "Profit/Loss"
                              ? "Profit/Loss"
                              : key === "SettleTime"
                              ? "SettleTime"
                              : "Commission"}
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
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profitLossData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-400">
                        <td
                          onClick={() => {
                            console.log(
                              "Clicked",
                              item.selectionId,
                              item.matchDetails._id,
                              item._id
                            );
                            handleRowClick(
                              item.matchDetails._id,
                              item._id,
                              item.selectionId
                            );
                          }}
                          className="px-4 py-3 text-sm text-center text-lightblue border-r border-gray-400 cursor-pointer"
                        >
                          {item.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.sport}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.match}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.type === "odds"
                            ? "Match odds"
                            : item.type === "bookmakers"
                            ? "Bookmaker"
                            : item.type === "toss"
                            ? "Toss"
                            : item.marketNameTwo}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item?.marketName ?? "-"}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-center border-r border-gray-400"
                          style={{
                            color: item.totalProfitLoss < 0 ? "red" : "green",
                          }}
                        >
                          {item.totalProfitLoss < 0
                            ? Math.abs(item?.totalProfitLoss?.toFixed(2))
                            : item?.totalProfitLoss?.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          {item.totalCommission.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                          <p>
                            {new Date(item.settledTime).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-sm text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* 
                {profitLossData.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-300 text-black">
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                        {totalData.sportName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                        {totalData.uplineProfitLoss}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                        {totalData.downlineProfitLoss}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {totalData.commission}
                      </td>
                    </tr>
                  </tfoot>
                )}
                  */}
              </table>
            </div>

            <div className="flex justify-between  items-center mt-4  flex-col sm:flex-row">
              <div className="text-sm text-gray-600 sm:mb-0">
                Showing{" "}
                {totalEntries > 0
                  ? `${(currentPage - 1) * entriesToShow + 1} to ${Math.min(
                      currentPage * entriesToShow,
                      totalEntries
                    )}`
                  : "0 to 0"}{" "}
                of {totalEntries} entries
              </div>
              <div className="flex space-x-2 sm:ml-auto">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfitLossUser;
