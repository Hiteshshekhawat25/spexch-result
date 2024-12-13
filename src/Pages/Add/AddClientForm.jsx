// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { closeDialog, saveClient } from "../../Store/AddClient";

// const AddClientForm = () => {
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     username: "",
//     name: "",
//     commission: "",
//     openingBalance: "",
//     creditReference: "",
//     mobileNumber: "",
//     exposureLimit: "",
//     password: "",
//     confirmPassword: "",
//     rollingCommission: false,
//     fancy: 0,
//     matka: 0,
//     casino: 0,
//     binary: 0,
//     sportsbook: 0,
//     bookmaker: 0,
//     masterPassword: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     console.log("hey");
//     e.preventDefault();
//     setIsSubmitting(true); // Indicate submission started
//     await dispatch(saveClient(formData)); // Wait for the action to be dispatched
//     dispatch(closeDialog()); // Close the modal after saving
//     setIsSubmitting(false); // Reset the submitting state
//   };

//   // const handleCancel = () => dispatch(closeDialog());

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white rounded-lg shadow-lg w-full max-w-md"
//     >
//       <h2 className="text-2xl font-bold mb-1">Add User</h2>

//       {/* Username Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="username" className="text-sm font-medium sm:w-2/4">
//           Username <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           name="username"
//           id="username"
//           placeholder="Username"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.username}
//           required
//         />
//       </div>

//       {/* Name Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="name" className="text-sm font-medium sm:w-2/4">
//           Name
//         </label>
//         <input
//           type="text"
//           name="name"
//           id="name"
//           placeholder="Name"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.name}
//           required
//         />
//       </div>

//       {/* Commission Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="commission" className="text-sm font-medium sm:w-2/4">
//           Commission (%) <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           name="commission"
//           id="commission"
//           placeholder="Commission (%)"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.commission}
//           required
//         />
//       </div>

//       {/* Opening Balance Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label
//           htmlFor="openingBalance"
//           className="text-sm font-medium sm:w-2/4"
//         >
//           Opening Balance <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           name="openingBalance"
//           id="openingBalance"
//           placeholder="Opening Balance"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.openingBalance}
//           required
//         />
//       </div>

//       {/* Credit Reference Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label
//           htmlFor="creditReference"
//           className="text-sm font-medium sm:w-2/4"
//         >
//           Credit Reference <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           name="creditReference"
//           id="creditReference"
//           placeholder="Credit Reference"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.creditReference}
//           required
//         />
//       </div>

//       {/* Mobile Number Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="mobileNumber" className="text-sm font-medium sm:w-2/4">
//           Mobile Number <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           name="mobileNumber"
//           id="mobileNumber"
//           placeholder="Mobile Number"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.mobileNumber}
//           required
//         />
//       </div>

//       {/* Exposure Limit Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="exposureLimit" className="text-sm font-medium sm:w-2/4">
//           Exposure Limit <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="number"
//           name="exposureLimit"
//           id="exposureLimit"
//           placeholder="Exposure Limit"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.exposureLimit}
//           required
//         />
//       </div>

//       {/* Password Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label htmlFor="password" className="text-sm font-medium sm:w-2/4">
//           Password <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="password"
//           name="password"
//           id="password"
//           placeholder="Password"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.password}
//           required
//         />
//       </div>

//       {/* Confirm Password Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label
//           htmlFor="confirmPassword"
//           className="text-sm font-medium sm:w-2/4"
//         >
//           Confirm Password <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="password"
//           name="confirmPassword"
//           id="confirmPassword"
//           placeholder="Confirm Password"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.confirmPassword}
//           required
//         />
//       </div>

//       {/* Rolling Commission Checkbox */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label
//           htmlFor="rollingCommission"
//           className="text-sm font-medium sm:w-2/4"
//         >
//           Rolling Commission
//         </label>
//         <input
//           type="checkbox"
//           name="rollingCommission"
//           id="rollingCommission"
//           className="form-checkbox w-1/10"
//           onChange={handleChange}
//           checked={formData.rollingCommission}
//         />
//       </div>

//       {/* Additional Fields Only Show When Rolling Commission is Checked */}
//       {formData.rollingCommission && (
//         <>
//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label htmlFor="fancy" className="text-sm font-medium sm:w-2/4">
//               Fancy
//             </label>
//             <input
//               type="number"
//               name="fancy"
//               id="fancy"
//               placeholder="Fancy"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.fancy}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label htmlFor="matka" className="text-sm font-medium sm:w-2/4">
//               Matka
//             </label>
//             <input
//               type="number"
//               name="matka"
//               id="matka"
//               placeholder="Matka"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.matka}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label htmlFor="casino" className="text-sm font-medium sm:w-2/4">
//               Casino
//             </label>
//             <input
//               type="number"
//               name="casino"
//               id="casino"
//               placeholder="Casino"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.casino}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label htmlFor="binary" className="text-sm font-medium sm:w-2/4">
//               Binary
//             </label>
//             <input
//               type="number"
//               name="binary"
//               id="binary"
//               placeholder="Binary"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.binary}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label
//               htmlFor="sportsbook"
//               className="text-sm font-medium sm:w-2/4"
//             >
//               Sportsbook
//             </label>
//             <input
//               type="number"
//               name="sportsbook"
//               id="sportsbook"
//               placeholder="Sportsbook"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.sportsbook}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//             <label htmlFor="bookmaker" className="text-sm font-medium sm:w-2/4">
//               Bookmaker
//             </label>
//             <input
//               type="number"
//               name="bookmaker"
//               id="bookmaker"
//               placeholder="Bookmaker"
//               className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.bookmaker}
//             />
//           </div>
//         </>
//       )}

//       {/* Master Password Field */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-3">
//         <label
//           htmlFor="masterPassword"
//           className="text-sm font-medium sm:w-2/4"
//         >
//           Master Password <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="password"
//           name="masterPassword"
//           id="masterPassword"
//           placeholder="Master Password"
//           className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.masterPassword}
//           required
//         />
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-center space-x-4 mt-4">
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded bg-NavyBlue"
//           disabled={isSubmitting} // Disable while submitting
//         >
//           {isSubmitting ? "Creating..." : "Create"} {/* Button text change */}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default AddClientForm;
