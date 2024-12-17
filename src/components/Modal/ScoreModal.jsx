import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateScore } from "../../Store/Slice/scoreSlice"; // Adjust the path if necessary
import { IoClose } from "react-icons/io5";

const ScoreModal = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { scoreId, team1, team2 } = useSelector((state) => state.score);

  const handleUpdateScoreId = () => {
    const newScoreId = prompt("Enter Score ID:", scoreId);
    if (newScoreId) {
      dispatch(updateScore({ name: "scoreId", value: newScoreId }));
    }
  };

  const handleUpdateTeams = () => {
    const newTeam1Name = prompt("Enter Team 1 Name:", team1);
    const newTeam2Name = prompt("Enter Team 2 Name:", team2);
    if (newTeam1Name && newTeam2Name) {
      dispatch(updateScore({ name: "team1", value: newTeam1Name }));
      dispatch(updateScore({ name: "team2", value: newTeam2Name }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-start z-50">
      <div className="bg-white rounded-lg w-[800px] p-5 mt-12"> {/* Adjust mt-12 to bring it higher */}
        {/* Gray Header with Close Icon */}
        <div className="bg-whiteGray p-3 rounded-t-lg flex justify-end items-center">
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column - Score ID */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-md font-bold text-gray-700">SCORE ID</label>
              <input
                type="text"
                value={scoreId}
                readOnly
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end mt-2"> {/* Align button to the right */}
                <button
                  onClick={handleUpdateScoreId}
                  className="py-2 px-4 bg-lightblue text-white rounded-md hover:bg-blue-600"
                >
                  Update Score ID
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Teams */}
          <div className="space-y-4">
            <div className="flex space-x-6">
              {/* Team 1 */}
              <div className="flex flex-col w-1/2">
                <label className="text-md font-bold text-gray-700">TEAM 1</label>
                <input
                  type="text"
                  value={team1}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Team 2 */}
              <div className="flex flex-col w-1/2">
                <label className="text-md font-bold text-gray-700">TEAM 2</label>
                <input
                  type="text"
                  value={team2}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end mt-2"> {/* Align button to the right */}
              <button
                onClick={handleUpdateTeams}
                className="py-2 px-4 bg-lightblue text-white rounded-md hover:bg-blue-600"
              >
                Update Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
