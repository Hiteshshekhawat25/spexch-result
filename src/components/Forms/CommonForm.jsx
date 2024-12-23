// import PropTypes from "prop-types";
// import React, { useState } from "react";
// import { setError } from "../../Store/Slice/downlineSlice";
// import { fetchRoles } from "../../Utils/LoginApi";

// const CommonForm = ({ formType, formTitle, onSubmit, accountTypes }) => {
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
//     rollingCommissionChecked: false, 
//     rollingCommission: {
//       fancy: "",
//       matka: "",
//       casino: "",
//       binary: "",
//       sportbook: "",
//       bookmaker: "",
//     },
//     agentRollingCommission: false,
//     agentRollingCommissionData: {
//       fancy: "",
//       matka: "",
//       casino: "",
//       binary: "",
//       sportbook: "",
//       bookmaker: "",
//     },
//     role: " ",
//     accountType: "",
//     partnership: "", 
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [token, setToken] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "number" && value < 0) {
//       return; // Prevent updating with negative values
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     // Trigger role fetch if account type changes
//     if (name === "accountType") {
//       fetchRoles(value);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Prepare formData for submission
//     const { confirmPassword, ...submitData } = { ...formData };

//     // Handle commission data as needed
//     if (!submitData.rollingCommissionChecked) {
//       delete submitData.rollingCommission;
//     } else {
//       const rollingCommissionData = { ...submitData.rollingCommission };
//       for (let key in rollingCommissionData) {
//         if (!rollingCommissionData[key]) {
//           delete rollingCommissionData[key];
//         }
//       }
//       submitData.rollingCommission = rollingCommissionData;
//     }

//     // Handle agent rolling commission
//     if (!submitData.agentRollingCommission) {
//       delete submitData.agentRollingCommissionData;
//     } else {
//       const agentRollingCommissionData = {
//         ...submitData.agentRollingCommissionData,
//       };
//       for (let key in agentRollingCommissionData) {
//         if (!agentRollingCommissionData[key]) {
//           delete agentRollingCommissionData[key];
//         }
//       }
//       submitData.agentRollingCommissionData = agentRollingCommissionData;
//     }

//     try {
//       // Send the request with the updated form data
//       await onSubmit(submitData);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg text-center">
//       <h2 className="text-xl font-bold mb-2">{formTitle}</h2>

//       {/* Input Fields */}
//       {[
//         { label: "Username", name: "username", type: "text", required: true },
//         { label: "Name", name: "name", type: "text", required: true },
//         { label: "Commission (%)", name: "commission", type: "number", required: true },
//         { label: "Opening Balance", name: "openingBalance", type: "number", required: true },
//         { label: "Credit Reference", name: "creditReference", type: "number" },
//         { label: "Mobile Number", name: "mobileNumber", type: "text", required: true },
//         { label: "Password", name: "password", type: "password", required: true },
//         { label: "Confirm Password", name: "confirmPassword", type: "password", required: true },
//         { label: "Master Password", name: "masterPassword", type: "password", required: true },
//       ].map((field) => (
//         <div key={field.name} className="mb-4 flex items-center">
//           <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor={field.name}>
//             {field.label}{" "}
//             {field.required && <span className="text-red-500">*</span>}
//           </label>
//           <input
//             type={field.type}
//             id={field.name}
//             name={field.name}
//             className="w-2/3 p-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             value={formData[field.name] ?? ""}
//             required={field.required}
//             min={field.type === "number" ? 0 : undefined}
//           />
//         </div>
//       ))}

//         {/* Exposure Limit - Only for "user-form" */}
//         {formType === "client" && (
//         <div className="mb-4 flex items-center">
//           <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor="exposureLimit">
//             Exposure Limit
//           </label>
//           <input
//             type="number"
//             id="exposureLimit"
//             name="exposureLimit"
//             className="w-2/3 p-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             value={formData.exposureLimit ?? ""}
//           />
//         </div>
//       )}

//        {/* Partnership Input - Only for master formType */}
//        {formType === "master" && (
//        <div className="mb-4 flex items-center">
//             <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor="partnership">
//               Partnership
//             </label>
//             <input
//               type="number"
//               id="partnership"
//               name="partnership"
//               className="w-2/3 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.partnership ?? ""}
//             />
//           </div>
//        )}

    

//       {/* Account Type Field */}
//       {formType === "master" && (
//         <div className="mb-2 flex items-center">
//           <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor="accountType">
//             Account Type
//           </label>
//           <select
//             id="accountType"
//             name="accountType"
//             className="w-2/3 p-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             value={formData.accountType ?? ""}
//           >
//             <option value="" disabled>
//               Select Account Type
//             </option>
//             {accountTypes?.map((roleName, index) => (
//               <option key={index} value={roleName}>
//                 {roleName}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Rolling Commission Checkbox and Inputs */}
//       <div className="mb-2 flex">
//         <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor="rollingCommissionChecked">
//           Rolling Commission
//         </label>
//         <input
//           type="checkbox"
//           id="rollingCommissionChecked"
//           name="rollingCommissionChecked"
//           checked={formData.rollingCommissionChecked}
//           onChange={handleChange}
//           className=""
//         />
//       </div>
//     {/* Rolling Commission Checkbox */}
// {formData.rollingCommissionChecked && (
//   <>
//     {["fancy", "matka", "casino", "binary", "sportbook", "bookmaker"].map((key) => (
//       <div key={key} className="mb-2 flex">
//         <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor={key}>
//           {key.charAt(0).toUpperCase() + key.slice(1)}
//         </label>
//         <input
//           type="text"
//           id={key}
//           name={`rollingCommission.${key}`}
//           className="w-2/3 p-2 border border-gray-300 rounded"
//           onChange={handleChange}
//           value={formData.rollingCommission[key] ?? ""}
//         />
//       </div>
//     ))}
//   </>
// )}

// {/* Agent Rolling Commission Checkbox and Inputs - Only for "master" formType */}
// {formType === "master" && (
//   <>
//     <div className="mb-4 flex items-center">
//       <label className="mr-2 text-sm font-medium" htmlFor="agentRollingCommission">
//         Agent Rolling Commission
//       </label>
//       <input
//         type="checkbox"
//         id="agentRollingCommission"
//         name="agentRollingCommission"
//         checked={formData.agentRollingCommission}
//         onChange={handleChange}
//         className="w-auto"
//       />
//     </div>

//     {formData.agentRollingCommission && (
//       <>
//         {["fancy", "matka", "casino", "binary", "sportbook", "bookmaker"].map((key) => (
//           <div key={key} className="mb-2 flex">
//             <label className="w-2/4 text-sm font-medium text-right pr-4" htmlFor={key}>
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             <input
//               type="text"
//               id={key}
//               name={`agentRollingCommissionData.${key}`}
//               className="w-2/3 p-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               value={formData.agentRollingCommissionData[key] ?? ""}
//             />
//           </div>
//         ))}
//       </>
//     )}
//   </>
// )}


//       {/* Submit Button */}
//       <div className="flex justify-center">
//         <button
//           type="submit"
//           className="px-4 py-2 bg-NavyBlue text-white rounded disabled:opacity-50"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating..." : "Create"}
//         </button>
//       </div>
//     </form>
//   );
// };

// CommonForm.propTypes = {
//   formType: PropTypes.string.isRequired,
//   formTitle: PropTypes.string.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   accountTypes: PropTypes.array, // Pass the account types as an array prop
// };

// export default CommonForm;
