import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetForm } from "../../Store/Slice/editMatchSlice";

const EditMatchModal = ({ onCancel , onSubmit}) => {
  const dispatch = useDispatch();

  const { oddsMessage = '', sessionMessage = '', eventId = '', bookmakerMessage = '', tossMessage = '', marketId = '' } = useSelector(
    (state) => state.editMatch || {}
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", {
      oddsMessage,
      sessionMessage,
      eventId,
      bookmakerMessage,
      tossMessage,
      marketId,
    });
    onCancel(); // Close the modal on successful submit
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Match Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="oddsMessage"
                  className="block text-sm font-medium text-black text-center"
                >
                  Odds Message
                </label>
                <input
                  type="text"
                  id="oddsMessage"
                  name="oddsMessage"
                  value={oddsMessage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="sessionMessage"
                  className="block text-sm font-medium text-black text-center"
                >
                  Session Message
                </label>
                <input
                  type="text"
                  id="sessionMessage"
                  name="sessionMessage"
                  value={sessionMessage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="eventId"
                  className="block text-sm font-medium text-black text-center"
                >
                  Event ID
                </label>
                <input
                  type="text"
                  id="eventId"
                  name="eventId"
                  value={eventId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="bookmakerMessage"
                  className="block text-sm font-medium text-black text-center"
                >
                  Bookmaker Message
                </label>
                <input
                  type="text"
                  id="bookmakerMessage"
                  name="bookmakerMessage"
                  value={bookmakerMessage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="tossMessage"
                  className="block text-sm font-medium text-black text-center"
                >
                  Toss Message
                </label>
                <input
                  type="text"
                  id="tossMessage"
                  name="tossMessage"
                  value={tossMessage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="marketId"
                  className="block text-sm font-medium text-black text-center"
                >
                  Market ID
                </label>
                <input
                  type="text"
                  id="marketId"
                  name="marketId"
                  value={marketId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatchModal;
