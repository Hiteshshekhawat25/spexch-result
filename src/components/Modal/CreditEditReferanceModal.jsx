import React, { useState } from "react";

const CreditEditReferenceModal = ({ username, currentCreditRef, onSubmit, onCancel }) => {
  const [newCreditRef, setNewCreditRef] = useState(currentCreditRef);
  const [password, setPassword] = useState("");

  const handleIncrease = () => {
    setNewCreditRef((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setNewCreditRef((prev) => (prev > 0 ? prev - 1 : 0)); // Ensure it doesn't go below 0
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newCreditRef, password); // Pass newCreditRef and password to the onSubmit function
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-96 p-6">
        {/* Header */}
        <div className="bg-black text-white text-lg font-semibold p-4 rounded-t-lg">
          Edit Credit Reference - {username}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Current Credit Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Credit Reference</label>
            <input
              type="text"
              value={currentCreditRef}
              readOnly
              className="w-full mt-2 p-2 border rounded-lg bg-gray-100 text-gray-700"
            />
          </div>

          {/* New Credit Reference */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">New Credit Reference</label>
              <input
                type="number"
                value={newCreditRef}
                onChange={(e) => setNewCreditRef(Number(e.target.value))}
                placeholder="New Credit Reference"
                className="w-full mt-2 p-2 border rounded-lg text-gray-700"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={handleIncrease}
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={handleDecrease}
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                ↓
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg"
            >
              Submit
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel} // Call onCancel to close the modal
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditEditReferenceModal;
