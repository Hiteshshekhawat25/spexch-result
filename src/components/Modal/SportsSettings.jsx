import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSportsList,
  updateGameStatusThunk,
  fetchUserGameStatusThunk,
} from "../../Store/Slice/sportsSettingSlice";
import {
  selectSportsList,
  selectLoading,
  selectError,
} from "../../Store/Selectors/SportsSelector";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const SportsSettingsModal = ({
  isOpen,
  onClose,
  userId,
  currentPage,
  entriesToShow,
}) => {
  const dispatch = useDispatch();

  const sportsList = useSelector(selectSportsList);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSportsList({ token }));
      dispatch(fetchUserGameStatusThunk({ userId }));
    }
  }, [isOpen, dispatch, token]);

   const handleCheckboxChange = (gameId, isChecked) => {
    dispatch(
      updateGameStatusThunk({ token, userId, gameId, isChecked: !isChecked })
    )
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
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-[500px] mt-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-blue text-white text-md font-semibold w-full p-2">
              <span>Sports Settings</span>
              <IoClose
                onClick={onClose}
                className="cursor-pointer text-white text-2xl"
              />
            </div>

            {loading && (
              <p className="text-center text-gray-500">
                <ClipLoader />
              </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="p-4">
              {!loading && !error && (
                <table className="min-w-full table-auto border border-gray-400">
                  <thead className="bg-gray-300 border border-gray-400">
                    <tr>
                      <th className="px-4 py-2 text-left border-r border-gray-400">
                        Sr.No.
                      </th>
                      <th className="px-4 py-2 text-left border-r border-gray-400">
                        Sport Name
                      </th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sportsList?.map((sport, index) => (
                      <tr
                        key={sport?.gameId}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="border border-gray-400 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-400 px-4 py-2 text-left">
                          {sport.name}
                        </td>
                        <td className="border border-gray-400 px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={sport?.isChecked}
                            onChange={() =>
                              handleCheckboxChange(
                                sport?.gameId,
                                sport?.isChecked
                              )
                            }
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
        </div>
      )}
    </>
  );
};
export default SportsSettingsModal;
