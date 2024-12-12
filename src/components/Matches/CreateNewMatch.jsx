import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../../Store/Slice/createMatchSlice";
import { createNewMatchAPIAuth,getCreateNewMatchAPIAuth } from "../../Services/Newmatchapi"; // Use your actual API service here

const CreateNewMatch = () => {
  const formState = useSelector((state) => state.createMatch);
  const dispatch = useDispatch();

  const [sportsOptions, setSportsOptions] = useState([]);
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [matchOptions, setMatchOptions] = useState([]);

  useEffect(() => {
    // Fetch options for sports, leagues, and matches
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("admin/v1/games/getgames");
      
        if (response.status === 200) {
          setSportsOptions(response.data.data || []); // Adjust based on API response
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    const fetchLeagues = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("admin/v1/series/getseries");
        console.log(response)
        if (response.status === 200) {
          setLeagueOptions(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
      }
    };

    // const fetchMatches = async () => {
    //   try {
    //     const response = await getCreateNewMatchAPIAuth("admin/v1/match/getmatches");
    //     console.log("hii",response)
    //     if (response.status === 200) {
    //       setMatchOptions(response.data.data|| []);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching matches:", error);
    //   }
    // };

    fetchSports();
    fetchLeagues();
    // fetchMatches();
  }, []);

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
      const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState);
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
        {/* Dynamic Fields */}
        <div>
          <label className="block text-gray-700 text-lg font-bold mb-1">Select Sport</label>
          <select
            value={formState.sport}
            onChange={(e) => handleInputChange("sport", e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport._id} value={sport.name}>
                {sport.name} {/* Display the name here */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-lg font-bold mb-1">Select League</label>
          <select
            value={formState.league}
            onChange={(e) => handleInputChange("league", e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select League</option>
            {leagueOptions.map((league) => (
              <option key={league.id} value={league.name}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-lg font-bold mb-1">Select Match</label>
          <select
            value={formState.match}
            onChange={(e) => handleInputChange("match", e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Match</option>
            {matchOptions.map((match) => (
              <option key={match.id} value={match.name}>
                {match.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rest of the form fields */}
        {[
          { label: "Market Type", field: "marketType" },
          { label: "MarketID", field: "marketID" },
          { label: "Team 1", field: "team1" },
          { label: "Team 2", field: "team2" },
          { label: "Runners", field: "runners" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-gray-700 text-lg font-bold mb-1">{label}</label>
            <input
              type="text"
              value={formState[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
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
                <span className="text-gray-700">Inactive</span>
              </label>
            </div>
          </div>
        ))}
        <div className="col-span-4 flex justify-center items-center mt-4">
          <button
            type="submit"
            className="bg-lightblue text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateNewMatch;


