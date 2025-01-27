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

  //  const handleCheckboxChange = (gameId, isChecked) => {
  //   dispatch(
  //     updateGameStatusThunk({ token, userId, gameId, isChecked: !isChecked })
  //   )
  //     .unwrap()
  //     .then((response) => {
  //       toast.success(response.message || "Sports Locked successfully");
  //     })
  //     .catch((error) => {
  //       toast.error(error || "Error updating game status");
  //     });
  // };

  const handleToggleChange = (gameId, currentStatus) => {
    const newStatus = !currentStatus;
  
    dispatch(
      updateGameStatusThunk({ token, userId, gameId, isChecked: newStatus })
    )
      .unwrap()
      .then((response) => {
        const message = newStatus
          ? response.message || "Sports Locked successfully"
          : "Sports Unlocked successfully";
        toast.success(message);
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
            <div className="flex justify-between items-center bg-gradient-blue text-white text-md font-custom font-semibold w-full p-2">
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
  
  <div
  className={`relative inline-flex items-center h-6 w-16 border border-whiteGray cursor-pointer transition-colors ${
    sport?.isChecked
      ? "bg-gradient-seablue"
      : "bg-white"
  }`}
  onClick={() =>
    handleToggleChange(
      sport?.gameId,
      sport?.isChecked
    )
  }
>
  
  <span
    className={`absolute right-2 text-sm font-bold ${
      sport?.isChecked ? "text-transparent" : "text-whiteGray"
    }`}
  >
    ✗
  </span>

  
  <span
    className={`absolute left-2 text-sm font-bold ${
      sport?.isChecked ? "text-white" : "text-transparent"
    }`}
  >
    ✓
  </span>

  
  <span
    className={`inline-block h-5 w-5 border border-whiteGray bg-white transform transition-transform ${
      sport?.isChecked ? "translate-x-9" : "translate-x-1"
    }`}
  ></span>
</div>

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
