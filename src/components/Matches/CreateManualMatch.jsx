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
    <div className="md:mx-0 mx-2 sm:mt-3 mt-2">
      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          Create Manual Match
        </h1>
        <div className="md:p-4 p-3">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 md:gap-4 gap-2.5">
            {/* Select Sport */}
            <div>
              <label className="text-lightblack text-[14px] capitalize">Select Sport</label>
              <select
                value={formState.sport}
                onChange={(e) => handleInputChange("sport", e.target.value)}
                className="w-full border border-gray-300 rounded p-2 sm:h-[38px] h-[35px] mt-0.5 sm:text-[14px] text-[13px] text-gray-700 outline-none"
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
                <label className="text-lightblack text-[14px] capitalize">{field}</label>
                <input
                  type="text"
                  value={formState[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 sm:h-[38px] h-[35px] mt-0.5 sm:text-[14px] text-[13px] text-gray-700 outline-none"
                  ref={(el) => (inputRefs.current[index + 1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index + 1)}
                />
              </div>
            ))}

            {/* Submit Button */}
            <div className="lg:col-span-5 md:col-span-4 sm:col-span-2 col-span-2 flex justify-center items-center mt-3">
              <button
                type="submit"
                className="bg-gradient-seablue font-semibold text-sm text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
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
//         <label className="text-lightblack text-[14px] capitalize">Select Sport</label>
//         <select
//           value={formState.sport}
//           onChange={(e) => handleInputChange("sport", e.target.value)}
//           className="w-full border border-gray-300 rounded p-2 sm:h-[38px] h-[35px] mt-0.5 sm:text-[14px] text-[13px] text-gray-700 outline-none"
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
//           <label className="text-lightblack text-[14px] capitalize capitalize">{field}</label>
//           <input
//             type="text"
//             value={formState[field] || ""}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             className="w-full border border-gray-300 rounded p-2 sm:h-[38px] h-[35px] mt-0.5 sm:text-[14px] text-[13px] text-gray-700 outline-none"
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


