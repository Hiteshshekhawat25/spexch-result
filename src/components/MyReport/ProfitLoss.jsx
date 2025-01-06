import React, { useState } from 'react';
import PLFilter from './PLFilter';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const ProfitLoss = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [profitLossData, setProfitLossData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'ascending' });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...profitLossData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const totalData = {
    username: 'Total',
    profitLoss: sortedData.reduce((sum, row) => sum + row.profitLoss, 0),
    downlineProfitLoss: sortedData.reduce((sum, row) => sum + row.downlineProfitLoss, 0),
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
      />

      {/* Data Table */}
      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-blue text-white font-bold">Profit Loss</h1>

        <div className="flex justify-between items-center mb-4 p-4">
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

        <div className="overflow-x-auto my-4 mx-4">
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead className="border border-gray-400 bg-gray-300 text-black text-center">
              <tr>
                {['username', 'profitLoss', 'downlineProfitLoss', 'commission'].map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {key === 'username'
                          ? 'Username'
                          : key === 'profitLoss'
                          ? 'Profit/Loss'
                          : key === 'downlineProfitLoss'
                          ? 'Downline Profit/Loss'
                          : 'Commission'}
                      </span>
                      <div className="flex flex-col items-center space-y-0.5 ml-2">
                        <FaSortUp
                          className={`text-sm ${
                            sortConfig.key === key && sortConfig.direction === 'ascending'
                              ? 'text-black'
                              : 'text-gray-400'
                          }`}
                        />
                        <FaSortDown
                          className={`text-sm ${
                            sortConfig.key === key && sortConfig.direction === 'descending'
                              ? 'text-black'
                              : 'text-gray-400'
                          }`}
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
                  <td className="px-4 py-3 text-sm text-center">{item.username}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.profitLoss}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.downlineProfitLoss}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.commission}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-300 text-black">
                <td className="px-4 py-3 text-sm text-center">{totalData.username}</td>
                <td className="px-4 py-3 text-sm text-center">{totalData.profitLoss}</td>
                <td className="px-4 py-3 text-sm text-center">{totalData.downlineProfitLoss}</td>
                <td className="px-4 py-3 text-sm text-center">{totalData.commission}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * entriesToShow + 1} to{' '}
            {Math.min(currentPage * entriesToShow, totalEntries)} of {totalEntries} entries
          </div>
          <div className="flex space-x-2">
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 text-gray-600 rounded text-sm"
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


// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   selectProfitLossData,
//   selectProfitLossLoading,
//   selectProfitLossError,
//   setProfitLossData,
//   setLoading,
//   setError,
// } from '../../Store/Slice/profitLossSlice';
// import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';
// import PLFilterComponent from "./PLFilter"

// const ProfitLoss = () => {
//   const dispatch = useDispatch();
//   const data = useSelector(selectProfitLossData);
//   const loading = useSelector(selectProfitLossLoading);
//   const error = useSelector(selectProfitLossError);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'ascending' });

//   useEffect(() => {
//     dispatch(setLoading(true));
//     setTimeout(() => {
//       try {
//         const demoData = [
//           { username: 'KRISH', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
//           { username: 'RINKU8', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
//           { username: 'RINKUMASTER1', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
//           { username: 'RINKUMASTER2', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
//           { username: 'RINKUUSER1', profitLoss: 0, downlineProfitLoss: 0, commission: 0 },
//         ];
//         dispatch(setProfitLossData(demoData));
//         dispatch(setLoading(false));
//       } catch (err) {
//         dispatch(setError('Failed to fetch data'));
//         dispatch(setLoading(false));
//       }
//     }, 1000);
//   }, [dispatch]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to page 1 on new search
//   };

//   const handleEntriesChange = (e) => {
//     setEntriesToShow(Number(e.target.value));
//     setCurrentPage(1); // Reset to page 1 on entries change
//   };

//   const filteredData = data.filter((item) =>
//     item.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredData.length / entriesToShow);

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


//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * entriesToShow,
//     currentPage * entriesToShow
//   );

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedData = [...paginatedData].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'ascending' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'ascending' ? 1 : -1;
//     }
//     return 0;
//   });

//   const totalData = {
//     username: 'Total',
//     profitLoss: sortedData.reduce((acc, row) => acc + row.profitLoss, 0),
//     downlineProfitLoss: sortedData.reduce((acc, row) => acc + row.downlineProfitLoss, 0),
//     commission: sortedData.reduce((acc, row) => acc + row.commission, 0),
//   };

//   return (
//     <div className='p-4'> 

//     <PLFilterComponent />

//     <div className=" border border-gray-300 rounded-md bg-white">
//       {/* Header */}
//       <h1 className="text-xl bg-gradient-blue text-white font-bold">
//         Profit Loss
//       </h1>

//       {/* Search and Entries Per Page */}
//       <div className="flex justify-between items-center mb-4 p-4">
//         <div className="flex items-center">
//           <label className="mr-2 text-sm font-medium text-black">Show</label>
//           <select
//             value={entriesToShow}
//             onChange={handleEntriesChange}
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
//         <div className="flex items-center">
//           <p>Search:</p>
//           <input
//             type="text"
//             placeholder="Search by username"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : (
//         <table className="w-full table-auto border-collapse border border-gray-400 p-2">
//           <thead className="border border-gray-400 bg-gray-300 text-black text-center">
//             <tr className="text-center">
//               {['username', 'profitLoss', 'downlineProfitLoss', 'commission'].map((key) => (
//                 <th
//                   key={key}
//                   className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
//                   onClick={() => handleSort(key)}
//                 >
//                   <div className="flex justify-between items-center">
//                     {/* Heading Text */}
//                     <span>{key === 'username' ? 'Username' : key === 'profitLoss' ? 'Profit/Loss' : key === 'downlineProfitLoss' ? 'Downline Profit/Loss' : 'Commission'}</span>

//                     {/* Sorting Icons */}
//                     <div className="flex flex-col items-center space-y-0.5 ml-2">
//                       <FaSortUp
//                         className={`text-sm ${sortConfig.key === key && sortConfig.direction === 'ascending' ? 'text-black' : 'text-gray-400'}`}
//                       />
//                       <FaSortDown
//                         className={`text-sm ${sortConfig.key === key && sortConfig.direction === 'descending' ? 'text-black' : 'text-gray-400'}`}
//                       />
//                     </div>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((item, index) => (
//               <tr key={index} className="border-b border-gray-400">
//                 <td className="px-4 py-3 text-sm text-center">{item.username}</td>
//                 <td className="px-4 py-3 text-sm text-center">{item.profitLoss}</td>
//                 <td className="px-4 py-3 text-sm text-center">{item.downlineProfitLoss}</td>
//                 <td className="px-4 py-3 text-sm text-center">{item.commission}</td>
//               </tr>
//             ))}
//           </tbody>
//           {/* Total Row */}
//           <tfoot>
//             <tr className="bg-gray-300 text-black">
//               <td className="px-4 py-3 text-sm text-center">{totalData.username}</td>
//               <td className="px-4 py-3 text-sm text-center">{totalData.profitLoss}</td>
//               <td className="px-4 py-3 text-sm text-center">{totalData.downlineProfitLoss}</td>
//               <td className="px-4 py-3 text-sm text-center">{totalData.commission}</td>
//             </tr>
//           </tfoot>
//         </table>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4 p-4">
//   <div className="text-sm text-gray-600">
//     Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
//     to {Math.min(currentPage * entriesToShow, filteredData.length)} of {filteredData.length}{" "}
//     entries
//   </div>
//   <div className="flex space-x-2">
//     <button
//       onClick={() => handlePageChange("first")}
//       className="px-3 py-1 text-gray-600 rounded text-sm"
//       disabled={currentPage === 1}
//     >
//       First
//     </button>
//     <button
//       onClick={() => handlePageChange("prev")}
//       className="px-3 py-1 text-gray-600 rounded text-sm"
//       disabled={currentPage === 1}
//     >
//       Previous
//     </button>
//     <button
//       onClick={() => handlePageChange("next")}
//       className="px-3 py-1 text-gray-600 rounded text-sm"
//       disabled={currentPage === totalPages}
//     >
//       Next
//     </button>
//     <button
//       onClick={() => handlePageChange("last")}
//       className="px-3 py-1 text-gray-600 rounded text-sm"
//       disabled={currentPage === totalPages}
//     >
//       Last
//     </button>
//   </div>
// </div>
//     </div>
//     </div>
//   );
// };

// export default ProfitLoss;


