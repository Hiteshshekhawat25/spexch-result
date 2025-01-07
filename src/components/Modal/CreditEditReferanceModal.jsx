import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import { useDispatch, useSelector } from "react-redux";
import { updateCreditReference } from "../../Store/Slice/creditReferenceslice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { setDownlineData, setLoading } from "../../Store/Slice/downlineSlice";
import { toast } from "react-toastify";
import { fetchRoles } from "../../Utils/LoginApi";
import { useLocation } from "react-router-dom";

const CreditEditReferenceModal = ({
  username,
  currentCreditRef,
  onSubmit = () => {},
  onCancel,
  user,
  userId,
  fetchDownline,
  currentPage,
  entriesToShow,
}) => {
  const [newCreditRef, setNewCreditRef] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const { creditReference } = useSelector((state) => state);
  const [roles, setRoles] = useState([]);
  const location = useLocation();

  const dispatch = useDispatch();
  
  const handleIncrease = () => {
    setNewCreditRef((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate fields
    if (!newCreditRef) {
      toast.error("New Credit Reference is required.");
      return;
    }
  
    if (!password) {
      toast.error("Password is required.");
      return;
    }
  
    if (newCreditRef <= 0 || isNaN(newCreditRef)) {
      toast.error("Please enter a valid credit reference greater than 0.");
      return;
    }
  
    // Start loading state
    dispatch(setLoading(true));
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        dispatch(setLoading(false));
        return;
      }
  
      // Fetch roles
      const rolesArray = await fetchRoles(token);
      if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
        toast.warning("No roles found. Please check your configuration.");
        dispatch(setLoading(false));
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
        const masterRole = rolesData.find(
          (role) => role.role_name === "master"
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        dispatch(setLoading(false));
        return;
      }
  
      const fetchResult = await dispatch(
        updateCreditReference({ newCreditRef, password, userId })
      );
      console.log("fetchResult", fetchResult);
  
      if (fetchResult.error) {
        // If there's an error returned from the action, display it in a toast
        toast.error(fetchResult.payload || "An error occurred while updating the partnership.");
      } else {
        const result = await fetchDownlineData(currentPage, entriesToShow, roleId);
        if (result && result.data) {
          dispatch(setDownlineData(result.data));
  
          setNewCreditRef(0);
          setPassword("");
          toast.success(result.message || "Partnership data updated successfully.");
          
          // Close the modal only after successful submission
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
      // Ensure loading state is reset
      dispatch(setLoading(false));
    }
  };
  

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-12">
        {" "}
        {/* Reduced margin-top */}
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-semibold w-full p-3">
          {" "}
          {/* Reduced padding */}
          <span>Edit Credit Reference - {username}</span>
          <IoClose
            onClick={onCancel} // Close the modal
            className="cursor-pointer text-white text-2xl"
          />
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {" "}
          {/* Increased padding */}
          {/* Current Credit Reference */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Current
            </label>
            <p className="w-2/3 text-black font-medium">{currentCreditRef}</p>{" "}
            {/* Display as text */}
          </div>
          {/* New Credit Reference */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              New
            </label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="number"
                value={newCreditRef}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 8) {
                    setNewCreditRef(Number(value));
                  }
                }}
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

export default CreditEditReferenceModal;
