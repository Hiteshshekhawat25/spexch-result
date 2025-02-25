import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateCommission } from "../../Store/Slice/updateCommissionSlice";
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { updateProfile } from "../../Store/Slice/profileSlice";

const EditCommisionModal = ({
  username,
  onCancel,
  currentCommission,
  userId,
}) => {
  const dispatch = useDispatch();

  const [newCommission, setNewCommission] = useState(currentCommission);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCommission || !password) {
      toast.error("Both commission and password are required.");
      return;
    }

    if (newCommission < 0 || newCommission > 100) {
      toast.error("Please enter a commission value between 0 and 100.");
      return;
    }

    try {
      const result = await dispatch(
        updateCommission({ newCommission, password, userId })
      );
      console.log("result", result);
      window.location.reload();
      if (result.payload) {
        toast.success("Commission updated successfully.");
        // dispatch(updateProfile(userId))
        onCancel();
      }
    } catch (error) {
      toast.error("Error updating commission. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[95%] sm:w-[500px] mt-20">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-[15px] rounded-t-md font-custom font-semibold w-full p-2">
          <span>Update Commission</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* New Commission */}
          <div className="flex flex-col">
            <label className="block text-sm font-custom font-medium text-gray-700 mb-1">
              Commission <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={newCommission}
              placeholder="Commission.."
              onChange={(e) => setNewCommission(e.target.value)}
              className="p-2 border border-whiteGray rounded-[5px] text-gray-700 h-[35px] outline-none text-[14px]"
              min="0"
              max="100"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col relative">
            <label className="block text-sm font-custom font-medium text-gray-700 mb-1">
              Your Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={password}
                placeholder="Your Password.."
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border w-full border-whiteGray rounded-[5px] text-gray-700 h-[35px] outline-none text-[14px]"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-4">
            <button
              type="submit"
              className={`px-3 py-1 rounded-md font-bold ${
                newCommission && password
                  ? "bg-gradient-seablue text-white"
                  : "bg-gray-500 text-white cursor-not-allowed"
              }`}
              disabled={!newCommission || !password}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 bg-gray-400 text-black rounded-md font-bold"
            >
              No
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommisionModal;
