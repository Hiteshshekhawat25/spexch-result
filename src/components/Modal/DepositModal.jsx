import React, { useState } from "react";
import { performTransaction } from "../../Services/DownlineListApi";
import { toast } from "react-toastify";

const DepositModal = ({ isOpen, onClose, userId }) => {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        resetState(); // Reset state after a successful transaction
        onClose(); // Close the modal
      } else {
        toast.error(response.message || "Transaction Failed");
      }
    } catch (err) {
      toast.error("An error occurred while processing the transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Banking - Master -</h2>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="text-gray-500 text-2xl hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form className="space-y-6">
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Balance
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
              Remark
            </label>
            <input
              type="text"
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Remark"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Transaction Buttons */}
          <div className="flex justify-between space-x-4">
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
