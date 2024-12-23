import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSportsList, updateGameStatusThunk } from "../../Store/Slice/sportsSettingSlice";
import { selectSportsList, selectLoading, selectError } from "../../Store/Selectors/SportsSelector";
import { toast } from "react-toastify";

const SportsSettingsModal = ({ isOpen, onClose, userId }) => {
  const dispatch = useDispatch();

  // Selectors
  const sportsList = useSelector(selectSportsList);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const token = localStorage.getItem("authToken");

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSportsList(token));
    }
  }, [isOpen, dispatch, token]);

  // Handle checkbox state changes
  const handleCheckboxChange = (gameId, isChecked) => {
    dispatch(updateGameStatusThunk({ token, userId, gameId, isChecked: !isChecked }))
      .unwrap()
      .then((response) => {
        toast.success(response.message || "Game status updated successfully");
      })
      .catch((error) => {
        toast.error(error || "Error updating game status");
      });
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

            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
              <table className="min-w-full table-auto border border-gray-400">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Sr.No.</th>
                    <th className="px-4 py-2 text-left">Sport Name</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sportsList.map((sport, index) => (
                    <tr key={sport.gameId} className="border-b">
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2">{sport.name}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={sport.isChecked}
                          onChange={() => handleCheckboxChange(sport.gameId, sport.isChecked)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SportsSettingsModal;
