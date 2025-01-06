import React, { useState, useEffect, useMemo } from "react";
import { FaSortUp, FaSortDown, FaEdit, FaEye } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArrowUpDownFill } from "react-icons/ri";
import { MdSettings, MdDelete, MdManageHistory } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { BsBuildingFillLock } from "react-icons/bs";
import CreditEditReferenceModal from "../Modal/CreditEditReferanceModal";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";
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
import { fetchDownlineData } from "../../Services/Downlinelistapi";
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [depositModal, setDepositModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userList, setUserList] = useState([]);
  const location = useLocation();
  const [roleId, setRoleId] = useState("");
  const [userFetchList, setUserFetchList] = useState([]);
  const downlineData = useSelector(selectDownlineData);
  const loading = useSelector(selectDownlineLoading);
  const error = useSelector(selectDownlineError);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found. Please log in again.");
          return;
        }

        if (!roleId) {
          console.error(
            "Invalid role ID. Cannot fetch data without a valid role."
          );
          return;
        }

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
  }, [dispatch, currentPage, entriesToShow, roleId]);

  useEffect(() => {
    if (token) {
      const fetchUserRoles = async () => {
        try {
          const rolesArray = await fetchRoles(token);

          if (Array.isArray(rolesArray)) {
            const rolesData = rolesArray.map((role) => ({
              role_name: role.role_name,
              role_id: role._id,
            }));
            setRole(rolesData);
          } else {
            setError("Roles data is not an array.");
          }
        } catch (error) {
          setError(error.message || "Failed to fetch roles.");
        }
      };
      fetchUserRoles();
    }
  }, [token]);

  // const filteredData = Array.isArray(data)
  //   ? data.filter((item) =>
  //       item.username.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   : [];

  const filteredData = downlineData.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (token) {
      const fetchRolesData = async () => {
        try {
          const rolesArray = await fetchRoles(token);
          setRoles(rolesArray || []);
        } catch {
          toast.error("Failed to fetch roles.");
        }
      };
      fetchRolesData();
    }
  }, [token]);

  useEffect(() => {
    if (location.pathname === "/master-downline-list") {
      const fetchUserRoles = async () => {
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
              if (rolesData.length > 0) {
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

  useEffect(() => {
    if (location.pathname === "/user-downline-list") {
      const fetchUserRoles = async () => {
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
              const userRole = rolesData.find(
                (role) => role.role_name === "user"
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

  useEffect(() => {
    if (roleId) {
      const fetchUserByRole = async () => {
        try {
          dispatch(setLoading(true));
          const data = await fetchDownlineData(
            currentPage,
            entriesToShow,
            roleId
          );
          dispatch(setDownlineData(data?.data));
        } catch (error) {
          console.error("Error fetching users by role:", error);
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      };

      fetchUserByRole();
    }
  }, [dispatch, roleId, currentPage, entriesToShow]);

  const sortedData = useMemo(() => {
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
    // Optional: Display the error in the UI
    return (
      <div className="text-red-500 font-bold">An error occurred: {error}</div>
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
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.username);
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleExposureEditClick = (user) => {
    setSelectedExposureUser(user);
    setIsExposureModalOpen(true);
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
    console.log("it is to fetch nested users", item);
    if (item.role_name === "master") {
      try {
        const data = await fetchallUsers(item._id);
        setUserFetchList(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="border border-gray-300 p-2 rounded-md">
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
        <div className="border border-gray-300 p-2 rounded-md">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="border border-gray-300">
          <tr className="bg-gray-300">
            {[
              { key: "username", label: "Username" },
              { key: "creditRef", label: "CreditRef" },
              { key: "balance", label: "Balance" },
              { key: "exposures", label: "Exposures" },
              { key: "exposure", label: "Exposure Limit" },
              { key: "availableBalance", label: "Avail. Bal" },
              { key: "refPL", label: "Ref. P/L" },
              { key: "partnership", label: "Partnership" },
              { key: "status", label: "Status" },
            ].map(({ key, label }) => (
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
            <th className="border border-gray-400 text-left px-4 py-3 text-sm font-medium text-black">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {(userFetchList.length > 0 ? userFetchList : downlineData).map(
            (item, index) => (
              <tr key={index} className="border border-gray-400 bg-white">
                <td className="px-4 py-2 text-sm">
                  {" "}
                  <span
                    className="bg-green-500 text-white px-2 py-2 mr-1 rounded font-semibold text-l"
                    onClick={() => handleUsernameList(item)}
                  >
                    {item.role_name.toUpperCase()}
                  </span>
                  <span className="text-black font-semibold">
                    {item.username}
                  </span>
                </td>
                <td className=" border border-gray-400 px-4 py-2 text-md text-blue-700 font-semibold">
                  {new Intl.NumberFormat("en-IN").format(item.creditReference)}
                  <div className="ml-2 inline-flex space-x-2">
                    <FaEdit
                      className="text-blue cursor-pointer"
                      onClick={() => handleEditClick(item)}
                    />
                    <FaEye
                      className="text-blue cursor-pointer"
                      onClick={() => handleListView(item)}
                    />
                  </div>
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                  {new Intl.NumberFormat("en-IN").format(item.openingBalance)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                  0
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm text-blue-900 font-semibold">
                  {new Intl.NumberFormat("en-IN").format(item.exposureLimit)}
                  <div className="ml-2 inline-flex space-x-2">
                    <FaEdit
                      className="text-blue cursor-pointer"
                      onClick={() => handleExposureEditClick(item)}
                    />
                  </div>
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                  {new Intl.NumberFormat("en-IN").format(
                    item.totalBalance || 0
                  )}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm font-semibold">
                  {new Intl.NumberFormat("en-IN").format(item.profit_loss)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-sm text-blue-900 font-semibold">
                  {new Intl.NumberFormat("en-IN").format(item.partnership)}
                </td>
                <td className="border border-gray-400 px-4 py-2 font-bold text-l">
                  <span
                    className={`p-1 rounded border ${
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
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleIconClick(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all duration-200"
                    >
                      <AiFillDollarCircle className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <RiArrowUpDownFill className="text-darkgray" />
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <MdManageHistory className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => statushandlechange(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                    >
                      <MdSettings className="text-darkgray" />
                    </div>
                    <Link to={ROUTES_CONST.MyAccount}>
                      <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer">
                        <FaUserAlt className="text-darkgray" />
                      </div>
                    </Link>
                    <div
                      onClick={() => handleOpenSettings(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer"
                    >
                      <BsBuildingFillLock className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => handleDeleteClick(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer"
                    >
                      <MdDelete className="text-" />
                    </div>
                  </div>
                </td>
              </tr>
            )
          )}
          {/* {location.pathname === "/master-downline-list" &&
            userFetchList.length === 0 &&
            downlineData?.data?.map((item, index) => (
              <tr key={index} className="border border-gray-300 bg-white">
                <td className="px-4 py-3 text-sm">
                  <span
                    className="bg-green-500 text-white px-2 py-1 mr-1 rounded font-bold text-l"
                    onClick={() => handleUsernameList(item)}
                  >
                    {item.role_name}
                  </span>
                  {item.username}
                </td>
                <td className="px-4 py-3 text-sm text-blue-900">
                  {item.creditReference}
                  <div className="ml-2 inline-flex space-x-2">
                    <FaEdit
                      className="text-blue cursor-pointer"
                      onClick={() => handleEditClick(item)}
                    />
                    <FaEye
                      className="text-blue cursor-pointer"
                      onClick={() => handleListView(item)}
                    />
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
                <td className="px-4 py-3 text-sm">{item.openingBalance}</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="x-4 py-3 font-bold text-green-600 text-l">
                  {item.status}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleIconClick(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all duration-200"
                    >
                      <AiFillDollarCircle className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <RiArrowUpDownFill className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <MdSettings className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => statushandlechange(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                    >
                      <FaUserAlt className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => handleOpenSettings(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                    >
                      <BsBuildingFillLock className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <MdDelete
                        className="text-darkgray"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
          {/* {location.pathname === "/user-downline-list" &&
            downlineData?.data?.map((item, index) => (
              <tr key={index} className="border border-gray-300 bg-white">
                <td className="px-4 py-3 text-sm">
                  <span
                    className="bg-green-500 text-white px-2 py-1 mr-1 rounded font-bold text-l"
                    onClick={() => handleUsernameList(item)}
                  >
                    {item.role_name}
                  </span>
                  {item.username}
                </td>
                <td className="px-4 py-3 text-sm text-blue-900">
                  {item.creditReference}
                  <div className="ml-2 inline-flex space-x-2">
                    <FaEdit
                      className="text-blue cursor-pointer"
                      onClick={() => handleEditClick(item)}
                    />
                    <FaEye
                      className="text-blue cursor-pointer"
                      onClick={() => handleListView(item)}
                    />
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
                <td className="px-4 py-3 text-sm">{item.openingBalance}</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="x-4 py-3 font-bold text-green-600 text-l">
                  {item.status}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleIconClick(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200 cursor-pointer hover:bg-gray-300 transition-all duration-200"
                    >
                      <AiFillDollarCircle className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <RiArrowUpDownFill className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <MdSettings className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => statushandlechange(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                    >
                      <FaUserAlt className="text-darkgray" />
                    </div>
                    <div
                      onClick={() => handleOpenSettings(item)}
                      className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200"
                    >
                      <BsBuildingFillLock className="text-darkgray" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                      <MdDelete
                        className="text-darkgray"
                        onClick={() => handleDeleteClick(item)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))} */}
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        userId={userToDelete?._id}
        currentPage={currentPage}
        entriesToShow={entriesToShow}
      />
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
      {selectedUser && (
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
  );
};

export default DownlineList;
