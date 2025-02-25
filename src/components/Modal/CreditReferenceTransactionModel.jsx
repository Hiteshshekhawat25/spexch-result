import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreditReference } from "../../Store/Slice/creditTransactionSlice"; // Adjust path as needed
import { FaSortUp, FaSortDown } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(entriesToShow || 10);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "ascending",
  });

  // Redux state
  const { data, loading, error } = useSelector(
    (state) => state.creditReference
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(
        fetchCreditReference({
          userId,
          username,
          page: currentPage,
          entriesToShow: entriesPerPage,
          search: searchTerm,
        })
      );
    }
  }, [
    dispatch,
    userId,
    username,
    currentPage,
    entriesToShow,
    searchTerm,
    isOpen,
  ]);

  const handleSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    // Dispatch the action to fetch sorted data
    dispatch(
      fetchCreditReference({
        userId,
        username,
        page: currentPage,
        entriesToShow: entriesPerPage,
        search: searchTerm,
        sortKey: key, // Pass sort key to backend if needed
        sortDirection: direction, // Pass sort direction to backend if needed
      })
    );
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
        className="bg-white rounded-lg shadow-lg p-0 w-[95%] sm:w-[80%] relative"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-gradient-blue rounded-t-lg text-white text-lg mt-0 px-2 py-2 font-custom font-semibold w-full">
          <h3 className="text-[15px] font-custom font-semibold">
            Credit Reference Log
          </h3>
          <button
            onClick={handleClose}
            className="cursor-pointer text-white text-xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && entries.length > 0 && (
          <div className="mt-2 max-h-96 p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <label className="mr-2 text-[13px] text-black">
                  Show
                </label>
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-gray-400 rounded px-1 py-0.5 text-[13px] h-[28px]"
                >
                  {[10, 25, 50, 100].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <label className="ml-2 text-[13px] text-black">
                  entries
                </label>
              </div>
              <div className="flex items-center md:pt-0 pt-2 w-auto">
                <p className="mr-2 text-[13px] text-black">Search:</p>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border rounded px-2 py-2 text-sm w-full md:w-auto h-[32px]"
                />
              </div>
            </div>
            <div className=" overflow-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {/* Table Header with Sorting Arrows */}
                    <th
                      className="border border-gray-300 px-2 py-2 cursor-pointer font-custom text-[13px] text-center"
                      onClick={() => handleSort("from_name")} // Replace with your sort handler
                    >
                      <div className="flex items-center justify-center">
                        From Name
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${
                              sortConfig.key === "from_name" &&
                              sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${
                              sortConfig.key === "from_name" &&
                              sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 cursor-pointer font-custom text-[13px] text-center"
                      onClick={() => handleSort("username")} // Replace with your sort handler
                    >
                      <div className="flex items-center justify-center">
                        User Name
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${
                              sortConfig.key === "username" &&
                              sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${
                              sortConfig.key === "username" &&
                              sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 cursor-pointer font-custom text-[13px] text-center"
                      onClick={() => handleSort("oldCreditReference")}
                    >
                      <div className="flex items-center justify-center">
                        Old Credit Reference
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${
                              sortConfig.key === "oldCreditReference" &&
                              sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${
                              sortConfig.key === "oldCreditReference" &&
                              sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 cursor-pointer font-custom text-[13px] text-center"
                      onClick={() => handleSort("newCreditReference")}
                    >
                      <div className="flex items-center justify-center">
                        New Credit Reference
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${
                              sortConfig.key === "newCreditReference" &&
                              sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${
                              sortConfig.key === "newCreditReference" &&
                              sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 cursor-pointer font-custom text-[13px] text-center"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center justify-center">
                        Date & Time
                        <div className="flex flex-col items-center ml-2">
                          <FaSortUp
                            className={`${
                              sortConfig.key === "createdAt" &&
                              sortConfig.direction === "ascending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginBottom: "-6px" }}
                          />
                          <FaSortDown
                            className={`${
                              sortConfig.key === "createdAt" &&
                              sortConfig.direction === "descending"
                                ? "text-black"
                                : "text-gray-400"
                            }`}
                            style={{ marginTop: "-6px" }}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((row, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-[14px] text-center">
                        {row.from_name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-[14px] text-center">
                        {row.username || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-[14px] text-center">
                        {row.oldCreditReference ?? 0}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-[14px] text-center">
                        {row.newCreditReference ?? 0}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-[14px] text-center">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {entries.length === 0 && !loading && !error && (
          <p>No credit reference transactions found.</p>
        )}

        {/* Pagination Controls */}

        <div className="flex items-center justify-between sm:mt-4 mt-3 sm:p-4 p-3">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages}
          </p>
          <div className="flex space-x-2 sm:ml-auto">
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 text-gray-600 rounded text-sm "
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 text-gray-600 rounded text-sm "
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-3 py-1 text-gray-600 rounded text-sm"
              disabled={currentPage === pagination.totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditReferenceTransactionModel;
