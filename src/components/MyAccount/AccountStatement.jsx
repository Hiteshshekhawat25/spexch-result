import React, { useState, useEffect } from "react";
import AccountStatementFilter from "./AccountStatementFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaRegArrowAltCircleRight } from 'react-icons/fa';

const AccountStatement = ({ Userid }) => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statementData, setStatementData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const { userData } = useSelector((state) => state.user);

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };

  // const handleFilterChange = (data) => {
  //   setTotalTransactions(data.pagination.totalTransactions || 0);
  //   setTotalPages(data.pagination.totalPages || 1);
  //   setStatementData(data.data || []);
  // };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "ascending";
    }
    setSortConfig((prev) =>
      prev.key === key && prev.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" });
  };

  const sortedData = [...statementData].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    // Fetch data when currentPage or Userid changes
    // fetchData();
  }, [currentPage, Userid]);

  const formatDateTime = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="">
      <AccountStatementFilter
        setTotalTransactions={setTotalTransactions}
        setTotalPages={setTotalPages}
        setTransactions={setStatementData}
        entriesToShow={entriesToShow}
        currentPage={currentPage}
        setIsDataFetched={setIsDataFetched}
        setCurrentPage={setCurrentPage}
        Userid={Userid}
      />

      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          Account Statement
        </h1>
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center">
            <label className="mr-2 text-[12px] font-custom font-medium text-black">
              Show
            </label>
            <select
              value={entriesToShow}
              onChange={(e) => {
                setEntriesToShow(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 outline-none border-gray-400 text-[12px]"
            >
              {[10, 25, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <label className="ml-2 text-[12px] font-custom font-medium text-black">
              entries
            </label>
          </div>
        </div>

        <div className="overflow-x-auto my-4 mx-4">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="border border-gray-300 bg-gray-200 text-black">
              <tr>
                {[
                  { key: "createdAt", label: "Date" },
                  { key: "amount", label: "Deposit" },
                  { key: "amount", label: "Withdraw" },
                  { key: "currentMainWallet", label: "Balance" },
                  { key: "description", label: "Remark" },
                  { key: "from_To", label: "From/To" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="border border-gray-300 text-center sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-center w-full">{label}</span>

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
              {sortedData.length > 0 ? (
                [...sortedData]?.sort((a, b) => {
                  if (sortConfig?.key !== '') {
                    if(sortConfig?.direction == 'ascending'){
                      console.log('runnnnn2',a[sortConfig.key] - b[sortConfig.key])
                      if(sortConfig?.key == 'refPL'){
                        return (a?.totalOpeningBalance - a?.creditReference) - (b?.totalOpeningBalance - b?.creditReference)
                      }else if(sortConfig?.key == 'username'){
                        return a.name?.localeCompare(a.name)
                      }else{
                        return a[sortConfig.key] - b[sortConfig.key]
                      }
                    }else if(sortConfig?.direction == 'descending'){
                      console.log('runnnnn3', b[sortConfig.key] - a[sortConfig.key])
                      if(sortConfig?.key == 'refPL'){
                        return (b?.totalOpeningBalance - b?.creditReference) - (a?.totalOpeningBalance - a?.creditReference)
                      }else if(sortConfig?.key == 'username'){
                        return b?.name?.localeCompare(a?.name)
                      }else{
                    return  b[sortConfig.key] - a[sortConfig.key]
                      }
                    }}
                }).map((item, index) => (
                  <tr key={index} className="border border-gray-300 text-center">
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold">
                      {item.transactionType === "credit" ? item.amount : "-"}
                    </td>
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      {item.transactionType === "debit" ? item.amount : "-"}
                    </td>
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-bold">
                      {item.currentMainWallet}
                    </td>
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      {item.description || userData?.data?.username}
                    </td>
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      <span className=" flex items-center gap-1">
                        {item?.from} <FaRegArrowAltCircleRight/> {item?.to}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 flex-col sm:flex-row p-4 pt-0">
          {/* Showing entries text */}
          <div className="text-[12px] text-gray-600 mb-2 sm:mb-0">
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
    </div>
  );
};

export default AccountStatement;
