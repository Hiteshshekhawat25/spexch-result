import React, { useState } from "react";
import {
  fetchDownlineData,
  performTransaction,
} from "../../Services/DownlineListApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setDownlineData } from "../../Store/Slice/downlineSlice";

const DepositModal = ({
  isOpen,
  onClose,
  userId,
  currentPage,
  entriesToShow,
}) => {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const token = localStorage.getItem("authToken");

  if (!isOpen) return null;

  const resetState = () => {
    setAmount("");
    setRemark("");
    setPassword("");
  };
  const handleTransaction = async (type) => {
    setLoading(true);

    const requestData = {
      userId: userId,
      amount: parseFloat(amount),
      password: password,
      description: remark,
    };

    try {
      const response = await performTransaction(type, requestData, token);
      if (response.success) {
        toast.success(response.message || "Transaction Successful");
        const result = await fetchDownlineData(currentPage, entriesToShow);
        if (result && result.data) {
          dispatch(setDownlineData(result.data));
          resetState();
          onClose();
        } else {
          toast.warning("Unable to fetch updated downline data.");
        }
      } else {
        toast.error(response.message || "Transaction Failed");
      }
    } catch (err) {
      toast.error(err || "An error occurred while processing the transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[500px] mt-12">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-3">
          <span>Banking - Master -{userData?.data?.name}</span>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="cursor-pointer text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form className="space-y-4 p-5">
          {/* Amount Field */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Balance
            </label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Remark
            </label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter Remark"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
            </div>
          </div>
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

          {/* Transaction Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => handleTransaction("deposit")}
              disabled={loading}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none"
            >
              {loading ? "Processing..." : "Deposit"}
            </button>
            <button
              type="button"
              onClick={() => handleTransaction("withdraw")}
              disabled={loading}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
