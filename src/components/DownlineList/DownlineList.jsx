import React, { useState, useEffect } from "react";
import { FaSortUp, FaSortDown, FaEdit, FaEye } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArrowUpDownFill } from "react-icons/ri";
import { MdSettings, MdDelete } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { BsBuildingFillLock } from "react-icons/bs";
import CreditEditReferenceModal from "../Modal/CreditEditReferanceModal";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";
import EditExposureLimitModal from "../Modal/EditExposureLimitModal";
import {
  setLoading,
  setError,
  setDownlineData,
} from "../../Store/Slice/downlineSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Constant/Api";

const DownlineList = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isModalOpen, setIsModalOpen] = useState(false); // State for opening the modal
  const [selectedUser, setSelectedUser] = useState(null); // State for storing selected user data
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isExposureModalOpen, setIsExposureModalOpen] = useState(false);
  const [selectedExposureUser, setSelectedExposureUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const handlePageChange = (direction) => {
    if (totalPages > 0) {
      if (direction === "first") {
        setCurrentPage(1);
      } else if (direction === "last") {
        setCurrentPage(totalPages);
      } else if (direction === "prev" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (direction === "next" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  // UseEffect to fetch data when `currentPage` or `entriesToShow` changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("Token not found. Please log in again.");
          return;
        }

        // API call to fetch data for the current page
        const response = await fetch(
          `${BASE_URL}/admin/v1/user/get-user?page=${currentPage}&limit=${entriesToShow}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log("API Response:", result);
        console.log("Current Page:", currentPage);
        console.log("Entries to Show:", entriesToShow);

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch data");
        }

        // Update data and totalUsers
        setData(result.data || []);
        setTotalUsers(result.pagination?.totalUsers || 0);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, entriesToShow]); // Fetch data when currentPage or entriesToShow changes

  console.log(data.length);
  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("filtereddata", filteredData);

  // Sorting logic
  // const sortedData = React.useMemo(() => {
  //   if (!sortConfig.key) return filteredData;
  //   const sorted = [...filteredData].sort((a, b) => {
  //     const aValue = a[sortConfig.key];
  //     const bValue = b[sortConfig.key];
  //     // Custom sorting for username (case-insensitive)
  //     if (sortConfig.key === "username") {
  //       return sortConfig.direction === "ascending"
  //         ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
  //         : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
  //     }
  //     // Custom sorting for creditRef (handle numbers within strings)
  //     if (sortConfig.key === "creditRef") {
  //       const extractNumber = (val) => parseInt(val.replace(/\D/g, ""), 10) || 0;
  //       const numA = extractNumber(aValue);
  //       const numB = extractNumber(bValue);
  //       if (numA !== numB) {
  //         return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
  //       }
  //       return sortConfig.direction === "ascending"
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }
  //     // Default sorting for numbers or strings
  //     if (typeof aValue === "number") {
  //       return sortConfig.direction === "ascending"
  //         ? aValue - bValue
  //         : bValue - aValue;
  //     }
  //     return sortConfig.direction === "ascending"
  //       ? aValue.localeCompare(bValue)
  //       : bValue.localeCompare(aValue);
  //   });
  //   return sorted;
  // }, [filteredData, sortConfig]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || ""; // Default to an empty string if undefined
      const bValue = b[sortConfig.key] || ""; // Default to an empty string if undefined

      // Handle numeric sorting for partnership, balance, and exposure values
      if (
        ["partnership", "balance", "exposureLimit"].includes(sortConfig.key)
      ) {
        const numA = parseFloat(aValue) || 0;
        const numB = parseFloat(bValue) || 0;
        return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
      }

      // Handle status sorting (alphabetical)
      if (sortConfig.key === "status") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Default sorting for strings and numbers
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredData, sortConfig]);

  console.log("sorteddata", sortedData);

  // Paginate data

  // const paginatedData = sortedData.slice(
  //   ((currentPage - 1) * entriesToShow),
  //   currentPage * entriesToShow
  // );

  // console.log("paginatedData",paginatedData)

  //   const startIndex = (currentPage - 1) * entriesToShow; // Start index for the current page
  // const endIndex = currentPage * entriesToShow; // End index for the current page (exclusive)

  // console.log('Start Index:', startIndex);
  // console.log('End Index:', endIndex);
  // console.log('Sorted Data Length:', sortedData.length);

  // Ensure the endIndex does not exceed the length of the sortedData
  // const paginatedData = sortedData.slice(startIndex, endIndex);
  const paginatedData = sortedData;

  console.log("Paginated Data:", paginatedData);

  // const totalPages = Math.ceil(filteredData.length / entriesToShow);
  const totalPages = Math.ceil(totalUsers / entriesToShow);

  // Event handlers
  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key && prev.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" }
    );
  };

  const handleEditClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Clear selected user data
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user); // Directly calling the delete action (you wanted to avoid this)
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const error = useSelector((state) => state.selectedUser?.error);

  if (error) {
    console.error("Error fetching user:", error);
    // Optional: Display the error in the UI
    return (
      <div className="text-red-500 font-bold">An error occurred: {error}</div>
    );
  }
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.username); // Replace with API call
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleExposureEditClick = (user) => {
    setSelectedExposureUser(user); // Set the selected user
    setIsExposureModalOpen(true); // Open the modal
  };

  const handleExposureModalClose = () => {
    setIsExposureModalOpen(false); // Close the modal
    setSelectedExposureUser(null); // Clear selected user data
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Show</label>
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
          <label className="ml-2 text-sm font-medium">entries</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="border border-gray-300">
          <tr className="bg-gray-300">
            {[
              { key: "username", label: "Username" },
              { key: "creditRef", label: "CreditRef" },
              { key: "partnership", label: "Partnership" },
              { key: "balance", label: "Balance" },
              { key: "exposure", label: "Exposure" },
              { key: "availableBalance", label: "Avail. Bal" },
              { key: "refPL", label: "Ref. P/L" },
              { key: "status", label: "Status" },
            ].map(({ key, label }) => (
              <th
                key={key}
                className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <div className="flex justify-between items-center">
                  {label}
                  <div className="flex flex-col items-center space-y-1 ml-2">
                    <FaSortUp
                      className={`${
                        sortConfig.key === key &&
                        sortConfig.direction === "ascending"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    />
                    <FaSortDown
                      className={`${
                        sortConfig.key === key &&
                        sortConfig.direction === "descending"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </th>
            ))}
            <th className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="border border-gray-300 bg-white">
              <td className="px-4 py-3 text-sm">
                {" "}
                <span className="bg-green-500 text-white px-2 py-1 mr-1 rounded">
                  {item.role_name}
                </span>
                {item.username}
              </td>
              <td className="px-4 py-3 text-sm text-blue-900">
                {item.creditReference}
                <div className="ml-2 inline-flex space-x-2">
                  <FaEdit
                    className="text-blue cursor-pointer"
                    onClick={() => handleEditClick(item)} // Trigger modal on click
                  />
                  <FaEye className="text-blue cursor-pointer" />
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{item.partnership}%</td>
              <td className="px-4 py-3 text-sm">{item.openingBalance}</td>
              <td className="px-4 py-3 text-sm text-blue-900">
                {item.exposureLimit}
                <div className="ml-2 inline-flex space-x-2">
                  <FaEdit
                    className="text-blue cursor-pointer"
                    onClick={() => handleExposureEditClick(item)}
                  />
                </div>
              </td>
              <td className="px-4 py-3 text-sm"></td>
              <td className="px-4 py-3 text-sm"></td>
              <td className="px-4 py-3 text-sm">{item.status}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <AiFillDollarCircle className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <RiArrowUpDownFill className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <MdSettings className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <FaUserAlt className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <BsBuildingFillLock className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <MdDelete
                      className="text-"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {totalUsers === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
          to {Math.min(currentPage * entriesToShow, totalUsers)} of {totalUsers}{" "}
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

      {isModalOpen && selectedUser && (
        <CreditEditReferenceModal
          isOpen={isModalOpen}
          onCancel={handleModalClose} // This will be triggered when the cancel button or cross icon is clicked
          username={selectedUser.username}
          currentCreditRef={selectedUser.creditRef}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        userId={userToDelete?._id}
      />

      {isExposureModalOpen && selectedExposureUser && (
        <EditExposureLimitModal
          username={selectedExposureUser.username}
          currentExposureLimit={selectedExposureUser.exposureLimit}
          onSubmit={(newExposureLimit, password) => {
            console.log(
              `Updated exposure limit for ${selectedExposureUser.username}: ${newExposureLimit} (Password: ${password})`
            );
            handleExposureModalClose(); // Close the modal after submission
          }}
          onCancel={handleExposureModalClose} // Close modal without changes
        />
      )}
    </div>
  );
};

export default DownlineList;
