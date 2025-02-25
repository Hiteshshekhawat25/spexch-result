import React, { useEffect, useState } from "react";
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
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
  const [showPassword, setShowPassword] = useState(false);
  

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
      if (location.pathname === "/user-downline-list" || location.pathname === "/user-banking") {
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/master-downline-list"|| location.pathname === "/user-banking") {
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

      if (fetchResult.error) {
        toast.error(fetchResult.error);
      } else {
        const result = await fetchDownlineData(
          currentPage,
          entriesToShow,
          roleId
        );
        console.log({result},'allOdds')
        if (result && result.data) {
          console.log("result", result.data);
          dispatch(setDownlineData(result.data));

          setNewCreditRef(0);
          setPassword("");
          toast.success(
            fetchResult.payload?.message || "Data updated successfully."
          );

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
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white rounded-lg w-[95%] sm:w-[500px] mt-12 sm:mt-12">
      {/* Header */}
      <div className="flex justify-between items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full px-3 py-2">
        <span>Edit Credit Reference - {username}</span>
        <IoClose
          onClick={onCancel} // Close the modal
          className="cursor-pointer text-white text-2xl"
        />
      </div>
  
      {/* Form */}
      <form onSubmit={handleSubmit} className="gap-5 flex flex-col p-5">
        {/* Current Credit Reference */}
        <div className="flex flex-row justify-between md:gap-0 gap-3 items-center md:w-[80%]">
          <label className="block text-[13px] font-custom font-medium text-gray-700 sm:w-1/3">
            Current
          </label>
          <p className="w-full sm:w-2/3 text-black font-custom font-bold text-[14px]">{currentCreditRef}</p>
        </div>
  
        {/* New Credit Reference */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center md:w-[80%]">
          <label className="block text-[13px] font-custom sm:mb-0 mb-[4px] font-medium text-gray-700 sm:w-1/3">
            New
          </label>
          <div className="w-full sm:w-2/3 flex items-center space-x-2">
          <input
              type="number"
              value={newCreditRef}
              onChange={(e) => setNewCreditRef(e.target.value)}
              min="0"
              className="w-full p-2 border border-whiteGray rounded-[4px] text-gray-700 h-[35px]"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center md:w-[80%]">
          <label className="block text-[13px] sm:mb-0 mb-[4px] font-custom font-medium text-gray-700 sm:w-1/3">
            Password
          </label>
          <div className="w-full sm:w-2/3 relative">
            <input
              type={showPassword ? "text" : "password"}  
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-whiteGray rounded-[4px] text-gray-700 h-[35px]"
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline className="text-blue" /> : <IoEyeOutline className="text-blue" />}
            </div>
          </div>
        </div>

      
        <div className="flex justify-end gap-3 md:mt-7 mt-4">
         
          <button
            type="submit"
            className="px-3 py-[6px] bg-gradient-seablue font-bold text-[14px] text-white rounded-md font-custom"
          >
            Submit
          </button>
  
          
          <button
            type="button"
            onClick={onCancel} // Call onCancel to close the modal
            className="px-3 py-[6px] bg-gray-400 font-bold text-[14px] text-gray-700 rounded-md font-custom"
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
