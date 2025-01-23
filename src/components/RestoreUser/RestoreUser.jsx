import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Constant/Api";

const RestoreUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [restoreUser, setRestoreUser] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchRestoreUser = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           console.error("No token found for authorization.");
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/user/get-deleted-user`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params: {
//             page: currentPage,
//             limit: entriesToShow,
//           },
//         });

//         const data = response.data;
//         console.log("data", data);
//         if (data.success) {
//           setRestoreUser(data?.data || []);
//           setTotalCount(data?.pagination.totalRecords);
//           setTotalRecords(data?.pagination.totalRecords);
//           // Calculate totalPages after fetching the data
//           setTotalPages(
//             Math.ceil(data?.pagination.totalRecords / entriesToShow)
//           );
//         } else {
//           console.error("Failed to fetch password history.");
//         }
//       } catch (error) {
//         console.error("An error occurred while fetching deleted user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestoreUser();
//   }, [currentPage, entriesToShow, totalRecords]);

  const filteredData = restoreUser.filter((item) =>
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

//   const handleRestoreUser =(userId)=> {
//     const token = localStorage.getItem("authToken");
//     console.log("token", token)
  
//     try {
//       const response = axios.put(
//         `${BASE_URL}/user/restore-user`,
//         {
//           userId,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchRestoreUser();
//       return response?.data?.data;
      
//     } catch (error) {
//       console.error("Error updating user status:", error);
//       throw error;
//     }

//   }
// const handleRestoreUser = async (userId) => {
//     const token = localStorage.getItem("authToken");
//     console.log("token", token);
  
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/user/restore-user`,
//         { userId },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("User restored successfully:", response?.data?.data);
  
//       // Call fetchRestoreUser if needed after the successful API call
//       fetchRestoreUser();
  
//       return response?.data?.data;
//     } catch (error) {
//       console.error("Error updating user status:", error);
//       throw error; // Re-throw the error for further handling if necessary
//     }
//   };

  const handleRestoreUser = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await axios.put(
        `${BASE_URL}/user/restore-user`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.data?.success) {
        setRestoreUser((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
  
        fetchRestoreUser();
      } else {
        console.error("Failed to restore user");
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };
  
  // Make fetchRestoreUser a reusable function
  const fetchRestoreUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found for authorization.");
        return;
      }
  
      const response = await axios.get(`${BASE_URL}/user/get-deleted-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: entriesToShow,
        },
      });
  
//       const data = response.data;
//       if (data.success) {
//         setRestoreUser(data?.data || []);
//         setTotalCount(data?.pagination.totalRecords);
//         setTotalRecords(data?.pagination.totalRecords);
//         setTotalPages(
//           Math.ceil(data?.pagination.totalRecords / entriesToShow)
//         );
//       } else {
//         console.error("Failed to fetch deleted users.");
//       }
//     } catch (error) {
//       console.error("Error fetching deleted users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
const data = response.data;
        console.log("data", data);
        if (data.success) {
          setRestoreUser(data?.data || []);
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
        console.error("An error occurred while fetching deleted user:", error);
      } finally {
        setLoading(false);
      }
    };

  
  // Call fetchRestoreUser in useEffect
  useEffect(() => {
    fetchRestoreUser();
  }, [currentPage, entriesToShow]);
  
  
  return (
    <div className="bg-gray-100">
      <div className="border border-gray-300 rounded-md bg-white">
        <h1 className="text-md bg-gradient-seablue text-white font-bold p-1">
          Restore User
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
                    Name
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-center">
                    Date & Time
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(
                    (item, index) => (
                      console.log("item", item),
                      (
                        <tr
                          key={index}
                          className="even:bg-gray-100 odd:bg-white text-gray-700"
                        >
                          <td className="border border-gray-300 p-2 text-center">
                            {item.username}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {item.name}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {formatDateTime(item.deletedAt)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button className="text-md bg-gradient-seablue text-white font-bold p-1 rounded" onClick={()=>handleRestoreUser(item._id)}>Restore</button>
                          </td>
                        </tr>
                      )
                    )
                  )
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

export default RestoreUser;
