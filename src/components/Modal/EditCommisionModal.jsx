import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateCommission } from "../../Store/Slice/updateCommissionSlice"; 
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5"; 

const EditCommisionModal = ({ username, onCancel, currentCommission, userId }) => {
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
      if (result.payload) {
        toast.success("Commission updated successfully.");
        onCancel(); // Close modal after success
      }
    } catch (error) {
      toast.error("Error updating commission. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-20">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-custom font-semibold w-full p-2">
          <span>Update Commission</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
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
              className="p-2 border border-whiteGray rounded-lg text-gray-700"
              min="0"
              max="100"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col relative">
            <label className="block text-sm font-custom font-medium text-gray-700 mb-1">
              Your Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"} 
              value={password}
              placeholder="Your Password.."
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-whiteGray rounded-lg text-gray-700"
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

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              className="px-2 py-2 bg-gray-400 text-white rounded-lg"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onCancel} // Call onCancel to close the modal
              className="px-2 py-2 bg-gray-400 text-black rounded-lg"
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

