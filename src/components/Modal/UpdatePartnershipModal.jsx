import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setDownlineData,
  setError,
  setLoading,
} from "../../Store/Slice/downlineSlice";
import { fetchRoles } from "../../Utils/LoginApi";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { updateCreditReference } from "../../Store/Slice/creditReferenceslice";
import { IoClose } from "react-icons/io5";
import { updatePartnership } from "../../Store/Slice/updatePartnershipSlice";

const UpdatePartnershipModal = ({
  username,
  setRoleId,
  fetchData,
  onCancel,
  currentPartnership,
  onSubmit = () => {},
  userId,
  currentPage,
  entriesToShow,
}) => {
  const dispatch = useDispatch();

  const [newPartnership, setNewPartnership] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const { userData, error } = useSelector((state) => state.user);


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate individual fields and throw specific errors
    if (
      newPartnership === "" ||
      newPartnership === null ||
      newPartnership === undefined
    ) {
      toast.error("Partnership value is required.");
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      setLoading(false);
      return;
    }

    // Validate newPartnership value
    if (newPartnership < 0 || isNaN(newPartnership) || newPartnership > 100) {
      toast.error("Please enter a valid partnership value between 0 and 100.");
      setLoading(false);
      return;
    }

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
      if (location.pathname.includes("/user-downline-list")) {
        console.log("Inside user-downline-list");
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname.includes("/master-downline-list")) {
        console.log("Inside master-downline-list");
        const masterRole = rolesData.find(
          (role) =>{
            if(userData?.data?.role_name == 'super-admin'){
              return role.role_name === "sub-admin"
             }else if(userData?.data?.role_name == 'sub-admin'){
               return role.role_name === "white-level"
             }else if(userData?.data?.role_name == 'white-level'){
               return role.role_name === "super"
             }else if(userData?.data?.role_name == 'white-level'){
               return role.role_name === "master"
             }
          }
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
        setRoleId(roleId)
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        setLoading(false);
        return;
      }

      // Dispatch the update action and handle result
      const fetchResult = await dispatch(
        updatePartnership({ newPartnership, password, userId })
      );
      if (fetchResult.error) {
        toast.error(fetchResult.error);
      } else {
        fetchData(roleId)
        onCancel()
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
      <div className="relative bg-white rounded-lg sm:mt-6 mt-3 shadow-lg w-[96%] md:w-3/4 lg:w-1/3 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full p-2">
          <span>Update Partnership - {username}</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Current Partnership */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
              Current
            </label>
            <p className="w-2/3 text-black font-custom text-sm font-medium">{currentPartnership}</p>
          </div>

          {/* New Partnership */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
              New
            </label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="text"
                value={newPartnership}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 3) {
                    setNewPartnership(Number(value));
                  }
                }}
                // placeholder="New Partnership"
                className="w-full p-2 text-sm border border-gray-300 outline-none rounded-[5px] text-gray-700"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 p-2 border border-gray-300 text-sm rounded-[5px] outline-none text-gray-700"
              // placeholder="Enter your password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-seablue text-sm font-semibold text-white rounded-[6px]"
            >
              Submit
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel} // Call onCancel to close the modal
              className="px-6 py-2 bg-gray-300 font-semibold text-sm text-gray-700 rounded-[6px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePartnershipModal;
