import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import { useDispatch } from "react-redux";
import { updateExposure } from "../../Store/Slice/editExposureSlice"; // Import the update exposure thunk
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import {
  setDownlineData,
  setError,
  setLoading,
} from "../../Store/Slice/downlineSlice";
import { toast } from "react-toastify";
import { fetchRoles } from "../../Utils/LoginApi";
import { useLocation } from "react-router-dom";

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
  const location = useLocation()

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
  
      // Dispatch exposure limit update
      dispatch(updateExposure({ newExposureLimit, password, userId }));
  
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
      if (location.pathname === "/user-downline-list") {
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/master-downline-list") {
        const masterRole = rolesData.find((role) => role.role_name === "master");
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        setLoading(false);
        return;
      }
   const fetchResult = await dispatch(updateExposure({ newExposureLimit, password, userId }));
        console.log("fetchResult", fetchResult);
      // Fetch downline data with roleId
      // const result = await fetchDownlineData(
      //   currentPage,
      //   entriesToShow,
      //   roleId
      // );
      // if (result && result.data) {
      //   dispatch(setDownlineData(result.data));
      //   setNewExposureLimit(0);
      //   setPassword("");
      //   onCancel(); // Close the modal only on success
      //   toast.success(
      //     result.message ||
      //       "Exposure limit updated and downline data fetched successfully."
      //   );
      // } else {
      //   toast.warning("Unable to fetch updated downline data.");
      // }
      if (fetchResult.error) {
              // If there's an error returned from the action, display it in a toast
              toast.error(fetchResult.payload || "An error occurred while updating the partnership.");
            } else {
              const result = await fetchDownlineData(currentPage, entriesToShow, roleId);
              if (result && result.data) {
                dispatch(setDownlineData(result.data));
        
                setNewExposureLimit(0);
                setPassword("");
                onCancel();
                toast.success(result.message || "Partnership data updated successfully.");
              } else {
                toast.warning("Unable to fetch updated downline data.");
              }
            }
    } catch (error) {
      console.error("Error fetching downline data:", error);
      dispatch(setError(error.message || "Failed to fetch the downline data."));
      toast.error(
        error.message || "An error occurred while fetching the downline data."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-20">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-semibold w-full p-2">
          <span>Edit Exposure Limit - {username}</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Current Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Current
            </label>
            <p className="w-2/3 text-black font-medium">
              {currentExposureLimit}
            </p>
          </div>

          {/* New Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              New
            </label>
            {/* <div className="w-2/3 flex items-center space-x-2">
              <input
                type="text"
                value={newExposureLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 8) {
                    setNewExposureLimit(Number(value));
                  }
                }}
                placeholder="New Exposure Limit"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
            </div> */}
             <div className="w-2/3 flex items-center space-x-2">
              <input
                type="text"
                value={newExposureLimit}
                onChange={(e) => setNewExposureLimit(e.target.value)}
                placeholder="New Credit Reference"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 p-2 border border-black rounded-lg text-gray-700"
              placeholder="Enter your password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg"
            >
              Submit
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel} // Call onCancel to close the modal
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
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
