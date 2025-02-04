import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import EventPLFilter from "./EventPLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { ROUTES_CONST } from "../../Constant/routesConstant";
import { useNavigate } from "react-router-dom";

const EventProfitLoss = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

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

  const handleRowClick = (gameId) => {
    navigate(`${ROUTES_CONST.SportsandLossEvents}/${gameId}`);
  };
  return (
    <div className="p-4">
      {localLoading ? (
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
          <EventPLFilter
            setPLData={setProfitLossData}
            setTotalTransactions={setTotalEntries}
            setTotalPages={setTotalPages}
            setIsDataFetched={setIsDataFetched}
            entriesToShow={entriesToShow}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setLocalLoading={setLocalLoading}
          />
          {/* Data Table */}
          <div className="border border-gray-300 rounded-md bg-white">
            <h1 className="text-xl bg-gradient-blue text-white font-bold">
              Event Profit Loss
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
                      "sportName",
                      "uplineProfitLoss",
                      "downlineProfitLoss",
                      "commission",
                    ].map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex justify-between items-center text-center">
                          <span>
                            {key === "sportName"
                              ? "Sport Name"
                              : key === "uplineProfitLoss"
                              ? "Upline Profit/Loss"
                              : key === "downlineProfitLoss"
                              ? "Downline Profit/Loss"
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
                    paginatedData.map(
                      (item, index) => (
                        console.log("item", item),
                        (
                          <tr key={index} className="border-b border-gray-400">
                            <td
                              onClick={() => handleRowClick(item.gameId)}
                              className="px-4 py-3 text-sm text-center text-lightblue border-r border-gray-400 cursor-pointer"
                            >
                              {item._id}
                            </td>
                            <td
                              className="px-4 py-3 text-sm text-center border-r border-gray-400"
                              style={{
                                color:
                                  item.totalUplineProfitLoss < 0
                                    ? "red"
                                    : "green",
                              }}
                            >
                              {item.totalUplineProfitLoss < 0
                                ? Math.abs(
                                    item.totalUplineProfitLoss.toFixed(2)
                                  )
                                : item.totalUplineProfitLoss.toFixed(2)}
                            </td>

                            <td
                              className="px-4 py-3 text-sm text-center border-r border-gray-400"
                              style={{
                                color:
                                  item.totalDownlineProfitLoss < 0
                                    ? "red"
                                    : "green",
                              }}
                            >
                              {item.totalDownlineProfitLoss < 0
                                ? Math.abs(
                                    item.totalDownlineProfitLoss.toFixed(2)
                                  )
                                : item.totalDownlineProfitLoss.toFixed(2)}
                            </td>

                            <td
                              className="px-4 py-3 text-sm text-center"
                              style={{
                                color:
                                  item.totalCommission < 0 ? "red" : "green",
                              }}
                            >
                              {item.totalCommission < 0
                                ? Math.abs(item.totalCommission.toFixed(2))
                                : item.totalCommission.toFixed(2)}
                            </td>
                          </tr>
                        )
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-sm text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>

                {profitLossData.length > 0 && (
                  <tfoot>
                    {console.log("totalData", totalData)}
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
              </table>
            </div>

            <div className="flex justify-between items-center mt-4  flex-col sm:flex-row">
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

export default EventProfitLoss;
