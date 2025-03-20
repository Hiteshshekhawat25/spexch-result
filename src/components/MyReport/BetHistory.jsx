import React, { useEffect, useMemo, useRef, useState } from "react";
import { BASE_URL } from "../../Constant/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const BetHistory = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [search,setSearch] = useState('');
  const time = useRef();
  const [localLoading, setLocalLoading] = useState(false);
  const { matchId, selectionId, id } = useParams();
  const [totalTransactions, setTotalTransactions] = useState(0);
  const location = useLocation();
  const color = location?.state?.color;
  // const { userId, matchId, selectionId } = location.state || {};
  console.log("location1234", location?.state?.type);

  const [sortConfig, setSortConfig] = useState({
    key: "sportName",
    direction: "descending",
  });
  const navigate = useNavigate();
  const { fromDate, toDate } = useSelector((state) => state.eventPLFilter);

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

  const handleChange=(e)=>{
    setSearch(e.target.value) 
    if(time.current){
      clearTimeout(time.current)
    }
    time.current = setTimeout(()=>{
      fetchData(e.target.value)
    },1000)
    
  }

  const fetchData = async (input) => {
    setLocalLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const url = `${BASE_URL}/user/get-user-bet?page=1&limit=200${location?.state?.type == 'casino' ? `&game_id=${matchId}` :`&matchId=${matchId}`}${location?.state?.type !== 'fancy' ? `&type=${location?.state?.type}` : ''}${location?.state?.type == 'fancy' ? `&selectionId=${location?.state?.selectionId}` : ''}&userId=${location?.state?.userId}&fromDate=${fromDate ? fromDate : ''}&toDate=${toDate ? toDate : ''}&search=${input ? input :search}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data, 'paginatedDatapaginatedDatapaginatedData')
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


  useEffect(() => {
    console.log("inside", matchId, id, selectionId);

    fetchData();
  }, [matchId, id]);



  return (
    <div className="md:mx-0 mx-2 ">
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
          <div className="w-full justify-end flex mb-2">
            {color ?
            <div className="flex gap-1">
              <div className="border border-black px-2 h-8 text-[13px] flex items-center text-center bg-[#faa9ba] ">
                Lay
              </div>
              <div className="border border-black px-2 h-8 text-[13px] flex items-center text-center bg-[#72bbef] ">
                Back
              </div>
              <div className="border border-black px-2 h-8 text-[13px] flex items-center text-center">
                Void
              </div>
            </div> : ''}
          </div>
          <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
            <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
              Bet History
            </h1>
            <div className="md:p-4 p-3">
              <div className="flex md:flex-row flex-col items-center w-full gap-3 md:justify-between">
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
                    className="border rounded px-2 py-1 text-[13px] border-gray-400"
                  >
                    {[10, 25, 50, 100].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                  <label className="ml-1.5 text-[13px] font-medium text-black">
                    entries
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="" className="text-[13px]">Search:</label>
                  <input
                  value={search}
                  className="border text-[13px] outline-none w-auto rounded-[5px] border-gray-300 py-1.5 px-2"
                  placeholder="Search..."
                  onChange={handleChange}
                  />
                </div>
              </div>
              <div className="overflow-x-auto my-4">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead className="border border-gray-300 bg-gray-200 text-black text-center">
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
                          className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center"
                          onClick={() => handleSort(key)}
                        >
                          <div className="flex justify-between w-full items-center text-center">
                            <span className="w-full">{key}</span>
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
                  </thead>
                <tbody>
                {
                    paginatedData.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b  border-gray-400 ${item.betType === "no" || item.betType === "lay"
                            ? "bg-[#faa9ba]"
                            : item.betType === "back" || item.betType === "yes"
                              ? "bg-[#72bbef]"
                              : ""
                          }`}
                      >
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
                          {item.sport}
                        </td>
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
                          {item.match}
                        </td>
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
                          {item.type == 'odds'
                            ? 'Match odds'
                            : item?.type == 'bookmakers' ?
                              'Bookmakers' : item?.type == 'fancy'
                                ? item.marketNameTwo :
                                item?.type == 'toss' ?
                                  'TOSS' : item?.name ? 
                                  item?.name : ''
                          }
                        </td>
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
                          {item.marketNameTwo}
                        </td>
                        <td className="px-1 min-w-32 w-auto text-nowrap py-2 text-sm text-center border-r border-gray-400">
                          {item.betType === "no" || item.betType === "lay"
                            ? "Lay"
                            : item.betType === "yes" || item.betType === "back"
                              ? "Back"
                              : "Casino"}
                        </td>
                        <td className="px-1 min-w-32 w-auto py-2 text-nowrap text-sm text-center border-r border-gray-400">
                        {item?.type == 'fancy' ? `${item?.fancyOdds}/${item.odds}` : item?.odds + '/' + item.fancyOdds}
                        </td>
                        <td className="px-1 min-w-32 w-auto py-2 text-sm text-center border-r border-gray-400">
                          {item.totalAmount?.toFixed(2)}
                        </td>
                        {/* <td className="px-1 min-w-32 w-auto py-2 text-sm text-center border-r border-gray-400 whitespace-nowrap">
                          {item?.betType === "lay" || item?.betType === "no" ? (
                            <>
                              <span className="text-green-800">
                                {item?.totalAmount}
                              </span>
                              <span className="text-red-500">
                                {" "}
                                ({item?.totalProfitLoss > 0 ? (-Math.abs(item?.totalProfitLoss + item?.totalCommission)?.toFixed(2)) : (item?.totalProfitLoss + item?.totalCommission)?.toFixed(2) || 0})
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-green-800">
                                ({(item?.totalProfitLoss  + item?.totalCommission)?.toFixed(2)})
                              </span>
                              <span className="text-red-500">
                                {" "}
                                (-{item?.totalAmount?.toFixed(2) || 0})
                              </span>
                            </>
                          )}
                        </td> */}
                        <td className="px-1 min-w-32 w-auto py-2 text-sm text-center border-r border-gray-400 whitespace-nowrap">
                          {item?.betType === "lay" || item?.betType === "no" ? (
                            <>
                              <span className="text-green-800">
                                {item?.potentialWin}
                              </span>
                              <span className="text-red-500">
                                {" "}
                              (-{item?.totalAmount?.toFixed(2)})
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-green-800">
                                {(item?.potentialWin)?.toFixed(2)}
                              </span>
                              <span className="text-red-500">
                                {" "}
                                (-{item?.totalAmount?.toFixed(2) || 0})
                              </span>
                            </>
                          )}
                        </td>
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
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
                        <td className="px-1 min-w-32 text-nowrap w-auto py-2 text-sm text-center border-r border-gray-400">
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
                        <td className="px-1 min-w-32 w-auto py-2 text-sm text-center border-r border-gray-400">
                          <button className="text-EgyptianBlue">Info</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-2 flex-col sm:flex-row">
                {/* Showing entries text */}
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing{" "}
                {totalEntries === 0
                  ? 0
                  : (currentPage - 1) * entriesToShow + 1}{" "}
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
          </div>
        </>
      )}
    </div>
  );
};

export default BetHistory;
