import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  setChangePasswordLoading,
  setChangePasswordSuccess,
  setChangePasswordError,
  selectChangePasswordStatus,
  selectChangePasswordError,
} from '../../Store/Slice/profileSlice';
import { clearUserData } from '../../Store/Slice/userInfoSlice'; // Import clearUserData action
import { toast } from "react-toastify";
import { changeUserPassword } from '../../Services/UserInfoApi';

const ChangePasswordModal = ({ onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const changePasswordStatus = useSelector(selectChangePasswordStatus);
  const changePasswordError = useSelector(selectChangePasswordError);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    dispatch(setChangePasswordLoading());

    try {
      // Use the utility function for API call
      await changeUserPassword(currentPassword, newPassword);
      dispatch(setChangePasswordSuccess());

      toast.success('Password changed successfully!', {});

      // Clear user data and logout
      dispatch(clearUserData());
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      dispatch(setChangePasswordError(err.message));
      setError(err.message);
      toast.error('Failed to change password. Please try again.', {});
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-20">
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-2">
          <span>Change Password</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        <div className="p-5 space-y-4">
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

          {(error || changePasswordError) && (
            <div className="text-red-600 text-sm mt-2">
              {error || changePasswordError}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSubmit}
              className="bg-gradient-blue text-white px-4 py-2 rounded mr-2"
              disabled={changePasswordStatus === 'loading'}
            >
              {changePasswordStatus === 'loading' ? 'Processing...' : 'Yes'}
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
              disabled={changePasswordStatus === 'loading'}
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


