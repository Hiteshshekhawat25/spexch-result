import React, { useState, useEffect, useMemo } from "react";
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
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { fetchRoles } from "../../Utils/LoginApi";
import CreditReferenceTransactionModel from "../Modal/CreditReferenceTransactionModel";
import DepositModal from "../Modal/DepositModal";
import SportsSettingsModal from "../Modal/SportsSettings";
import AccountStatus from "../Modal/AccountStatus";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [roleId,setRoleId] = useState("");



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

        const result = await fetchDownlineData(
          token,
          currentPage,
          entriesToShow
        );

        if (result && result.data) {
          console.log("data.data",result.data);
          setData(result.data);
          setTotalUsers(result.pagination?.totalUsers || 0);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, entriesToShow]);

  useEffect(() => {
    if (token) {
      const fetchUserRoles = async () => {
        try {
          const rolesArray = await fetchRoles(token); // Fetch roles
          console.log("rolesArray", rolesArray);

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

  const filteredData = Array.isArray(data) ? data.filter(item => item.username.toLowerCase().includes(searchTerm.toLowerCase())) : [];


  // const filteredData = data.filter((item) =>
  //   item.username.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

  useEffect(() => { console.log("location",location.pathname)
    if (location.pathname == '/master-downline-list') {
      console.log("inside",location.pathname)
     
      const fetchUserRoles = async () => {
        try {
          const token = localStorage.getItem("authToken");
          console.log("1",token);
          if (token) {
            const rolesArray = await fetchRoles(token); 
            console.log("rolesArray", rolesArray);
  
            if (Array.isArray(rolesArray)) {
              const rolesData = rolesArray.map((role) => ({
                role_name: role.role_name,
                role_id: role._id,
              }));
              console.log("master role data", rolesData);
  
              setRoles(rolesData);
              if (rolesData.length > 0) {
                setRoleId(rolesData[0].role_id); // Set default role_id
                console.log("roleIDdddddd",rolesData[0].role_id);
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
  if (roleId ) {
    const fetchUserByRole = async () => {
      const token = localStorage.getItem("authToken");
      console.log('222',token)
      try {
        const response = await axios.get(
          `${BASE_URL}/user/get-user?page=1&limit=28&role=${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            
          }
        );
        setData(response.data); 
        console.log("ekkkkk",response?.data?.data);
      } catch (error) {
        console.error("Error fetching users by role:", error);
      }
    };

    fetchUserByRole();
  }
}, [roleId, token]); // Also depend on token so the effect re-runs when it changes

 

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] || ""; // Default to an empty string if undefined
      const bValue = b[sortConfig.key] || ""; // Default to an empty string if undefined

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
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
  };
  const handleListView = (user) => {
    setCreditReferenceTransactionList(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Clear selected user data
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
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
    setDepositModal(false);
    setSettingsModal(false);
    setAccountStatus(false);
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

  const handleIconClick = (user) => {
    // setIsModalOpen((prevState) => !prevState);
    setDepositModal(true);
    setSelectedUser(user);
  };

  const handleOpenSettings = (user) => {
    console.log("user",user);
    setSettingsModal(true);
    setSelectedUser(user);
  };
  const statushandlechange = (user) => {
    setAccountStatus(true);
    setSelectedUser(user);
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
              <td className="px-4 py-3 text-sm">{item.status}</td>
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
                      className="text-"
                      onClick={() => handleDeleteClick(item)}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {console.log("datttttt",data)}
          {location.pathname === '/master-downline-list' && data?.data?.map((item, index) => (
  <tr key={index} className="border border-gray-300 bg-white">
    <td className="px-4 py-3 text-sm">
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
    <td className="px-4 py-3 text-sm">{item.status}</td>
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
        <>
          {console.log("userId", selectedUser?._id)} {/* Log userId */}
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
      {console.log(
        "creditReferenceTransactionList",
        creditReferenceTransactionList?._id
      )}{" "}
      {/* Log userId */}
      {isModalOpen && creditReferenceTransactionList && (
        <>
          <CreditReferenceTransactionModel
            username={creditReferenceTransactionList.username}
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            // onConfirm={handleDeleteConfirm}
            userId={creditReferenceTransactionList?._id}
          />
        </>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        userId={userToDelete?._id}
      />
      {selectedUser && <>
      <DepositModal
        isOpen={depositModal}
        onClose={handleDeleteModalClose}
        // onConfirm={handleDeleteConfirm}
        userId={selectedUser?._id}
      />
      </>}
      {selectedUser && <>
      <SportsSettingsModal
        isOpen={settingsModal}
        onClose={handleDeleteModalClose}
        // onConfirm={handleDeleteConfirm}
        userId={selectedUser?._id}
      /></>}
      {/* {selectedUser && <> */}
      <AccountStatus
        isOpen={accountStatus}
        onClose={handleDeleteModalClose}
        // onConfirm={handleDeleteConfirm}
        userId={selectedUser?._id}
        
      />
      {/* </>} */}
      {isExposureModalOpen && selectedExposureUser && (
        <>
          {console.log("idddd", selectedExposureUser)}
          <EditExposureLimitModal
            username={selectedExposureUser.username}
            currentExposureLimit={selectedExposureUser.exposureLimit}
            onSubmit={(newExposureLimit, password) => {
              console.log(
                `Updated exposure limit for ${selectedExposureUser.username}: ${newExposureLimit} (Password: ${password})`
              );
              handleExposureModalClose(); // Close the modal after submission
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
