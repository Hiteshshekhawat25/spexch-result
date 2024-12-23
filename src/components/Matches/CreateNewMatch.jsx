import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField, resetForm } from "../../Store/Slice/createMatchSlice";
import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth,putUpdateMatchAPIAuth} from "../../Services/Newmatchapi";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateNewMatch = () => {
  const formState = useSelector((state) => state.createMatch);
  const dispatch = useDispatch();

  const [sportsOptions, setSportsOptions] = useState([]);
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [matchOptions, setMatchOptions] = useState([]);

  useEffect(() => {
    // Fetch sports options
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
    fetchSports();
  }, []);

  useEffect(() => {
    if (formState.sport) {
      // Fetch leagues based on selected sport (using gameId)
      const fetchLeagues = async () => {
        try {
          console.log("Fetching leagues for sport:", formState.sport); // Debug log
          const response = await getCreateNewMatchAPIAuth(`admin/v1/series/getseries/${String(formState.sport)}`);
          console.log("Leagues response:", response); // Debug log
          if (response.status === 200) {
            setLeagueOptions(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching leagues:", error);
        }
      };
      fetchLeagues();
    } else {
      setLeagueOptions([]);
    }
  }, [formState.sport]); // Re-fetch leagues when sport changes

  useEffect(() => {
    if (formState.league) {
      // Fetch matches based on selected league
      const fetchMatches = async () => {
        try {
          console.log("Fetching matches for league:", formState.league); // Debug log
          const response = await getCreateNewMatchAPIAuth(`admin/v1/match/getmatches/${String(formState.league)}`);
          console.log("Matches response:", response); // Debug log
          if (response.status === 200) {
            setMatchOptions(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching matches:", error);
        }
      };
      fetchMatches();
    } else {
      setMatchOptions([]);
    }
  }, [formState.league]); // Re-fetch matches when league changes

  useEffect(() => {
    if (formState.match) {
      // Fetch match details based on selected match
      const fetchMatchDetails = async () => {
        try {
          const response = await getCreateNewMatchAPIAuth(`admin/v1/match/getmatchdetails/${String(formState.match)}`);
          if (response.status === 200) {
            console.log(response)
            const matchDetails = response.data;
            console.log(matchDetails)
            const marketType = matchDetails[0]?.marketType; 
            console.log("hiii",marketType)
            
            
            // Auto-fill form fields with match details
            dispatch(updateField({ field: "marketType", value: matchDetails[0]?.marketType }));
            dispatch(updateField({ field: "marketID", value: matchDetails[0]?.marketID }));
            dispatch(updateField({ field: "team1", value: matchDetails[0]?.team1 })); // Ensure matchDetails[0]
            dispatch(updateField({ field: "team2", value: matchDetails[0]?.team2 })); // Ensure matchDetails[0]
            dispatch(updateField({ field: "runners", value: matchDetails[0]?.runners })); // Ensure matchDetails[0]
            dispatch(updateField({ field: "oddsDelay", value: matchDetails[0]?.oddsDelay }));
            dispatch(updateField({ field: "sessionDelay", value: matchDetails[0]?.sessionDelay }));
            dispatch(updateField({ field: "bookDelay", value: matchDetails[0]?.bookDelay }));
            dispatch(updateField({ field: "tossDelay", value: matchDetails[0]?.tossDelay }));
            dispatch(updateField({ field: "oddsMinStake", value: matchDetails[0]?.oddsMinStake }));
            dispatch(updateField({ field: "oddsMaxStake", value: matchDetails[0]?.oddsMaxStake }));
            dispatch(updateField({ field: "sessionMinStake", value: matchDetails[0]?.sessionMinStake }));
            dispatch(updateField({ field: "sessionMaxStake", value: matchDetails[0]?.sessionMaxStake }));
            dispatch(updateField({ field: "bookMinStake", value: matchDetails[0]?.bookMinStake }));
            dispatch(updateField({ field: "bookMaxStake", value: matchDetails[0]?.bookMaxStake }));
            dispatch(updateField({ field: "tossMinStake", value: matchDetails[0]?.tossMinStake }));
            dispatch(updateField({ field: "tossMaxStake", value: matchDetails[0]?.tossMaxStake }));
            dispatch(updateField({ field: "matchStatus", value: matchDetails[0]?.matchStatus }));
            dispatch(updateField({ field: "sessionStatus", value: matchDetails[0]?.sessionStatus }));
            dispatch(updateField({ field: "bookmakerStatus", value: matchDetails[0]?.bookmakerStatus }));
            dispatch(updateField({ field: "tossStatus", value: matchDetails[0]?.tossStatus }));
            dispatch(updateField({ field: "oddsStatus", value: matchDetails[0]?.oddsStatus }));
            
          }
        } catch (error) {
          console.error("Error fetching match details:", error);
        }
      };
      fetchMatchDetails();
    }
  }, [formState.match, dispatch]); // Fetch match details when match changes

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleCheckboxChange = (field, value) => {
    dispatch(updateField({
      field,
      value: value === "active" ? "inactive" : "active", // Toggle between 'active' and 'inactive'
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState);
  //     if (response.status === 200) {
  //       toast.success("Form submitted successfully!");
  //       dispatch(resetForm()); // Reset form on success
  //     } else {
  //       toast.error("Failed to submit the form. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast.error("An error occurred. Please try again later.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
      if (formState.match) {
        // Update the match if formState.match is not empty (i.e., an existing match is selected)
        response = await putUpdateMatchAPIAuth(
          `admin/v1/match/updatematch/${formState.match}`,
          formState
        );
        if (response.status === 200) {
          toast.success("Form updated successfully!");
        }
      } else {
        // Create a new match if formState.match is empty (i.e., no match selected)
        response = await createNewMatchAPIAuth(
          "admin/v1/match/creatematch",
          formState
        );
        if (response.status === 200) {
          toast.success("Form submitted successfully!");
          dispatch(resetForm()); // Reset form on success
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
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
              <option key={sport._id} value={sport.gameId}>
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
              <option key={league._id} value={league.id}>
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
              <option key={match.id} value={match._id}>
                {match.Match}
              </option>
            ))}
          </select>
        </div>

        {/* Rest of the form fields */}
        {[{ label: "Market Type", field: "marketType" }, { label: "MarketID", field: "marketID" }, { label: "Team 1", field: "team1" }, { label: "Team 2", field: "team2" }, { label: "Runners", field: "runners" }].map(({ label, field }) => (
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
        {["oddsMinStake", "oddsMaxStake", "sessionMinStake", "sessionMaxStake", "bookMinStake", "bookMaxStake", "tossMinStake", "tossMaxStake"].map((field) => (
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


// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { updateField, resetForm } from "../../Store/Slice/createMatchSlice";
// import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth } from "../../Services/Newmatchapi"; 
// import { ToastContainer, toast } from 'react-toastify';
//   import 'react-toastify/dist/ReactToastify.css';

// const CreateNewMatch = () => {

//   const formState = useSelector((state) => state.createMatch);
//   const dispatch = useDispatch();

//   const [sportsOptions, setSportsOptions] = useState([]);
//   const [leagueOptions, setLeagueOptions] = useState([]);
//   const [matchOptions, setMatchOptions] = useState([]);

//   useEffect(() => {
//     // Fetch sports options
//     const fetchSports = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth("admin/v1/games/getgames");
//         if (response.status === 200) {
//           setSportsOptions(response.data.data || []); // Adjust based on API response
//         }
//       } catch (error) {
//         console.error("Error fetching sports:", error);
//       }
//     };

//     fetchSports();
//   }, []);

//   useEffect(() => {
//     if (formState.sport) {
//       // Fetch leagues based on selected sport (using gameId)
//       const fetchLeagues = async () => {
//         try {
//           console.log("Fetching leagues for sport:", formState.sport); // Debug log
//           const response = await getCreateNewMatchAPIAuth(`admin/v1/series/getseries/${String(formState.sport)}`);
//           console.log("Leagues response:", response); // Debug log
//           if (response.status === 200) {
//             setLeagueOptions(response.data.data || []);
//           }
//         } catch (error) {
//           console.error("Error fetching leagues:", error);
//         }
//       };
  
//       fetchLeagues();
//     } else {
//       setLeagueOptions([]);
//     }
//   }, [formState.sport]); // Re-fetch leagues when sport changes
  
//   useEffect(() => {
//     if (formState.league) {
//       // Fetch matches based on selected league
//       const fetchMatches = async () => {
//         try {
//           console.log("Fetching matches for league:", formState.league); // Debug log
//           const response = await getCreateNewMatchAPIAuth(`admin/v1/match/getmatches/${String(formState.league)}`);
//           console.log("Matches response:", response); // Debug log
//           if (response.status === 200) {
//             setMatchOptions(response.data.data || []);
//           }
//         } catch (error) {
//           console.error("Error fetching matches:", error);
//         }
//       };
  
//       fetchMatches();
//     } else {
//       setMatchOptions([]);
//     }
//   }, [formState.league]); // Re-fetch matches when league changes
  

//   const handleInputChange = (field, value) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleCheckboxChange = (field, value) => {
//     dispatch(updateField({
//       field,
//       value: value === "active" ? "inactive" : "active", // Toggle between 'active' and 'inactive'
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState);
//   //     if (response.status === 200) {
//   //       alert("Form submitted successfully!");
//   //       dispatch(resetForm()); // Reset form on success
//   //     } else {
//   //       alert("Failed to submit the form. Please try again.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     alert("An error occurred. Please try again later.");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createNewMatchAPIAuth("admin/v1/match/creatematch", formState);
//       if (response.status === 200) {
//         toast.success("Form submitted successfully!");
//         dispatch(resetForm()); // Reset form on success
//       } else {
//         toast.error("Failed to submit the form. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error("An error occurred. Please try again later.");
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded">
//       <div className="grid grid-cols-4 gap-4">
//         {/* Dynamic Fields */}
//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Select Sport</label>
//           <select
//             value={formState.sport}
//             onChange={(e) => handleInputChange("sport", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           >
//             <option value="">Select Sport</option>
//             {sportsOptions.map((sport) => (
//               <option key={sport._id} value={sport.gameId}>
//                 {sport.name} {/* Display the name here */}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Select League</label>
//           <select
//             value={formState.league}
//             onChange={(e) => handleInputChange("league", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           >
//             <option value="">Select League</option>
//             {leagueOptions.map((league) => (
//               <option key={league._id} value={league.id}>
//                 {league.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 text-lg font-bold mb-1">Select Match</label>
//           <select
//             value={formState.match}
//             onChange={(e) => handleInputChange("match", e.target.value)}
//             className="w-full border border-gray-300 rounded p-2"
//           >
//             <option value="">Select Match</option>
//             {matchOptions.map((match) => (
//               <option key={match.id} value={match.Match}>
//                 {match.Match}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Rest of the form fields */}
//         {[{ label: "Market Type", field: "marketType" }, { label: "MarketID", field: "marketID" }, { label: "Team 1", field: "team1" }, { label: "Team 2", field: "team2" }, { label: "Runners", field: "runners" }].map(({ label, field }) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{label}</label>
//             <input
//               type="text"
//               value={formState[field]}
//               onChange={(e) => handleInputChange(field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Delays */}
//         {["oddsDelay", "sessionDelay", "bookDelay", "tossDelay"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState[field]}
//               onChange={(e) => handleInputChange(field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Stakes */}
//         {["oddsMinStake", "oddsMaxStake", "sessionMinStake", "sessionMaxStake", "bookMinStake", "bookMaxStake", "tossMinStake", "tossMaxStake"].map((field) => (
//           <div key={field}>
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <input
//               type="text"
//               value={formState[field]}
//               onChange={(e) => handleInputChange(field, e.target.value)}
//               className="w-full border border-gray-300 rounded p-2"
//             />
//           </div>
//         ))}

//         {/* Statuses - Active/Inactive */}
//         {["matchStatus", "sessionStatus", "bookmakerStatus", "tossStatus", "oddsStatus"].map((field) => (
//           <div key={field} className="flex flex-col">
//             <label className="block text-gray-700 text-lg font-bold mb-1">{field}</label>
//             <div className="flex space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name={field}
//                   value="active"
//                   checked={formState[field] === "active"}
//                   onChange={(e) => handleInputChange(field, e.target.value)}
//                   className="h-5 w-5"
//                 />
//                 <span className="text-gray-700">Active</span>
//               </label>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   name={field}
//                   value="inactive"
//                   checked={formState[field] === "inactive"}
//                   onChange={(e) => handleInputChange(field, e.target.value)}
//                   className="h-5 w-5"
//                 />
//                 <span className="text-gray-700">Inactive</span>
//               </label>
//             </div>
//           </div>
//         ))}
//         <div className="col-span-4 flex justify-center items-center mt-4">
//           <button
//             type="submit"
//             className="bg-lightblue text-white px-6 py-2 rounded hover:bg-blue-600"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CreateNewMatch;

