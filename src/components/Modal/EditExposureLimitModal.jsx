import React, { useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon

const EditExposureLimitModal = ({ username, currentExposureLimit, onSubmit, onCancel }) => {
  const [newExposureLimit, setNewExposureLimit] = useState(currentExposureLimit);
  const [password, setPassword] = useState("");

  const handleIncrease = () => {
    setNewExposureLimit((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setNewExposureLimit((prev) => (prev > 0 ? prev - 1 : 0)); // Ensure it doesn't go below 0
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newExposureLimit, password); // Pass newExposureLimit and password to the onSubmit function
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-0">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-2">
          <span>Edit Exposure Limit - {username}</span>
          <IoClose
            onClick={onCancel} // Close the modal
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Current Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">Current</label>
            <p className="w-2/3 text-black font-medium">{currentExposureLimit}</p> {/* Display as text */}
          </div>

          {/* New Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">New</label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="number"
                value={newExposureLimit}
                onChange={(e) => setNewExposureLimit(Number(e.target.value))}
                placeholder="New Exposure Limit"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">Password</label>
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
