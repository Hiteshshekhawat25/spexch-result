import React, { useEffect, useState } from "react";
import { fetchRoles, saveClientApi } from "../../Utils/LoginApi";
import { BASE_URL } from "../../Constant/Api";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setStartFetchData } from "../../Store/Slice/downlineSlice";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";

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

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.name.trim() !== "" &&
      formData.role !== "" &&
      formData.commission >= 0 &&
      formData.commission <= 100 &&
      formData.partnership >= 0 &&
      formData.partnership <= 100 &&
      formData.password.trim() !== "" &&
      formData.password === formData.confirmPassword &&
      formData.masterPassword.trim() !== "" &&
      (!formData.rollingCommissionChecked ||
        Object.values(formData.rollingCommission).every(
          (value) => value !== ""
        )) &&
      (!formData.agentRollingCommissionChecked ||
        Object.values(formData.agentRollingCommission).every(
          (value) => value !== ""
        ))
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "username") {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
      return;
    }

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

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long.";
    }

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.role) newErrors.role = "Role selection is required.";
    if (formData.commission < 0 || formData.commission > 100)
      newErrors.commission = "Commission must be between 0 and 100.";
    if (formData.partnership < 0 || formData.partnership > 100)
      newErrors.partnership = "Partnership must be between 0 and 100.";

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase and one lowercase letter.";
    }

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
        window.location.reload();
        dispatch(setStartFetchData());
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
      <h2 className="flex text-white font-custom text-[15px] font-semibold mb-4 py-2 px-2 bg-gradient-blue">
        Add Master
        <IoClose
          onClick={closeModal}
          className="cursor-pointer text-white text-2xl ml-auto"
        />
      </h2>
      <form onSubmit={handleSubmit} className="md:px-6 px-4">
        <div className="flex flex-col gap-2.5">
          {/* Username */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {/* Validation messages */}
              {formData.username.length > 0 && formData.username.length < 4 && (
                <div className="text-red-500 text-sm">
                  Username must be at least 4 characters long.
                </div>
              )}
              {errors.username && (
                <div className="text-red-500 text-sm">{errors.username}</div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Name
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>
          </div>

          {/* Account Type */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
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
                className="w-full h-8 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              >
                <option value="" disabled>
                  Select Role
                </option>
                {role
                  ?.filter(({ role_name }) => {
                    if (userData?.data?.role_name === "super-admin") {
                      return role_name === "sub-admin" ; // Super can assign Master & Agent
                    } else if (userData?.data?.role_name === "sub-admin") {
                      return role_name === "white-level"; // Master can only assign Agent
                    } else if (userData?.data?.role_name === "white-level") {
                      return (
                        role_name === "super" ||
                        role_name === "master" ||
                        role_name === "agent"
                      );
                    } else if (userData?.data?.role_name === "super") {
                      return role_name === "master" || role_name === "agent";
                    } else if (userData?.data?.role_name === "master") {
                      return role_name === "agent";
                    }
                    return false; // Default case (if userData is not super/master)
                  })
                  .map(({ _id, role_name }, index) => (
                    <option key={index} value={_id}>
                      {role_name}
                    </option>
                  ))}
              </select>
              {errors.role && (
                <div className="text-red-500 text-sm">{errors.role}</div>
              )}
            </div>
          </div>

          {/* Account Type */}

          {/* <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
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
                      (userData?.data?.role_name !== "master" ||
                        role_name !== "master") &&
                      role_name !== "user"
                  )
                  .map(({ _id, role_name }, index) => (
                    <option key={index} value={_id}>
                      {role_name}
                    </option>
                  ))}
              </select>
              {errors.role && (
                <div className="text-red-500 text-sm">{errors.role}</div>
              )}
            </div>
          </div> */}

          {/* Commission */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Commission (%) <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.commission && (
                <div className="text-red-500 text-sm">{errors.commission}</div>
              )}
            </div>
          </div>

          {/* Opening Balance */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Opening Balance <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.openingBalance && (
                <div className="text-red-500 text-sm">
                  {errors.openingBalance}
                </div>
              )}
            </div>
          </div>

          {/* Credit Reference */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Credit Reference <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="creditReference"
                value={formData.creditReference}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.creditReference && (
                <div className="text-red-500 text-sm">
                  {errors.creditReference}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.mobileNumber && (
                <div className="text-red-500 text-sm">
                  {errors.mobileNumber}
                </div>
              )}
            </div>
          </div>

          {/* Partnership */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Partnership <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="partnership"
                value={formData.partnership}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              {errors.partnership && (
                <div className="text-red-500 text-sm">{errors.partnership}</div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
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
          <div className="flex flex-col md:flex-row md:items-center">
            <label className=" w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <IoEyeOff size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </button>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Rolling Commission Checkbox */}
          <div className="flex flex-row items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Rolling Commission
            </label>
            <div
              className={`relative inline-flex items-center rounded-[4px] h-7 w-14 p-[2px] border border-whiteGray cursor-pointer transition-colors ${
                formData.rollingCommissionChecked
                  ? "bg-gradient-seablue"
                  : "bg-white"
              }`}
              onClick={() => {
                // Manually toggle the value of `rollingCommissionChecked`
                setFormData({
                  ...formData,
                  rollingCommissionChecked: !formData.rollingCommissionChecked, // toggle the value
                });
              }}
            >
              {/* Hidden Checkbox */}
              <input
                type="checkbox"
                name="rollingCommissionChecked"
                checked={formData.rollingCommissionChecked}
                onChange={handleChange}
                className="hidden"
              />

              {/* Cross (✗) when unchecked */}
              <span
                className={`absolute right-2 text-sm font-bold ${
                  formData.rollingCommissionChecked
                    ? "text-transparent"
                    : "text-whiteGray"
                }`}
              >
                ✗
              </span>

              {/* Checkmark (✓) when checked */}
              <span
                className={`absolute left-2 text-sm font-bold ${
                  formData.rollingCommissionChecked
                    ? "text-white"
                    : "text-transparent"
                }`}
              >
                ✓
              </span>

              {/* Toggle Knob */}
              <span
                className={`inline-block size-[21px] rounded-[2px] border border-whiteGray bg-white transform transition-transform ${
                  formData.rollingCommissionChecked
                    ? "translate-x-7"
                    : "translate-x-[1.5px]"
                }`}
              ></span>
            </div>
          </div>

          {/* Conditional Rendering for Rolling Commission Fields */}
          {formData.rollingCommissionChecked && (
            <div className="flex flex-col gap-2.5">
              {[
                "fancy",
                "matka",
                "casino",
                "binary",
                "sportbook",
                "bookmaker",
              ].map((field) => (
                <div
                  key={field}
                  className="flex flex-col md:flex-row md:items-center"
                >
                  <label className=" w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                    {field}
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name={`rollingCommission.${field}`}
                      value={formData.rollingCommission[field] || ""}
                      onChange={handleChange}
                      className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agent Rolling Commission Checkbox */}
          <div className="flex flex-row items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Agent Rolling Commission
            </label>
            <div
              className={`relative inline-flex items-center rounded-[4px] h-7 w-14 p-[2px] border border-whiteGray cursor-pointer transition-colors ${
                formData.agentRollingCommissionChecked
                  ? "bg-gradient-seablue"
                  : "bg-white"
              }`}
              onClick={() => {
                // Manually toggle the value of `agentRollingCommissionChecked`
                setFormData({
                  ...formData,
                  agentRollingCommissionChecked:
                    !formData.agentRollingCommissionChecked, // toggle the value
                });
              }}
            >
              {/* Hidden Checkbox */}
              <input
                type="checkbox"
                name="agentRollingCommissionChecked"
                checked={formData.agentRollingCommissionChecked}
                onChange={handleChange}
                className="hidden"
              />

              {/* Cross (✗) when unchecked */}
              <span
                className={`absolute right-2 text-sm font-bold ${
                  formData.agentRollingCommissionChecked
                    ? "text-transparent"
                    : "text-whiteGray"
                }`}
              >
                ✗
              </span>

              {/* Checkmark (✓) when checked */}
              <span
                className={`absolute left-2 text-sm font-bold ${
                  formData.agentRollingCommissionChecked
                    ? "text-white"
                    : "text-transparent"
                }`}
              >
                ✓
              </span>

              {/* Toggle Knob */}
              <span
                className={`inline-block size-[21px] rounded-[2px] border border-whiteGray bg-white transform transition-transform ${
                  formData.agentRollingCommissionChecked
                    ? "translate-x-7"
                    : "translate-x-[1.5px]"
                }`}
              ></span>
            </div>

            {/* Hidden checkbox input */}
            <input
              type="checkbox"
              name="agentRollingCommissionChecked"
              checked={formData.agentRollingCommissionChecked}
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Conditional Rendering for Agent Rolling Commission Fields */}
          {formData.agentRollingCommissionChecked && (
            <div className="flex flex-col gap-2.5">
              {[
                "fancy",
                "matka",
                "casino",
                "binary",
                "sportbook",
                "bookmaker",
              ].map((field) => (
                <div
                  key={field}
                  className="flex flex-col md:flex-row md:items-center"
                >
                  <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                    {field}
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      name={`agentRollingCommission.${field}`}
                      value={formData.agentRollingCommission[field] || ""}
                      onChange={handleChange}
                      className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Master Password */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
              Master Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1">
              <input
                type={showMasterPassword ? "text" : "password"}
                name="masterPassword"
                value={formData.masterPassword}
                onChange={handleChange}
                required
                className="w-full h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowMasterPassword(!showMasterPassword)}
              >
                {showMasterPassword ? (
                  <IoEyeOff size={20} />
                ) : (
                  <IoEye size={20} />
                )}
              </button>
            </div>
            {errors.masterPassword && (
              <div className="text-red-500 text-sm">
                {errors.masterPassword}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded mb-2 ${
                isFormValid()
                  ? "bg-gradient-seablue hover:bg-gradient-seablue"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isSubmitting || !isFormValid()}
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
