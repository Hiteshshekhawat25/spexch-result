import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreditReference } from '../../Store/Slice/creditTransactionSlice'; // Adjust path as needed

const CreditReferenceTransactionModel = ({ userId, username, page = 1, limit = 1 }) => {
    console.log("userIdzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",userId);
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl"
      >
        <h3 className="text-xl font-semibold mb-4">Credit Reference Log - {username}</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && data && (
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
                {data?.entries?.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{row.fromName}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.userName}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.oldCreditReference}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.newCreditReference}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-600 mt-4">
              Showing {data.pagination.start} to {data.pagination.end} of {data.pagination.total} entries
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditReferenceTransactionModel;
