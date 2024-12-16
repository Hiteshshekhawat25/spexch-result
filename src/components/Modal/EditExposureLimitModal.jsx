import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon
import { useDispatch } from "react-redux";
import { updateExposure } from "../../Store/Slice/editExposureSlice"; // Import the update exposure thunk
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { setError } from "../../Store/Slice/downlineSlice";

const EditExposureLimitModal = ({
  username,
  currentExposureLimit,
  onCancel,
  onSubmit = () => {},
  user,
  userId,
  fetchDownline,
  currentPage,
  entriesToShow,
}) => {
  console.log("currentExposureLimit", currentExposureLimit);
  const dispatch = useDispatch();
  // const { loading, error } = useSelector((state) => state.exposure); // Access loading and error from Redux

  const [newExposureLimit, setNewExposureLimit] =
    useState(currentExposureLimit);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
        if (parsedToken) {
          setToken(parsedToken);
        } else {
          setError("Access token not found in the stored data.");
        }
      } catch {
        setToken(storedToken);
      }
    } else {
      setError("Token is missing. Please login again.");
    }
  }, []);

  const handleIncrease = () => {
    // Increase value by 1
    setNewExposureLimit((prev) => prev + 1);
  };

  const handleDecrease = () => {
    // Ensure the new exposure limit doesn't go below 0
    setNewExposureLimit((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (newExposureLimit <= 0) {
    //   alert("Exposure limit must be greater than 0");
    //   return;
    // }
    
    // Dispatch the update action
    console.log("password", password);
    dispatch(updateExposure({ newExposureLimit, password, userId }));

    // Call the parent onSubmit after dispatch
    onSubmit(newExposureLimit, password);

    try {
      // Call fetchDownline API to update and render the new value
      await fetchDownlineData(token, currentPage, entriesToShow);

      // // After the data is fetched, refresh the page or update state to reflect new data
      window.location.reload();

      // // Close the modal after update and API call
      onCancel();
    } catch (error) {
      console.error("Error fetching downline data:", error);
      setError("Failed to fetch the downline data.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      {/* Modal container adjusted to center properly and cover the screen */}
      <div className="bg-white rounded-lg w-[500px] mt-20"> {/* Adjusted margin-top to mt-20 for proper centering */}
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-2">
          <span>Edit Exposure Limit - {username}</span>
          <IoClose
            onClick={onCancel} // Close the modal
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Current Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Current
            </label>
            <p className="w-2/3 text-black font-medium">
              {currentExposureLimit}
            </p>
          </div>

          {/* New Exposure Limit */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              New
            </label>
            <div className="w-2/3 flex items-center space-x-2">
              <input
                type="number"
                value={newExposureLimit}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  // Ensure the new exposure limit cannot go below 0 or exceed 100
                  if (value >= 0 && value <= 100) {
                    setNewExposureLimit(value);
                  } else {
                    alert("Exposure limit should be between 0 and 100");
                  }
                }}
                placeholder="New Exposure Limit"
                className="w-full p-2 border border-black rounded-lg text-gray-700"
              />
             
            </div>
          </div>

          {/* Password Field */}
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 p-2 border border-black rounded-lg text-gray-700"
              placeholder="Enter your password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg"
            >
              Submit
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel} // Call onCancel to close the modal
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExposureLimitModal;

// import React, { useEffect, useState } from "react";
// import { IoClose } from "react-icons/io5"; // Importing the close icon
// import { useDispatch, useSelector } from "react-redux";
// import { updateExposure } from "../../Store/Slice/editExposureSlice"; // Import the update exposure thunk
// import { fetchDownlineData } from "../../Services/Downlinelistapi";
// import { setError } from "../../Store/Slice/downlineSlice";

// const EditExposureLimitModal = ({
//   username,
//   currentExposureLimit,
//   onCancel,
//   onSubmit = () => {},
//   user,
//   userId,
//   fetchDownline,
//   currentPage,
//   entriesToShow,
// }) => {
//   console.log("currentExposureLimit", currentExposureLimit);
//   const dispatch = useDispatch();
//   // const { loading, error } = useSelector((state) => state.exposure); // Access loading and error from Redux

//   const [newExposureLimit, setNewExposureLimit] =
//     useState(currentExposureLimit);
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     if (storedToken) {
//       try {
//         const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
//         if (parsedToken) {
//           setToken(parsedToken);
//         } else {
//           setError("Access token not found in the stored data.");
//         }
//       } catch {
//         setToken(storedToken);
//       }
//     } else {
//       setError("Token is missing. Please login again.");
//     }
//   }, []);

//   const handleIncrease = () => {
//     // Increase value by 1
//     setNewExposureLimit((prev) => prev + 1);
//   };

//   const handleDecrease = () => {
//     // Ensure the new exposure limit doesn't go below 0
//     setNewExposureLimit((prev) => (prev > 0 ? prev - 1 : 0));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // if (newExposureLimit <= 0) {
//     //   alert("Exposure limit must be greater than 0");
//     //   return;
//     // }
    
//     // Dispatch the update action
//     console.log("password", password);
//     dispatch(updateExposure({ newExposureLimit, password, userId }));

//     // Call the parent onSubmit after dispatch
//     onSubmit(newExposureLimit, password);

//     try {
//       // Call fetchDownline API to update and render the new value
//       await fetchDownlineData(token, currentPage, entriesToShow);

//       // // After the data is fetched, refresh the page or update state to reflect new data
//       window.location.reload();

//       // // Close the modal after update and API call
//       onCancel();
//     } catch (error) {
//       console.error("Error fetching downline data:", error);
//       setError("Failed to fetch the downline data.");
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-[500px] mt-0">
//         {/* Header */}
//         <div className="flex justify-between items-center bg-black text-white text-lg font-semibold w-full p-2">
//           <span>Edit Exposure Limit - {username}</span>
//           <IoClose
//             onClick={onCancel} // Close the modal
//             className="cursor-pointer text-white text-2xl"
//           />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 p-5">
//           {/* Current Exposure Limit */}
//           <div className="flex justify-between items-center">
//             <label className="block text-sm font-medium text-gray-700 w-1/3">
//               Current
//             </label>
//             <p className="w-2/3 text-black font-medium">
//               {currentExposureLimit}
//             </p>
//           </div>

//           {/* New Exposure Limit */}
//           <div className="flex justify-between items-center">
//             <label className="block text-sm font-medium text-gray-700 w-1/3">
//               New
//             </label>
//             <div className="w-2/3 flex items-center space-x-2">
//               <input
//                 type="number"
//                 value={newExposureLimit}
//                 onChange={(e) => {
//                   const value = Number(e.target.value);
//                   // Ensure the new exposure limit cannot go below 0 or exceed 100
//                   if (value >= 0 && value <= 100) {
//                     setNewExposureLimit(value);
//                   } else {
//                     alert("Exposure limit should be between 0 and 100");
//                   }
//                 }}
//                 placeholder="New Exposure Limit"
//                 className="w-full p-2 border border-black rounded-lg text-gray-700"
//               />
             
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="flex justify-between items-center">
//             <label className="block text-sm font-medium text-gray-700 w-1/3">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-2/3 p-2 border border-black rounded-lg text-gray-700"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-4 mt-4">
//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="px-6 py-2 bg-black text-white rounded-lg"
//             >
//               Submit
//             </button>

//             {/* Cancel Button */}
//             <button
//               type="button"
//               onClick={onCancel} // Call onCancel to close the modal
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditExposureLimitModal;
