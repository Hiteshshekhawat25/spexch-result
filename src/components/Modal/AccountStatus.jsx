import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  resetStatusState,
  updateUserStatusThunk,
} from "../../Store/Slice/accountStatusSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";
import { getUserDatabyId } from "../../Services/UserInfoApi";
import { setDownlineData, setError } from "../../Store/Slice/downlineSlice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { fetchRoles } from "../../Utils/LoginApi";

const AccountStatus = ({
  userId,
  isOpen,
  onClose,
  currentPage,
  entriesToShow,
}) => {
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.accountStatus
  );

  console.log("userID", userId);
  useEffect(() => {
    if (isOpen) {
      fetchUserStatus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (successMessage) {
      // toast.success(successMessage);
      dispatch(resetStatusState());
      onClose();
    }
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error, dispatch]);

  const fetchUserStatus = async () => {
    try {
      const userData = await getUserDatabyId(userId);
      setStatus(userData?.data?.status);
      setUserName(userData?.data?.userName);
    } catch (err) {
      toast.error("Failed to fetch user data.");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    console.log("Inside handleSubmit");
    dispatch(updateUserStatusThunk({ userId, newStatus: status, password }));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const rolesArray = await fetchRoles(token);
      if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
        toast.warning("No roles found. Please check your configuration.");
        return;
      }

      const rolesData = rolesArray.map((role) => ({
        role_name: role.role_name,
        role_id: role._id,
      }));
      setRoles(rolesData);

      let roleId = null;
      if (location.pathname === "/user-downline-list") {
        console.log("Inside user-downline-list");
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/master-downline-list") {
        console.log("Inside master-downline-list");
        const masterRole = rolesData.find(
          (role) => role.role_name === "master"
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        return;
      }

      console.log("roleId:", roleId);

      // Fetch downline data with roleId
      const result = await fetchDownlineData(
        currentPage,
        entriesToShow,
        roleId
      );

      if (result && result.data) {
        dispatch(setDownlineData(result.data));
        setPassword("");
        onClose();
        toast.success("Status updated successfully");
      } else {
        toast.warning("Unable to fetch updated downline data.");
      }
    } catch (error) {
      console.error("Error fetching downline data:", error);
      dispatch(setError(error.message || "Failed to fetch the downline data."));
      toast.error(
        error.message || "An error occurred while fetching the downline data."
      );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-12">
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-semibold w-full p-3">
          <span>Change Status</span>
          <IoClose
            onClick={onClose}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* User Info */}
        <div className="space-y-4 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="font-medium text-lg font-bold">
              <span className="bg-green-500 text-white px-2 py-1 mr-1 rounded">
                User
              </span>
              {userName}
            </div>
            <div
              className={`text-${
                status === "active"
                  ? "green"
                  : status === "suspended"
                  ? "red"
                  : "gray"
              }-500`}
            >
              {status === "active"
                ? "Active"
                : status === "suspended"
                ? "Suspended"
                : "Locked"}
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex justify-between mb-4">
            <div
              onClick={() => handleStatusChange("active")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.707 8.293l-6.707 6.707L6.293 10.293l1.414-1.414L11 10.586l5.293-5.293 1.414 1.414z" />
              </svg>
              <span className="font-medium">Active</span>
            </div>
            <div
              onClick={() => handleStatusChange("suspended")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "suspended"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-1 6h2v6h-2zm1 12c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
              </svg>
              <span className="font-medium">Suspend</span>
            </div>
            <div
              onClick={() => handleStatusChange("locked")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "locked"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C9.243 2 7 4.243 7 7v3h2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3h2V7c0-2.757-2.243-5-5-5zm4 9H8c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2v-6c0-1.103-.897-2-2-2zm-4 6c-.828 0-1.5-.672-1.5-1.5S11.172 14 12 14s1.5.672 1.5 1.5S12.828 17 12 17z" />
              </svg>
              <span className="font-medium">Locked</span>
            </div>
          </div>

          <div className="flex items-center mb-6 space-x-4">
            {/* Password Field */}
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter Password"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`py-2 px-4 bg-NavyBlue text-white font-medium rounded-lg mt-5 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Changing..." : "Change Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;
