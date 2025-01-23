
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchDownlineData,
  performTransaction,
} from "../../Services/Downlinelistapi";
import {
  setLoading,
  setError,
  setDownlineData,
} from "../../Store/Slice/downlineSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  selectDownlineData,
  selectDownlineLoading,
  selectDownlineError,
} from "../../Store/Slice/downlineSlice";
import { fetchRoles } from "../../Utils/LoginApi";
import { FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import CreditEditReferenceModal from "../Modal/CreditEditReferanceModal";

const Banking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const downlineData = useSelector(selectDownlineData);
  const loading = useSelector(selectDownlineLoading);
  const error = useSelector(selectDownlineError);
  const [editedData, setEditedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const { startFetchData } = useSelector((state) => state.downline);
  const [password, setPassword] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedButtonRow, setSelectedButtonRow] = useState(null);
  const [selectedButtonStatus, setSelectedButtonStatus] = useState(null);


  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const columns = [
    { key: "username", label: "UID" },
    { key: "openingBalance", label: "Balance" },
    { key: "totalBalance", label: "Available D/W" },
    { key: "exposure", label: "Exposure" },
    { key: "creditReference", label: "Credit Referance" },
    { key: "referance", label: "Referance P/L" },
    { key: "depositwithdraw", label: "Deposit/Withdraw" },
    { key: "remark", label: "Remark" },
  ];

  const filteredData = downlineData.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearAll = () => {
    setEditedData([]);
    setPassword("");
    setSelectedRowIndex(null);
    setSearchTerm("");

    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleInputChange = (e, key, index) => {
    const { value } = e.target;
    setEditedData((prevState) => {
      const updatedData = [...prevState];
      updatedData[index] = {
        ...updatedData[index],
        [key]: value,
      };
      return updatedData;
    });
  };

  const handleButtonClick = (status, index) => {
    setEditedData((prevState) => {
      const updatedData = [...prevState];
      
      // If a button in another row is selected, unselect the previous one
      if (selectedButtonRow !== null && selectedButtonRow !== index) {
        updatedData[selectedButtonRow] = {
          ...updatedData[selectedButtonRow],
          depositwithdrawStatus: "", // Unselect the previous button
          highlightFull: false, // Remove highlighting for "Full"
        };
      }
  
      // Now set the current selected button
      if (status === "Full") {
              updatedData[index] = {
                ...updatedData[index],
                depositwithdraw: filteredData[index]?.totalBalance || "",
                highlightFull: true,
              };
      } else {
              updatedData[index] = {
                ...updatedData[index],
                depositwithdrawStatus: status,
                highlightFull:
                  status === "W" ? true : updatedData[index]?.highlightFull,
              };
      }
  
      return updatedData;
    });
  
    
    setSelectedButtonRow(index);
    setSelectedButtonStatus(status);
  };
  
    const handleSubmitPaymentFunction = (data) => {
    if (!password) {
      toast.error("Please enter the password.");
      return;
    }

    if (!data.userId) {
      toast.error("Invalid data. Ensure all fields are filled correctly.");
      return;
    }

    if (!data.depositwithdraw || !data.depositwithdrawStatus) {
      toast.error("Amount is Mandatory");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }

    const user = downlineData.find((item) => item._id === data.userId);
    if (
      data.depositwithdrawStatus === "W" &&
      user.totalBalance < Number(data.depositwithdraw)
    ) {
      toast.error(
        "Insufficient balance. Withdrawal amount exceeds total balance."
      );
      return;
    }

    performTransaction(
      data.depositwithdrawStatus,
      {
        userId: data.userId,
        amount: Number(data.depositwithdraw),
        password: data.password,
        description: data.remark,
      },
      token
    )
      .then(() => {
        toast.success(`Transaction was successful.`);
        setPassword("");

        setEditedData((prevState) => {
          const updatedData = [...prevState];
          updatedData[selectedRowIndex] = {
            ...updatedData[selectedRowIndex],
            depositwithdraw: "",
            remark: "",
            depositwithdrawStatus: "",
            
            highlightFull: false,
          };
          return updatedData;
        });

        const updatedDownlineData = downlineData.map((item) =>
          item._id === data.userId
            ? {
                ...item,
                totalBalance:
                  data.depositwithdrawStatus === "D"
                    ? item.totalBalance + Number(data.depositwithdraw)
                    : item.totalBalance - Number(data.depositwithdraw),
                depositwithdraw: "",
              }
            : item
        );

        dispatch(setDownlineData(updatedDownlineData)); // Automatically update Redux store
      })
      .catch((error) => {
        toast.error(
          error.message || `Error processing transaction for ${data.userId}.`
        );
      });
  };

  const handleSubmitPaymentForRow = () => {
    if (selectedRowIndex === null) {
      toast.error("No row selected for payment.");
      return;
    }
    setIsSubmitClicked(true);
    setTimeout(() => setIsSubmitClicked(false), 300);

    const item = filteredData[selectedRowIndex];
    const currentData = {
      userId: item._id,
      depositwithdraw:
        editedData[selectedRowIndex]?.depositwithdraw || item.depositwithdraw,
      depositwithdrawStatus:
        editedData[selectedRowIndex]?.depositwithdrawStatus,
      remark: editedData[selectedRowIndex]?.remark || item.remark || "",
      password,
    };

    console.log("Submit Payment Data:", currentData);
    handleSubmitPaymentFunction(currentData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitFunction = (newCreditRef, password) => {
    console.log("New Credit Ref:", newCreditRef, "Password:", password);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found. Please log in again.");
          return;
        }

        dispatch(setLoading(true));

        const result = await fetchDownlineData(
          currentPage,
          entriesToShow,
          roleId
        );

        if (result && result.data) {
          dispatch(setDownlineData(result.data));
          console.log("Fetched downline data:", result.data);
          setTotalUsers(result.pagination?.totalUsers || 0);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, entriesToShow, roleId, startFetchData]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found. Please log in again.");
          return;
        }
        const rolesArray = await fetchRoles(token);

        if (Array.isArray(rolesArray)) {
          const rolesData = rolesArray.map((role) => ({
            role_name: role.role_name,
            role_id: role._id,
          }));
          setRoles(rolesData);
          if (location.pathname === "/master-banking") {
            const masterRole = rolesData.find(
              (role) => role.role_name === "master"
            );
            if (masterRole) {
              setRoleId(masterRole.role_id);
            }
          } else if (location.pathname === "/user-banking") {
            const userRole = rolesData.find(
              (role) => role.role_name === "user"
            );
            if (userRole) {
              setRoleId(userRole.role_id);
            }
          }
        } else {
          setError("Roles data is not an array.");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch roles.");
      }
    };

    fetchUserRoles();
  }, [location.pathname]);

  useEffect(() => {
    if (roleId) {
      const fetchDownlineDataByRole = async () => {
        try {
          dispatch(setLoading(true));
          const data = await fetchDownlineData(
            currentPage,
            entriesToShow,
            roleId
          );
          dispatch(setDownlineData(data?.data));
        } catch (error) {
          console.error("Error fetching downline data:", error);
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      };

      fetchDownlineDataByRole();
    }
  }, [dispatch, roleId, currentPage, entriesToShow]);

  const totalPages = Math.ceil(totalUsers / entriesToShow);

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

  const getStatusClasses = (status) => {
    if (status === "active")
      return "text-green-600 border-green-600 bg-green-100";
    if (status === "suspended" || status === "locked")
      return "text-red-600 border-red-600 bg-red-100";
    return "text-gray-600 border-gray-600 bg-gray-100";
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>

            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>

            <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
              <ClipLoader />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* <div className="p-4"> */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-2 sm:ml-0 ml-10">
              <label className="mr-2 text-sm font-medium">Show</label>
              <select
                value={entriesToShow}
                onChange={handleEntriesChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 25, 50, 100].map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
              <label className="ml-2 text-sm font-medium">entries</label>
            </div>
            <div className="p-2 rounded-md">
              <label className="p-1">Search:</label>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          {/* </div> */}
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="border border-gray-300">
              <tr className="bg-gray-300">
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    className="border border-gray-400 text-left px-4 text-sm font-medium text-black cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex justify-between items-center">
                      {label}
                      <div className="flex flex-col items-center ml-2">
                        <FaSortUp
                          className={`${
                            sortConfig.key === key &&
                            sortConfig.direction === "ascending"
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                          style={{
                            marginBottom: "-6px",
                          }}
                        />
                        <FaSortDown
                          className={`${
                            sortConfig.key === key &&
                            sortConfig.direction === "descending"
                              ? "text-black"
                              : "text-gray-400"
                          }`}
                          style={{
                            marginTop: "-6px",
                          }}
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border border-gray-400 bg-white"
                  onClick={() => handleRowClick(index)}
                >
                  <td className="px-4 py-2 text-sm">
                    <span className="text-black font-semibold">
                      {item.username}
                    </span>
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                    {new Intl.NumberFormat("en-IN").format(item.openingBalance)}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                    {new Intl.NumberFormat("en-IN").format(item.totalBalance)}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-sm text-red-500 font-bold">
                    {/* {new Intl.NumberFormat("en-IN").format(item.exposure)} */}
                    {"(0)"}
                  </td>
                  <td className=" px-4 py-2 text-md text-blue font-semibold flex items-center">
                    {new Intl.NumberFormat("en-IN").format(
                      item.creditReference
                    )}
                    <FaEdit
                      className="text-blue cursor-pointer ml-2"
                      onClick={() => handleEditClick(item)}
                    />
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-sm font-bold">
                    {new Intl.NumberFormat("en-IN").format(item.profit_loss)}{" "}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-md">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleButtonClick("D", index)}
                        className={`px-3 py-1 text-sm text-white font-medium rounded-md ${
                          editedData[index]?.depositwithdrawStatus === "D"
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                        } border border-black`}
                      >
                        D
                      </button>

                      <button
                        onClick={() => handleButtonClick("W", index)}
                        className={`px-3 py-1 text-sm text-white font-medium rounded-md ${
                          editedData[index]?.depositwithdrawStatus === "W" ||
                          editedData[index]?.highlightFull
                            ? "bg-red-600 text-white"
                            : "bg-gray-400 text-white"
                        } border border-black`}
                      >
                        W
                      </button>

                      <input
                        type="text"
                        value={
                          editedData[index]?.depositwithdraw ||
                          item.depositwithdraw ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(e, "depositwithdraw", index)
                        }
                        className="border border-gray-300 px-2 py-1 text-sm"
                      />

                      <button
                        onClick={() => handleButtonClick("Full", index)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          editedData[index]?.highlightFull
                            ? "bg-gradient-blue text-white"
                            : "bg-gray-400 text-white"
                        } border border-black`}
                      >
                        Full
                      </button>
                    </div>
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-md">
                    <input
                      type="text"
                      value={editedData[index]?.remark || ""}
                      onChange={(e) => handleInputChange(e, "remark", index)}
                      placeholder="Remark"
                      className="border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col p-2 sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {totalUsers === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
              {Math.min(currentPage * entriesToShow, totalUsers)} of{" "}
              {totalUsers} entries
            </div>
            <div className="flex space-x-2 sm:ml-auto">
              <button
                onClick={() => handlePageChange("first")}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange("prev")}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange("next")}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange("last")}
                className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center mt-4 space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 w-full">
            <div className="flex space-x-2">
              <button
                onClick={handleClearAll}
                className="px-8 py-1 bg-lightred text-white font-bold text-md rounded-md w-full sm:w-72"
              >
                Clear All
              </button>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="border border-gray-300 px-2 py-1 text-sm w-full sm:w-auto"
              />
            </div>
            <button
              onClick={() => handleSubmitPaymentForRow()}
              className={`px-3 py-1 ${
                isSubmitClicked ? "bg-gradient-green" : "bg-gradient-seablue"
              } text-white text-sm font-medium rounded-md w-full sm:w-auto`}
            >
              Submit Payment
            </button>
          </div>

          {isModalOpen && selectedUser && (
            <>
              <CreditEditReferenceModal
                isOpen={isModalOpen}
                onCancel={handleModalClose}
                username={selectedUser.username}
                currentCreditRef={selectedUser.creditReference}
                onSubmit={handleSubmitFunction}
                user={selectedUser}
                userId={selectedUser?._id}
                currentPage={currentPage}
                entriesToShow={entriesToShow}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Banking;

