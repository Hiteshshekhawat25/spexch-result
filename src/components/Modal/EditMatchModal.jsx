import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { updateField, resetForm } from "../../Store/Slice/editMatchSlice"; // Ensure the correct path
import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; // Ensure this import is correct
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
        {/* Close Icon */}
        <div className="bg-gray-200 p-3 rounded-t-lg flex justify-end items-center">
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-gray-700 text-2xl"
          />
        </div>

        {/* Edit Match Heading */}
        <div className="flex justify-between items-center border-b pb-3 mt-4">
          <h2 className="text-gray-700 text-xl font-semibold">Edit Match</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="oddsMessage" className="block text-sm font-medium text-black">
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
                <label htmlFor="sessionMessage" className="block text-sm font-medium text-black">
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
                <label htmlFor="eventId" className="block text-sm font-medium text-black">
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
                <label htmlFor="bookmakerMessage" className="block text-sm font-medium text-black">
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
                <label htmlFor="tossMessage" className="block text-sm font-medium text-black">
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
                <label htmlFor="marketId" className="block text-sm font-medium text-black">
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

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IoClose } from "react-icons/io5";
// import { updateField, resetForm } from "../../Store/Slice/editMatchSlice"; // Ensure the correct path
// import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; // Ensure this import is correct
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditMatchModal = ({ onCancel, onSubmit, match }) => {
//   const dispatch = useDispatch();

//   // Get form values from Redux state
//   const {
//     oddsMessage = "",
//     sessionMessage = "",
//     eventId = "",
//     bookmakerMessage = "",
//     tossMessage = "",
//     marketId = "",
//   } = useSelector((state) => state.editMatch || {});

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(updateField({ name, value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       oddsMessage,
//       sessionMessage,
//       eventId,
//       bookmakerMessage,
//       tossMessage,
//       marketId,
//     };

//     try {
//       if (!match || !match._id) {
//         toast.error("Match ID is missing.", { position: "top-center" });
//         return;
//       }

//       const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);

//       if (response.status === 200) {
//         toast.success("Match updated successfully!", { position: "top-center" });
//         onCancel(); // Close modal
//         dispatch(resetForm()); // Reset Redux state
//       } else {
//         toast.error("Failed to update match. Please try again.", { position: "top-center" });
//       }
//     } catch (error) {
//       console.error("Error updating match:", error);
//       toast.error("An error occurred while updating the match.", { position: "top-center" });
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
//         {/* Close Icon */}
//         <div className="bg-gray-200 p-3 rounded-t-lg flex justify-end items-center">
//           <IoClose
//             onClick={onCancel}
//             className="cursor-pointer text-gray-700 text-2xl"
//           />
//         </div>

//         {/* Edit Match Heading */}
//         <div className="flex justify-between items-center border-b pb-3 mt-4">
//           <h2 className="text-gray-700 text-xl font-semibold">Edit Match</h2>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="oddsMessage" className="block text-sm font-medium text-black">
//                   Odds Message
//                 </label>
//                 <input
//                   type="text"
//                   id="oddsMessage"
//                   name="oddsMessage"
//                   value={oddsMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="sessionMessage" className="block text-sm font-medium text-black">
//                   Session Message
//                 </label>
//                 <input
//                   type="text"
//                   id="sessionMessage"
//                   name="sessionMessage"
//                   value={sessionMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="eventId" className="block text-sm font-medium text-black">
//                   Event ID
//                 </label>
//                 <input
//                   type="text"
//                   id="eventId"
//                   name="eventId"
//                   value={eventId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="bookmakerMessage" className="block text-sm font-medium text-black">
//                   Bookmaker Message
//                 </label>
//                 <input
//                   type="text"
//                   id="bookmakerMessage"
//                   name="bookmakerMessage"
//                   value={bookmakerMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="tossMessage" className="block text-sm font-medium text-black">
//                   Toss Message
//                 </label>
//                 <input
//                   type="text"
//                   id="tossMessage"
//                   name="tossMessage"
//                   value={tossMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="marketId" className="block text-sm font-medium text-black">
//                   Market ID
//                 </label>
//                 <input
//                   type="text"
//                   id="marketId"
//                   name="marketId"
//                   value={marketId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMatchModal;


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IoClose } from "react-icons/io5";
// import { updateField, resetForm } from "../../Store/Slice/editMatchSlice";

// const EditMatchModal = ({ onCancel , onSubmit}) => {
//   const dispatch = useDispatch();

//   const { oddsMessage = '', sessionMessage = '', eventId = '', bookmakerMessage = '', tossMessage = '', marketId = '' } = useSelector(
//     (state) => state.editMatch || {}
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form data submitted:", {
//       oddsMessage,
//       sessionMessage,
//       eventId,
//       bookmakerMessage,
//       tossMessage,
//       marketId,
//     });
//     onCancel(); // Close the modal on successful submit
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
//         {/* Close Icon */}
//         <div className="bg-whiteGray p-3 rounded-t-lg flex justify-end items-center">
//                   <IoClose
//                     onClick={onCancel}
//                     className="cursor-pointer text-white text-2xl"
//                   />
//                 </div>
        
//                 {/* Edit Stake Heading */}
//                 <div className="flex justify-between items-center border-b pb-3 mt-4">
//                   <h2 className="text-gray-700 text-xl font-semibold">Edit Match </h2>
//                 </div>

    
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="oddsMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Odds Message
//                 </label>
//                 <input
//                   type="text"
//                   id="oddsMessage"
//                   name="oddsMessage"
//                   value={oddsMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="sessionMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Session Message
//                 </label>
//                 <input
//                   type="text"
//                   id="sessionMessage"
//                   name="sessionMessage"
//                   value={sessionMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="eventId"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Event ID
//                 </label>
//                 <input
//                   type="text"
//                   id="eventId"
//                   name="eventId"
//                   value={eventId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="bookmakerMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Bookmaker Message
//                 </label>
//                 <input
//                   type="text"
//                   id="bookmakerMessage"
//                   name="bookmakerMessage"
//                   value={bookmakerMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="tossMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Toss Message
//                 </label>
//                 <input
//                   type="text"
//                   id="tossMessage"
//                   name="tossMessage"
//                   value={tossMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="marketId"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Market ID
//                 </label>
//                 <input
//                   type="text"
//                   id="marketId"
//                   name="marketId"
//                   value={marketId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMatchModal;

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateField, resetForm } from "../../Store/Slice/editMatchSlice";

// const EditMatchModal = ({ onCancel , onSubmit}) => {
//   const dispatch = useDispatch();

//   const { oddsMessage = '', sessionMessage = '', eventId = '', bookmakerMessage = '', tossMessage = '', marketId = '' } = useSelector(
//     (state) => state.editMatch || {}
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form data submitted:", {
//       oddsMessage,
//       sessionMessage,
//       eventId,
//       bookmakerMessage,
//       tossMessage,
//       marketId,
//     });
//     onCancel(); // Close the modal on successful submit
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
//         {/* Close Icon */}
//         <button
//           onClick={onCancel}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//             stroke="currentColor"
//             className="w-6 h-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         <h2 className="text-2xl font-semibold mb-4 text-center">Edit Match Details</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="oddsMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Odds Message
//                 </label>
//                 <input
//                   type="text"
//                   id="oddsMessage"
//                   name="oddsMessage"
//                   value={oddsMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="sessionMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Session Message
//                 </label>
//                 <input
//                   type="text"
//                   id="sessionMessage"
//                   name="sessionMessage"
//                   value={sessionMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="eventId"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Event ID
//                 </label>
//                 <input
//                   type="text"
//                   id="eventId"
//                   name="eventId"
//                   value={eventId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="bookmakerMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Bookmaker Message
//                 </label>
//                 <input
//                   type="text"
//                   id="bookmakerMessage"
//                   name="bookmakerMessage"
//                   value={bookmakerMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="tossMessage"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Toss Message
//                 </label>
//                 <input
//                   type="text"
//                   id="tossMessage"
//                   name="tossMessage"
//                   value={tossMessage}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="marketId"
//                   className="block text-sm font-medium text-black text-center"
//                 >
//                   Market ID
//                 </label>
//                 <input
//                   type="text"
//                   id="marketId"
//                   name="marketId"
//                   value={marketId}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="submit"
//               className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMatchModal;
