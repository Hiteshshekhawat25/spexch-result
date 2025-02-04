import React, { useState, useEffect } from "react";
import PLFilter from "./PLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios";

const ProfitLoss = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  // Sort Function
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Fetch Expanded Data for a User
  const fetchUserData = async (userId) => {
    const token = localStorage.getItem("authToken");
    setLocalLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/user/get-profit-loss`, {
        params: { page: 1, limit: 10, userId },
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      console.log("data", data);
      setExpandedRows(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const sortedData = [...profitLossData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData;

  const totalData = {
    username: "Total",
    profitLoss: sortedData.reduce((sum, row) => sum + row.profitLoss, 0),
    downlineProfitLoss: sortedData.reduce(
      (sum, row) => sum + row.downlineProfitLoss,
      0
    ),
    commission: sortedData.reduce((sum, row) => sum + row.commission, 0),
  };

  return (
    <div className="p-4">
      <PLFilter
        setPLData={setProfitLossData}
        setTotalTransactions={setTotalEntries}
        setTotalPages={setTotalPages}
        setIsDataFetched={setIsDataFetched}
        entriesToShow={entriesToShow}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setLocalLoading={setLocalLoading}
      />

      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-blue text-white font-custom font-bold">
          Profit Loss
        </h1>

        {/* Table Header */}
        <div className="overflow-x-auto my-4 mx-4">
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead className="border border-gray-400 bg-gray-200 text-black text-center">
              <tr>
                {[
                  "username",
                  "profitLoss",
                  "downlineProfitLoss",
                  "commission",
                ].map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer border-r border-gray-400"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex justify-between items-center text-center">
                      <span>{key === "username" ? "Username" : key}</span>
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
              {expandedRows.length > 0 ? (
                expandedRows.map(
                  (row, index) => (
                    console.log("row", row),
                    (
                      <tr key={index} className="border-b border-gray-400">
                        <td
                          className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium text-lightblue cursor-pointer"
                          onClick={() => fetchUserData(row._id)}
                        >
                          {row.username ? row.username.toUpperCase() : ""}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                            row.totalUplineProfitLoss < 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {Math.abs(row.totalUplineProfitLoss)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                            row.totalDownlineProfitLoss < 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {Math.abs(row.totalDownlineProfitLoss)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                            row.commission < 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {0}
                        </td>
                      </tr>
                    )
                  )
                )
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td
                      className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium text-lightblue cursor-pointer"
                      onClick={() => fetchUserData(item._id)}
                    >
                      {item.username ? item.username.toUpperCase() : ""}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                        item.totalUplineProfitLoss < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {Math.abs(item.totalUplineProfitLoss.toFixed(2))}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                        item.totalDownlineProfitLoss < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {Math.abs(item.totalDownlineProfitLoss.toFixed(2))}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                        item.commission < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {/* {Math.abs(item.commission)} */}
                      {0}
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

            {/* Footer */}
            <tfoot>
              <tr className="bg-gray-300 text-black">
                {console.log("totalllllllllllllll", totalData)}
                <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-bold text-blue-500">
                  {totalData.username ? totalData.username.toUpperCase() : ""}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.profitLoss < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.abs(totalData.profitLoss)}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.downlineProfitLoss < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {Math.abs(totalData.downlineProfitLoss)}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.commission < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.abs(totalData.commission)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
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
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    </div>
  );
};

export default ProfitLoss;
