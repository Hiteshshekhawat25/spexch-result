import React, { useState } from "react";

const SportsSettingsModal = ({ isOpen, onClose }) => {
  const [sportsList, setSportsList] = useState([
    { id: 1, name: "Soccer", isChecked: false },
    { id: 2, name: "Tennis", isChecked: false },
    { id: 3, name: "Casino", isChecked: false },
    { id: 4, name: "Cricket", isChecked: false },
  ]);

  const handleCheckboxChange = (id) => {
    setSportsList(
      sportsList.map((sport) =>
        sport.id === id ? { ...sport, isChecked: !sport.isChecked } : sport
      )
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg w-1/3 shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={onClose}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">Sports Settings</h2>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Sr.No.</th>
                  <th className="px-4 py-2 text-left">Sport Name</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {sportsList.map((sport) => (
                  <tr key={sport.id} className="border-b">
                    <td className="px-4 py-2 text-center">{sport.id}</td>
                    <td className="px-4 py-2">{sport.name}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={sport.isChecked}
                        onChange={() => handleCheckboxChange(sport.id)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={onClose}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SportsSettingsModal;
