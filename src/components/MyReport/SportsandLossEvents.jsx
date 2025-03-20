import React, { useEffect, useState, useMemo } from "react";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SportsandLossEvents = () => {
  const { gameId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;
  const list = location.state?.list;
  const [sortConfig, setSortConfig] = useState({
    key: "event",
    direction: "ascending",
  });
  const navigate = useNavigate();
  const headers = [
    { display: "Sport Name", key: "sport" },
    { display: "Event Name", key: "event" },
    { display: "Profit & Loss", key: "totalUplineProfitLoss" },
    { display: "Downline Profit/Loss", key: "totalDownlineProfitLoss" },
    { display: "Commission", key: "commission" },
  ];

  const header2 = [
    { display: "Sport Name", key: "sport" },
    { display: "Event Name", key: "event" },
    { display: "Profit & Loss", key: "totalUplineProfitLoss" },
    { display: "Commission", key: "commission" },
    { display: "Total P&L", key: "total P&L" },
  ];

  console.log("userId", userId);
  const { fromDate, toDate } = useSelector((state) => state.eventPLFilter);
  console.log("fromDate", fromDate);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BASE_URL}/user/get-sport-event-profit-loss`,
          {
            params: {
              page: 1,
              limit: 10,
              search: search,
              gameId: gameId,
              userId,
              fromDate: fromDate,
              toDate: toDate,
            },
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId, search]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
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
  }, [data, sortConfig]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  if (loading) {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  // const handleMatchClick = (matchId) => {
  //   navigate(`/match-bet-profit-loss/${matchId}`);
  // };

  const handleMatchClick = (matchId) => {
    navigate(`/match-bet-profit-loss/${matchId}`, {
      state: { userId: userId },
    });
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
    <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white md:mx-0 mx-2.5">
      <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
        Profit & Loss Events
      </h1>
      <div className="p-4">
        <div className="md:flex-row flex flex-col gap-4 md:gap-0 justify-between items-center mb-4">
          <div className="flex w-auto items-center">
            <label className="mr-1 text-[13px] font-medium text-black">Show</label>
            <select
              value={entriesToShow}
              onChange={(e) => {
                setEntriesToShow(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-[13px]"
            >
              {[10, 25, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <label className="ml-1 text-[13px] font-medium text-black">entries</label>
          </div>
          <div className="flex text-nowrap gap-2 items-center">
            <label htmlFor="" className="mr-1 text-[14px]">Search :</label>
            <input
              name='search'
              className="border text-[14px] w-auto rounded-[4px] outline-none py-1 px-2"
              value={search}
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-black border border-gray-4300">
              <tr>
                {(location?.state?.downline
                  ? header2
                  : headers).map((header) => (
                    <th
                      key={header.key}
                      className="border border-gray-300 text-center sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer"
                      onClick={() => handleSort(header.key)}
                    // className=" bg-red-500 border border-gray-400 text-center justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <div className="items-center text-center text-nowrap w-full justify-between">
                          {header.display}
                        </div>
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${sortConfig.key === header.key &&
                                sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                              }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${sortConfig.key === header.key &&
                                sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                              }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.map((item, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                    {item.sport}
                  </td>
                  <td
                    className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-linkcolor"
                    onClick={() => handleMatchClick(item._id)}
                  >
                    {item.match}
                  </td>

                  {list ?

                    <td
                      className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack"
                      style={{
                        color: item.totalDownlineProfitLoss < 0 ? "red" : "green",
                      }}
                    >
                      {item.totalDownlineProfitLoss < 0
                        ? `-${(
                          Math.abs(item.totalDownlineProfitLoss)
                        )?.toFixed(2)}`
                        : (
                          Math.abs(item.totalDownlineProfitLoss) +
                          item?.totalCommission
                        )?.toFixed(2)}
                    </td> :
                    <td
                      className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-semibold"
                      style={{
                        color: item.totalUplineProfitLoss < 0 ? "red" : "green",
                      }}
                    >
                      {item.totalUplineProfitLoss < 0
                        ? `-${(
                          Math.abs(item.totalUplineProfitLoss)
                        )?.toFixed(2)}`
                        : (
                          Math.abs(item.totalUplineProfitLoss) +
                          item?.totalCommission
                        )?.toFixed(2)}
                    </td>
                  }
                  {location?.state?.downline ?
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      {item?.totalCommission?.toFixed(2)}
                    </td>
                    : <td
                      className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border font-semibold border-gray-300 text-darkblack"
                      style={{
                        color: item.totalDownlineProfitLoss < 0 ? "red" : "green",
                      }}
                    >
                      {item.totalDownlineProfitLoss < 0
                        ? `-${Math.abs(item.totalDownlineProfitLoss +
                          item?.totalCommission)?.toFixed(2)}`
                        : (item.totalDownlineProfitLoss +
                          item?.totalCommission).toFixed(2)}
                    </td>}

                  {location?.state?.downline ?
                    <td className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack ${item?.totalDownlineProfitLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.totalDownlineProfitLoss < 0
                        ? `-${Math.abs(item.totalDownlineProfitLoss +
                          item?.totalCommission)?.toFixed(2)}`
                        : (item.totalDownlineProfitLoss +
                          item?.totalCommission).toFixed(2)}
                    </td>
                    :
                    <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                      {item?.totalCommission?.toFixed(2)}
                    </td>
                  }

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
          <div className="text-[13px] text-gray-600 sm:mb-0">
            Showing{" "}
            {data.length > 0
              ? `${(currentPage - 1) * entriesToShow + 1} to ${Math.min(
                currentPage * entriesToShow,
                data.length
              )}`
              : "0 to 0"}{" "}
            of {data.length} entries
          </div>
          <div className="flex space-x-2 sm:ml-auto">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(data.length / entriesToShow))
                )
              }
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === Math.ceil(data.length / entriesToShow)}
            >
              Next
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.ceil(data.length / entriesToShow))
              }
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === Math.ceil(data.length / entriesToShow)}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsandLossEvents;
