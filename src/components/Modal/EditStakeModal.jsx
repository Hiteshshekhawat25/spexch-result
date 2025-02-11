import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateField } from "../../Store/Slice/editStakeSlice";
import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; // Ensure this is correct
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStakeModal = ({ onCancel, onSubmit, match }) => {
  console.log(match)
  const dispatch = useDispatch();

  // Local state for form values
  const [formValues, setFormValues] = useState({
    oddsDelay: "",
    oddsMinStake: "",
    oddsMaxStake: "",
    oddsMaxProfit: "",
    sessionDelay: "",
    sessionMinStake: "",
    sessionMaxStake: "",
    sessionMaxProfit: "",
    bookDelay: "",
    bookMinStake: "",
    bookMaxStake: "",
    bookMaxProfit: "",
    tossDelay: "",
    tossMinStake: "",
    tossMaxStake: "",
    tossMaxProfit: "",
  });

  const inputRefs = useRef({});

  // Pre-populate form values with match data when the modal opens
  useEffect(() => {
    if (match) {
      setFormValues({
        oddsDelay: match.oddsDelay || "",
        oddsMinStake: match.oddsMinStake || "",
        oddsMaxStake: match.oddsMaxStake || "",
        oddsMaxProfit: match.oddsMaxProfit || "",
        sessionDelay: match.sessionDelay || "",
        sessionMinStake: match.sessionMinStake || "",
        sessionMaxStake: match.sessionMaxStake || "",
        sessionMaxProfit: match.sessionMaxProfit || "",
        bookDelay: match.bookDelay || "",
        bookMinStake: match.bookMinStake || "",
        bookMaxStake: match.bookMaxStake || "",
        bookMaxProfit: match.bookMaxProfit || "",
        tossDelay: match.tossDelay || "",
        tossMinStake: match.tossMinStake || "",
        tossMaxStake: match.tossMaxStake || "",
        tossMaxProfit: match.tossMaxProfit || "",
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!match || !match._id) {
      toast.error("Match ID is missing.", { position: "top-center" });
      return;
    }

    const payload = { ...formValues };

    try {
      const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);

      if (response.status === 200) {
        toast.success("Stake updated successfully!", { position: "top-center" });
        onSubmit(); // Trigger parent update callback
        onCancel(); // Close modal
      } else {
        toast.error("Failed to update stake. Please try again.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error updating stake:", error);
      toast.error("An error occurred while updating the stake.", { position: "top-center" });
    }
  };

  const handleKeyDown = (e, fieldName) => {
    const keys = {
      ArrowDown: () => moveFocus("down", fieldName),
      ArrowUp: () => moveFocus("up", fieldName),
      ArrowLeft: () => moveFocus("left", fieldName),
      ArrowRight: () => moveFocus("right", fieldName),
    };

    if (keys[e.key]) {
      keys[e.key]();
    }
  };

  const moveFocus = (direction, currentField) => {
    const fieldNames = Object.keys(formValues);
    const currentIndex = fieldNames.indexOf(currentField);
    let nextIndex = currentIndex;

    if (direction === "down" && currentIndex + 2 < fieldNames.length) {
      nextIndex = currentIndex + 2;
    } else if (direction === "up" && currentIndex - 2 >= 0) {
      nextIndex = currentIndex - 2;
    } else if (direction === "left" && currentIndex % 2 !== 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex % 2 === 0 && currentIndex + 1 < fieldNames.length) {
      nextIndex = currentIndex + 1;
    }

    if (inputRefs.current[fieldNames[nextIndex]]) {
      inputRefs.current[fieldNames[nextIndex]].focus();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-[700px] mt-0 p-4 shadow-lg">
        {/* Header */}
        {/* <div className="bg-gray-100 p-3 rounded-t-lg flex justify-end items-center">
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-gray-600 text-2xl"
          />
        </div> */}

        {/* Heading */}
        <div className="overflow-y-auto">
          <h2 className="text-gray-800 text-lg font-semibold">Edit Stake</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4">
          {Object.keys(formValues).map((field) => (
            <div key={field} className="space-y-1">
              <label className="block items-center text-xs font-custom text-black">
                {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </label>
              <input
                type="text"
                name={field}
                value={formValues[field]}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, field)}
                ref={(el) => (inputRefs.current[field] = el)}
                className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
              />
            </div>
          ))}
        </form>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-lightblue text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStakeModal;

// import React, { useState, useRef } from "react";
// import { IoClose } from "react-icons/io5";
// import { useDispatch } from "react-redux";
// import { updateField } from "../../Store/Slice/editStakeSlice";
// import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi"; // Ensure this is correct
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditStakeModal = ({ onCancel, onSubmit, match }) => {
//   const dispatch = useDispatch();
//   const [formValues, setFormValues] = useState({
//     oddsDelay: "",
//     oddsMinStake: "",
//     oddsMaxStake: "",
//     oddsMaxProfit: "",
//     sessionDelay: "",
//     sessionMinStake: "",
//     sessionMaxStake: "",
//     sessionMaxProfit: "",
//     bookDelay: "",
//     bookMinStake: "",
//     bookMaxStake: "",
//     bookMaxProfit: "",
//     tossDelay: "",
//     tossMinStake: "",
//     tossMaxStake: "",
//   });

//   const inputRefs = useRef({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Match",match)
//     console.log("Matchid",match._id)

//     if (!match || !match._id) {
//       toast.error("Match ID is missing.", { position: "top-center" });
//       return;
//     }

//     const payload = {
//       ...formValues,
//     };

//     try {
//       const response = await putUpdateMatchAPIAuth(`match/updatematch/${match._id}`, payload);

//       if (response.status === 200) {
//         toast.success("Stake updated successfully!", { position: "top-center" });
//         onSubmit(); // Trigger parent update callback
//         onCancel(); // Close modal
//       } else {
//         toast.error("Failed to update stake. Please try again.", { position: "top-center" });
//       }
//     } catch (error) {
//       console.error("Error updating stake:", error);
//       toast.error("An error occurred while updating the stake.", { position: "top-center" });
//     }
//   };

//   const handleKeyDown = (e, fieldName) => {
//     const keys = {
//       ArrowDown: () => moveFocus("down", fieldName),
//       ArrowUp: () => moveFocus("up", fieldName),
//       ArrowLeft: () => moveFocus("left", fieldName),
//       ArrowRight: () => moveFocus("right", fieldName),
//     };

//     if (keys[e.key]) {
//       keys[e.key]();
//     }
//   };

//   const moveFocus = (direction, currentField) => {
//     const fieldNames = Object.keys(formValues);
//     const currentIndex = fieldNames.indexOf(currentField);
//     let nextIndex = currentIndex;

//     if (direction === "down" && currentIndex + 2 < fieldNames.length) {
//       nextIndex = currentIndex + 2;
//     } else if (direction === "up" && currentIndex - 2 >= 0) {
//       nextIndex = currentIndex - 2;
//     } else if (direction === "left" && currentIndex % 2 !== 0) {
//       nextIndex = currentIndex - 1;
//     } else if (direction === "right" && currentIndex % 2 === 0 && currentIndex + 1 < fieldNames.length) {
//       nextIndex = currentIndex + 1;
//     }

//     if (inputRefs.current[fieldNames[nextIndex]]) {
//       inputRefs.current[fieldNames[nextIndex]].focus();
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-[700px] mt-0 p-4 shadow-lg">
//         {/* Header */}
//         <div className="bg-gray-100 p-3 rounded-t-lg flex justify-end items-center">
//           <IoClose
//             onClick={onCancel}
//             className="cursor-pointer text-gray-600 text-2xl"
//           />
//         </div>

//         {/* Heading */}
//         <div className="flex justify-between items-center border-b pb-3 mt-2">
//           <h2 className="text-gray-800 text-lg font-semibold">Edit Stake</h2>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4">
//           {Object.keys(formValues).map((field) => (
//             <div key={field} className="space-y-1">
//               <label className="block items-center text-xs font-custom text-black">
//                 {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
//               </label>
//               <input
//                 type="text"
//                 name={field}
//                 value={formValues[field]}
//                 onChange={handleChange}
//                 onKeyDown={(e) => handleKeyDown(e, field)}
//                 ref={(el) => (inputRefs.current[field] = el)}
//                 className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
//               />
//             </div>
//           ))}
//         </form>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-3 mt-6">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 hover:bg-gray-400 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-lightblue text-white rounded-lg hover:bg-blue-700 text-sm"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditStakeModal;




// import React, { useState, useRef } from "react";
// import { IoClose } from "react-icons/io5";
// import { useDispatch } from "react-redux";
// import { updateField } from "../../Store/Slice/editStakeSlice";

// const EditStakeModal = ({ onCancel, onSubmit }) => {
//   const dispatch = useDispatch();
//   const [formValues, setFormValues] = useState({
//     oddsDelay: "",
//     oddsMinStake: "",
//     oddsMaxStake: "",
//     oddsMaxProfit: "",
//     sessionDelay: "",
//     sessionMinStake: "",
//     sessionMaxStake: "",
//     sessionMaxProfit: "",
//     bookDelay: "",
//     bookMinStake: "",
//     bookMaxStake: "",
//     bookMaxProfit: "",
//     tossDelay: "",
//     tossMinStake: "",
//     tossMaxStake: "",
//   });

//   // Refs for each input field
//   const inputRefs = useRef({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formValues);
//     onCancel(); // Close the modal after submission
//   };

//   const handleKeyDown = (e, fieldName) => {
//     const keys = {
//       ArrowDown: () => moveFocus("down", fieldName),
//       ArrowUp: () => moveFocus("up", fieldName),
//       ArrowLeft: () => moveFocus("left", fieldName),
//       ArrowRight: () => moveFocus("right", fieldName),
//     };

//     if (keys[e.key]) {
//       keys[e.key]();  // Call the corresponding movement function
//     }
//   };

//   const moveFocus = (direction, currentField) => {
//     const fieldNames = Object.keys(formValues); // Get the names of all fields
//     const currentIndex = fieldNames.indexOf(currentField); 

//     let nextIndex = currentIndex;

//     if (direction === "down" && currentIndex + 2 < fieldNames.length) {
//       nextIndex = currentIndex + 2; // Move to the next row field
//     } else if (direction === "up" && currentIndex - 2 >= 0) {
//       nextIndex = currentIndex - 2; // Move to the previous row field
//     } else if (direction === "left" && currentIndex % 2 !== 0) {
//       nextIndex = currentIndex - 1; // Move left within the same row
//     } else if (direction === "right" && currentIndex % 2 === 0 && currentIndex + 1 < fieldNames.length) {
//       nextIndex = currentIndex + 1; // Move right within the same row
//     }

//     // Move focus to the next field
//     if (inputRefs.current[fieldNames[nextIndex]]) {
//       inputRefs.current[fieldNames[nextIndex]].focus();
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-[800px] mt-12 p-5">
//         {/* Gray Header with Close Icon */}
//         <div className="bg-whiteGray p-3 rounded-t-lg flex justify-end items-center">
//           <IoClose
//             onClick={onCancel}
//             className="cursor-pointer text-white text-2xl"
//           />
//         </div>

//         {/* Edit Stake Heading */}
//         <div className="flex justify-between items-center border-b pb-3 mt-4">
//           <h2 className="text-gray-700 text-xl font-semibold">Edit Stake</h2>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-4">
//           {/* Left Column */}
//           <div className="space-y-4">
//             {["oddsDelay", "oddsMaxStake", "sessionDelay", "sessionMaxStake", "bookDelay", "bookMaxStake", "tossDelay"].map((field) => (
//               <div key={field}>
//                 <label className="block text-md font-custom text-gray-700 text-center">
//                   {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={formValues[field]}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, field)}
//                   ref={(el) => (inputRefs.current[field] = el)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             {["oddsMinStake", "oddsMaxProfit", "sessionMinStake", "sessionMaxProfit", "bookMinStake", "bookMaxProfit", "tossMaxStake"].map((field) => (
//               <div key={field}>
//                 <label className="block text-md font-custom text-gray-700 text-center">
//                   {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={formValues[field]}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, field)}
//                   ref={(el) => (inputRefs.current[field] = el)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>
//         </form>

//         {/* Line Divider */}
//         <div className="border-t border-gray-300 mt-6"></div>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-lightblue text-white rounded-lg"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditStakeModal;




// import React, { useState, useRef } from "react";
// import { IoClose } from "react-icons/io5";
// import { useDispatch } from "react-redux";
// import { updateField } from "../../Store/Slice/editStakeSlice";

// const EditStakeModal = ({ onCancel, onSubmit }) => {
//   const dispatch = useDispatch();
//   const [formValues, setFormValues] = useState({
//     oddsDelay: "",
//     oddsMinStake: "",
//     oddsMaxStake: "",
//     oddsMaxProfit: "",
//     sessionDelay: "",
//     sessionMinStake: "",
//     sessionMaxStake: "",
//     sessionMaxProfit: "",
//     bookDelay: "",
//     bookMinStake: "",
//     bookMaxStake: "",
//     bookMaxProfit: "",
//     tossDelay: "",
//     tossMinStake: "",
//     tossMaxStake: "",
//     tossMaxProfit: "",
//   });

//   // Refs for each input field
//   const inputRefs = useRef({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formValues);
//     onCancel(); // Close the modal after submission
//   };

//   const handleKeyDown = (e, fieldName) => {
//     const keys = {
//       ArrowDown: () => moveFocus("down", fieldName),
//       ArrowUp: () => moveFocus("up", fieldName),
//       ArrowLeft: () => moveFocus("left", fieldName),
//       ArrowRight: () => moveFocus("right", fieldName),
//     };

//     if (keys[e.key]) {
//       keys[e.key]();  // Call the corresponding movement function
//     }
//   };

//   const moveFocus = (direction, currentField) => {
//     const fieldNames = Object.keys(formValues); // Get the names of all fields
//     const currentIndex = fieldNames.indexOf(currentField); 

//     let nextIndex = currentIndex;

//     if (direction === "down" && currentIndex + 2 < fieldNames.length) {
//       nextIndex = currentIndex + 2; // Move to the next row field
//     } else if (direction === "up" && currentIndex - 2 >= 0) {
//       nextIndex = currentIndex - 2; // Move to the previous row field
//     } else if (direction === "left" && currentIndex % 2 !== 0) {
//       nextIndex = currentIndex - 1; // Move left within the same row
//     } else if (direction === "right" && currentIndex % 2 === 0 && currentIndex + 1 < fieldNames.length) {
//       nextIndex = currentIndex + 1; // Move right within the same row
//     }

//     // Move focus to the next field
//     if (inputRefs.current[fieldNames[nextIndex]]) {
//       inputRefs.current[fieldNames[nextIndex]].focus();
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-[800px] mt-12 p-5">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-gray-700 text-xl font-semibold">Edit Stake</h2>
//           <IoClose
//             onClick={onCancel}
//             className="cursor-pointer text-gray-600 text-2xl"
//           />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-4">
//           {/* Left Column */}
//           <div className="space-y-4">
//             {["oddsDelay", "oddsMaxStake", "sessionDelay", "sessionMaxStake", "bookDelay", "bookMaxStake", "tossDelay"].map((field, index) => (
//               <div key={field}>
//                 <label className="block text-md font-custom text-gray-700 text-center">
//                   {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={formValues[field]}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, field)}
//                   ref={(el) => (inputRefs.current[field] = el)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             {["oddsMinStake", "oddsMaxProfit", "sessionMinStake", "sessionMaxProfit", "bookMinStake", "bookMaxProfit", "tossMaxStake"].map((field) => (
//               <div key={field}>
//                 <label className="block text-md font-custom text-gray-700 text-center">
//                   {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={formValues[field]}
//                   onChange={handleChange}
//                   onKeyDown={(e) => handleKeyDown(e, field)}
//                   ref={(el) => (inputRefs.current[field] = el)}
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>
//         </form>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-lightblue text-white rounded-lg"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditStakeModal;


// import React, { useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { useDispatch } from "react-redux";
// import { updateField } from "../../Store/Slice/editStakeSlice";

// const EditStakeModal = ({ onCancel, onSubmit }) => {
//   const dispatch = useDispatch();
//   const [formValues, setFormValues] = useState({
//     oddsDelay: "",
//     oddsMinStake: "",
//     oddsMaxStake: "",
//     oddsMaxProfit: "",
//     sessionDelay: "",
//     sessionMinStake: "",
//     sessionMaxStake: "",
//     sessionMaxProfit: "",
//     bookDelay: "",
//     bookMinStake: "",
//     bookMaxStake: "",
//     bookMaxProfit: "",
//     tossDelay: "",
//     tossMinStake: "",
//     tossMaxStake: "",
//     tossMaxProfit: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//     dispatch(updateField({ name, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formValues);
//     onCancel(); // Close the modal after submission
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg w-[800px] mt-12 p-5">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-gray-700 text-xl font-semibold">Edit Stake</h2>
//           <IoClose
//             onClick={onCancel}
//             className="cursor-pointer text-gray-600 text-2xl"
//           />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-4">
//           {/* Left Column */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-md font-custom text-gray-700">Odds Delay</label>
//               <input
//                 type="text"
//                 name="oddsDelay"
//                 value={formValues.oddsDelay}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Odds Max Stake</label>
//               <input
//                 type="text"
//                 name="oddsMaxStake"
//                 value={formValues.oddsMaxStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Session Delay</label>
//               <input
//                 type="text"
//                 name="sessionDelay"
//                 value={formValues.sessionDelay}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Session Max Stake</label>
//               <input
//                 type="text"
//                 name="sessionMaxStake"
//                 value={formValues.sessionMaxStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Book Delay</label>
//               <input
//                 type="text"
//                 name="bookDelay"
//                 value={formValues.bookDelay}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Book Max Stake</label>
//               <input
//                 type="text"
//                 name="bookMaxStake"
//                 value={formValues.bookMaxStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Toss Delay</label>
//               <input
//                 type="text"
//                 name="tossDelay"
//                 value={formValues.tossDelay}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-md font-custom text-gray-700">Odds Min Stake</label>
//               <input
//                 type="text"
//                 name="oddsMinStake"
//                 value={formValues.oddsMinStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Odds Max Profit</label>
//               <input
//                 type="text"
//                 name="oddsMaxProfit"
//                 value={formValues.oddsMaxProfit}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Session Min Stake</label>
//               <input
//                 type="text"
//                 name="sessionMinStake"
//                 value={formValues.sessionMinStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Session Max Profit</label>
//               <input
//                 type="text"
//                 name="sessionMaxProfit"
//                 value={formValues.sessionMaxProfit}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Book Min Stake</label>
//               <input
//                 type="text"
//                 name="bookMinStake"
//                 value={formValues.bookMinStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Book Max Profit</label>
//               <input
//                 type="text"
//                 name="bookMaxProfit"
//                 value={formValues.bookMaxProfit}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-md font-custom text-gray-700">Toss Max Stake</label>
//               <input
//                 type="text"
//                 name="tossMaxStake"
//                 value={formValues.tossMaxStake}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//               />
//             </div>
//           </div>
//         </form>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-lightblue text-white rounded-lg"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditStakeModal;
