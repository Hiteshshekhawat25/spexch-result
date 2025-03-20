import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { updateField, resetForm } from "../../Store/Slice/editMatchSlice"; 
import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditMatchModal = ({ onCancel, onSubmit, match }) => {
  const dispatch = useDispatch();

  // Local state for form values
  const [oddsMessage, setOddsMessage] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [eventId, setEventId] = useState("");
  const [bookmakerMessage, setBookmakerMessage] = useState("");
  const [tossMessage, setTossMessage] = useState("");
  const [marketId, setMarketId] = useState("");

  // Pre-populate form values with match data when the modal opens
  useEffect(() => {
    if (match) {
      setOddsMessage(match.oddsMessage || "");
      setSessionMessage(match.sessionMessage || "");
      setEventId(match.eventId || "");
      setBookmakerMessage(match.bookmakerMessage || "");
      setTossMessage(match.tossMessage || "");
      setMarketId(match.marketId || "");
    }
  }, [match]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "oddsMessage":
        setOddsMessage(value);
        break;
      case "sessionMessage":
        setSessionMessage(value);
        break;
      case "eventId":
        setEventId(value);
        break;
      case "bookmakerMessage":
        setBookmakerMessage(value);
        break;
      case "tossMessage":
        setTossMessage(value);
        break;
      case "marketId":
        setMarketId(value);
        break;
      default:
        break;
    }
    dispatch(updateField({ name, value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      oddsMessage,
      sessionMessage,
      eventId,
      bookmakerMessage,
      tossMessage,
      marketId,
    };

    try {
      if (!match || !match._id) {
        toast.error("Match ID is missing.", { position: "top-center" });
        return;
      }

      const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);

      if (response.status === 200) {
        toast.success("Match updated successfully!", { position: "top-center" });
        onCancel(); // Close modal
        dispatch(resetForm()); // Reset Redux state
      } else {
        toast.error("Failed to update match. Please try again.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("An error occurred while updating the match.", { position: "top-center" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white flex flex-col rounded-lg sm:mt-6 mt-3 shadow-lg w-[96%] md:w-3/4 lg:w-1/2">
        <div className="flex justify-between items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full px-3 py-2">
          <h2>Edit Match</h2>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>
        <div className="sm:p-4 p-3 overflow-y-auto h-full">
          {/* Form */}
          <form onSubmit={handleSubmit} className="sm:space-y-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4 gap-3">
              <div>
                <label htmlFor="oddsMessage" className="block text-sm font-custom font-medium text-black">
                  Odds Message
                </label>
                <input
                  type="text"
                  id="oddsMessage"
                  name="oddsMessage"
                  value={oddsMessage}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
              <div>
                <label htmlFor="sessionMessage" className="block text-sm font-custom font-medium text-black">
                  Session Message
                </label>
                <input
                  type="text"
                  id="sessionMessage"
                  name="sessionMessage"
                  value={sessionMessage}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
              <div>
                <label htmlFor="eventId" className="block text-sm font-custom font-medium text-black">
                  Event ID
                </label>
                <input
                  type="text"
                  id="eventId"
                  name="eventId"
                  value={eventId}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
              <div>
                <label htmlFor="bookmakerMessage" className="block text-sm font-custom font-medium text-black">
                  Bookmaker Message
                </label>
                <input
                  type="text"
                  id="bookmakerMessage"
                  name="bookmakerMessage"
                  value={bookmakerMessage}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
              <div>
                <label htmlFor="tossMessage" className="block text-sm font-custom font-medium text-black">
                  Toss Message
                </label>
                <input
                  type="text"
                  id="tossMessage"
                  name="tossMessage"
                  value={tossMessage}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
              <div>
                <label htmlFor="marketId" className="block text-sm font-custom font-medium text-black">
                  Market ID
                </label>
                <input
                  type="text"
                  id="marketId"
                  name="marketId"
                  value={marketId}
                  onChange={handleChange}
                  className="w-full sm:p-2 p-[7px] border border-gray-300 rounded-[5px] text-sm mt-0.5 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-gradient-seablue font-semibold text-sm text-white px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMatchModal;

