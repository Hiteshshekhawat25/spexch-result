import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import EventPLFilter from "./EventPLFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { ROUTES_CONST } from "../../Constant/routesConstant";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const EventProfitLoss = ({ Userid }) => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  // const [totalTransactions, setTotalTransactions] = useState(0);

  const location = useLocation();
  const userId = location.state?.userId;
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: "sportName",
    direction: "ascending",
  });
  const navigate = useNavigate();

  const { fromDate, toDate } = useSelector((state) => state.eventPLFilter);
  console.log("fromDate", fromDate);

  console.log("userId", userId);

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

  const handleRowClick = (gameId) => {
    if(location.pathname?.includes('/MyAccount')){
      navigate(`${ROUTES_CONST.SportsandLossEvents}/${gameId}`, {
        state: { userId: userId,list: true, downline: location?.pathname?.includes('/EventProfitLoss') ? false : true },
      });
    }else{
      navigate(`${ROUTES_CONST.SportsandLossEvents}/${gameId}`, {
        state: { userId: userId, downline: location?.pathname?.includes('/EventProfitLoss') ? false : true },
      });
    }
  };

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === "next" && currentPage < totalPages) newPage++;
    else if (direction === "prev" && currentPage > 1) newPage--;
    else if (direction === "first") newPage = 1;
    else if (direction === "last") newPage = totalPages;

    setCurrentPage(newPage);
  };
  return (
    <div className="">
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
          <EventPLFilter
            setPLData={setProfitLossData}
            setTotalTransactions={setTotalEntries}
            setTotalPages={setTotalPages}
            setIsDataFetched={setIsDataFetched}
            entriesToShow={entriesToShow}
            search={search}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            Userid={Userid}
            setLocalLoading={setLocalLoading}
          />
          {/* Data Table */}
          <div className="border border-gray-300 rounded-md bg-white">
            <h1 className="text-[15px] rounded-t-lg p-2 px-4 bg-gradient-seablue text-white font-bold">
              Event Profit Loss
            </h1>


            <div className="flex md:flex-row flex-col gap-3 md:justify-between md:items-center mb-4 p-4">
              <div className="flex items-center">
                <label className="mr-2 text-sm text-black">
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
                <label className="ml-2 text-sm text-black">
                  entries
                </label>
              </div>
              <div>
                <input
                  name="search"
                  className="border-2 px-2 text-sm py-1 w-full md:w-auto rounded-md"
                  autoComplete="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto my-4 mx-4">
              <table className="w-full table-auto border-collapse border border-gray-400">
                <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                  {!location?.pathname?.includes('/MyAccount') ?
                    <tr>
                      {[
                        "sportName",
                        "Upline Profit/Loss",
                        "Downline Profit/Loss",
                        "commission",
                      ].map((key) => (
                        <th
                          key={key}
                          className="border-r border-gray-400 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer"
                          onClick={() => handleSort(key)}
                        >
                          <div className="flex justify-between items-center text-center font-semibold font-custom text-[13px]">
                            <span className="text-center text-nowrap w-full">
                              {key === "sportName"
                                ? "Sport Name"
                                : key === "Upline Profit/Loss"
                                  ? "Upline Profit/Loss"
                                  : key === "Downline Profit/Loss"
                                    ? "Downline Profit/Loss"
                                    : key === "commission"
                                      ? "Commission"
                                      : "Total P & L"}
                            </span>
                            <div className="flex flex-col items-center ml-2">
                              <FaSortUp
                                className={`${sortConfig.key === key &&
                                    sortConfig.direction === "ascending"
                                    ? "text-black"
                                    : "text-gray-400"
                                  }`}
                                style={{
                                  marginBottom: "-6px",
                                }}
                              />
                              <FaSortDown
                                className={`${sortConfig.key === key &&
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
                    :
                    <tr>
                      {[
                        "sportName",
                        "Profit & Loss",
                        "commission",
                        "Total Profit&Loss",
                      ].map((key) => (
                        <th
                          key={key}
                          className="border-r border-gray-400 px-4 py-3 text-sm font-custom font-medium text-center cursor-pointer"
                          onClick={() => handleSort(key)}
                        >
                          <div className="flex justify-between items-center text-center font-semibold font-custom text-[13px]">
                            <span className="text-center w-full">
                              {key === "sportName"
                                ? "Sport Name"
                                : key === "Profit & Loss"
                                  ? "Profit & Loss"
                                  : key === "Downline Profit/Loss"
                                    ? "Downline Profit/Loss"
                                    : key === "commission"
                                      ? "Commission"
                                      : "Total P & L"}
                            </span>
                            <div className="flex flex-col items-center ml-2">
                              <FaSortUp
                                className={`${sortConfig.key === key &&
                                    sortConfig.direction === "ascending"
                                    ? "text-black"
                                    : "text-gray-400"
                                  }`}
                                style={{
                                  marginBottom: "-6px",
                                }}
                              />
                              <FaSortDown
                                className={`${sortConfig.key === key &&
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
                    </tr>}
                </thead>
                <tbody>
                  {profitLossData.length > 0 ? (
                    [...paginatedData]?.sort((a, b) => {
                      if (sortConfig?.key !== '') {
                        if (sortConfig?.direction == 'ascending') {
                          console.log('runnnnn2', a[sortConfig.key] - b[sortConfig.key])
                          if (sortConfig?.key == 'refPL') {
                            return (a?.totalOpeningBalance - a?.creditReference) - (b?.totalOpeningBalance - b?.creditReference)
                          } else if (sortConfig?.key == 'username') {
                            return a.name?.localeCompare(a.name)
                          } else {
                            return a[sortConfig.key] - b[sortConfig.key]
                          }
                        } else if (sortConfig?.direction == 'descending') {
                          console.log('runnnnn3', b[sortConfig.key] - a[sortConfig.key])
                          if (sortConfig?.key == 'refPL') {
                            return (b?.totalOpeningBalance - b?.creditReference) - (a?.totalOpeningBalance - a?.creditReference)
                          } else if (sortConfig?.key == 'username') {
                            return b?.name?.localeCompare(a?.name)
                          } else {
                            return b[sortConfig.key] - a[sortConfig.key]
                          }
                        }
                      }
                    }).map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-400 font-medium"
                      >
                        <td
                          onClick={() => {
                            if (item._id == 'Casino') {
                              navigate(`${ROUTES_CONST.CasinoSportList}/${item?.gameId}`)
                            } else {
                              handleRowClick(item.gameId)
                            }
                          }}
                          className="px-4 py-3 text-sm text-center text-lightblue border-r border-gray-400 cursor-pointer font-medium"
                        >
                          {item._id}
                        </td>

                        {location?.pathname?.includes('/MyAccount') ?
                          <td
                            className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium"
                            style={{
                              color:
                                item.totalDownlineProfitLoss < 0 ? "red" : "green",
                            }}
                          >
                            {item.totalDownlineProfitLoss < 0
                              ? `-${Math.abs(
                                (item.totalDownlineProfitLoss + item?.totalCommission).toFixed(2)
                              )}`
                              : (item.totalDownlineProfitLoss + item?.totalCommission).toFixed(2)}
                          </td> 
                          :
                          <td
                            className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium"
                            style={{
                              color:
                                item.totalUplineProfitLoss < 0 ? "red" : "green",
                            }}
                          >
                            {item.totalUplineProfitLoss < 0
                              ? `-${Math.abs(
                                (item.totalUplineProfitLoss + item?.totalCommission).toFixed(2)
                              )}`
                              : (item.totalUplineProfitLoss + item?.totalCommission).toFixed(2)}
                          </td>
                        }
                        {location?.pathname?.includes('/MyAccount') ?
                          <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                            {Math.abs(item.totalCommission.toFixed(2))}
                          </td>
                          : 
                          <td
                            className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium"
                            style={{
                              color:
                                item.totalUplineProfitLoss < 0
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {item.totalUplineProfitLoss < 0
                              ? Math.abs(
                                (
                                  item.totalUplineProfitLoss
                                )
                              ).toFixed(2)
                              : (
                                item.totalUplineProfitLoss
                              ).toFixed(2)}
                          </td>}

                        {location?.pathname?.includes('/MyAccount') ?
                          <td
                            className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium"
                            style={{
                              color:
                                item.totalDownlineProfitLoss < 0
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {item.totalDownlineProfitLoss < 0
                              ? Math.abs(
                                (
                                  item.totalDownlineProfitLoss
                                ).toFixed(2)
                              )
                              : (
                                item.totalDownlineProfitLoss
                              ).toFixed(2)}
                          </td>
                          :
                          <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                            {Math.abs(item.totalCommission)?.toFixed(2)}
                          </td>

                        }

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-3 text-sm text-center">
                        No data !
                      </td>
                    </tr>
                  )}
                </tbody>

                {profitLossData.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-300 text-black font-medium">
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                        {totalData.username}
                      </td>
                      {location?.pathname?.includes('/MyAccount') ?
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                        <span
                          className={`${totalData.downlineProfitLoss < 0
                              ? "text-red-500"
                              : "text-green-500"
                            }`}
                        >
                          {totalData.downlineProfitLoss < 0
                            ? `-${Math.abs(totalData.downlineProfitLoss)?.toFixed(2)}`
                            : Math.abs(totalData.downlineProfitLoss)?.toFixed(2)}
                        </span>
                      </td>
                      :
                      <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                        <span
                          className={`${totalData.profitLoss < 0
                              ? "text-red-500"
                              : "text-green-500"
                            }`}
                        >
                          {totalData.profitLoss < 0
                            ? `-${Math.abs(totalData.profitLoss)?.toFixed(2)}`
                            : Math.abs(totalData.profitLoss)?.toFixed(2)}
                        </span>
                      </td>
                          }

                      {location?.pathname?.includes('/MyAccount') ?
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                          {totalData.commission?.toFixed(2)}
                        </td>
                        :
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                          <span
                            className={`${totalData.downlineProfitLoss < 0
                                ? "text-red-500"
                                : "text-green-500"
                              }`}
                          >
                            {Math.abs(
                              totalData.downlineProfitLoss + totalData.commission
                            )?.toFixed(2)}
                          </span>
                        </td>
                      }

                      {location?.pathname?.includes('/MyAccount') ?
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                          <span
                            className={`${totalData.downlineProfitLoss < 0
                                ? "text-red-500"
                                : "text-green-500"
                              }`}
                          >
                            {Math.abs(
                              totalData.downlineProfitLoss + totalData.commission
                            )?.toFixed(2)}
                          </span>
                        </td>
                        :
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-400 font-medium">
                          {totalData.commission?.toFixed(2)}
                        </td>

                      }
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 flex-col sm:flex-row p-3">
              {/* Showing entries text */}
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing{" "}
                {totalEntries === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
                to {Math.min(currentPage * entriesToShow, totalEntries)} of{" "}
                {totalEntries} entries
              </div>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex space-x-2">
                  {/* First Button */}
                  <button
                    onClick={() => handlePageChange("first")}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded ${currentPage === 1
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
                    className={`px-3 py-1 text-sm rounded ${currentPage === 1
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
                            className={`px-3 py-1 text-sm border border-gray-300 rounded ${currentPage === page
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
                    className={`px-3 py-1 text-sm rounded ${currentPage === totalPages
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
                    className={`px-3 py-1 text-sm rounded ${currentPage === totalPages
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

export default EventProfitLoss;
