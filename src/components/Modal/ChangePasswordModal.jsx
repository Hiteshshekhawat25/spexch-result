import React, { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
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
import {
  changeOwnPassword,
  changeUserPassword,
} from "../../Services/UserInfoApi";

const ChangePasswordModal = ({ userId, onCancel }) => {
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
  console.log("userrrrrrrrrrrrr", userId);

  // const handleSubmit = async ( userId ) => {
  //   console.log("userIDdd",userId)
  //   if (!currentPassword || !newPassword || !confirmPassword) {
  //     setError("All fields are required");
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setError("New password and confirm password do not match");
  //     return;
  //   }

  //   dispatch(setChangePasswordLoading());

  //   try {
  //     if (userId) {
  //       console.log("hi")
  //       await changeUserPassword(currentPassword, newPassword, userId);
  //     } else {
  //       console.log("bye")
  //       await changeOwnPassword(currentPassword, newPassword);
  //     }

  //     dispatch(setChangePasswordSuccess());
  //     toast.success("Password changed successfully!");

  //     dispatch(clearUserData());
  //     localStorage.clear();
  //     window.location.reload();
  //     // window.location.href = "/";
  //   } catch (err) {
  //     dispatch(setChangePasswordError(err.message));
  //     setError(err.message);
  //     toast.error("Failed to change password. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    console.log("userID:", userId);
  
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
      if (userId) {
        console.log("Changing password for user:", userId);
        await changeUserPassword(currentPassword, newPassword, userId);
      } else {
        console.log("Changing own password");
        await changeOwnPassword(currentPassword, newPassword);
      }
  
      dispatch(setChangePasswordSuccess());
      toast.success("Password changed successfully!");
  
      dispatch(clearUserData());
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      dispatch(setChangePasswordError(err.message));
      setError(err.message);
      toast.error("Failed to change password. Please try again.");
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-20">
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-custom font-semibold w-full p-2">
          <span>Change Password</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-custom font-medium text-gray-700">
              Your Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              <span
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showCurrentPassword ? (
                  <IoEyeOff size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-custom font-medium text-gray-700">
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-custom font-medium text-gray-700" onClick={() => handleSubmit(userId)}>
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showConfirmPassword ? (
                  <IoEyeOff size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </span>
            </div>
          </div>

          {(error || changePasswordError) && (
            <div className="text-red-600 text-sm mt-2">
              {error || changePasswordError}
            </div>
          )}

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-ashGray text-white font-bold font-custom px-2 py-2 rounded"
              disabled={changePasswordStatus === "loading"}
            >
              {changePasswordStatus === "loading" ? "Processing..." : "Confirm"}
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-400 text-darkGray px-2 py-2 rounded font-bold font-custom"
              disabled={changePasswordStatus === "loading"}
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
