
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectBetListData, selectBetListLoading, selectBetListError } from "../../Store/Slice/betListSlice";
import { selectBetListFilter } from "../../Store/Slice/betListFilterSlice"; // Filter slice
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import UserHierarchyModal from "../Modal/UserHierarchyModal";

import BetListFilter from "./BetListFilter";

const BetList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectBetListData); 
  const loading = useSelector(selectBetListLoading);
  const error = useSelector(selectBetListError);
  const filters = useSelector(selectBetListFilter); 

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [betlistData, setBetlistData] = useState([]); 
  const [totalBets, setTotalBets] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);

    const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  
  const handleBetlistUpdate = (newData) => {
    setBetlistData(newData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    
    setBetlistData(data);
    setCurrentPage(1); 
  }, [data, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === 'next' && currentPage < totalPages) newPage++;
    else if (direction === 'prev' && currentPage > 1) newPage--;
    else if (direction === 'first') newPage = 1;
    else if (direction === 'last') newPage = totalPages;

    setCurrentPage(newPage);
  };
  const paginatedData = betlistData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );
  
  console.log("Paginated Data:", paginatedData);   
const handleFilterChange = (data) => {
    setTotalBets(data.pagination.totalTransactions || 0);
    setTotalPages(data.pagination.totalPages || 1);
    setBetlistData(data.data || []);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...betlistData].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
 
  }, [currentPage]);

  
  console.log("Sorted Data:", sortedData); 
  
  console.log("Current Page:", currentPage);
  console.log("Entries to Show:", entriesToShow);
  console.log("Total Bets:", totalBets);
  console.log("Total Pages:", totalPages);

  return (
    <div className="p-4">
      <BetListFilter
        setTotalBets={(total) => setTotalBets(total)}
        setTotalPages={(total) => setTotalPages(total)}
        setBetlistData={handleBetlistUpdate}
        entriesToShow={entriesToShow}
        currentPage={currentPage}
        setIsDataFetched={(isFetched) => console.log(isFetched)}
        setCurrentPage={setCurrentPage}
      />

      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-blue text-white font-bold">Bet List</h1>

   
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-black">Show</label>
            <select
              value={entriesToShow}
              onChange={handleEntriesChange}
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
          <div className="flex items-center">
            <p>Search:</p>
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

       
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-400 p-2">
              <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                <tr className="text-center">
                  {[
                    "username",
                    "sportName",
                    "event",
                    "market",
                    "selection",
                    "Type",
                    "oddsReq",
                    "stack",
                    "placeTime",
                    "settleTime", 
                  ].map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {key === "username"
                            ? "Username"
                            : key === "sportName"
                            ? "Sport Name"
                            : key === "event"
                            ? "Event"
                            : key === "market"
                            ? "Market"
                            : key === "selection"
                            ? "Selection"
                            : key === "Type"
                            ? "Type"
                            : key === "oddsReq"
                            ? "Odds Req"
                            : key === "stack"
                            ? "Stack"
                            : key === "placeTime"
                            ? "Place Time"
                            : key === "settleTime"
                            ? "Settle Time" 
                            : key}
                        </span>
                       
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

              <tbody className="text-center">
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                    <tr key={index}>
                     
<td
  onClick={() => {
    console.log("Clicked Item:", item); // Log the entire item object
    console.log("Selected User ID:", item.createdBy); 
    console.log("Selected User Name:", item.username); 
    setSelectedUserId(item.createdBy);
    setSelectedUsername(item.username);
    setIsModalOpen(true);
  }}
  className="border border-gray-400 px-4 py-3 font-bold text-blue cursor-pointer"
>
  {item.username}
</td>


                      <td className="border border-gray-400 px-4 py-3">{item.sport}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.event}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.market}</td>
                      <td className="border border-gray-400 px-4 py-3">{item.selection}</td>
                      <td
                        className={`border border-gray-400 px-4 py-3 font-bold ${
                          item.type === "no" ? "text-red-600" : "text-blue"
                        }`}
                      >
                        {item.type === "no" ? "Lay" : "Back"}
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        {item.oddsRequested}
                      </td>
                      <td className="border border-gray-400 px-4 py-3 font-bold">
                        {item.stake}
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        {new Date(item.placeTime).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        {new Date(item.placeTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="border border-gray-400 px-4 py-3">
                        {new Date(item.settleTime).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}{' '}
                        {new Date(item.settleTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="border border-gray-400 px-4 py-3">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {totalBets === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
            {Math.min(currentPage * entriesToShow, totalBets)} of {totalBets} entries
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange("first")}
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange("prev")}
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange("next")}
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange("last")}
              className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UserHierarchyModal userId={selectedUserId} username={selectedUsername}  closeModal={closeModal} />
      )}
    </div>
  );
};


export default BetList;


// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { selectBetListData, selectBetListLoading, selectBetListError } from "../../Store/Slice/betListSlice";
// import { selectBetListFilter } from "../../Store/Slice/betListFilterSlice"; // Filter slice
// import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
// import BetListFilter from "./BetListFilter";

// const BetList = () => {
//   const dispatch = useDispatch();
//   const data = useSelector(selectBetListData); // Data fetched from Redux store
//   const loading = useSelector(selectBetListLoading);
//   const error = useSelector(selectBetListError);
//   const filters = useSelector(selectBetListFilter); // Access filters from Redux

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [betlistData, setBetlistData] = useState([]); // Initialize betlistData with empty array
//   const [totalBets, setTotalBets] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [sortConfig, setSortConfig] = useState({
//     key: "username",
//     direction: "ascending",
//   });

//   // Handle BetListFilter data update
//   const handleBetlistUpdate = (newData) => {
//     setBetlistData(newData);
//   };

//   useEffect(() => {
//     // Set betlist data whenever Redux data or filters change
//     setBetlistData(data);
//     setCurrentPage(1); // Reset page when data or filters change
//   }, [data, filters]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on search change
//   };

//   const handleEntriesChange = (e) => {
//     setEntriesToShow(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page on entries change
//   };

  

//   const handlePageChange = (direction) => {
//     if (direction === "next" && currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     } else if (direction === "prev" && currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     } else if (direction === "first") {
//       setCurrentPage(1);
//     } else if (direction === "last") {
//       setCurrentPage(totalPages);
//     }
//   };

//   const paginatedData = betlistData.slice(
//     (currentPage - 1) * entriesToShow,
//     currentPage * entriesToShow
//   );

//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedData = [...paginatedData].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === "ascending" ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === "ascending" ? 1 : -1;
//     }
//     return 0;
//   });

//   return (
//     <div className="p-4">
//       {/* Pass necessary state management functions to BetListFilter */}
//       <BetListFilter 
//         setTotalBets={(total) => setTotalBets(total)} 
//         setTotalPages={(total) => setTotalPages(total)} 
//         setBetlistData={handleBetlistUpdate} 
//         entriesToShow={entriesToShow}
//         currentPage={currentPage}
//         setIsDataFetched={(isFetched) => console.log(isFetched)} // Just an example, replace with the actual logic
//         setCurrentPage={setCurrentPage}
//       />

//       <div className="border border-gray-300 rounded-md bg-white">
//         <h1 className="text-xl bg-gradient-blue text-white font-bold">Bet List</h1>

//         {/* Search and Entries Per Page */}
//         <div className="flex justify-between items-center mb-4 p-4">
//           <div className="flex items-center">
//             <label className="mr-2 text-sm font-medium text-black">Show</label>
//             <select
//               value={entriesToShow}
//               onChange={handleEntriesChange}
//               className="border rounded px-2 py-1 text-sm"
//             >
//               {[10, 25, 50, 100].map((number) => (
//                 <option key={number} value={number}>
//                   {number}
//                 </option>
//               ))}
//             </select>
//             <label className="ml-2 text-sm font-medium text-black">entries</label>
//           </div>
//           <div className="flex items-center">
//             <p>Search:</p>
//             <input
//               type="text"
//               placeholder="Search by username"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="border rounded px-2 py-1 text-sm"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div className="text-red-500">{error}</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto border-collapse border border-gray-400 p-2">
//             <thead className="border border-gray-400 bg-gray-300 text-black text-center">
//   <tr className="text-center">
//     {[
//       "username",
//       "sportName",
//       "event",
//       "market",
//       "selection",
//       "Type",
//       "oddsReq",
//       "stack",
//       "placeTime",
//       "settleTime", 
//     ].map((key) => (
//       <th
//         key={key}
//         className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
//         onClick={() => handleSort(key)}
//       >
//         <div className="flex justify-between items-center">
//           <span>
//             {key === "username"
//               ? "Username"
//               : key === "sportName"
//               ? "Sport Name"
//               : key === "event"
//               ? "Event"
//               : key === "market"
//               ? "Market"
//               : key === "selection"
//               ? "Selection"
//               : key === "Type"
//               ? "Type"
//               : key === "oddsReq"
//               ? "Odds Req"
//               : key === "stack"
//               ? "Stack"
//               : key === "placeTime"
//               ? "Place Time"
//               : key === "settleTime"
//               ? "Settle Time" 
//               : key}
//           </span>
//           <div className="flex flex-col items-center space-y-0.5 ml-2">
//             <FaSortUp
//               className={`text-sm ${
//                 sortConfig.key === key && sortConfig.direction === "ascending"
//                   ? "text-black"
//                   : "text-gray-400"
//               }`}
//             />
//             <FaSortDown
//               className={`text-sm ${
//                 sortConfig.key === key && sortConfig.direction === "descending"
//                   ? "text-black"
//                   : "text-gray-400"
//               }`}
//             />
//           </div>
//         </div>
//       </th>
//     ))}
//   </tr>
// </thead>

//               <tbody className="text-center">
//                 {sortedData.length > 0 ? (
//                   sortedData.map((item, index) => (
//                     <tr key={index}>
//                       <td className="border border-gray-400 px-4 py-3">{item.username}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.sportName}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.event}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.market}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.selection}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.Type}</td>
//                       <td className="border border-gray-400 px-4 py-3">{item.oddsReq}</td>                      
//                       <td className="border border-gray-400 px-4 py-3">{item.stack}</td>
//                       <td className="border border-gray-400 px-4 py-3">
//   {new Date(item.placeTime).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   })}{' '}
//   {new Date(item.placeTime).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   })}
// </td>
// <td className="border border-gray-400 px-4 py-3">
//   {new Date(item.settleTime).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   })}{' '}
//   {new Date(item.settleTime).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   })}
// </td>
                     
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="border border-gray-400 px-4 py-3">No data found</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}

//         <div className="flex justify-between items-center mt-4">
//   {/* Left Side: Showing Entries Info */}
//   <div className="text-sm text-gray-600">
//     Showing {totalBets === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
//     {Math.min(currentPage * entriesToShow, totalBets)} of {totalBets} entries
//   </div>

//   {/* Right Side: Pagination Buttons */}
//   <div className="flex space-x-2">
//     <button
//       onClick={() => handlePageChange("first")}
//       className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//       disabled={currentPage === 1}
//     >
//       First
//     </button>
//     <button
//       onClick={() => handlePageChange("prev")}
//       className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//       disabled={currentPage === 1}
//     >
//       Prev
//     </button>
//     <button
//       onClick={() => handlePageChange("next")}
//       className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//       disabled={currentPage === totalPages}
//     >
//       Next
//     </button>
//     <button
//       onClick={() => handlePageChange("last")}
//       className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//       disabled={currentPage === totalPages}
//     >
//       Last
//     </button>
//   </div>
// </div>

// {/* <div className="flex justify-end items-center py-2 space-x-2">
//   <button
//     onClick={() => handlePageChange("first")}
//     disabled={currentPage === 1}
//     className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//   >
//     First
//   </button>
//   <button
//     onClick={() => handlePageChange("prev")}
//     disabled={currentPage === 1}
//     className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//   >
//     Prev
//   </button>
//   <button
//     onClick={() => handlePageChange("next")}
//     disabled={currentPage === totalPages}
//     className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//   >
//     Next
//   </button>
//   <button
//     onClick={() => handlePageChange("last")}
//     disabled={currentPage === totalPages}
//     className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
//   >
//     Last
//   </button>
// </div> */}

//       </div>
//     </div>
//   );
// };

// export default BetList;

