import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateField,
  resetForm,
} from "../../Store/Slice/createManualMatchSlice";
import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth } from "../../Services/Newmatchapi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateManualMatch = () => {
  const [sportsOptions, setSportsOptions] = useState([]);
  const formState = useSelector((state) => state.createManualMatch);
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth("games/getgames");
        if (response.status === 200) {
          setSportsOptions(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    fetchSports();
  }, []);

  const handleInputChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  const handleKeyDown = (e, index) => {
    const totalFields = inputRefs.current.length;
    const fieldsPerRow = 4;

    if (e.key === "ArrowUp" && index >= fieldsPerRow) {
      inputRefs.current[index - fieldsPerRow]?.focus();
    } else if (e.key === "ArrowDown" && index < totalFields - fieldsPerRow) {
      inputRefs.current[index + fieldsPerRow]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < totalFields - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createNewMatchAPIAuth(
        "match/creatematchmanual",
        formState
      );
      if (response.status === 200) {
        toast.success("Form submitted successfully!");
        dispatch(resetForm());
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <h1 className="text-2xl font-custom text-center mb-6">
        Create Manual Match
      </h1>
      <div className="p-8 border border-gray-300 rounded-lg bg-white shadow">
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
          {/* Select Sport */}
          <div>
            <label className="block font-custom">Select Sport</label>
            <select
              value={formState.sport}
              onChange={(e) => handleInputChange("sport", e.target.value)}
              className="border p-2 rounded w-full"
              ref={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            >
              <option value="">Select</option>
              {sportsOptions.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          {/* All fields from the Redux slice */}
          {[
            "league",
            "match",
            "marketType",
            "marketID",
            "eventId",
            "team1",
            "team2",
            "team1Selectionid",
            "team2Selectionid",
            "runners",
            "datetime",
            "oddsDelay",
            "oddsMinStake",
            "oddsMaxStake",
            "oddsMaxProfit",
            "sessionDelay",
            "sessionMinStake",
            "sessionMaxStake",
            "sessionMaxProfit",
            "bookDelay",
            "bookMinStake",
            "bookMaxStake",
            "bookMaxProfit",
          ].map((field, index) => (
            <div key={field}>
              <label className="block font-custom capitalize">{field}</label>
              <input
                type="text"
                value={formState[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="border p-2 rounded w-full"
                ref={(el) => (inputRefs.current[index + 1] = el)}
                onKeyDown={(e) => handleKeyDown(e, index + 1)}
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-span-4 flex justify-center items-center mt-4">
            <button
              type="submit"
              className="bg-lightblue text-white px-6 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualMatch;

// import React, { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   updateField,
//   resetForm,
// } from "../../Store/Slice/createManualMatchSlice";
// import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth } from "../../Services/Newmatchapi"; 
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateManualMatch = () => {
//   const [sportsOptions, setSportsOptions] = useState([]);
//   const formState = useSelector((state) => state.createManualMatch);
//   const dispatch = useDispatch();
//   const inputRefs = useRef([]); // Array of refs for input fields

//   useEffect(() => {
//     const fetchSports = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth("games/getgames");
//         if (response.status === 200) {
//           setSportsOptions(response.data.data || []); // Adjust based on API response
//         }
//       } catch (error) {
//         console.error("Error fetching sports:", error);
//       }
//     };

//     fetchSports();
//   }, []);

//   const handleInputChange = (field, value) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleKeyDown = (e, index) => {
//     const totalFields = inputRefs.current.length; // Total number of fields
//     const fieldsPerRow = 4; // Adjust based on your grid layout (4 columns)

//     if (e.key === "ArrowUp" && index >= fieldsPerRow) {
//       inputRefs.current[index - fieldsPerRow]?.focus(); // Move up a row
//     } else if (e.key === "ArrowDown" && index < totalFields - fieldsPerRow) {
//       inputRefs.current[index + fieldsPerRow]?.focus(); // Move down a row
//     } else if (e.key === "ArrowLeft" && index > 0) {
//       inputRefs.current[index - 1]?.focus(); // Move left
//     } else if (e.key === "ArrowRight" && index < totalFields - 1) {
//       inputRefs.current[index + 1]?.focus(); // Move right
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createNewMatchAPIAuth(
//         "match/creatematchmanual",
//         formState
//       );
//       if (response.status === 200) {
//         toast.success("Form submitted successfully!");
//         dispatch(resetForm());
//       } else {
//         toast.error("Failed to submit the form. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
     
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4">
//       {/* Select Sport */}
//       <div>
//         <label className="block font-custom">Select Sport</label>
//         <select
//           value={formState.sport}
//           onChange={(e) => handleInputChange("sport", e.target.value)}
//           className="border p-2 rounded w-full"
//           ref={(el) => (inputRefs.current[0] = el)} // Assign ref to this field
//           onKeyDown={(e) => handleKeyDown(e, 0)} // Handle arrow key navigation
//         >
//           <option value="">Select</option>
//           {sportsOptions.map((sport) => (
//             <option key={sport.id} value={sport.name}>
//               {sport.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* All fields from the Redux slice */}
//       {[
//         "league",
//         "match",
//         "marketType",
//         "marketID",
//         "eventId",
//         "team1",
//         "team2",
//         "team1Selectionid",
//         "team2Selectionid",
//         "runners",
//         "datetime",
//         "oddsDelay",
//         "oddsMinStake",
//         "oddsMaxStake",
//         "oddsMaxProfit",
//         "sessionDelay",
//         "sessionMinStake",
//         "sessionMaxStake",
//         "sessionMaxProfit",
//         "bookDelay",
//         "bookMinStake",
//         "bookMaxStake",
//         "bookMaxProfit",
//       ].map((field, index) => (
//         <div key={field}>
//           <label className="block font-custom capitalize">{field}</label>
//           <input
//             type="text"
//             value={formState[field] || ""}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             className="border p-2 rounded w-full"
//             ref={(el) => (inputRefs.current[index + 1] = el)} // Assign refs dynamically
//             onKeyDown={(e) => handleKeyDown(e, index + 1)} // Handle arrow key navigation
//           />
//         </div>
//       ))}

//       {/* Submit Button */}
//       <div className="col-span-4 flex justify-center items-center mt-4">
//         <button
//           type="submit"
//           className="bg-lightblue text-white px-6 py-2 rounded"
//         >
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CreateManualMatch;


