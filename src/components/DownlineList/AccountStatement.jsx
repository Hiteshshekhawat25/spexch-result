// AccountStatement.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAccountStatementData,
  selectAccountStatementLoading,
  selectAccountStatementError,
  setAccountStatementData,
  setLoading,
  setError,
} from '../../Store/Slice/accountStatementSlice';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import AccountStatementFilter from './AccountStatementFilter';

const AccountStatement = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAccountStatementData);
  const loading = useSelector(selectAccountStatementLoading);
  const error = useSelector(selectAccountStatementError);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      try {
        const demoData = [
          { date: '2024-12-20 10:00', deposit: 500, withdraw: 0, balance: 1500, remark: 'Initial Deposit',FromTo: '12/11/24' },
          { date: '2024-12-21 12:00', deposit: 0, withdraw: 200, balance: 1300, remark: 'Withdrawal' ,FromTo: '12/11/24'},
          // Add more data here
        ];
        dispatch(setAccountStatementData(demoData));
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError('Failed to fetch data'));
        dispatch(setLoading(false));
      }
    }, 1000);
  }, [dispatch]);

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(data.length / entriesToShow);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "first") {
      setCurrentPage(1);
    } else if (direction === "last") {
      setCurrentPage(totalPages);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...paginatedData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="p-4">
        <AccountStatementFilter/>

      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-xl bg-gradient-blue text-white font-bold">Account Statement</h1>

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
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
            <div className="overflow-x-auto my-4 mx-4">
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                <tr>
                  {['date', 'deposit', 'withdraw', 'balance', 'remark','From/To'].map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
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
                {sortedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-3 text-sm text-center">{item.date}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.deposit}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.withdraw}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.balance}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.remark}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.FromTok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        )}

        <div className="flex justify-between items-center mt-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * entriesToShow + 1} to {Math.min(currentPage * entriesToShow, data.length)} of {data.length} entries
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
