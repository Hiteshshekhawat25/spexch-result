import React, { useState } from "react";
import PLFilter from "./PLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";

const ProfitLoss = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...profitLossData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  
  console.log("Current Page: ", currentPage);
  console.log("Entries to Show: ", entriesToShow);
  console.log("Total Entries: ", totalEntries);

 
    
  const paginatedData = sortedData;

  console.log("Paginated Data: ", paginatedData);

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
      {/* Filter Component */}
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

        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm  font-custom font-medium text-black">Show</label>
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
            <label className="ml-2 text-sm font-custom font-medium text-black">entries</label>
          </div>
        </div>

        <div className="overflow-x-auto my-4 mx-4">
          <table className="w-full table-auto border-collapse border border-gray-400 ">
            <thead className="border border-gray-400 bg-gray-200 text-black text-center ">
              <tr>
                {["username", "profitLoss", "downlineProfitLoss", "commission"].map((key) => (
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                      {item.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                      {item.profitLoss}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                      {item.downlineProfitLoss}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {item.commission}
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
            {paginatedData.length > 0 && (
              <tfoot>
                <tr className="bg-gray-300 text-black">
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                    {totalData.username}
                  </td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-400">
                    {totalData.profitLoss}
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4  flex-col sm:flex-row">
              <div className="text-sm text-gray-600 sm:mb-0">

              Showing{" "}
  {totalEntries > 0
    ? `${(currentPage - 1) * entriesToShow + 1} to ${Math.min(currentPage * entriesToShow, totalEntries)}`
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

