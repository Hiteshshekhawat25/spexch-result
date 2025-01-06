import React, { useState, useEffect } from 'react';
import AccountStatementFilter from './AccountStatementFilter';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const AccountStatement = () => {
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statementData, setStatementData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt', // Default sort by date
    direction: 'ascending',
  });

  const handlePageChange = (direction) => {
    let newPage = currentPage;
    if (direction === 'next' && currentPage < totalPages) newPage++;
    else if (direction === 'prev' && currentPage > 1) newPage--;
    else if (direction === 'first') newPage = 1;
    else if (direction === 'last') newPage = totalPages;

    setCurrentPage(newPage);
  };

  const handleFilterChange = (data) => {
    setTotalTransactions(data.pagination.totalTransactions || 0);
    setTotalPages(data.pagination.totalPages || 1);
    setStatementData(data.data || []);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...statementData].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    // Handle actions when currentPage changes
  }, [currentPage]);

  return (
    <div className="p-4">
      <AccountStatementFilter
        setTotalTransactions={setTotalTransactions}
        setTotalPages={setTotalPages}
        setTransactions={setStatementData}
        entriesToShow={entriesToShow}
        currentPage={currentPage}
        setIsDataFetched={setIsDataFetched}
        setCurrentPage={setCurrentPage}
      />

      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-seablue text-white font-bold">Account Statement</h1>

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
                {[
                  { key: 'createdAt', label: 'Date' },
                  { key: 'amount', label: 'Deposit' },
                  { key: 'amount', label: 'Withdraw' },
                  { key: 'currentMainWallet', label: 'Balance' },
                  { key: 'description', label: 'Remark' },
                  { key: 'from_To', label: 'From/To' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{label}</span>
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
              {sortedData.length > 0 ? (
                sortedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-3 text-sm text-center">{item.createdAt}</td>
                    <td className="px-4 py-3 text-sm text-center">
          {item.transactionType === 'credit' ? item.amount : '-'}
        </td>
        <td className="px-4 py-3 text-sm text-center">
          {item.transactionType === 'debit' ? item.amount : '-'}
        </td>
                    <td className="px-4 py-3 text-sm text-center">{item.currentMainWallet}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.from_To}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * entriesToShow + 1} to{' '}
            {Math.min(currentPage * entriesToShow, totalTransactions)} of {totalTransactions} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange('first')}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange('prev')}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange('next')}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange('last')}
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

export default AccountStatement;





// import React, { useState, useEffect } from 'react';
// import AccountStatementFilter from './AccountStatementFilter';

// const AccountStatement = () => {
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [statementData, setStatementData] = useState([]);
//   const [isDataFetched, setIsDataFetched] = useState(false);

//   const handlePageChange = (direction) => {
//     let newPage = currentPage;
//     if (direction === 'next' && currentPage < totalPages) newPage++;
//     else if (direction === 'prev' && currentPage > 1) newPage--;
//     else if (direction === 'first') newPage = 1;
//     else if (direction === 'last') newPage = totalPages;

//     console.log(`Page change detected. Current page: ${currentPage}, New page: ${newPage}`);
//     setCurrentPage(newPage); // Update currentPage state to trigger a new fetch
//   };

//   // This function will update the displayed statement data whenever currentPage or entriesToShow changes
//   const handleFilterChange = (data) => {
//     console.log("Data fetched:", data);
//     setTotalTransactions(data.pagination.totalTransactions || 0);
//     setTotalPages(data.pagination.totalPages || 1);
//     setStatementData(data.data || []); // Set new data for the statement
//   };

//   useEffect(() => {
//     console.log(`Current page changed: ${currentPage}`);
//     // You can make the API call or handle any other actions you want to perform when currentPage changes
//   }, [currentPage]); // This effect will run when currentPage changes.

//   return (
//     <div className="p-4">
//       <AccountStatementFilter
//         setTotalTransactions={setTotalTransactions}
//         setTotalPages={setTotalPages}
//         setTransactions={setStatementData}
//         entriesToShow={entriesToShow}
//         currentPage={currentPage} // Pass the currentPage to AccountStatementFilter
//         setIsDataFetched={setIsDataFetched}
//         setCurrentPage={setCurrentPage} // Pass setCurrentPage to allow it to update the currentPage state
//       />

// <div className="border border-gray-300 rounded-md bg-white">
//         <h1 className="text-xl bg-gradient-seablue text-white font-bold">Account Statement</h1>

//         <div className="flex justify-between items-center mb-4 p-4">
//           <div className="flex items-center">
//             <label className="mr-2 text-sm font-medium text-black">Show</label>
//             <select
//               value={entriesToShow}
//               onChange={(e) => {
//                 const newEntriesToShow = Number(e.target.value);
//                 console.log(`Entries to show changed: ${newEntriesToShow}`);
//                 setEntriesToShow(newEntriesToShow);
//                 setCurrentPage(1); // Reset to first page when entries change
//               }}
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
//         </div>

//         <div className="overflow-x-auto my-4 mx-4">
//           <table className="w-full table-auto border-collapse border border-gray-400">
//             <thead className="border border-gray-400 bg-gray-300 text-black text-center">
//               <tr>
//                 {['date', 'deposit', 'withdraw', 'balance', 'remark', 'FromTo'].map((key) => (
//                   <th key={key} className="border border-gray-300 px-4 py-3 text-sm font-medium text-center">
//                     {key.charAt(0).toUpperCase() + key.slice(1)}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {statementData.length > 0 ? (
//                 statementData.map((item, index) => (
//                   <tr key={index} className="border-b border-gray-400">
//                     <td className="px-4 py-3 text-sm text-center">{item.createdAt}</td>
//                     <td className="px-4 py-3 text-sm text-center">{item.amount}</td>
//                     <td className="px-4 py-3 text-sm text-center">{item.amount}</td>
//                     <td className="px-4 py-3 text-sm text-center">{item.currentMainWallet}</td>
//                     <td className="px-4 py-3 text-sm text-center">{item.description}</td>
//                     <td className="px-4 py-3 text-sm text-center">{item.from_To}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-between items-center mt-4 p-4">
//           <div className="text-sm text-gray-600">
//             Showing {(currentPage - 1) * entriesToShow + 1} to{' '}
//             {Math.min(currentPage * entriesToShow, totalTransactions)} of {totalTransactions} entries
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handlePageChange('first')}
//               className="px-3 py-1 text-gray-600 rounded text-sm"
//               disabled={currentPage === 1}
//             >
//               First
//             </button>
//             <button
//               onClick={() => handlePageChange('prev')}
//               className="px-3 py-1 text-gray-600 rounded text-sm"
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => handlePageChange('next')}
//               className="px-3 py-1 text-gray-600 rounded text-sm"
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//             <button
//               onClick={() => handlePageChange('last')}
//               className="px-3 py-1 text-gray-600 rounded text-sm"
//               disabled={currentPage === totalPages}
//             >
//               Last
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountStatement;

