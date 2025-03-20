import React, { useState, useEffect } from "react";
import PLFilter from "./PLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES_CONST } from "../../Constant/routesConstant";
import { useSelector } from "react-redux";

const ProfitLoss = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const location = useLocation()
  const plFilterState = useSelector((state) => state.plFilter);
  const { dataSource, fromDate, toDate, fromTime, toTime } =
    plFilterState || {};
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });
  const navigate = useNavigate();

  console.log("fromDate1234",plFilterState,fromDate,{toDate});
  console.log("todate",toDate)

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
          userId: item._id,
          selectedPage: "profitLoss",
        },
      });
      setLocalLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user/get-profit-loss`, {
        params: {
          page: currentPage,
          limit: entriesToShow,
          userId,
          fromDate : fromDate,
          toDate : toDate,
        },
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Request URL:", response.config.url);
      // console.log("Response Data:", response?.data);

      const data = response?.data?.data || [];
      setExpandedRows(data);
      setProfitLossData(data);
      setTotalPages(response?.data?.pagination?.totalPages || 0);
      setTotalEntries(response?.data?.pagination?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if(fromDate && toDate){
      fetchUserData();
    }
  }, [currentPage, entriesToShow,fromDate,toDate]);

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

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };

  console.log(totalData,sortedData,'totalData')
  return (
    <div className="md:mx-0 mx-2 ">
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

      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          Profit Loss
        </h1>

        <div className="md:p-4 p-3">
          {/* Table Header */}
          <div className="overflow-x-auto ">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <label className="mr-1.5 text-[13px] font-medium text-black">
                  Show
                </label>
                <select
                  value={entriesToShow}
                  onChange={(e) => {
                    setEntriesToShow(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 outline-none text-[13px]"
                >
                  {[10, 25, 50, 100].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <label className="ml-2 text-[13px] font-medium text-black">
                  entries
                </label>
              </div>
            </div>
            <table className="w-full text-center table-auto border-collapse border border-gray-300">
              <thead className="border border-gray-400 bg-gray-200 text-black text-center">
                <tr className="relative ml-50%">
                  { 
                  [
                    "User Name",
                    "Profit/Loss",
                    "Downline Profit/Loss",
                    "Commission",
                  ].map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex justify-between  items-center text-center">
                        <span className="w-full">{key === "username" ? "Username" : key}</span>
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
                      // console.log("row", row),
                      (
                        <tr
                          key={index}
                          className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack"
                        >
                          <td
                            className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-linkcolor"
                            onClick={() =>
                              fetchUserData(row._id, row.role_name, row)
                            }
                          >
                            {row.username ? row.username.toUpperCase() : ""}
                          </td>
                          <td
                            className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border font-bold border-gray-300 text-darkblack ${
                              row.totalUplineProfitLoss < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {/* {Math.abs(row.totalUplineProfitLoss.toFixed(2))} */}
                            {row.totalUplineProfitLoss.toFixed(2)}
                            {/* + {row.commission} */}
                          </td>
                          <td
                            className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                              row.totalDownlineProfitLoss < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {Math.abs((row.totalDownlineProfitLoss + row.totalCommission)).toFixed(2)}
                          </td>
                          <td
                            className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack ${
                              row.commission < 0 ? "red" : "green"
                            }`}
                          >
                            {Math.abs(row.totalCommission.toFixed(2))}
                          </td>
                        </tr>
                      )
                    )
                  )
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-400">
                      <td
                        className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack"
                        onClick={() =>
                          fetchUserData(item._id, item.role_name, item)
                        }
                      >
                        {item.username ? item.username.toUpperCase() : ""}
                      </td>
                      <td
                        className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                          item.totalUplineProfitLoss < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {Math.abs(item.totalUplineProfitLoss.toFixed(2))}
                      </td>
                      <td
                        className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                          item.totalDownlineProfitLoss < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {Math.abs(item.totalDownlineProfitLoss.toFixed(2))}
                      </td>
                      <td
                        className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
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
                <tr className="bg-gray-200 text-black">
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold">
                    {totalData?.username ? totalData?.username.toUpperCase() : ""}
                  </td>
                  <td
                    className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                      totalData?.profitLoss < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {Math.abs(totalData?.profitLoss?.toFixed(2) || 0)}
                  </td>
                  <td
                    className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                      totalData?.downlineProfitLoss < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {Math.abs(totalData?.downlineProfitLoss?.toFixed(2) || 0)}
                  </td>
                  <td
                    className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold ${
                      totalData?.commission < 0 ? "red" : "green"
                    }`}
                  >
                    {Math.abs(totalData?.commission?.toFixed(2) || 0)}
                  </td>
                </tr>
              </tfoot>
              {/* )} */}
            </table>
          </div>

          {/* Pagination */}
          {/* <div className="flex justify-between items-center mt-4 p-2 flex-col sm:flex-row">
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
          </div> */}
          <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
            {/* Showing entries text */}
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing{" "}
              {totalEntries === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
              {Math.min(currentPage * entriesToShow, totalEntries)} of{" "}
              {totalEntries} entries
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
      </div>
    </div>
  );
};

export default ProfitLoss;
