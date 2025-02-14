import React, { useState, useEffect } from "react";
import PLFilter from "./PLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES_CONST } from "../../Constant/routesConstant";

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
  const navigate = useNavigate();
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const fetchUserData = async (userId, role_name, item) => {
    const token = localStorage.getItem("authToken");
    setLocalLoading(true);
    if (role_name === "user") {
      navigate(ROUTES_CONST.MyAccount, {
        state: {
          selectedUser: item,
          selectedPage: "profitLoss",
        },
      });
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/get-profit-loss`, {
        params: { page: currentPage, limit: 10, userId },
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
    profitLoss: sortedData.reduce(
      (sum, row) => sum + (Number(row.totalUplineProfitLoss) || 0),
      0
    ),
    downlineProfitLoss: sortedData.reduce(
      (sum, row) => sum + (Number(row.totalDownlineProfitLoss) || 0),
      0
    ),
    commission: sortedData.reduce(
      (sum, row) => sum + (Number(row.totalCommission) || 0),
      0
    ),
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
        <h1 className="text-xl p-2 px-4 bg-gradient-blue text-white font-custom font-bold">
          Profit Loss
        </h1>

        {/* Table Header */}
        <div className="overflow-x-auto my-4 mx-4">
          <div className="flex justify-between items-center mb-4">
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
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead className="border border-gray-400 bg-gray-200 text-black text-center">
              <tr className="relative ml-50%">
                {[
                  "User Name",
                  "Profit/Loss",
                  "Downline Profit/Loss",
                  "Commission",
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
                      <tr
                        key={index}
                        className="border-b border-gray-400 text-center"
                      >
                        <td
                          className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium text-lightblue cursor-pointer"
                          onClick={() =>
                            fetchUserData(row._id, row.role_name, row)
                          }
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
                            row.totalDownlineProfitLoss < 0 ? "red" : "green"
                          }`}
                        >
                          {Math.abs(row.totalDownlineProfitLoss)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                            row.commission < 0 ? "red" : "green"
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
                      {Math.abs(item.totalCommission.toFixed(2))}
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
            {/* {(expandedRows[0]?.role_name === "master" ||
              paginatedData[0]?.role_name === "master") && ( */}
            <tfoot>
              <tr className="bg-gray-300 text-black">
                <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-bold text-blue-500">
                  {totalData.username ? totalData.username.toUpperCase() : ""}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.profitLoss < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {Math.abs(totalData.profitLoss.toFixed(2))}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.downlineProfitLoss < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {Math.abs(totalData.downlineProfitLoss.toFixed(2))}
                </td>
                <td
                  className={`px-4 py-3 text-sm text-center border-r border-gray-400 font-bold ${
                    totalData.commission < 0 ? "red" : "green"
                  }`}
                >
                  {Math.abs(totalData.commission.toFixed(2))}
                </td>
              </tr>
            </tfoot>
            {/* )} */}
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 p-2 flex-col sm:flex-row">
          <div className="text-[12px] sm:text-sm mb-2 w-full items-start text-gray-600 sm:mb-0">
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
              className="px-3 py-1 text-gray-600 rounded text-[12px] sm:text-sm border border-gray-300"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 text-gray-600 rounded text-[12px] sm:text-sm border border-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 text-gray-600 rounded text-[12px] sm:text-sm border border-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 text-gray-600 rounded text-[12px] sm:text-sm border border-gray-300"
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
