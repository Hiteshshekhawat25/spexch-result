import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectEventProfitLossData,
  selectEventStatus,
  selectEventError,
  updateEventProfitLoss,
  setEventLoading,
  setEventError,
} from '../../Store/Slice/eventProfitLossSlice';
import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';
import EventPLFilter from './EventPLFilter';

const EventProfitLoss = () => {
    const dispatch = useDispatch();
    const data = useSelector(selectEventProfitLossData);
    const loading = useSelector(selectEventStatus) === 'loading';
    const error = useSelector(selectEventError);
  
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'sportName', direction: 'ascending' });
  
    useEffect(() => {
      dispatch(setEventLoading());
      setTimeout(() => {
        try {
          const demoData = [
            { sportName: 'Football', uplineProfitLoss: 100, downlineProfitLoss: 50, commission: 20 },
            { sportName: 'Basketball', uplineProfitLoss: 200, downlineProfitLoss: 150, commission: 30 },
            { sportName: 'Tennis', uplineProfitLoss: 120, downlineProfitLoss: 80, commission: 25 },
          ];
          dispatch(updateEventProfitLoss(demoData));
        } catch (err) {
          dispatch(setEventError('Failed to fetch data'));
        }
      }, 1000);
    }, [dispatch]);
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to page 1 on new search
    };
  
    const handleEntriesChange = (e) => {
      setEntriesToShow(Number(e.target.value));
      setCurrentPage(1); // Reset to page 1 on entries change
    };
  
    // Safely check if `data` is an array before calling `.filter()`
    const filteredData = Array.isArray(data)
      ? data.filter((item) =>
          item.sportName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
  
    const totalPages = Math.ceil(filteredData.length / entriesToShow);
  
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
  
    const paginatedData = filteredData.slice(
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
  
    const totalData = {
      sportName: 'Total',
      uplineProfitLoss: sortedData.reduce((acc, row) => acc + row.uplineProfitLoss, 0),
      downlineProfitLoss: sortedData.reduce((acc, row) => acc + row.downlineProfitLoss, 0),
      commission: sortedData.reduce((acc, row) => acc + row.commission, 0),
    };
  
    return (
      <div className='p-4'>
        <EventPLFilter />
  
        <div className="border border-gray-300 rounded-md bg-white">
          {/* Header */}
          <h1 className="text-xl bg-gradient-blue text-white font-bold">
            Event Profit Loss
          </h1>
  
          {/* Search and Entries Per Page */}
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
                // placeholder="Search by sport name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
  
          {/* Table */}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-400 p-2">
              <thead className="border border-gray-400 bg-gray-300 text-black text-center">
                <tr className="text-center">
                  {['sportName', 'uplineProfitLoss', 'downlineProfitLoss', 'commission'].map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-3 text-sm font-medium text-center cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex justify-between items-center">
                        {/* Heading Text */}
                        <span>{key === 'sportName' ? 'Sport Name' : key === 'uplineProfitLoss' ? 'Upline Profit/Loss' : key === 'downlineProfitLoss' ? 'Downline Profit/Loss' : 'Commission'}</span>
  
                        {/* Sorting Icons */}
                        <div className="flex flex-col items-center space-y-0.5 ml-2">
                          <FaSortUp
                            className={`text-sm ${sortConfig.key === key && sortConfig.direction === 'ascending' ? 'text-black' : 'text-gray-400'}`}
                          />
                          <FaSortDown
                            className={`text-sm ${sortConfig.key === key && sortConfig.direction === 'descending' ? 'text-black' : 'text-gray-400'}`}
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
                    <td className="px-4 py-3 text-sm text-center">{item.sportName}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.uplineProfitLoss}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.downlineProfitLoss}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.commission}</td>
                  </tr>
                ))}
              </tbody>
              {/* Total Row */}
              <tfoot>
                <tr className="bg-gray-300 text-black">
                  <td className="px-4 py-3 text-sm text-center">{totalData.sportName}</td>
                  <td className="px-4 py-3 text-sm text-center">{totalData.uplineProfitLoss}</td>
                  <td className="px-4 py-3 text-sm text-center">{totalData.downlineProfitLoss}</td>
                  <td className="px-4 py-3 text-sm text-center">{totalData.commission}</td>
                </tr>
              </tfoot>
            </table>
          )}
  
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 p-4">
            <div className="text-sm text-gray-600">
              Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
              to {Math.min(currentPage * entriesToShow, filteredData.length)} of {filteredData.length}{" "}
              entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange("first")}
                className="px-3 py-1 text-gray-600 rounded text-sm"
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange("prev")}
                className="px-3 py-1 text-gray-600 rounded text-sm"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange("next")}
                className="px-3 py-1 text-gray-600 rounded text-sm"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange("last")}
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
  
  export default EventProfitLoss;
  

