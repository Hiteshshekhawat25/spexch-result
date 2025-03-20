import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateScore } from "../../Store/Slice/scoreSlice"; // Adjust the path if necessary
import { IoClose } from "react-icons/io5";
import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; // Ensure correct import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScoreModal = ({ onCancel, match }) => {
  const dispatch = useDispatch();
  const { scoreId, team1, team2 } = useSelector((state) => state.score);

  // Local state to track the new score ID and team names
  const [newScoreId, setNewScoreId] = useState(scoreId);
  const [newTeam1Name, setNewTeam1Name] = useState(team1);
  const [newTeam2Name, setNewTeam2Name] = useState(team2);

  // Pre-populate modal inputs with existing match data
  useEffect(() => {
    if (match) {
      setNewScoreId(match.scoreId || ""); // Set default value if match doesn't have data
      setNewTeam1Name(match.team1 || "");
      setNewTeam2Name(match.team2 || "");
    }
  }, [match]);

  // Update ScoreId function (also calls the API to update the match)
  const handleUpdateScoreId = async () => {
    if (newScoreId !== scoreId) {
      try {
        const payload = { scoreId: newScoreId };
        const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);
        if (response.status === 200) {
          toast.success("Score ID updated successfully!", { position: "top-center" });
          dispatch(updateScore({ name: "scoreId", value: newScoreId }));
          onCancel();
        } else {
          toast.error("Failed to update Score ID", { position: "top-center" });
        }
      } catch (error) {
        toast.error("Error updating Score ID", { position: "top-center" });
        console.error(error);
      }
    }
  };

  // Update Teams function (also calls the API to update the match)
  const handleUpdateTeams = async () => {
    if (newTeam1Name !== team1 || newTeam2Name !== team2) {
      try {
        const payload = { team1: newTeam1Name, team2: newTeam2Name };
        const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);
        if (response.status === 200) {
          toast.success("Teams updated successfully!", { position: "top-center" });
          dispatch(updateScore({ name: "team1", value: newTeam1Name }));
          dispatch(updateScore({ name: "team2", value: newTeam2Name }));
          onCancel();
        } else {
          toast.error("Failed to update teams", { position: "top-center" });
        }
      } catch (error) {
        toast.error("Error updating teams", { position: "top-center" });
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-start z-50">
      <div className="relative bg-white rounded-lg sm:mt-6 mt-3 shadow-lg w-[96%] md:w-3/4 lg:w-2/4">
        <div className="flex justify-end items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full px-3 py-2">
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>
        {/* Modal Content */}
        <div className="sm:p-4 p-3 overflow-y-auto h-full">
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            {/* Left Column - Score ID */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-custom text-[14px] text-gray-800">SCORE ID</label>
                <input
                  type="text"
                  value={newScoreId}
                  onChange={(e) => setNewScoreId(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-none text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleUpdateScoreId}
                    className="py-2 px-4 bg-gradient-seablue text-sm font-semibold text-white rounded-md hover:bg-blue-600"
                  >
                    Update Score ID
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Teams */}
            <div className="sm:space-y-4 space-y-3">
              <div className="flex sm:space-x-6 space-x-4">
                {/* Team 1 */}
                <div className="flex flex-col w-1/2">
                  <label className="font-custom text-sm text-gray-800">TEAM 1</label>
                  <input
                    type="text"
                    value={newTeam1Name}
                    onChange={(e) => setNewTeam1Name(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-none text-sm"
                  />
                </div>

                {/* Team 2 */}
                <div className="flex flex-col w-1/2">
                  <label className="font-custom text-sm text-gray-800">TEAM 2</label>
                  <input
                    type="text"
                    value={newTeam2Name}
                    onChange={(e) => setNewTeam2Name(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md outline-none text-sm"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleUpdateTeams}
                  className="py-2 px-4 bg-gradient-seablue font-semibold text-sm text-white rounded-md hover:bg-blue-600"
                >
                  Update Teams
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;

