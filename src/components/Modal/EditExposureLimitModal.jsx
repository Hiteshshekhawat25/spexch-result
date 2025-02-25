import React, { useEffect, useState } from "react";
import { IoClose, IoEyeOutline, IoEyeOffOutline} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateExposure } from "../../Store/Slice/editExposureSlice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import {
  setDownlineData,
  setError,
  setLoading,
} from "../../Store/Slice/downlineSlice";
import { toast } from "react-toastify";
import { fetchRoles, fetchUserDetails } from "../../Utils/LoginApi";
import { useLocation } from "react-router-dom";
import { updateProfile } from "../../Store/Slice/profileSlice";

const EditExposureLimitModal = ({
  username,
  currentExposureLimit,
  onCancel,
  onSubmit = () => {},
  user,
  userId,
  fetchDownline,
  currentPage,
  entriesToShow,
}) => {
  // console.log("currentExposureLimit", currentExposureLimit);
  const dispatch = useDispatch();

  const [newExposureLimit, setNewExposureLimit] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for empty fields
    if (!newExposureLimit) {
      toast.error("New Exposure Limit is required.");
      return; // Do not proceed if validation fails
    }

    if (!password) {
      toast.error("Password is required.");
      return; // Do not proceed if validation fails
    }

    // Validation for invalid exposure limit value
    if (newExposureLimit <= 0 || isNaN(newExposureLimit)) {
      toast.error("Please enter a valid exposure limit greater than 0.");
      return; // Do not proceed if validation fails
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const rolesArray = await fetchRoles(token);
      if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
        toast.warning("No roles found. Please check your configuration.");
        setLoading(false);
        return;
      }

      const rolesData = rolesArray.map((role) => ({
        role_name: role.role_name,
        role_id: role._id,
      }));
      setRoles(rolesData);

      let roleId = null;
      if (
        location.pathname === "/user-downline-list" ||
        location.pathname === "/MyAccount"
      ) {
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (
        location.pathname === "/master-downline-list" ||
        location.pathname === "/MyAccount"
      ) {
        const masterRole = rolesData.find(
          (role) => role.role_name === "master"
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        setLoading(false);
        return;
      }
      const fetchResult = await dispatch(
        updateExposure({ newExposureLimit, password, userId })
      );

      if (fetchResult.error) {
        // toast.error(fetchResult.error);
      } else {
        const result = await fetchDownlineData(
          currentPage,
          entriesToShow,
          roleId
        );
        if (result && result.data) {
          console.log("result", result.data);
          dispatch(setDownlineData(result.data));
          window.location.reload();

          setNewExposureLimit(0);
          setPassword("");
          onCancel();
          toast.success(
            fetchResult.payload?.message || "Data updated successfully."
          );

          onCancel();
        } else {
          toast.warning("Unable to fetch updated downline data.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.message || "An error occurred while processing the request."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[95%] sm:w-[500px] mt-20 sm:mt-10">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue rounded-t-lg text-white text-[15px] font-custom font-semibold w-full p-2">
          <span>Edit Exposure Limit - {username}</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="gap-5 flex flex-col p-4">
          {/* Current Exposure Limit */}
          <div className="flex flex-row justify-between md:gap-0 gap-3 items-center md:w-[80%]">
            <label className="block text-[13px] font-custom text-gray-700 sm:w-1/3">
              Current
            </label>
            <p className="w-full sm:w-2/3 text-black font-custom font-bold text-[13px]">
              {currentExposureLimit}
            </p>
          </div>

          {/* New Exposure Limit */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center md:w-[80%]">
            <label className="block text-[13px] font-custom text-gray-700 w-1/3">
              New
            </label>
            <div className="w-full sm:w-2/3 flex items-center space-x-2">
              <input
                type="text"
                value={newExposureLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9]/g, "");
                  setNewExposureLimit(numericValue);
                }}
                className="w-full p-2 border border-gray-300 rounded-[5px] h-[35px] text-gray-700"
              />
            </div>
          </div>

          {/* Password Field */}

          <div className="flex flex-col sm:flex-row justify-between sm:items-center md:w-[80%] relative">
            <label className="block text-[13px] font-custom text-gray-700 w-1/3">
              Password
            </label>
           <div className="relative w-full sm:w-2/3">
            <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-[5px] h-[35px] text-gray-700 pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {passwordVisible ? (
                  <IoEyeOffOutline className="text-blue" />
                ) : (
                  <IoEyeOutline className="text-blue" />
                )}
              </div>
           </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 md:mt-7 mt-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="px-3 py-[6px] text-[14px] bg-gradient-seablue font-custom font-bold text-white rounded-md"
            >
              Submit
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-[6px] text-[14px] bg-gray-400 font-custom font-bold text-gray-700 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExposureLimitModal;
