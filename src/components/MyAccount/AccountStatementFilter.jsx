import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataSource,
  setFromDate,
  setToDate,
  selectAccountStatementFilter,
} from '../../Store/Slice/accountStatementFilterSlice';
import { getAccountStatementData } from '../../Services/Downlinelistapi';

const AccountStatementFilter = ({
  setTotalTransactions,
  setTotalPages,
  setTransactions,
  entriesToShow,
  currentPage,
  setIsDataFetched,
  setCurrentPage,
}) => {
  const dispatch = useDispatch();
  const { dataSource, fromDate, toDate } = useSelector(selectAccountStatementFilter);

  // Whenever the entriesToShow changes (like from 25 to 10), reset currentPage to 1
  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when entriesToShow changes
  }, [entriesToShow, setCurrentPage]);

  // Whenever currentPage, fromDate, toDate, or dataSource changes, fetch the statement
  useEffect(() => {
    // Trigger API call whenever one of the necessary filter values changes
    if (fromDate && toDate) {
      console.log('Fetching data due to filter change or page change');
      handleGetStatement(); // Trigger API call on filter change or page change
    }
  }, [currentPage, fromDate, toDate, dataSource, entriesToShow]); // Re-run the effect if any of these change

  const handleGetStatement = async () => {
    // Ensure fromDate and toDate are selected before fetching data
    if (!fromDate || !toDate) {
      alert('Please select both From Date and To Date');
      return;
    }

    try {
      // Construct the URL based on the filters
      const url = `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&dataSource=${dataSource || ''}`;
      console.log('Fetching data with URL:', url);

      // Call the API
      const response = await getAccountStatementData(url);

      if (response && response.data) {
        console.log('Fetched data:', response.data);

        const { pagination, data } = response.data; // Destructure pagination and data

        setTransactions(data); // Set the fetched data to the Parent state
        setTotalTransactions(pagination?.totalTransactions || 0);
        setTotalPages(pagination?.totalPages || 1);
        setIsDataFetched(true); // Mark that data has been fetched
      } else {
        console.error('No data found in response');
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error('Error fetching account statement data:', error);
      setIsDataFetched(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
      {/* Filter UI */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">Data Source</label>
        <select
          value={dataSource}
          onChange={(e) => {
            dispatch(setDataSource(e.target.value));
            console.log('Data Source selected:', e.target.value);
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Select Data Source</option>
          <option value="api1">API 1</option>
          <option value="api2">API 2</option>
          <option value="api3">API 3</option>
        </select>
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            dispatch(setFromDate(e.target.value));
            console.log('From Date selected:', e.target.value);
          }}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex flex-col items-start">
        <label className="text-sm font-medium text-black mb-1">To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            dispatch(setToDate(e.target.value));
            console.log('To Date selected:', e.target.value);
          }}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <div className="flex space-x-2 items-center ml-auto">
        <button
          onClick={handleGetStatement}
          className="px-4 py-2 bg-gradient-blue text-white rounded-md text-sm"
        >
          Get Statement
        </button>
      </div>
    </div>
  );
};

export default AccountStatementFilter;




// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   setDataSource,
//   setFromDate,
//   setToDate,
//   selectAccountStatementFilter,
// } from '../../Store/Slice/accountStatementFilterSlice';
// import { getAccountStatementData } from '../../Services/Downlinelistapi';

// const AccountStatementFilter = ({
//   setTotalTransactions,
//   setTotalPages,
//   setTransactions,
//   entriesToShow,
//   currentPage,
//   setIsDataFetched, // New prop to control when data is fetched
// }) => {
//   const dispatch = useDispatch();
//   const { dataSource, fromDate, toDate } = useSelector(selectAccountStatementFilter);

//   useEffect(() => {
//     // This effect will run every time the currentPage changes
//     console.log('Current Page changed:', currentPage);
//     handleGetStatement(); // Trigger the API call when page changes
//   }, [currentPage]); // Dependency array contains currentPage to re-run on page change

//   const handleGetStatement = async () => {
//     // Ensure fromDate and toDate are selected
//     if (!fromDate || !toDate) {
//       alert('Please select both From Date and To Date');
//       return;
//     }

//     try {
//       // Construct the URL based on the filters
//       const url = `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&dataSource=${dataSource || ''}`;
//       console.log('Fetching data with URL:', url);

//       // Call the API
//       const response = await getAccountStatementData(url);

//       if (response && response.data) {
//         console.log('Fetched data:', response.data);

//         const { pagination, data } = response.data; // Destructure pagination and data

//         setTransactions(data); // Set the fetched data to the Parent state

//         setTotalTransactions(pagination?.totalTransactions || 0);
//         setTotalPages(pagination?.totalPages || 1);

//         setIsDataFetched(true); // Mark that data has been fetched
//       } else {
//         console.error('No data found in response');
//       }
//     } catch (error) {
//       console.error('Error fetching account statement data:', error);
//     }
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
//       {/* Filter UI */}
//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">Data Source</label>
//         <select
//           value={dataSource}
//           onChange={(e) => {
//             dispatch(setDataSource(e.target.value));
//             console.log('Data Source selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         >
//           <option value="">Select Data Source</option>
//           <option value="api1">API 1</option>
//           <option value="api2">API 2</option>
//           <option value="api3">API 3</option>
//         </select>
//       </div>

//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">From Date</label>
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => {
//             dispatch(setFromDate(e.target.value));
//             console.log('From Date selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         />
//       </div>

//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">To Date</label>
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => {
//             dispatch(setToDate(e.target.value));
//             console.log('To Date selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         />
//       </div>

//       <div className="flex space-x-2 items-center ml-auto">
//         <button
//           onClick={handleGetStatement}
//           className="px-4 py-2 bg-gradient-blue text-white rounded-md text-sm"
//         >
//           Get Statement
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccountStatementFilter;



// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   setDataSource,
//   setFromDate,
//   setToDate,
//   selectAccountStatementFilter,
// } from '../../Store/Slice/accountStatementFilterSlice';
// import { getAccountStatementData } from '../../Services/Downlinelistapi';

// const AccountStatementFilter = ({
//   setTotalTransactions,
//   setTotalPages,
//   setTransactions, // Pass setTransactions function from Parent
//   entriesToShow,
//   currentPage,
// }) => {
//   const dispatch = useDispatch();
//   const { dataSource, fromDate, toDate } = useSelector(selectAccountStatementFilter);

//   const handleGetStatement = async () => {
//     try {
//       const url = `user/get-transaction?page=${currentPage}&limit=${entriesToShow}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&dataSource=${dataSource || ''}`;
//       console.log('Fetching data with URL:', url);

//       const response = await getAccountStatementData(url);

//       if (response && response.data) {
//         console.log('Fetched data:', response.data);

//         const { pagination, data } = response.data; // Destructure pagination and data

//         setTransactions(data); // Set the fetched data to the Parent state

//         console.log('Total Transactions:', pagination?.totalTransactions);
//         console.log('Total Pages:', pagination?.totalPages);

//         setTotalTransactions(pagination?.totalTransactions || 0);
//         setTotalPages(pagination?.totalPages || 1);
//       } else {
//         console.error('No data found in response');
//       }
//     } catch (error) {
//       console.error('Error fetching account statement data:', error);
//     }
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 border border-gray-300 rounded-md mb-4">
//       {/* Filter UI */}
//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">Data Source</label>
//         <select
//           value={dataSource}
//           onChange={(e) => {
//             dispatch(setDataSource(e.target.value));
//             console.log('Data Source selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         >
//           <option value="">Select Data Source</option>
//           <option value="api1">API 1</option>
//           <option value="api2">API 2</option>
//           <option value="api3">API 3</option>
//         </select>
//       </div>

//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">From Date</label>
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => {
//             dispatch(setFromDate(e.target.value));
//             console.log('From Date selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         />
//       </div>

//       <div className="flex flex-col items-start">
//         <label className="text-sm font-medium text-black mb-1">To Date</label>
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => {
//             dispatch(setToDate(e.target.value));
//             console.log('To Date selected:', e.target.value);
//           }}
//           className="border rounded px-2 py-1 text-sm"
//         />
//       </div>

//       <div className="flex space-x-2 items-center ml-auto">
//         <button
//           onClick={handleGetStatement}
//           className="px-4 py-2 bg-gradient-blue text-white rounded-md text-sm"
//         >
//           Get Statement
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccountStatementFilter;


