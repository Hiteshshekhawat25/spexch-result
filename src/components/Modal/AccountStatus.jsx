// AccountStatus.js
import React, { useState } from "react";
import { updateUserStatus } from "../../Services/DownlineListApi";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

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
        toast.success(response.message || "Status updated successfully");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-12">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-3">
          {" "}
          {/* Reduced padding */}
          <span>Change Status {""}</span>
          {/* Close Button */}
          <IoClose
            onClick={onClose} // Close the modal
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* User Info */}
        <div className="space-y-4 p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="font-medium text-lg font-bold">
              <span className="bg-green-500 text-white px-2 py-1 mr-1 rounded">
                {"User"}{" "}
              </span>
              rinku8
            </div>
            <div
              className={`text-${status === "active" ? "green" : "red"}-500`}
            >
              {status === "active"
                ? "Active"
                : status === "suspended"
                ? "Suspended"
                : "Locked"}
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex justify-between mb-4">
            <div
              onClick={() => handleStatusChange("active")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.707 8.293l-6.707 6.707L6.293 10.293l1.414-1.414L11 10.586l5.293-5.293 1.414 1.414z" />
              </svg>
              <span className="font-medium">Active</span>
            </div>
            <div
              onClick={() => handleStatusChange("suspended")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "suspended"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm-1 6h2v6h-2zm1 12c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
              </svg>
              <span className="font-medium">Suspend</span>
            </div>
            <div
              onClick={() => handleStatusChange("locked")}
              className={`flex flex-col items-center justify-center w-1/3 p-4 rounded-lg cursor-pointer ${
                status === "locked"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 mb-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C9.243 2 7 4.243 7 7v3h2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3h2V7c0-2.757-2.243-5-5-5zm4 9H8c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2v-6c0-1.103-.897-2-2-2zm-4 6c-.828 0-1.5-.672-1.5-1.5S11.172 14 12 14s1.5.672 1.5 1.5S12.828 17 12 17z" />
              </svg>
              <span className="font-medium">Locked</span>
            </div>
          </div>

          <div className="flex items-center mb-6 space-x-4">
            {/* Password Field */}
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
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
              className={`py-2 px-4 bg-NavyBlue text-white font-medium rounded-lg mt-5 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Changing..." : "Change Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;
