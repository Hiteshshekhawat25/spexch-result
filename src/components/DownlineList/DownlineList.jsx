import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSortUp, FaSortDown, FaEdit, FaEye } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArrowUpDownFill } from "react-icons/ri";
import { MdSettings, MdDelete, MdManageHistory } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { BsBuildingFillLock } from "react-icons/bs";
import CreditEditReferenceModal from "../Modal/CreditEditReferanceModal";
import EditExposureLimitModal from "../Modal/EditExposureLimitModal";
import {
  setLoading,
  setError,
  setDownlineData,
  selectDownlineData,
  selectDownlineLoading,
  selectDownlineError,
} from "../../Store/Slice/downlineSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Constant/Api";
import {
  deleteData,
  fetchDownlineData,
  fetchUsersByStatus,
  searchDownline,
} from "../../Services/Downlinelistapi";
import {
  fetchallUsers,
  fetchRoles,
  fetchUserDetails,
} from "../../Utils/LoginApi";
import CreditReferenceTransactionModel from "../Modal/CreditReferenceTransactionModel";
import DepositModal from "../Modal/DepositModal";
import SportsSettingsModal from "../Modal/SportsSettings";
import AccountStatus from "../Modal/AccountStatus";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { ROUTES_CONST } from "../../Constant/routesConstant";
import UpdatePartnershipModal from "../Modal/UpdatePartnershipModal";
import { ClipLoader } from "react-spinners";
import { resetDeleteState } from "../../Store/Slice/deleteSlice";

const DownlineList = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [creditReferenceTransactionList, setCreditReferenceTransactionList] =
    useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isExposureModalOpen, setIsExposureModalOpen] = useState(false);
  const [selectedExposureUser, setSelectedExposureUser] = useState(null);
  const [updatePartnership, setUpdatePartnership] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [depositModal, setDepositModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [users, setUsers] = useState([]);

  const [roles, setRoles] = useState([]);
  const [userList, setUserList] = useState([]);
  const location = useLocation();
  const [roleId, setRoleId] = useState("");
  const [userFetchList, setUserFetchList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const downlineData = useSelector(selectDownlineData);
  const loading = useSelector(selectDownlineLoading);
  const error = useSelector(selectDownlineError);
  const { startFetchData } = useSelector((state) => state.downline);
  const navigate = useNavigate();

  console.log("startFetchDatastartFetchData", startFetchData);

  console.log("roleIdroleIdroleId", roleId);
  const isMasterDownlineList = location.pathname.includes(
    "/master-downline-list"
  );

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

  const handleArrowClick = (item) => {
    // console.log("Selected User Data:", item);
    navigate(ROUTES_CONST.MyAccount, {
      state: {
        selectedUser: item,
        selectedPage: "profitLoss",
      },
    });
  };

  const handleHistoryClick = (item) => {
    // console.log("Selected User Data:", item);
    navigate(ROUTES_CONST.MyAccount, {
      state: {
        selectedUser: item,
        selectedPage: "bethistory",
      },
    });
  };

  const handleProfileClick = (item) => {
    // console.log("Selected User Data:", item);
    navigate(ROUTES_CONST.MyAccount, {
      state: {
        selectedUser: item,
        selectedPage: "myProfile",
      },
    });
  };

  useEffect(() => {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm?.length) {
     try {
        const res = await searchDownline(
          `user/get-user?page=1&limit=10&search=${searchTerm}&role=${roleId}`
        );
        setSearchData(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if(roleId){
      const fetchData = async () => {
        console.log('rrrrrruuuuuunnnnnnnn3')
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
    }
  }, [
    dispatch,
    currentPage,
    entriesToShow,
    roleId,
    startFetchData,
    location.pathname,
  ]);

  const filteredData = downlineData.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (location.pathname === "/master-downline-list") {
      const fetchUserRoles = async () => {
        console.log('rrrrrruuuuuunnnnnnnn2')
        try {
          const token = localStorage.getItem("authToken");
          if (token) {
            const rolesArray = await fetchRoles(token);
            if (Array.isArray(rolesArray)) {
              const rolesData = rolesArray.map((role) => ({
                role_name: role.role_name,
                role_id: role._id,
              }));
              setRoles(rolesData);

              const masterAgentRoles = rolesData.filter(
                (role) =>
                  role.role_name.toLowerCase() === "master" ||
                  role.role_name.toLowerCase() === "agent"
              );

              if (masterAgentRoles.length > 0) {
                // Fetch all data for each role without pagination
                const fetchPromises = masterAgentRoles.map(
                  (role) => fetchDownlineData(1, 10000, role.role_id) // High limit to get all data
                );

                const results = await Promise.all(fetchPromises);

                const combinedData = results.flatMap(
                  (result) => result.data || []
                );

                const totalUsers = combinedData.length;
                setTotalUsers(totalUsers);

                const startIndex = (currentPage - 1) * entriesToShow;
                const endIndex = startIndex + entriesToShow;
                const paginatedData = combinedData.slice(startIndex, endIndex);

                dispatch(setDownlineData(paginatedData));
              } else if (rolesData.length > 0) {
                setRoleId(rolesData[0].role_id);
              }
            } else {
              setError("Roles data is not an array.");
            }
          }
        } catch (error) {
          setError(error.message || "Failed to fetch roles.");
        }
      };

      fetchUserRoles();
    }
  }, [token, location.pathname, currentPage, entriesToShow, dispatch]);

  useEffect(() => {
    if (location.pathname === "/user-downline-list") {
      const fetchUserRoles = async () => {
        console.log('rrrrrruuuuuunnnnnnnn1')
        try {
          const token = localStorage.getItem("authToken");
          if (token) {
            const rolesArray = await fetchRoles(token);
            if (Array.isArray(rolesArray)) {
              const rolesData = rolesArray.map((role) => ({
                role_name: role.role_name,
                role_id: role._id,
              }));
              setRoles(rolesData);
              // Case-insensitive check for 'user'
              const userRole = rolesData.find(
                (role) => role.role_name.toLowerCase() === "user"
              );
              if (userRole) {
                setRoleId(userRole.role_id);
              } else if (rolesData.length > 0) {
                setRoleId(rolesData[0].role_id);
              }
            } else {
              setError("Roles data is not an array.");
            }
          }
        } catch (error) {
          setError(error.message || "Failed to fetch roles.");
        }
      };

      fetchUserRoles();
    }
  }, [token, location.pathname]);
  const sortedData = useMemo(() => {
    // console.log("filteredData", filteredData);
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (
        ["partnership", "balance", "exposureLimit"].includes(sortConfig.key)
      ) {
        const numA = parseFloat(aValue) || 0;
        const numB = parseFloat(bValue) || 0;
        return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
      }

      if (sortConfig.key === "status") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredData, sortConfig]);

  const paginatedData = sortedData;
  const totalPages = Math.ceil(totalUsers / entriesToShow);

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
  const handleSubmitFunction = (newCreditRef, password) => {
    console.log("New Credit Ref:", newCreditRef, "Password:", password);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleListView = (user) => {
    setCreditReferenceTransactionList(user);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  if (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="text-red-500 font-custom font-bold">
        An error occurred: {error}
      </div>
    );
  }
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setDepositModal(false);
    setSettingsModal(false);
    setAccountStatus(false);
    setCreditReferenceTransactionList(false);
    setIsModalOpen(false);
    setUpdatePartnership(false);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      // console.log("Deleting user:", userToDelete.username);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleExposureEditClick = (user) => {
    setSelectedExposureUser(user);
    setIsExposureModalOpen(true);
  };

  const handleUpdatePartnership = (item) => {
    setUpdatePartnership(true);
    setSelectedUser(item);
  };

  const handleExposureModalClose = () => {
    setIsExposureModalOpen(false);
    setSelectedExposureUser(null);
  };

  const handleIconClick = (user) => {
    setDepositModal(true);
    setSelectedUser(user);
  };

  const handleOpenSettings = (user) => {
    setSettingsModal(true);
    setSelectedUser(user);
  };
  const statushandlechange = (user) => {
    setAccountStatus(true);
    setSelectedUser(user);
  };

  const handleUsernameList = async (item) => {
    // console.log("Fetching nested users for:", item);
    try {
      if (item.role_name === "master") {
        const data = await fetchallUsers(item._id);
        setUserFetchList(data);
      } else if (item.role_name === "agent") {
        const data = await fetchallUsers(item._id);
        setUserFetchList(data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const fetchUsers = async () => {
    if (!selectedFilter) return;
    try {
      const fetchedUsers = await fetchUsersByStatus(selectedFilter,roleId);
      setUserList(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  useEffect(() => {
      fetchUsers();
  }, [selectedFilter]);

  const handleDelete = async (item) => {
    try {
      await deleteData(`user/delete-user/${item._id}`);
      toast.success("User deleted successfully.");

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const rolesArray = await fetchRoles(token);
      if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
        throw new Error("No roles found. Please check your configuration.");
      }

      const rolesData = rolesArray.map((role) => ({
        role_name: role.role_name,
        role_id: role._id,
      }));

      let roleId = null;

      if (location.pathname === "/user-downline-list") {
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/master-downline-list") {
        const masterRole = rolesData.find(
          (role) => role.role_name === "master"
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        throw new Error("Invalid location path. Unable to determine roleId.");
      }

      const result = await fetchDownlineData(
        currentPage,
        entriesToShow,
        roleId
      );
      if (result && result.data) {
        dispatch(setDownlineData(result.data));
      }

      dispatch(resetDeleteState());
      // onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";
      // setApiError(errorMessage);s
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  console.log({roles,roleId,role},'downlineData')
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>

            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>

            <div className="absolute bottom-[-40px] w-full text-center text-xl font-custom font-medium text-black">
              <ClipLoader />
            </div>
          </div>
        </div>
      ) : (
        <>
          {userFetchList.length ? (
            <>
              <div
                className="border rounded p-2 mb-3 w-full sm:w-max flex items-center text-nowrap cursor-pointer bg-green-50 border-green-500 text-green-600 font-custom font-medium"
                onClick={() => setUserFetchList([])}
              >
                <div className="bg-green-500 text-white px-2 py-1 mr-2 rounded font-custom font-medium text-xs sm:text-sm w-14">
                  Master
                </div>
                <div className="text-sm sm:text-base">
                  {userFetchList?.[0]?.username}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="md:p-4 p-3 border border-gray-200 rounded-md bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
              <div className="flex items-center flex-1 w-full">
                {/* Show Entries Dropdown */}
                <div className="rounded-md flex items-center w-full sm:w-auto">
                  <label className="mr-2 text-sm font-custom font-medium">
                    Show
                  </label>
                  <select
                    value={entriesToShow}
                    onChange={handleEntriesChange}
                    // className="border border-gray-300 rounded px-2 py-1 text-sm w-full sm:w-auto"
                    className="border rounded px-2 py-1 text-sm  sm:w-auto"
                  >
                    {[10, 25, 50, 100].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                  <label className="ml-2 text-sm font-custom font-medium">
                    entries
                  </label>
                </div>

                {/* Filter Dropdown */}
                <div className="flex-1 md:mr-2">
                  <div className="rounded-md w-full sm:w-28 ml-auto">
                    <select
                      value={selectedFilter}
                      onChange={handleFilterChange}
                      // className="border rounded py-1 px-2 text-sm bg-gray-200 text-black border-gray-400 sm:ml-10 "
                      className="border rounded py-1 px-2 text-sm bg-gray-200 text-black border-gray-400"
                    >
                      <option value="">Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="locked">Locked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                {/* Search Input */}
                <div className="flex w-full sm:flex-row sm:items-center sm:space-x-2">
                  <label className="text-sm p-1">Search:</label>
               {!accountStatus && 
                  <div className="rounded-md w-full sm:w-28">
                    <input
                    id="search"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="border border-gray-400 rounded px-2 py-1 text-sm w-full"
                    />
                  </div>
                  }
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead className="border border-gray-300">
                  <tr className="bg-gray-200">
                    {[
                      { key: "username", label: "Username" },
                      { key: "creditRef", label: "CreditRef" },
                      ...(isMasterDownlineList
                        ? [{ key: "partnership", label: "Partnership" }]
                        : []),
                      { key: "balance", label: "Balance" },
                      { key: "exposure", label: "Exposure" },
                      ...(!isMasterDownlineList
                        ? [{ key: "exposure", label: "Exposure Limit" }]
                        : []),
                      { key: "availableBalance", label: "Avail. Bal" },
                      { key: "refPL", label: "Ref. P/L" },
                      ...(!isMasterDownlineList
                        ? [{ key: "partnership", label: "Partnership" }]
                        : []),
                      { key: "status", label: "Status" },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="border border-gray-400 text-left px-3 p-2 text-[12.5px] text-nowrap text-black cursor-pointer"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center ">{label}</div>
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
                    <th className="border border-gray-400 text-left px-4 py-3 text-sm font-custom font-bold text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(searchTerm?.length
                    ? searchData
                    : userFetchList.length > 0
                    ? userFetchList
                    : userList.length > 0
                    ? userList
                    : downlineData
                  )?.length ? (
                    (searchTerm?.length
                      ? searchData
                      : userFetchList.length > 0
                      ? userFetchList
                      : userList.length > 0
                      ? userList
                      : downlineData
                    ).map((item) => (
                      <tr
                        key={item?._id}
                        className="border border-gray-400 bg-white"
                      >
                        <td className="px-3 py-2 text-[13px] text-nowrap">
                          <div
                            onClick={() => handleUsernameList(item)}
                            className={`${
                              item.role_name === "master"
                                ? "cursor-pointer"
                                : ""
                            }`}
                          >
                            <span
                              className={`bg-green-500 text-white px-2 py-1 text-[10.5px] mr-1 rounded font-custom font-semibold text-l ${
                                item.role_name === "master"
                                  ? "cursor-pointer"
                                  : ""
                              }`}
                            >
                              {item.role_name?.toUpperCase()}
                            </span>
                            <span
                              className="text-[#2789ce] font-custom font-semibold"
                              style={{
                                fontFamily: "Tahoma, Helvetica, sans-serif",
                              }}
                            >
                              {item.username}
                            </span>
                          </div>
                        </td>
                        <td
                          className="border border-gray-400 px-4 py-2 text-[13px] text-blue-700 font-semibold text-nowrap"
                          style={{
                            fontFamily: "Tahoma, Helvetica, sans-serif",
                          }}
                        >
                          <span className="flex items-center">
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }).format(item.creditReference)}
                            <span className="ml-2 inline-flex space-x-2">
                              <FaEdit
                                className="text-[#315195] cursor-pointer"
                                onClick={() => handleEditClick(item)}
                              />
                              <FaEye
                                className="text-[#315195] cursor-pointer"
                                onClick={() => handleListView(item)}
                              />
                            </span>
                          </span>
                        </td>
                        {!isMasterDownlineList && (
                          <td
                            className="border border-gray-400 px-4 py-2 text-[13px] text-blue-900 font-custom font-semibold"
                            style={{
                              fontFamily: "Tahoma, Helvetica, sans-serif",
                            }}
                          >
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }).format(item.totalOpeningBalance)}
                          </td>
                        )}
                        {isMasterDownlineList && (
                          <td
                            className="border border-gray-400 px-4 py-2 text-[13px] text-blue-900 font-custom font-semibold"
                            style={{
                              fontFamily: "Tahoma, Helvetica, sans-serif",
                            }}
                          >
                            <span className="flex items-center">
                              {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(item.partnership)}
                              <span className="ml-2 inline-flex space-x-2">
                                <FaEdit
                                  className="text-[#315195] cursor-pointer"
                                  onClick={() => handleUpdatePartnership(item)}
                                />
                              </span>
                            </span>
                          </td>
                        )}
                        {isMasterDownlineList && (
                          <td
                            className="border border-gray-400 px-4 py-2 text-[13px] text-blue-900 font-custom font-semibold"
                            style={{
                              fontFamily: "Tahoma, Helvetica, sans-serif",
                            }}
                          >
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }).format(item.totalOpeningBalance)}
                          </td>
                        )}
                        <td
                          className="border border-gray-400 px-4 py-2 text-[13px] text-red-700 font-custom font-semibold"
                          style={{
                            fontFamily: "Tahoma, Helvetica, sans-serif",
                          }}
                        >
                          (
                          {new Intl.NumberFormat("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(item.totalExposureBalance)}
                          )
                        </td>
                        {!isMasterDownlineList && (
                          <td
                            className="border border-gray-400 px-4 py-2 text-[13px] text-blue-900 font-custom font-semibold"
                            style={{
                              fontFamily: "Tahoma, Helvetica, sans-serif",
                            }}
                          >
                            <span className="flex items-center">
                              {new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(item.exposureLimit)}
                              <span className="ml-2 inline-flex space-x-2">
                                <FaEdit
                                  className="text-[#315195]  cursor-pointer"
                                  onClick={() => handleExposureEditClick(item)}
                                />
                              </span>
                            </span>
                          </td>
                        )}
                        <td
                          className="border border-gray-400 px-4 py-2 text-[13px] font-custom font-semibold"
                          style={{
                            fontFamily: "Tahoma, Helvetica, sans-serif",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }).format(item.totalAvailableBalance || 0)}
                        </td>
                        <td
                          className={`border border-gray-400 px-4 py-2 text-[13px] font-custom font-semibold ${
                            (item?.totalOpeningBalance - item?.creditReference ) < 0 ? "text-red-500" : ""
                          }`}
                          style={{
                            fontFamily: "Tahoma, Helvetica, sans-serif",
                          }}
                        >
                          {item.profit_loss < 0
                            ? `(-${new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(Math.abs(item.profit_loss))})`
                            : new Intl.NumberFormat("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }).format(item?.totalOpeningBalance - item?.creditReference )}
                        </td>
                        {!isMasterDownlineList && (
                          <td
                            className="border border-gray-400 px-4 py-2 text-[13px] text-blue-900 font-custom font-semibold"
                            style={{
                              fontFamily: "Tahoma, Helvetica, sans-serif",
                            }}
                          >
                            {new Intl.NumberFormat("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }).format(100)}
                          </td>
                        )}
                        <td
                          className="border border-gray-400 px-4 py-2 font-custom font-bold text-l"
                          style={{
                            fontFamily: "Tahoma, Helvetica, sans-serif",
                          }}
                        >
                          <span
                            className={`px-2 py-[4px] rounded-[5px] border text-[11px] capitalize ${
                              item.status === "active"
                                ? "text-green-600 border-green-600 bg-green-100"
                                : item.status === "suspended"
                                ? "text-red-600 border-red-600 bg-red-100"
                                : item.status === "locked"
                                ? "text-red-600 border-red-600 bg-red-100"
                                : "text-gray-600 border-gray-600 bg-gray-100"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex md:space-x-2.5 space-x-2">
                            <div
                              onClick={() => handleIconClick(item)}
                              title="Banking"
                              className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all duration-200"
                            >
                              <AiFillDollarCircle className="text-darkgray" />
                            </div>
                            {!isMasterDownlineList && (
                              <div
                                onClick={() => handleArrowClick(item)}
                                className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                              >
                                <RiArrowUpDownFill className="text-darkgray" />
                              </div>
                            )}
                            {!isMasterDownlineList && (
                              <div
                                onClick={() => handleHistoryClick(item)}
                                className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                              >
                                <MdManageHistory className="text-darkgray" />
                              </div>
                            )}
                            <div
                              onClick={() => statushandlechange(item)}
                              title="Change status"
                              className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                            >
                              <MdSettings className="text-darkgray" />
                            </div>

                            <div
                              onClick={() => handleProfileClick(item)}
                              className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer"
                            >
                              <FaUserAlt className="text-darkgray" />
                            </div>

                            <div
                              onClick={() => handleOpenSettings(item)}
                              title="Sports Settings"
                              className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer"
                            >
                              <BsBuildingFillLock className="text-darkgray" />
                            </div>
                            <div
                              onClick={() => handleDeleteClick(item)}
                              title="Delete"
                              className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer"
                            >
                              <MdDelete
                                className="text-"
                                onClick={() => handleDelete(item)}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )))
                   : (
                    <tr>
                      <td colSpan={10} className="text-center p-6">
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col p-2 sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {totalUsers === 0 ? 0 : (currentPage - 1) * entriesToShow + 1}{" "}
                to {Math.min(currentPage * entriesToShow, totalUsers)} of{" "}
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
            {selectedUser && updatePartnership && (
              <>
                <UpdatePartnershipModal
                  isOpen={updatePartnership}
                  onCancel={handleDeleteModalClose}
                  username={selectedUser.username}
                  currentPartnership={selectedUser.partnership}
                  onSubmit={handleSubmitFunction}
                  user={selectedUser}
                  userId={selectedUser?._id}
                  currentPage={currentPage}
                  entriesToShow={entriesToShow}
                />
              </>
            )}
            {/* Log userId */}
            {creditReferenceTransactionList && (
              <>
                <CreditReferenceTransactionModel
                  username={creditReferenceTransactionList.username}
                  isOpen={creditReferenceTransactionList}
                  onClose={handleDeleteModalClose}
                  // onConfirm={handleDeleteConfirm}
                  userId={creditReferenceTransactionList?._id}
                  currentPage={currentPage}
                  entriesToShow={entriesToShow}
                />
              </>
            )}
            {selectedUser && depositModal && (
              <DepositModal
                isOpen={depositModal}
                onClose={handleDeleteModalClose}
                userId={selectedUser?._id}
                currentPage={currentPage}
                entriesToShow={entriesToShow}
                user={selectedUser}
              />
            )}
            {selectedUser && (
              <>
                <SportsSettingsModal
                  isOpen={settingsModal}
                  onClose={handleDeleteModalClose}
                  // onConfirm={handleDeleteConfirm}
                  userId={selectedUser?._id}
                  currentPage={currentPage}
                  entriesToShow={entriesToShow}
                />
              </>
            )}
            {selectedUser && accountStatus && (
              <>
                <AccountStatus
                  isOpen={accountStatus}
                  onClose={handleDeleteModalClose}
                  // onConfirm={handleDeleteConfirm}
                  userId={selectedUser?._id}
                  currentPage={currentPage}
                  entriesToShow={entriesToShow}
                  user={selectedUser}
                />
              </>
            )}
            {isExposureModalOpen && selectedExposureUser && (
              <>
                <EditExposureLimitModal
                  username={selectedExposureUser.username}
                  currentExposureLimit={selectedExposureUser.exposureLimit}
                  onSubmit={(newExposureLimit, password) => {
                    console.log(
                      `Updated exposure limit for ${selectedExposureUser.username}: ${newExposureLimit} (Password: ${password})`
                    );
                    handleExposureModalClose();
                  }}
                  onCancel={handleExposureModalClose}
                  // onSubmit={handleSubmitFunction}
                  user={selectedExposureUser}
                  userId={selectedExposureUser?._id}
                  currentPage={currentPage}
                  entriesToShow={entriesToShow}
                />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DownlineList;
