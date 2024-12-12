import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateField,
  updateNestedField,
  resetForm,
} from "../../Store/Slice/createManualMatchSlice";
import { createNewMatchAPIAuth } from "../../Services/Newmatchapi"; // Use your actual API service here

const CreateManualMatch = () => {
  const formState = useSelector((state) => state.createManualMatch);
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleNestedInputChange = (section, field, value) => {
    dispatch(updateNestedField({ section, field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createNewMatchAPIAuth("admin/v1/match/creatematchmanual", formState); // Replace with actual API endpoint
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
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4">
      <div>
        <label className="block">Select Sport</label>
        <select
          value={formState.sport}
          onChange={(e) => handleInputChange("sport", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select</option>
          <option value="Cricket">Cricket</option>
          <option value="Football">Football</option>
        </select>
      </div>
      <div>
        <label className="block">Select League</label>
        <input
          type="text"
          value={formState.league}
          onChange={(e) => handleInputChange("league", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Select Match</label>
        <input
          type="text"
          value={formState.match}
          onChange={(e) => handleInputChange("match", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Market Type</label>
        <input
          type="text"
          value={formState.marketType}
          onChange={(e) => handleInputChange("marketType", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">MarketID</label>
        <input
          type="text"
          value={formState.marketID}
          onChange={(e) => handleInputChange("marketID", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Event ID</label>
        <input
          type="text"
          value={formState.eventID}
          onChange={(e) => handleInputChange("eventID", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Team 1</label>
        <input
          type="text"
          value={formState.team1}
          onChange={(e) => handleInputChange("team1", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Team 2</label>
        <input
          type="text"
          value={formState.team2}
          onChange={(e) => handleInputChange("team2", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Delays */}
      <div>
        <label className="block">Odds Delay</label>
        <input
          type="text"
          value={formState.delays.odds}
          onChange={(e) => handleNestedInputChange("delays", "odds", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Session Delay</label>
        <input
          type="text"
          value={formState.delays.session}
          onChange={(e) => handleNestedInputChange("delays", "session", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Book Delay</label>
        <input
          type="text"
          value={formState.delays.book}
          onChange={(e) => handleNestedInputChange("delays", "book", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Stakes */}
      <div>
        <label className="block">Odds Min</label>
        <input
          type="text"
          value={formState.stakes.oddsMin}
          onChange={(e) => handleNestedInputChange("stakes", "oddsMin", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Odds Max</label>
        <input
          type="text"
          value={formState.stakes.oddsMax}
          onChange={(e) => handleNestedInputChange("stakes", "oddsMax", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Session Min</label>
        <input
          type="text"
          value={formState.stakes.sessionMin}
          onChange={(e) => handleNestedInputChange("stakes", "sessionMin", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Session Max</label>
        <input
          type="text"
          value={formState.stakes.sessionMax}
          onChange={(e) => handleNestedInputChange("stakes", "sessionMax", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Book Min</label>
        <input
          type="text"
          value={formState.stakes.bookMin}
          onChange={(e) => handleNestedInputChange("stakes", "bookMin", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Book Max</label>
        <input
          type="text"
          value={formState.stakes.bookMax}
          onChange={(e) => handleNestedInputChange("stakes", "bookMax", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Submit Button */}
      <div className="col-span-1 flex justify-center items-center mt-4">
        <button
          type="submit"
          className="bg-blue text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateManualMatch;

// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   updateField,
//   updateNestedField,
//   resetForm,
// } from "../../Store/Slice/createManualMatchSlice";
// import { createNewMatchAPIAuth } from "../../Services/Newmatchapi"; // Use your actual API service here

// const CreateManualMatch = () => {
//   const formState = useSelector((state) => state.createManualMatch);
//   const dispatch = useDispatch();

//   const handleInputChange = (field, value) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleNestedInputChange = (section, field, value) => {
//     dispatch(updateNestedField({ section, field, value }));
//   };

//   const handleCheckboxChange = (section, field, value) => {
//     dispatch(updateNestedField({ section, field, value: value ? "active" : "inactive" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createNewMatchAPIAuth("admin/v1/match/creatematchmanual", formState); // Replace with actual API endpoint
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
//     <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4">
//       <div>
//         <label className="block">Select Sport</label>
//         <select
//           value={formState.sport}
//           onChange={(e) => handleInputChange("sport", e.target.value)}
//           className="border p-2 rounded w-full"
//         >
//           <option value="">Select</option>
//           <option value="Cricket">Cricket</option>
//           <option value="Football">Football</option>
//         </select>
//       </div>
//       <div>
//         <label className="block">Select League</label>
//         <input
//           type="text"
//           value={formState.league}
//           onChange={(e) => handleInputChange("league", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Select Match</label>
//         <input
//           type="text"
//           value={formState.match}
//           onChange={(e) => handleInputChange("match", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Market Type</label>
//         <input
//           type="text"
//           value={formState.marketType}
//           onChange={(e) => handleInputChange("marketType", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">MarketID</label>
//         <input
//           type="text"
//           value={formState.marketID}
//           onChange={(e) => handleInputChange("marketID", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Event ID</label>
//         <input
//           type="text"
//           value={formState.eventID}
//           onChange={(e) => handleInputChange("eventID", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Team 1</label>
//         <input
//           type="text"
//           value={formState.team1}
//           onChange={(e) => handleInputChange("team1", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Team 2</label>
//         <input
//           type="text"
//           value={formState.team2}
//           onChange={(e) => handleInputChange("team2", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       {/* Delays */}
//       <div>
//         <label className="block">Odds Delay</label>
//         <input
//           type="text"
//           value={formState.delays.odds}
//           onChange={(e) => handleNestedInputChange("delays", "odds", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Session Delay</label>
//         <input
//           type="text"
//           value={formState.delays.session}
//           onChange={(e) => handleNestedInputChange("delays", "session", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Book Delay</label>
//         <input
//           type="text"
//           value={formState.delays.book}
//           onChange={(e) => handleNestedInputChange("delays", "book", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       {/* Stakes */}
//       <div>
//         <label className="block">Odds Min</label>
//         <input
//           type="text"
//           value={formState.stakes.oddsMin}
//           onChange={(e) => handleNestedInputChange("stakes", "oddsMin", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Odds Max</label>
//         <input
//           type="text"
//           value={formState.stakes.oddsMax}
//           onChange={(e) => handleNestedInputChange("stakes", "oddsMax", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Session Min</label>
//         <input
//           type="text"
//           value={formState.stakes.sessionMin}
//           onChange={(e) => handleNestedInputChange("stakes", "sessionMin", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Session Max</label>
//         <input
//           type="text"
//           value={formState.stakes.sessionMax}
//           onChange={(e) => handleNestedInputChange("stakes", "sessionMax", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Book Min</label>
//         <input
//           type="text"
//           value={formState.stakes.bookMin}
//           onChange={(e) => handleNestedInputChange("stakes", "bookMin", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Book Max</label>
//         <input
//           type="text"
//           value={formState.stakes.bookMax}
//           onChange={(e) => handleNestedInputChange("stakes", "bookMax", e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       {/* Statuses */}
//       {["match", "session", "bookmaker", "toss", "odds"].map((field) => (
//         <div key={field} className="flex items-center space-x-4">
//           <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>

//           {/* Active Checkbox */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id={`${field}-active`}
//               checked={formState.statuses[field] === "active"}
//               onChange={() => handleCheckboxChange("statuses", field, "active")}
//               className="h-5 w-5"
//             />
//             <label htmlFor={`${field}-active`} className="text-gray-700">Active</label>
//           </div>

//           {/* Inactive Checkbox */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id={`${field}-inactive`}
//               checked={formState.statuses[field] === "inactive"}
//               onChange={() => handleCheckboxChange("statuses", field, "inactive")}
//               className="h-5 w-5"
//             />
//             <label htmlFor={`${field}-inactive`} className="text-gray-700">Inactive</label>
//           </div>
//         </div>
//       ))}

//       {/* Submit Button */}
//       <div className="col-span-4 flex justify-center items-center mt-4">
//         <button
//           type="submit"
//           className="bg-blue text-white px-4 py-2 rounded w-full"
//         >
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateManualMatch;
