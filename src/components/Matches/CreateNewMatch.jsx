import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateField,
  updateNestedField,
  resetForm,
} from "../../Store/createMatchSlice.js";

const CreateNewMatch = () => {
  const formState = useSelector((state) => state.createMatch);
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleNestedInputChange = (section, field, value) => {
    dispatch(updateNestedField({ section, field, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formState);
    // Dispatch an API call here if needed
    dispatch(resetForm());
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

      {/* Additional inputs for delays, stakes, messages, statuses, etc. */}

      <div className="col-span-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateNewMatch;
