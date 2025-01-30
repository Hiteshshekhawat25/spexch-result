import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setChangePasswordLoading,
  setChangePasswordSuccess,
  setChangePasswordError,
  selectChangePasswordStatus,
  selectChangePasswordError,
} from "../../Store/Slice/profileSlice";
import { clearUserData } from "../../Store/Slice/userInfoSlice";
import { toast } from "react-toastify";
import { changeUserPassword } from "../../Services/UserInfoApi";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const changePasswordStatus = useSelector(selectChangePasswordStatus);
  const changePasswordError = useSelector(selectChangePasswordError);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    dispatch(setChangePasswordLoading());

    try {
      await changeUserPassword(currentPassword, newPassword);
      dispatch(setChangePasswordSuccess());

      toast.success("Password changed successfully!", {});

      // Clear user data and logout
      dispatch(clearUserData());
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      dispatch(setChangePasswordError(err.message));
      setError(err.message);
      toast.error("Failed to change password. Please try again.", {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Blur Effect */}
      <div className="w-full bg-gradient-blue text-white text-center py-2 ">
        
        <h1 className="text-sm font-bold">Change Password</h1>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-6">
            {/* Current Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Your Password</label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mt-1"
                    placeholder="Enter your current password"
                  />
                  <span
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
                  >
                    {showCurrentPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mt-1"
                    placeholder="Enter a new password"
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
                  >
                    {showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded mt-1"
                  placeholder="Confirm your new password"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {(error || changePasswordError) && (
              <div className="text-red-600 text-sm mt-2">{error || changePasswordError}</div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                className="bg-gradient-blue text-white font-bold px-6 py-2 rounded"
                disabled={changePasswordStatus === "loading"}
              >
                {changePasswordStatus === "loading" ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
