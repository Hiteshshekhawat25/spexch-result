import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditReference } from "../../Store/Slice/creditTransactionSlice"; // Adjust path as needed

const CreditReferenceTransactionModel = ({
  userId,
  username,
  currentPage,
  entriesToShow,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Redux state
  const { data, loading, error } = useSelector(
    (state) => state.creditReference
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchCreditReference({ userId, username, page: currentPage, entriesToShow })
      );
    }
  }, [dispatch, userId, username, currentPage, entriesToShow, isOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const entries = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-3">
          <h3 className="text-l font-semibold">Credit Reference Log</h3>
          <button
            onClick={handleClose}
            className="cursor-pointer text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && entries.length > 0 && (
          <div className="mt-4 overflow-auto max-h-96">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    From Name
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    User Name
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    Old Credit Reference
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    New Credit Reference
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-left">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">
                      {row.from_name || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {row.username || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {row.oldCreditReference ?? 0}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {row.newCreditReference ?? 0}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {entries.length === 0 && !loading && !error && (
          <p>No credit reference transactions found.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditReferenceTransactionModel;
