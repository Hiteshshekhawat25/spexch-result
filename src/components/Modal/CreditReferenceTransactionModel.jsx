import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreditReference } from '../../Store/Slice/creditTransactionSlice'; // Adjust path as needed

const CreditReferenceTransactionModel = ({ userId, username, page = 1, limit = 2 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Redux state
  const { data, loading, error } = useSelector((state) => state.creditReference);

  useEffect(() => {
    // Fetch credit reference data
    dispatch(fetchCreditReference({ userId, username, page, limit }));
  }, [dispatch, userId, username, page, limit]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  // Extract entries and pagination from the fetched data
  const entries = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl"
      >
        <h3 className="text-xl font-semibold mb-4">Credit Reference Log - {username}</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && entries.length > 0 && (
          <>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">From Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Old Credit Reference</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">New Credit Reference</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{row.from_user}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.oldCreditReference}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.newCreditReference}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-600 mt-4">
              Showing {pagination.currentPage} to {pagination.totalPages} of {pagination.totalRecords} entries
            </p>
          </>
        )}
        {entries.length === 0 && !loading && !error && (
          <p>No credit reference transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default CreditReferenceTransactionModel;
