import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

const PasswordHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPasswordHistory = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found for authorization.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/user/get-password-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              limit: entriesToShow,
            },
          }
        );

        const data = response.data;
        if (data.success) {
          setPasswordHistory(data?.data || []);
          setTotalCount(data?.pagination.totalRecords);
          setTotalRecords(data?.pagination.totalRecords);
          // Calculate totalPages after fetching the data
          setTotalPages(
            Math.ceil(data?.pagination.totalRecords / entriesToShow)
          );
        } else {
          console.error("Failed to fetch password history.");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching password history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPasswordHistory();
  }, [currentPage, entriesToShow, totalRecords]);

  const filteredData = passwordHistory.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === "first") {
      setCurrentPage(1);
    } else if (direction === "last") {
      setCurrentPage(totalPages);
    }
  };

  const formatDateTime = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-100">
      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-md bg-gradient-seablue text-white font-bold p-1">
          Password Change History
        </h1>
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Entries Dropdown */}
            {/* <div className="flex items-center space-x-2 ml-10"> */}
            <div className="flex items-center space-x-2 sm:ml-0 ml-10">
              <label className="">Show</label>
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
              <label className="">entries</label>
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-2">
              <label className="">Search:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2 text-left text-center">
                    Username
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-center">
                    Remarks
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-center">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="even:bg-gray-100 odd:bg-white text-gray-700"
                    >
                      <td className="border border-gray-300 p-2 text-center">
                        {item.username}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {item.remarks}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {formatDateTime(item.date)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-600 py-4">
                      No user found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {totalRecords === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
              to {Math.min(currentPage * entriesToShow, totalRecords)} of{" "}
              {totalRecords} entries
            </div>
            <div className="flex justify-end items-center py-2 space-x-2">
              <button
                onClick={() => handlePageChange("first")}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange("last")}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordHistory;
