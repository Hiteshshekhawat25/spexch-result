import React, { useState, useEffect } from "react";
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateRollingCommissionField } from "../../Store/Slice/profileSlice";
import { putEditRollingCommission } from '../../Services/UserInfoApi';

const EditRollingCommissionModal = ({ username,userId, onCancel, onSubmit }) => {
  const dispatch = useDispatch();
  const rollingCommission = useSelector((state) => state.profile.rollingCommission);
  const password = useSelector((state) => state.profile.password);

  const [fields, setFields] = useState({
    fancy: 0,
    matka: 0,
    casino: 0,
    binary: 10,
    bookmaker: 0,
    sportbook: 0,
  });

  const [passwordField, setPasswordField] = useState(""); 
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    
    if (rollingCommission) {
      setFields({
        ...rollingCommission,
      });
    }
  }, [rollingCommission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordField(e.target.value); 
  };

  const handleSubmit = async () => {
    // Validate if password is entered
    if (passwordField === "") {
      setError("Password is required.");
      return;
    }
  
    // Proceed without validation for other fields
    try {
      // Create the data object to send in the request
      const data = {
        userId,  // Pass the userId
        password: passwordField,  // Include the separate password field
        rollingCommission: fields,  // Pass the rollingCommission data
      };
  
      // Call putEditCommission function and pass the userId and data
      const response = await putEditRollingCommission('user/update-rollingcommission', data);
  
      // Handle response or success message
      toast.success("Rolling commission updated successfully!");
      onSubmit(fields); // Call the provided onSubmit from parent to close the modal
    } catch (error) {
      setError(error.message || "An error occurred while updating the rolling commission.");
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-0 right-0 md:py-10 py-3 h-[100vh] bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[95%] h-auto sm:w-[500px] overflow-y-auto">
        <div className="flex justify-between items-center bg-gradient-blue text-white text-sm font-custom font-semibold text-[15px] w-full p-2 h-[35px]">
          <span>Edit Rolling Commission - {username}</span>
          <IoClose onClick={onCancel} className="cursor-pointer text-white text-xl" />
        </div>

        <div className="p-4 space-y-4">
          
          {["fancy", "matka", "casino", "binary", "sportbook", "bookmaker"].map((field) => (
            
            <div key={field} className="flex flex-col lg:flex-row items-center space-y-2 lg:space-x-3 lg:space-y-0">
              <label className="text-xs font-custom text-gray-700 capitalize w-full lg:w-1/3">{field}</label>
              <input
                type="number"
                name={field}
                value={fields[field] || 0} 
                onChange={handleChange}
                className="w-full lg:w-3/3 p-1.5 border border-gray-300 rounded text-xs h-[35px]"
                placeholder={`Enter ${field} value`}
              />
            </div>

          ))}
          <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-x-3 lg:space-y-0">
            <label className="text-xs font-custom text-gray-700 w-full lg:w-1/3">Password </label>
            <div className="relative w-full lg:w-3/3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={passwordField || ""} 
                onChange={handlePasswordChange}
                className="w-full p-1.5 border border-gray-300 rounded text-xs h-[35px]"
                placeholder="Enter your password"
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOffOutline className="text-blue" /> : <IoEyeOutline className="text-blue" />}
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 text-xs mt-2">{error}</div>}

          <div className="flex justify-end mt-3 space-x-2 md:pt-0 pt-3">
            <button onClick={handleSubmit} className="bg-gray-400 text-white font-custom font-bold text-sm px-4 py-1.5 rounded">
              Submit
            </button>
            <button onClick={onCancel} className="bg-gray-400 text-black  font-custom font-bold text-sm px-4 py-1.5 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRollingCommissionModal;

