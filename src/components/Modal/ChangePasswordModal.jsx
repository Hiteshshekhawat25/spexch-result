import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5'; // Close icon

const ChangePasswordModal = ({ onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    // Submit logic (e.g., API call for password change)
    // Reset error after successful change
    setError('');
    // For now, just close the modal after validation
    onCancel();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-20">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-2">
          <span>Change Password</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Your Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Confirm your new password"
            />
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handleSubmit}
              className="bg-gradient-blue text-white px-4 py-2 rounded mr-2"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
