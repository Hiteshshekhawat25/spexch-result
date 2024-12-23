import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import { useDispatch } from "react-redux";
import { updateCreditReference } from "../../Store/Slice/creditReferenceslice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";

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
  console.log("currentCreditRef", currentCreditRef);
  const [newCreditRef, setNewCreditRef] = useState(currentCreditRef);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Function to fetch token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
        if (parsedToken) {
          setToken(parsedToken);
        } else {
          setError("Access token not found in the stored data.");
        }
      } catch {
        setToken(storedToken);
      }
    } else {
      setError("Token is missing. Please login again.");
    }
  }, []);

  const handleIncrease = () => {
    setNewCreditRef((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setNewCreditRef((prev) => (prev > 0 ? prev - 1 : 0)); // Ensure it doesn't go below 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for newCreditRef (ensure it's a number and greater than 0)
    if (newCreditRef <= 0 || isNaN(newCreditRef)) {
      alert("Please enter a valid credit reference greater than 0");
      return;
    }

    // Dispatch the update action
    dispatch(updateCreditReference({ newCreditRef, password, userId })); // Pass userId here

    // Call the parent onSubmit after dispatch
    onSubmit(newCreditRef, password);

    try {
      // Call fetchDownline API to update and render the new value
      await fetchDownlineData(token, currentPage, entriesToShow);

      // After the data is fetched, you can refresh the page or update state to reflect new data
      // Option 1: Force a page reload
      window.location.reload();

      // Option 2: Alternatively, if you're managing the downline data in your state, you can call a setState here to update the UI
      // setDownlineData(newData);  // Replace `setDownlineData` with your actual state update logic

      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      console.error("Error fetching downline data:", error);
      setError("Failed to fetch the downline data.");
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

