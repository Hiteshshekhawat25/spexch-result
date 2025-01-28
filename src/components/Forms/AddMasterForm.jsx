import React, { useEffect, useState } from "react";
import { fetchRoles, saveClientApi } from "../../Utils/LoginApi";
import { BASE_URL } from "../../Constant/Api";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setStartFetchData } from "../../Store/Slice/downlineSlice";
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';

export const AddMasterForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "",
    commission: "",
    openingBalance: "",
    creditReference: "",
    mobileNumber: "",
    partnership: "",
    password: "",
    confirmPassword: "",
    rollingCommission: {
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      sportbook: 0,
      bookmaker: 0,
    },
    agentRollingCommission: {
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      sportbook: 0,
      bookmaker: 0,
    },
    masterPassword: "",
    rollingCommissionChecked: false,
    agentRollingCommissionChecked: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const { userData, loading, error } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const dispatch = useDispatch();
  console.log("userData", userData?.data?.role_name);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (
      name.includes("rollingCommission") ||
      name.includes("agentRollingCommission")
    ) {
      const [field, key] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Validatio
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.role) newErrors.role = "Role selection is required.";
    if (formData.commission < 0 || formData.commission > 100)
      newErrors.commission = "Commission must be between 0 and 100.";
    if (formData.partnership < 0 || formData.partnership > 100)
      newErrors.partnership = "Partnership must be between 0 and 100.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.masterPassword.trim())
      newErrors.masterPassword = "Master Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch roles
  useEffect(() => {
    if (token) {
      const fetchRolesData = async () => {
        try {
          const rolesArray = await fetchRoles(token);
          setRole(rolesArray || []);
        } catch {
          toast.error("Failed to fetch roles.");
        }
      };
      fetchRolesData();
    }
  }, [token]);

  //  to select the role
  const handleRoleSelection = (roleId) => {
    console.log("role id", roleId);
    setFormData((prevData) => ({
      ...prevData,
      role: roleId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    const {
      confirmPassword,
      rollingCommissionChecked,
      agentRollingCommissionChecked,
      ...submitData
    } = formData;

    try {
      const response = await saveClientApi(
        `${BASE_URL}/user/create-user`,
        submitData,
        token
      );

      if (response?.data?.success) {
        setFormData({
          username: "",
          name: "",
          role: "",
          commission: 10,
          openingBalance: 0,
          creditReference: "",
          mobileNumber: "",
          partnership: 0,
          password: "",
          confirmPassword: "",
          rollingCommission: {
            fancy: " ",
            matka: " ",
            casino: " ",
            binary: " ",
            bookmaker: " ",
          },
          agentRollingCommission: {
            fancy: " ",
            matka: " ",
            casino: " ",
            binary: " ",
            sportsbook: " ",
            bookmaker: " ",
          },
          masterPassword: "",
        });
        toast.success(response?.data?.message || "Master created Successfully");
        handleCloseModal();
        dispatch(setStartFetchData());
        // setTimeout(() => { 
        // }, 2000);
      } else {
        toast.error(
          response?.response?.data?.message || "Failed to save master."
        );
      }
    } catch (error) {
      toast.error(
        error?.message || "An error occurred while saving the master."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setSuccessMessage("");
    closeModal();
  };

  return (
    <div className=" bg-white rounded shadow-lg ">
      <h2 className="flex text-white  font-custom font-semibold mb-4 py-2 px-2 bg-gradient-blue">
        Add Master
        <IoClose
          onClick={closeModal}
          className="cursor-pointer text-white text-2xl ml-auto"
        />
      </h2>
      <form onSubmit={handleSubmit} className="px-4">
  <div className="space-y-4">
    {/* Username */}
    <div className="flex flex-col sm:flex-row sm:items-center">
      <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
        Username <span className="text-red-500">*</span>
      </label>
      <div className="flex-1">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        {errors.username && (
          <div className="text-red-500 text-sm">{errors.username}</div>
        )}
      </div>
    </div>

    {/* Name */}
    <div className="flex flex-col sm:flex-row sm:items-center">
      <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">Name</label>
      <div className="flex-1">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name}</div>
        )}
      </div>
    </div>

    {/* Account Type */}
    <div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Account Type <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <select
      name="role"
      value={formData.role || ""}
      onChange={(e) => {
        handleChange(e);
        handleRoleSelection(e.target.value);
      }}
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    >
      <option value="" disabled>
        Select Role
      </option>
      {role
        ?.filter(
          ({ role_name }) =>
            userData?.data?.role_name !== "master" || role_name !== "master"
        )
        .map(({ _id, role_name }, index) => (
          <option key={index} value={_id}>
            {role_name}
          </option>
        ))}
    </select>
    {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
  </div>
</div>

{/* Commission */}
<div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Commission (%) <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <input
      type="text"
      name="commission"
      value={formData.commission}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    {errors.commission && (
      <div className="text-red-500 text-sm">{errors.commission}</div>
    )}
  </div>
</div>

{/* Opening Balance */}
<div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Opening Balance <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <input
      type="text"
      name="openingBalance"
      value={formData.openingBalance}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    {errors.openingBalance && (
      <div className="text-red-500 text-sm">{errors.openingBalance}</div>
    )}
  </div>
</div>

{/* Credit Reference */}
<div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Credit Reference <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <input
      type="text"
      name="creditReference"
      value={formData.creditReference}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    {errors.creditReference && (
      <div className="text-red-500 text-sm">{errors.creditReference}</div>
    )}
  </div>
</div>

{/* Mobile Number */}
<div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Mobile Number <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <input
      type="text"
      name="mobileNumber"
      value={formData.mobileNumber}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    {errors.mobileNumber && (
      <div className="text-red-500 text-sm">{errors.mobileNumber}</div>
    )}
  </div>
</div>

{/* Partnership */}
<div className="flex flex-col sm:flex-row sm:items-center mb-4">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
    Partnership <span className="text-red-500">*</span>
  </label>
  <div className="flex-1">
    <input
      type="text"
      name="partnership"
      value={formData.partnership}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    {errors.partnership && (
      <div className="text-red-500 text-sm">{errors.partnership}</div>
    )}
  </div>
</div>

    {/* Password */}
    <div className="flex flex-col sm:flex-row sm:items-center">
      <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
        Password <span className="text-red-500">*</span>
      </label>
      <div className="relative flex-1">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
      </div>
    </div>

    {/* Confirm Password */}
    <div className="flex flex-col sm:flex-row sm:items-center">
      <label className=" font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
        Confirm Password <span className="text-red-500">*</span>
      </label>
      <div className="relative flex-1">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
        {errors.confirmPassword && (
          <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
        )}
      </div>
    </div>       

      {/* Rolling Commission Checkbox */}
<div className="py-2">
  <label className="font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">
       Rolling Commission
  </label>
  <input
      type="checkbox"
      name="rollingCommissionChecked"
      checked={formData.rollingCommissionChecked}
      onChange={handleChange}
      className="ml-2"
    />
</div>

{/* Conditional Rendering for Rolling Commission Fields */}
{formData.rollingCommissionChecked && (
  <div className="space-y-4">
    {['fancy', 'matka', 'casino', 'binary', 'sportbook', 'bookmaker'].map((field) => (
      <div key={field} className="flex flex-col">
        <label className="capitalize  font-custom font-semibold sm:text-left text-center sm:w-1/3 w-full">{field}</label>
        <input
          type="text"
          name={`rollingCommission.${field}`}
          value={formData.rollingCommission[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>
    ))}
  </div>
)}

{/* Agent Rolling Commission Checkbox */}
<div className="py-2">
  <label className="inline-flex items-center font-custom font-bold">
  
    Agent Rolling Commission
  </label>
  <input
      type="checkbox"
      name="agentRollingCommissionChecked"
      checked={formData.agentRollingCommissionChecked}
      onChange={handleChange}
      className="ml-2"
    />
</div>

{/* Conditional Rendering for Agent Rolling Commission Fields */}
{formData.agentRollingCommissionChecked && (
  <div className="space-y-4">
    {['fancy', 'matka', 'casino', 'binary', 'sportbook', 'bookmaker'].map((field) => (
      <div key={field} className="flex flex-col">
        <label className="capitalize font-custom font-bold sm:text-left text-center sm:w-1/3 w-full">{field}</label>
        <input
          type="text"
          name={`agentRollingCommission.${field}`}
          value={formData.agentRollingCommission[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>
    ))}
  </div>
)}

{/* Master Password */}
<div className="flex flex-col sm:flex-row sm:items-center">
  <label className="font-custom font-bold sm:text-left text-center sm:w-1/3 w-full">
    Master Password <span className="text-red-500">*</span>
  </label>
  <div className="relative flex-1">
    <input
      type={showMasterPassword ? "text" : "password"}
      name="masterPassword"
      value={formData.masterPassword}
      onChange={handleChange}
      required
      className="w-full p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    />
    <button
      type="button"
      className="absolute right-3 top-3 text-gray-500"
      onClick={() => setShowMasterPassword(!showMasterPassword)}
    >
      {showMasterPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
    </button>
  </div>
  {errors.masterPassword && (
    <div className="text-red-500 text-sm">{errors.masterPassword}</div>
  )}
</div>


<div className="flex justify-center mt-4">
  <button
    type="submit"
    className="px-4 py-2 bg-ashGray text-white rounded mb-2"
    disabled={isSubmitting}
  >
    {isSubmitting ? "Creating..." : "Create"}
  </button>
</div>

</div>
      </form>
      <ToastContainer autoClose={2000} draggable={true} />
    </div>
  );
};
