// AccountStatus.js
import React, { useState } from "react";
import { updateUserStatus } from "../../Services/DownlineListApi";

const AccountStatus = ({ userId, isOpen, onClose }) => {
  console.log("00000", userId);
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusUpdated, setStatusUpdated] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await updateUserStatus(userId, status, password);
      if (response) {
        setStatusUpdated(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Change Status</h2>
          <span className="text-green-500 text-sm">USER</span>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-red-500 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* User Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-lg">rinku8</div>
          <div className={`text-${status === "active" ? "green" : "red"}-500`}>
            {status === "active"
              ? "Active"
              : status === "suspended"
              ? "Suspended"
              : "Locked"}
          </div>
        </div>

        {/* Status Buttons */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => handleStatusChange("active")}
            className={`w-full py-2 rounded-lg font-medium ${
              status === "active" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange("suspended")}
            className={`w-full py-2 rounded-lg font-medium ${
              status === "suspended" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Suspend
          </button>
          <button
            onClick={() => handleStatusChange("locked")}
            className={`w-full py-2 rounded-lg font-medium ${
              status === "locked" ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Locked
          </button>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
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
          className="w-full py-2 bg-NavyBlue text-white font-medium rounded-lg"
        >
          {loading ? "Changing..." : "Change Status"}
        </button>

        {/* Status update message */}
        {statusUpdated && (
          <div className="text-green-500 mt-4">Status updated successfully!</div>
        )}

        {/* Error message */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default AccountStatus;
