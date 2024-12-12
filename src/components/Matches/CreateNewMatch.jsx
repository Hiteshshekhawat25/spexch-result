import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../../Store/Slice/createMatchSlice";
import { createNewMatchAPIAuth } from "../../Services/Newmatchapi"; // Use your actual API service here

const CreateNewMatch = () => {
  const formState = useSelector((state) => state.createMatch);
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleCheckboxChange = (field, value) => {
    dispatch(updateField({
      field,
      value: value === "active" ? "inactive" : "active", // Toggle between 'active' and 'inactive'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState); // Replace with actual API endpoint
      if (response.status === 200) {
        alert("Form submitted successfully!");
        dispatch(resetForm()); // Reset form on success
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded">
      <div className="grid grid-cols-4 gap-4">
        {/* Basic Fields */}
        {[
          { label: "Select Sport", field: "sport", type: "select", options: ["Cricket", "Football"] },
          { label: "Select League", field: "league" },
          { label: "Select Match", field: "match" },
          { label: "Market Type", field: "marketType" },
          { label: "MarketID", field: "marketID" },
          { label: "Team 1", field: "team1" },
          { label: "Team 2", field: "team2" },
          { label: "Runners", field: "runners" },
        ].map(({ label, field, type, options }) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{label}</label>
            {type === "select" ? (
              <select
                value={formState[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formState[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            )}
          </div>
        ))}

        {/* Delays */}
        {["oddsDelay", "sessionDelay", "bookDelay", "tossDelay"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
            <input
              type="text"
              value={formState[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}

        {/* Stakes */}
        {[
          "oddsMinStake",
          "oddsMaxStake",
          "sessionMinStake",
          "sessionMaxStake",
          "bookMinStake",
          "bookMaxStake",
          "tossMinStake",
          "tossMaxStake",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
            <input
              type="text"
              value={formState[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}

        {/* Profits */}
        {["oddsMaxProfit", "sessionMaxProfit", "bookMaxProfit", "tossMaxProfit"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
            <input
              type="text"
              value={formState[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}

        {/* Messages */}
        {["oddsMessage", "bookmakerMessage", "sessionMessage", "tossMessage"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
            <input
              type="text"
              value={formState[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}

        {/* Statuses - Active/Inactive */}
        {["matchStatus", "sessionStatus", "bookmakerStatus", "tossStatus", "oddsStatus"].map((field) => (
  <div key={field} className="flex flex-col">
    <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
    <div className="flex space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name={field}
          value="active"
          checked={formState[field] === "active"}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="h-5 w-5"
        />
        <span className="text-gray-700">Active</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name={field}
          value="inactive"
          checked={formState[field] === "inactive"}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="h-5 w-5"
        />
        <span className="text-gray-700">Deactive</span>
      </label>
    </div>
  </div>
))}

        {/* Submit Button */}
        <div className="col-span-4 flex justify-center items-center mt-4">
          <button
            type="submit"
            className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateNewMatch;

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { updateField,  resetForm } from "../../Store/Slice/createMatchSlice";
// import { createNewMatchAPIAuth } from "../../Services/Newmatchapi"; // Use your actual API service here

// const CreateNewMatch = () => {
//   const formState = useSelector((state) => state.createMatch);
//   const dispatch = useDispatch();

//   const handleInputChange = (field, value) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleNestedInputChange = (section, field, value) => {
//     dispatch(updateNestedField({ section, field, value }));
//   };

//   const handleCheckboxChange = (section, field, value) => {
//     dispatch(updateNestedField({
//       section, 
//       field, 
//       value: value === "active" ? "inactive" : "active" // Toggle between 'active' and 'inactive'
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState); // Replace with actual API endpoint
//       if (response.status === 200) {
//         alert("Form submitted successfully!");
//         dispatch(resetForm()); // Reset form on success
//       } else {
//         alert("Failed to submit the form. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded">
//       <div className="grid grid-cols-4 gap-4">
//         {/* Sport, League, Match, Market Type */}
//         <div>
//           <label className="block text-gray-700 text-md font-bold mb-1">Select Sport</label>
//           <select
//             value={formState.sport}
//             onChange={(e) => handleInputChange("sport", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           >
//             <option value="">Select</option>
//             <option value="Cricket">Cricket</option>
//             <option value="Football">Football</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Select League</label>
//           <input
//             type="text"
//             value={formState.league}
//             onChange={(e) => handleInputChange("league", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Select Match</label>
//           <input
//             type="text"
//             value={formState.match}
//             onChange={(e) => handleInputChange("match", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Market Type</label>
//           <input
//             type="text"
//             value={formState.marketType}
//             onChange={(e) => handleInputChange("marketType", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>

//         {/* Market ID, Team 1, Team 2 */}
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">MarketID</label>
//           <input
//             type="text"
//             value={formState.marketID}
//             onChange={(e) => handleInputChange("marketID", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Team 1</label>
//           <input
//             type="text"
//             value={formState.team1}
//             onChange={(e) => handleInputChange("team1", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Team 2</label>
//           <input
//             type="text"
//             value={formState.team2}
//             onChange={(e) => handleInputChange("team2", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Runners</label>
//           <input
//             type="text"
//             value={formState.team2}
//             onChange={(e) => handleInputChange("team2", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>

//         {/* Delays (odds, session, book, toss) */}
//         {["odds", "session", "book", "toss"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState.delays[field]}
//               onChange={(e) => handleNestedInputChange("delays", field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Stakes */}
//         {["oddsMin", "oddsMax", "sessionMin", "sessionMax", "bookMin", "bookMax", "tossMin", "tossMax"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState.stakes[field]}
//               onChange={(e) => handleNestedInputChange("stakes", field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Profits */}
//         {["oddsMax", "sessionMax", "bookMax", "tossMax"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState.profits[field]}
//               onChange={(e) => handleNestedInputChange("profits", field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Messages */}
//         {["odds", "bookmaker", "session", "toss"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState.messages[field]}
//               onChange={(e) => handleNestedInputChange("messages", field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Statuses - Checkboxes for Active/Inactive */}
//         {/* {["match", "session", "bookmaker", "toss", "odds"].map((field) => (
//           <div key={field} className="flex items-center space-x-2">
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="checkbox"
//               checked={formState.statuses[field] === "active"}
//               onChange={(e) => handleCheckboxChange("statuses", field, e.target.checked)}
//               className="h-5 w-5"
//             />
//             <span>{formState.statuses[field] === "active" ? "Active" : "Inactive"}</span>
//           </div>
//         ))} */}
//        {["match", "session", "bookmaker", "toss", "odds"].map((field) => (
//   <div key={field} className="flex items-center space-x-4">
//     <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
    
//     {/* Active Checkbox */}
//     <div className="flex items-center space-x-2">
//       <input
//         type="checkbox"
//         id={`${field}-active`}
//         checked={formState.statuses[field] === "active"}
//         onChange={() => handleCheckboxChange("statuses", field, formState.statuses[field])}
//         className="h-5 w-5"
//       />
//       <label htmlFor={`${field}-active`} className="text-gray-700">Active</label>
//     </div>

//     {/* Inactive Checkbox */}
//     <div className="flex items-center space-x-2">
//       <input
//         type="checkbox"
//         id={`${field}-inactive`}
//         checked={formState.statuses[field] === "inactive"}
//         onChange={() => handleCheckboxChange("statuses", field, formState.statuses[field])}
//         className="h-5 w-5"
//       />
//       <label htmlFor={`${field}-inactive`} className="text-gray-700">Inactive</label>
//     </div>
//   </div>
// ))}

//         {/* Submit Button */}
//         <div className="col-span-4 flex justify-center items-center mt-4">
//           <button
//             type="submit"
//             className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CreateNewMatch;




// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { updateField, updateNestedField, resetForm } from "../../Store/Slice/createMatchSlice";
// import { createNewMatchAPIAuth } from "../../Services/Newmatchapi";

// const CreateNewMatch = () => {
//   const formState = useSelector((state) => state.createMatch);
//   const dispatch = useDispatch();

//   const handleInputChange = (field, value) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleNestedInputChange = (section, field, value) => {
//     dispatch(updateNestedField({ section, field, value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState); // Replace with actual API endpoint

//       if (response.status === 200) {
//         alert("Form submitted successfully!");
//         dispatch(resetForm()); // Reset form on success
//       } else {
//         alert("Failed to submit the form. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded"
//     >
//       <div className="grid grid-cols-4 gap-4">
//         {/* Sport, League, Match, Market Type */}
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Select Sport</label>
//           <select
//             value={formState.sport}
//             onChange={(e) => handleInputChange("sport", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           >
//             <option value="">Select</option>
//             <option value="Cricket">Cricket</option>
//             <option value="Football">Football</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Select League</label>
//           <input
//             type="text"
//             value={formState.league}
//             onChange={(e) => handleInputChange("league", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Select Match</label>
//           <input
//             type="text"
//             value={formState.match}
//             onChange={(e) => handleInputChange("match", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Market Type</label>
//           <input
//             type="text"
//             value={formState.marketType}
//             onChange={(e) => handleInputChange("marketType", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>

//         {/* Market ID, Team 1, Team 2 */}
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">MarketID</label>
//           <input
//             type="text"
//             value={formState.marketID}
//             onChange={(e) => handleInputChange("marketID", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Team 1</label>
//           <input
//             type="text"
//             value={formState.team1}
//             onChange={(e) => handleInputChange("team1", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-2">Team 2</label>
//           <input
//             type="text"
//             value={formState.team2}
//             onChange={(e) => handleInputChange("team2", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           />
//         </div>

//         {/* Additional inputs for delays, stakes, messages, and statuses */}
//         <div className="col-span-4">
//           <h3 className="text-xl font-bold mb-4">Delays</h3>
//           <div className="grid grid-cols-4 gap-4">
//             {["odds", "session", "book", "toss"].map((field) => (
//               <div key={field}>
//                 <label className="block text-gray-700 text-lg font-bold mb-2">{field}</label>
//                 <input
//                   type="text"
//                   value={formState.delays[field]}
//                   onChange={(e) => handleNestedInputChange("delays", field, e.target.value)}
//                   className="w-full border border-gray-300 rounded p-2"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="col-span-4 flex justify-between items-center">
//           <button
//             type="submit"
//             className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CreateNewMatch;

