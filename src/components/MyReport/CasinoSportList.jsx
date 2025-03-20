import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { BASE_URL } from "../../Constant/Api";
import { useSelector } from "react-redux";
import { ROUTES_CONST } from "../../Constant/routesConstant";

const CasinoSportList = () => {
  const { gameId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const startDate = useSelector((state)=>state.filterData?.startDate)
  const endDate = useSelector((state)=>state.filterData?.endDate)
  const [sortConfig, setSortConfig] = useState({
    key: "event", // default sort key, adjust as needed
    direction: "ascending",
  });
  const navigate = useNavigate();
  const headers = [
    { display: "Sport Name", key: "sport" },
    { display: "Event Name", key: "event" },
    // { display: "Profit & Loss", key: "totalUplineProfitLoss" },
    { display: "Profit/Loss", key: "totalDownlineProfitLoss" },
    { display: "Commission", key: "commission" },
    { display: "Total P&L", key: "total" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BASE_URL}/user/get-casino-games-profit-loss`,
          {
            params: {
              page: currentPage,
              limit: entriesToShow,
              gameId: gameId,
              fromDate : startDate ? startDate : '',
              toDate : endDate ? endDate : '',
            },
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response,'response')
        setData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId,entriesToShow,currentPage]);

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

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const handleMatchClick = (id,selectionId,data) => {
    navigate(`/match-bet-profit-loss/${selectionId}`,{state: 'casino'});
  };

  console.log(startDate,endDate,'startDate')

  return (
    <div className="md:mx-0 mx-2 border border-gray-300 rounded-[5px] overflow-hidden bg-white">
      <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
        Profit & Loss Events
      </h1>
      <div className="md:p-4 p-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-black">Show</label>
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
            <label className="ml-2 text-sm font-medium text-black">entries</label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-black">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center"
                    onClick={() => handleSort(header.key)}
                  >
                    <div className="flex justify-between text-center items-center">
                      <span className="w-full ">{header.display}</span>
                      <div className="flex flex-col items-center ml-2">
                        <FaSortUp
                          className={`${
                            sortConfig.key === header.key &&
                            sortConfig.direction === "ascending"
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                          style={{ marginBottom: "-6px" }}
                        />
                        <FaSortDown
                          className={`${
                            sortConfig.key === header.key &&
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
                <tr key={index} className="border-b border-gray-400">
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">{item.sport}</td>
                  <td
                    className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-linkcolor"
                    onClick={() => handleMatchClick(item._id, item.providerId,item)}
                  >
                    {item.provider}
                  </td>
                  {/* <td
                    className="px-4 py-2 text-center"
                    style={{
                      color: item.totalUplineProfitLoss < 0 ? "red" : "green",
                    }}
                  >
                    {item.totalUplineProfitLoss < 0
                      ? Math.abs(item.totalUplineProfitLoss.toFixed(2))
                      : item.totalUplineProfitLoss.toFixed(2)}
                  </td> */}
                  <td
                    className="px-4 py-2 border border-gray-400 text-center"
                    style={{
                      color: item.totalDownlineProfitLoss < 0 ? "red" : "green",
                    }}
                  >
                    {item.totalDownlineProfitLoss < 0
                      ? (Math.abs(item.totalDownlineProfitLoss) + item.totalCommission).toFixed(2)
                      : (Math.abs(item.totalDownlineProfitLoss) + item.totalCommission).toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-2 border border-gray-400 text-center"
                    style={{
                      color: item.totalDownlineProfitLoss < 0 ? "red" : "green",
                    }}
                  >
                    {item.totalCommission < 0
                      ? Math.abs(item.totalCommission.toFixed(2))
                      : item.totalCommission.toFixed(2)}
                  </td>
                  <td className={` py-2 px-3  border border-gray-400 text-center min-w-56 ${item?.totalDownlineProfitLoss > 0 ? 'text-green-700' : 'text-red-500'}`}>
                          {item?.totalDownlineProfitLoss?.toFixed(2)}
                        </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between  items-center mt-4 flex-col sm:flex-row">
          <div className="text-sm text-gray-600 sm:mb-0">
            Showing{" "}
            {data.length > 0
              ? `${(currentPage - 1) * entriesToShow + 1} to ${Math.min(
                  currentPage * entriesToShow,
                  data.length
                )}`
              : "0 to 0"}{" "}
            of {data.length} entries
          </div>
          <div className="flex space-x-2 border border-gray-400 sm:ml-auto">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 text-gray-600  rounded text-sm border border-gray-300"
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
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(data.length / entriesToShow))
                )
              }
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === Math.ceil(data.length / entriesToShow)}
            >
              Next
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.ceil(data.length / entriesToShow))
              }
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
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

export default CasinoSportList;
