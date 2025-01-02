import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import { useDispatch, useSelector } from "react-redux";
import { updateCreditReference } from "../../Store/Slice/creditReferenceslice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { setDownlineData, setLoading } from "../../Store/Slice/downlineSlice";
import { toast } from "react-toastify";
import { fetchRoles } from "../../Utils/LoginApi";

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

  const dispatch = useDispatch();
  const handleIncrease = () => {
    setNewCreditRef((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newCreditRef <= 0 || isNaN(newCreditRef)) {
      toast.error("Please enter a valid credit reference greater than 0.");
      return;
    }
  
    dispatch(updateCreditReference({ newCreditRef, password, userId }));
  
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
      if (location.pathname === "/user-downline-list") {
        console.log("Inside user-downline-list");
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/master-downline-list") {
        console.log("Inside master-downline-list");
        const masterRole = rolesData.find((role) => role.role_name === "master");
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        toast.warning("Invalid location path. Unable to determine action.");
        setLoading(false);
        return;
      }
  
      console.log("roleId:", roleId);
  
      const result = await fetchDownlineData(currentPage, entriesToShow, roleId);
      if (result && result.data) {
        dispatch(setDownlineData(result.data));
        setNewCreditRef(0);
        setPassword("");
        onCancel();
        toast.success("Credit Reference data updated successfully.");
      } else {
        toast.warning("Unable to fetch updated downline data.");
      }
    } catch (error) {
      console.error("Error fetching downline data:", error);
      setError(error.message || "Failed to fetch the downline data.");
      toast.error(
        error.message || "An error occurred while fetching the downline data."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-12">
        {" "}
        {/* Reduced margin-top */}
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-3">
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
                onChange={(e) => setNewCreditRef(Number(e.target.value))}
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
