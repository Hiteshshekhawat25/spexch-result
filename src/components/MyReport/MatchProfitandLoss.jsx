// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { FaSortUp, FaSortDown } from "react-icons/fa";
// import { BASE_URL } from "../../Constant/Api";
// import { ClipLoader } from "react-spinners";

// const MatchProfitandLoss = () => {
//   const { matchId } = useParams();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({
//     key: "betId",
//     direction: "ascending",
//   });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userId = location.state?.userId;

//   console.log("userId",userId);

//   // Define headers based on the fields returned by your API.
//   const headers = [
//     { display: "Sport Name", key: "sports" },
//     { display: "Event Name", key: "event" },
//     { display: "Market Name", key: "market" },
//     { display: "Result", key: "result" },
//     { display: "Profit/Loss", key: "profitLoss" },
//     { display: "Commission", key: "commission" },
//     { display: "Settle Time", key: "settle" },
//     // Add additional columns if needed
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("authToken");
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/user/get-selection-group-amount-profit-loss`,
//           {
//             params: {
//               page: 1,
//               limit: 10,
//               matchId: matchId,
//             },
//             headers: {
//               "Content-Type": "application/json; charset=utf-8",
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching match bet profit loss data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [matchId]);

//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedData = useMemo(() => {
//     return [...data].sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return sortConfig.direction === "ascending"
//           ? aValue - bValue
//           : bValue - aValue;
//       }
//       if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//   }, [data, sortConfig]);

//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * entriesToShow,
//     currentPage * entriesToShow
//   );
//   // const handleMarketNameClick = (id, selectionId) => {
//   //   navigate(`/profit-loss-user/${selectionId}/${id}`);
//   // };

//   const handleMarketNameClick = (id, selectionId, userId) => {
//     navigate(`/profit-loss-user/${selectionId}/${id}`, {
//       state: { userId: userId },
//     });
//   };

//   const handlePageChange = (direction) => {
//     let newPage = currentPage;
//     if (direction === "next" && currentPage < totalPages) newPage++;
//     else if (direction === "prev" && currentPage > 1) newPage--;
//     else if (direction === "first") newPage = 1;
//     else if (direction === "last") newPage = totalPages;

//     setCurrentPage(newPage);
//   };

//   if (loading) {
//     return (
//       <div>
//         <ClipLoader />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4 bg-gradient-blue text-white p-1">
//         Match Bet Profit & Loss
//       </h1>
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <label className="mr-2 text-sm font-medium text-black">Show</label>
//           <select
//             value={entriesToShow}
//             onChange={(e) => {
//               setEntriesToShow(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border rounded px-2 py-1 text-sm"
//           >
//             {[10, 25, 50, 100].map((number) => (
//               <option key={number} value={number}>
//                 {number}
//               </option>
//             ))}
//           </select>
//           <label className="ml-2 text-sm font-medium text-black">entries</label>
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full table-auto border-collapse border border-gray-400">
//           <thead className="bg-gray-300 text-black">
//             <tr>
//               {headers.map((header) => (
//                 <th
//                   key={header.key}
//                   className="px-4 py-2 cursor-pointer"
//                   onClick={() => handleSort(header.key)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span>{header.display}</span>
//                     <div className="flex flex-col items-center ml-2">
//                       <FaSortUp
//                         className={`${
//                           sortConfig.key === header.key &&
//                           sortConfig.direction === "ascending"
//                             ? "text-black"
//                             : "text-gray-400"
//                         }`}
//                         style={{ marginBottom: "-6px" }}
//                       />
//                       <FaSortDown
//                         className={`${
//                           sortConfig.key === header.key &&
//                           sortConfig.direction === "descending"
//                             ? "text-black"
//                             : "text-gray-400"
//                         }`}
//                         style={{ marginTop: "-6px" }}
//                       />
//                     </div>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((item, index) => (
//               <tr key={index} className="border-b border-gray-400">
//                 <td className="px-4 py-2 text-center">{item.sport}</td>
//                 <td className="px-4 py-2 text-center">{item.match}</td>
//                 <td
//                   className="px-4 py-2 text-center text-lightblue cursor-pointer"
//                   onClick={() => {
//                     handleMarketNameClick(
//                       item.matchId,
//                       item.selectionId,
//                       item.type
//                     );
//                     console.log(item.type);
//                     console.log(item.selectionId);
//                     console.log(item.matchId);
//                   }}
//                 >
//                   {" "}
//                   <p>
//                     {item?.type === "odds"
//                       ? "Match Odds"
//                       : item?.type === "fancy"
//                       ? item?.marketNameTwo
//                       : ""}
//                   </p>
//                 </td>
//                 <td className="px-4 py-2 text-center">{item?.marketName}</td>
//                 <td
//                   className="px-4 py-2 text-center"
//                   style={{
//                     color: item.totalProfitLoss < 0 ? "red" : "green",
//                   }}
//                 >
//                   {item.totalProfitLoss < 0
//                     ? `-${(
//                         Math.abs(item.totalProfitLoss) + item?.totalCommission
//                       ).toFixed(2)}`
//                     : (
//                         Math.abs(item.totalProfitLoss) + item?.totalCommission
//                       ).toFixed(2)}
//                 </td>

//                 <td className="px-4 py-2 text-center">
//                   {item?.totalCommission.toFixed(2)}
//                 </td>

//                 <td className="px-4 py-2 text-center">
//                   {new Date(item.settledTime).toLocaleString("en-GB", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
//         <div className="text-sm text-gray-600 sm:mb-0">
//           Showing{" "}
//           {data.length > 0
//             ? `${(currentPage - 1) * entriesToShow + 1} to ${Math.min(
//                 currentPage * entriesToShow,
//                 data.length
//               )}`
//             : "0 to 0"}{" "}
//           of {data.length} entries
//         </div>
//         <div className="flex space-x-2 sm:ml-auto">
//           <button
//             onClick={() => setCurrentPage(1)}
//             className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//             disabled={currentPage === 1}
//           >
//             First
//           </button>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) =>
//                 Math.min(prev + 1, Math.ceil(data.length / entriesToShow))
//               )
//             }
//             className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//             disabled={currentPage === Math.ceil(data.length / entriesToShow)}
//           >
//             Next
//           </button>
//           <button
//             onClick={() =>
//               setCurrentPage(Math.ceil(data.length / entriesToShow))
//             }
//             className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//             disabled={currentPage === Math.ceil(data.length / entriesToShow)}
//           >
//             Last
//           </button>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default MatchProfitandLoss;

// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { FaSortUp, FaSortDown } from "react-icons/fa";
// import { BASE_URL } from "../../Constant/Api";
// import { ClipLoader } from "react-spinners";

// const MatchProfitandLoss = () => {
//   const { matchId } = useParams();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({
//     key: "betId",
//     direction: "ascending",
//   });
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user_id = location.state?.userId;

//   console.log("userId", user_id);

//   // Define headers based on the fields returned by your API.
//   const headers = [
//     { display: "Sport Name", key: "sports" },
//     { display: "Event Name", key: "event" },
//     { display: "Market Name", key: "market" },
//     { display: "Result", key: "result" },
//     { display: "Profit/Loss", key: "profitLoss" },
//     { display: "Commission", key: "commission" },
//     { display: "Settle Time", key: "settle" },
//     // Add additional columns if needed
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("authToken");
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/user/get-selection-group-amount-profit-loss`,
//           {
//             params: {
//               page: 1,
//               limit: 10,
//               matchId: matchId,
//             },
//             headers: {
//               "Content-Type": "application/json; charset=utf-8",
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching match bet profit loss data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [matchId]);

//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedData = useMemo(() => {
//     return [...data].sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       if (typeof aValue === "number" && typeof bValue === "number") {
//         return sortConfig.direction === "ascending"
//           ? aValue - bValue
//           : bValue - aValue;
//       }
//       if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//   }, [data, sortConfig]);

//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * entriesToShow,
//     currentPage * entriesToShow
//   );

//   // console.log("matchId",matchId);
//   // console.log("id",id);
//   // console.log("selectionId",selectionId);
//   // console.log("userId",userId);
//   const handleMarketNameClick = (matchId, selectionId, userId) => {
//     console.log("matchId:", matchId);
//     console.log("selectionId:", selectionId);
//     console.log("userId:", userId);
//     console.log("first user user_id:", user_id);

//     let url = "";

//     if (user_id) {
//       url = `/bet-history/${matchId}/${selectionId}/${userId}`;
//       navigate(url, {
//         state: { userId, matchId, selectionId },
//       });
//     } else {
//       url = `/profit-loss-user/${matchId}/${selectionId}`;
//       navigate(url, {
//         state: { userId },
//       });
//     }

//     console.log("Navigating to:", url);
//   };

//   const handlePageChange = (direction) => {
//     let newPage = currentPage;
//     // if (direction === "next" && currentPage < totalPages) newPage++;
//     // else if (direction === "prev" && currentPage > 1) newPage--;
//     // else if (direction === "first") newPage = 1;
//     // else if (direction === "last") newPage = totalPages;

//     setCurrentPage(newPage);
//   };

//   if (loading) {
//     return (
//       <div>
//         <ClipLoader />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4 bg-gradient-blue text-white p-1">
//         Match Bet Profit & Loss
//       </h1>
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center">
//           <label className="mr-2 text-sm font-medium text-black">Show</label>
//           <select
//             value={entriesToShow}
//             onChange={(e) => {
//               setEntriesToShow(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border rounded px-2 py-1 text-sm"
//           >
//             {[10, 25, 50, 100].map((number) => (
//               <option key={number} value={number}>
//                 {number}
//               </option>
//             ))}
//           </select>
//           <label className="ml-2 text-sm font-medium text-black">entries</label>
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full table-auto border-collapse border border-gray-400">
//           <thead className="bg-gray-300 text-black">
//             <tr>
//               {headers.map((header) => (
//                 <th
//                   key={header.key}
//                   className="px-4 py-2 cursor-pointer"
//                   onClick={() => handleSort(header.key)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span>{header.display}</span>
//                     <div className="flex flex-col items-center ml-2">
//                       <FaSortUp
//                         className={`${
//                           sortConfig.key === header.key &&
//                           sortConfig.direction === "ascending"
//                             ? "text-black"
//                             : "text-gray-400"
//                         }`}
//                         style={{ marginBottom: "-6px" }}
//                       />
//                       <FaSortDown
//                         className={`${
//                           sortConfig.key === header.key &&
//                           sortConfig.direction === "descending"
//                             ? "text-black"
//                             : "text-gray-400"
//                         }`}
//                         style={{ marginTop: "-6px" }}
//                       />
//                     </div>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((item, index) => (
//               <tr key={index} className="border-b border-gray-400">
//                 <td className="px-4 py-2 text-center">{item.sport}</td>
//                 <td className="px-4 py-2 text-center">{item.match}</td>
//                 <td
//                   className="px-4 py-2 text-center text-lightblue cursor-pointer"
//                   onClick={() => {
//                     handleMarketNameClick(
//                       item.matchId,
//                       item.selectionId,
//                       item.userId
//                     );
//                     console.log("item userId", item.userId);
//                     console.log("item selectionId", item.selectionId);
//                     console.log("item matchId", item.matchId);
//                     // console.log("item only userId",userId);
//                   }}
//                 >
//                   {" "}
//                   <p>
//                     {item?.type === "odds"
//                       ? "Match Odds"
//                       : item?.type === "fancy"
//                       ? item?.marketNameTwo
//                       : ""}
//                   </p>
//                 </td>
//                 <td className="px-4 py-2 text-center">{item?.marketName}</td>
//                 <td
//                   className="px-4 py-2 text-center"
//                   style={{
//                     color: item.totalProfitLoss < 0 ? "red" : "green",
//                   }}
//                 >
//                   {item.totalProfitLoss < 0
//                     ? `-${(
//                         Math.abs(item.totalProfitLoss) + item?.totalCommission
//                       ).toFixed(2)}`
//                     : (
//                         Math.abs(item.totalProfitLoss) + item?.totalCommission
//                       ).toFixed(2)}
//                 </td>

//                 <td className="px-4 py-2 text-center">
//                   {item?.totalCommission.toFixed(2)}
//                 </td>

//                 <td className="px-4 py-2 text-center">
//                   {new Date(item.settledTime).toLocaleString("en-GB", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MatchProfitandLoss;
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { BASE_URL } from "../../Constant/Api";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const MatchProfitandLoss = () => {
  const { matchId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "betId",
    direction: "ascending",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.userId;

  console.log("userId", user_id);

  // Define headers based on the fields returned by your API
  const headers = [
    { display: "Sport Name", key: "sports" },
    { display: "Event Name", key: "event" },
    { display: "Market Name", key: "market" },
    { display: "Result", key: "result" },
    { display: "Profit/Loss", key: "profitLoss" },
    { display: "Commission", key: "commission" },
    { display: "Settle Time", key: "settle" },
  ];

  const { fromDate, toDate } = useSelector((state) => state.eventPLFilter);
  console.log("fromDate in matchbet", fromDate);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          `${BASE_URL}/user/get-selection-group-amount-profit-loss`,
          {
            params: {
              page: 1,
              limit: 10,
              matchId: matchId,
              userId:user_id,
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

        setData(response.data.data); // No sorting here
        setTotalEntries(response.data.total);
        setTotalPages(Math.ceil(response.data.total / entriesToShow));
      } catch (error) {
        console.error("Error fetching match bet profit loss data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId, entriesToShow, fromDate, toDate]);

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

  const handleMarketNameClick = (matchId, selectionId, userId) => {
    let url = "";

    if (user_id) {
      url = `/bet-history/${matchId}/${selectionId}/${userId}`;
      navigate(url, {
        state: { userId, matchId, selectionId },
      });
    } else {
      url = `/profit-loss-user/${matchId}/${selectionId}`;
      navigate(url, {
        state: { userId },
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

  if (loading) {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 bg-gradient-blue text-white p-1">
        Match Bet Profit & Loss
      </h1>
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
        <table className="w-full table-auto border-collapse border border-gray-400">
          <thead className="bg-gray-300 text-black">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex justify-between items-center">
                    <span>{header.display}</span>
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
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-400">
                <td className="px-4 py-2 text-center">{item.sport}</td>
                <td className="px-4 py-2 text-center">{item.match}</td>
                <td
                  className="px-4 py-2 text-center text-lightblue cursor-pointer"
                  onClick={() => {
                    handleMarketNameClick(
                      item.matchId,
                      item.selectionId,
                      item.userId
                    );
                  }}
                >
                  <p>
                    {item?.type === "odds"
                      ? "Match Odds"
                      : item?.type === "fancy"
                      ? item?.marketNameTwo
                      : ""}
                  </p>
                </td>
                <td className="px-4 py-2 text-center">{item?.marketName}</td>
                <td
                  className="px-4 py-2 text-center"
                  style={{
                    color: item.totalProfitLoss < 0 ? "red" : "green",
                  }}
                >
                  {item.totalProfitLoss < 0
                    ? `-${(
                        Math.abs(item.totalProfitLoss) + item?.totalCommission
                      ).toFixed(2)}`
                    : (
                        Math.abs(item.totalProfitLoss) + item?.totalCommission
                      ).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {item?.totalCommission.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {new Date(item.settledTime).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
        {/* Showing entries text */}
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing{" "}
          {data.length === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
          {Math.min(currentPage * entriesToShow, data.length)} of {data.length}{" "}
          entries
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                      currentPage === page ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-3 py-1 text-sm">
                    ...
                  </span>
                );
              }
              return null;
            })}

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
  );
};

export default MatchProfitandLoss;
