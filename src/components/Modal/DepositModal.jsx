import React, { useState } from "react";
import { performTransaction } from "../../Services/DownlineListApi";

const DepositModal = ({ isOpen, onClose,userId }) => {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [password, setPassword] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("authToken");;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous state
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const requestData = {
      userId: userId, 
      amount: parseFloat(amount),
      password: password,
      description: remark,
    };

    try {
      const response = await performTransaction(transactionType, requestData, token);
      if (response.success) {
        setSuccessMessage("Transaction successful!");
      } else {
        setError(response.message || "Transaction failed.");
      }
    } catch (err) {
      setError(err);
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
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-800">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <div className="flex items-center mt-2 space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transaction-type"
                  value="deposit"
                  checked={transactionType === "deposit"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                Deposit
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transaction-type"
                  value="withdraw"
                  checked={transactionType === "withdraw"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                Withdraw
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-NavyBlue text-white py-2 px-6 rounded-lg hover:bg-NavyBlue focus:outline-none"
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Success and Error Messages */}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default DepositModal;
