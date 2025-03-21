import React, { useEffect, useState } from "react";
import { IoClose, IoEyeOutline, IoEyeOffOutline} from "react-icons/io5";
import { toast } from "react-toastify";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";

import {
  resetStatusState,
  updateUserStatusThunk,
} from "../../Store/Slice/accountStatusSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../Constant/Api";
import { getUserDatabyId } from "../../Services/UserInfoApi";
import {
  setDownlineData,
  setError,
  setLoading,
} from "../../Store/Slice/downlineSlice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { fetchRoles } from "../../Utils/LoginApi";

const AccountStatus = ({
  userId,
  isOpen,
  fetchData,
  setRoleId,
  onClose,
  currentPage,
  entriesToShow,
  user,
}) => {
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const { userData } = useSelector((state) => state.user);
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state) => state.accountStatus);

  console.log("Open", userId);
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
    dispatch(setLoading(true));
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
      if (location.pathname.includes("/user-downline-list")) {
        console.log("Inside user-downline-list");
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname.includes("/master-downline-list")) {
        console.log("Inside master-downline-list");
        const masterRole = rolesData.find(
          (role) => {  
            if(userData?.data?.role_name == 'super-admin'){
            return role.role_name === "sub-admin"
           }else if(userData?.data?.role_name == 'sub-admin'){
             return role.role_name === "white-level"
           }else if(userData?.data?.role_name == 'white-level'){
             return role.role_name === "super"
           }else if(userData?.data?.role_name == 'super'){
             return role.role_name === "master"
           }
        });
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
        setRoleId(roleId)
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        return;
      }

      const fetchResult = await dispatch(
        updateUserStatusThunk({ userId, newStatus: status, password })
      );
      console.log("fetchResult", fetchResult);

      if (fetchResult.message) {
        dispatch(setLoading(false));
        toast.error(
          fetchResult.payload ||
            "An error occurred while updating the credit reference."
        );
      } else {
        fetchData(roleId)
          dispatch(setLoading(false));
          // dispatch(setDownlineData(result.data));
          setPassword("");
          toast.success("Status updated successfully.");
        
      }
    } catch (error) {
      console.error("Error fetching downline data:", error);
      dispatch(setLoading(false));
      dispatch(setError(error.message || "Failed to fetch the downline data."));
      toast.error(
        error.message || "An error occurred while fetching the downline data."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[95%] sm:w-[500px] md:mt-12 mt-3">
        <div className="flex justify-between items-center rounded-t-md bg-gradient-blue text-white text-sm font-custom font-semibold w-full p-2">
          <span>Change Status</span>
          <IoClose
            onClick={onClose}
            className="cursor-pointer text-white text-xl"
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-4 p-5">
          <div className="flex justify-between items-center mb-4">
            {/* Amount Field */}
            <div className="flex justify-between">
              <div className="text-xs">
                <span
                  className="bg-green-500 text-white px-1 py-1 mr-1 rounded font-custom font-bold text-[10px]"
                  // onClick={() => handleUsernameList(item)}
                >
                  {user?.role_name.toUpperCase()}
                </span>
                {user.username}
              </div>
            </div>
            <div
              className={`px-1 border rounded-[4px] text-center font-bold text-[12px] text-${
                user?.status === "active"
                  ? "green"
                  : status === "suspended"
                  ? "red"
                  : "gray"
              }-500 bg-${
                user?.status === "active"
                  ? "green"
                  : status === "suspended"
                  ? "red"
                  : "gray"
              }-100 border-${
                user?.status === "active"
                  ? "green"
                  : user?.status === "suspended"
                  ? "red"
                  : "gray"
              }-500`}
            >
            {/* {status === "active"
              ? "active"
              : status === "suspended"
              ? "suspended"
              : "locked"} */}
              {user?.status}
          </div>

          </div>

          {/* Status Buttons */}
          <div className="grid sm:grid-cols-3 grid-cols-2 justify-between gap-3">
            <div
              onClick={() => handleStatusChange("active")}
              className={`flex flex-col items-center justify-center w-full p-1 rounded-lg cursor-pointer border 
                ${
                  status === "active"
                    ? "bg-white text-green-500 border-green-500"
                    : "bg-white text-green-300 border-green-300"
                }`}
            >
              <FaCheckCircle
                className={`w-8 h-8 mb-1 ${
                  status === "active" ? "text-green-500" : "text-green-300"
                }`}
              />
              <span className="font-bold font-custom text-[14px]">Active</span>
            </div>
            <div
              onClick={() => handleStatusChange("suspended")}
              className={`flex flex-col items-center justify-center w-full p-1 rounded-lg cursor-pointer border 
                ${
                  status === "suspended"
                    ? "bg-white text-red-500 border-red-500"
                    : "bg-white text-red-300 border-red-300"
                }`}
            >
              <AiOutlineStop
                className={`w-8 h-8 mb-1 ${
                  status === "suspended" ? "text-red-500" : "text-red-300"
                }`}
              />
              <span className="font-custom font-bold text-[14px]">Suspend</span>
            </div>
            <div
              onClick={() => handleStatusChange("locked")}
              className={`flex flex-col items-center justify-center w-full p-1 rounded-lg cursor-pointer border 
                ${
                  status === "locked"
                    ? "bg-white text-gray-600 border-gray-600"
                    : "bg-white text-gray-300 border-gray-300"
                }`}
            >
              <FaLock
                className={`w-8 h-8 mb-1 ${
                  status === "locked" ? "text-gray-500" : "text-whiteGray"
                }`}
              />
              <span className="font-custom font-bold text-[14px]">Locked</span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row items-center md:gap-4 mt-3">
            {/* Password Field */}
            <div className="flex-1 relative w-full md:w-auto">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password..."
                value={password}
                onChange={handlePasswordChange}
                className="w-full md:w-64 p-2 text-[14px] h-[35px] border border-gray-300 outline-none rounded-md"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-4 text-[13px] transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showPassword ? <IoEyeOutline size={17} /> : <IoEyeOffOutline size={17} />}
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!password}
              className={`w-full md:w-64 py-1.5 px-4 font-custom text-[14px] font-bold rounded-md mt-3 md:mt-0
              ${password ? "bg-gradient-seablue" : "bg-ashGray"} text-white`}
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;
