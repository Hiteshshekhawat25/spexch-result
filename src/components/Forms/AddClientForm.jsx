import React, { useState, useEffect, useRef } from "react";
import { saveClientApi } from "../../Services/FormDataApi";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios"; // For making API calls
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import { useDispatch } from "react-redux";
import {
  setDownlineData,
  setStartFetchData,
} from "../../Store/Slice/downlineSlice";
import { fetchDownlineData } from "../../Services/Downlinelistapi";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";

export const AddClientForm = ({ closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [userRoleId, setUserRoleId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();

  const initialFormData = {
    username: "",
    name: "",
    commission: "",
    openingBalance: "",
    creditReference: "",
    mobileNumber: "",
    exposureLimit: "",
    password: "",
    confirmPassword: "",
    rollingCommission: {
      fancy: "0",
      matka: "0",
      casino: "0",
      binary: "0",
      sportbook: "0",
      bookmaker: "0",
    },
    masterPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const checkFormValidity = () => {
      const {
        username,
        name,
        commission,
        openingBalance,
        creditReference,
        mobileNumber,
        exposureLimit,
        password,
        confirmPassword,
        masterPassword,
      } = formData;

      const isValid =
        username.length >= 4 &&
        name &&
        commission &&
        openingBalance &&
        creditReference &&
        mobileNumber &&
        exposureLimit &&
        password &&
        confirmPassword &&
        masterPassword &&
        password === confirmPassword &&
        commission >= 0 &&
        commission <= 100 &&
        openingBalance >= 0 &&
        creditReference >= 0 &&
        exposureLimit >= 0;

      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData]);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
        setToken(parsedToken || storedToken);
      } catch {
        setToken(storedToken);
      }
    } else {
      setError("Token is missing. Please login again.");
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchRoles = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/user/get-role`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const rolesArray = response.data.data;
          const userRole = rolesArray.find((role) => role.role_name === "user");
          setUserRoleId(userRole?._id || null);
        } catch (error) {
          setError(error.message || "Failed to fetch roles.");
        }
      };
      fetchRoles();
    }
  }, [token]);

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

    if (name === "rollingCommissionChecked") {
      setFormData((prevData) => ({
        ...prevData,
        rollingCommissionChecked: checked,
      }));
    } else if (name.startsWith("rollingCommission")) {
      const [parentKey, key] = name.split(".");

      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [key]: type === "checkbox" ? checked : value ? Number(value) : 0,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.username) {
      errors.username = "Username is required.";
    } else if (formData.username.length < 4) {
      errors.username = "Username must be at least 4 characters long.";
    }

    if (!formData.name) errors.name = "Name is required.";
    if (formData.commission < 0 || formData.commission > 100)
      errors.commission = "Commission must be between 0 and 100.";
    if (formData.openingBalance < 0)
      errors.openingBalance = "Opening balance must be a positive number.";
    if (formData.creditReference < 0)
      errors.creditReference = "Credit reference must be a positive number.";
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required.";
    }
    if (formData.exposureLimit < 0)
      errors.exposureLimit = "Exposure limit must be a positive number.";

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase and one lowercase letter.";
    }

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords must match.";

    if (!formData.masterPassword)
      errors.masterPassword = "Master password is required.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!token) {
      setError("Token is missing. Please login again.");
      return;
    }
    if (!userRoleId) {
      setError("User role ID is not available. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    const { confirmPassword, rollingCommissionChecked, ...dataToSubmit } =
      formData;
    if (rollingCommissionChecked) {
      dataToSubmit.rollingCommission = Object.fromEntries(
        Object.entries(dataToSubmit.rollingCommission || {}).map(
          ([key, value]) => [key, value ? Number(value) : 0]
        )
      );
    }

    const dataWithAccountType = { ...dataToSubmit, role: userRoleId };

    try {
      const response = await saveClientApi(
        `${BASE_URL}/user/create-user`,
        dataWithAccountType,
        token
      );
      console.log(response);

      // toast.success(response.data.message || "Client created successfully!");
      // window.location.reload();

      setTimeout(() => {
        handleCloseModal();
        dispatch(setStartFetchData());
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the client."
      );
      // toast.error("Cannot create duplicate username");
    } finally {
      setIsSubmitting(false);
    }
    // handleCloseModal();
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setError(null);
    setSuccessMessage("");
    closeModal();
  };

  return (
    <div className="bg-white shadow-lg">
      <h2 className="flex text-white font-custom text-[15px] font-semibold mb-4 py-2 px-2 bg-gradient-blue">
        Add User
        <IoClose
          onClick={closeModal}
          className="cursor-pointer text-white text-2xl ml-auto"
        />
      </h2>
      <form
        onSubmit={handleSubmit}
        className="gap-2.5 md:px-6 px-4 flex flex-col"
      >
        <div className="w-full flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Username<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username..."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formData.username.length > 0 && formData.username.length < 4 && (
          <div className="text-red-500 ml-1 text-sm ml-[33%]">
            Username must be at least 4 characters long.
          </div>
        )}
        {formErrors.username && (
          <div className="text-red-500 ml-1 text-sm ml-[33%]">
            {formErrors.username}
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name..."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Commission(%)<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="commission"
            value={formData.commission}
            placeholder="Commission.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formErrors.commission && (
          <div className="text-red-500 ml-1">{formErrors.commission}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Opening Balance<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="openingBalance"
            placeholder="OpeningBalance.."
            value={formData.openingBalance}
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formErrors.openingBalance && (
          <div className="text-red-500 ml-1">{formErrors.openingBalance}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Credit Reference<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="creditReference"
            placeholder="CreditReference.."
            value={formData.creditReference}
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formErrors.creditReference && (
          <div className="text-red-500 ml-1">{formErrors.creditReference}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Mobile Number<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            placeholder="Mobile Number.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formErrors.mobileNumber && (
          <div className="text-red-500 ml-1">{formErrors.mobileNumber}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Exposure Limit<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="exposureLimit"
            value={formData.exposureLimit}
            placeholder="ExposureLimit.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
            required
          />
        </div>
        {formErrors.exposureLimit && (
          <div className="text-red-500 ml-1">{formErrors.exposureLimit}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Password<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative w-full md:w-2/3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              // pattern="^(?=.*[a-z])(?=.*[A-Z]).{2,}$"
              placeholder="Password.."
              onChange={handleChange}
              className="w-full h-8 p-2 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </span>
          </div>
        </div>
        {formErrors.password && (
          <div className="text-red-500 ml-1">{formErrors.password}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Confirm Password<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative w-full md:w-2/3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              // pattern="^(?=.*[a-z])(?=.*[A-Z]).{2,}$"
              placeholder="ConfirmPassword.."
              onChange={handleChange}
              className="w-full h-8 p-2 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              required
            />
            {formErrors.confirmPassword && (
              <div className="text-red-500 ml-1">
                {formErrors.confirmPassword}
              </div>
            )}
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? (
                <IoEyeOff size={20} />
              ) : (
                <IoEye size={20} />
              )}
            </span>
          </div>
        </div>
        {formErrors.confirmPassword && (
          <div className="text-red-500 ml-1">{formErrors.confirmPassword}</div>
        )}

        <div className="flex items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Rolling Commission
          </label>
          {/* <input
            type="checkbox"
            name="rollingCommissionChecked"
            checked={formData.rollingCommissionChecked}
            onChange={handleChange}
          /> */}
          <div
            className={`relative inline-flex items-center rounded-[4px] h-7 w-14 p-[2px] border border-whiteGray cursor-pointer transition-colors ${
              formData.rollingCommissionChecked
                ? "bg-gradient-seablue"
                : "bg-white"
            }`}
            onClick={() =>
              handleChange({
                target: {
                  name: "rollingCommissionChecked",
                  checked: !formData.rollingCommissionChecked,
                },
              })
            }
          >
            <span
              className={`absolute right-2 text-sm font-bold ${
                formData.rollingCommissionChecked
                  ? "text-transparent"
                  : "text-whiteGray"
              }`}
            >
              ✗
            </span>

            <span
              className={`absolute left-2 text-sm font-bold ${
                formData.rollingCommissionChecked
                  ? "text-white"
                  : "text-transparent"
              }`}
            >
              ✓
            </span>

            <span
              className={`inline-block size-[21px] border rounded-[2px] border-whiteGray bg-white transform transition-transform ${
                formData.rollingCommissionChecked
                  ? "translate-x-7"
                  : "translate-x-[1.5px]"
              }`}
            ></span>
          </div>
        </div>

        {formData.rollingCommissionChecked && (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                Fancy
              </label>
              <input
                type="text"
                name="rollingCommission.fancy"
                value={formData.rollingCommission.fancy || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                Matka
              </label>
              <input
                type="text"
                name="rollingCommission.matka"
                value={formData.rollingCommission.matka || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                Casino
              </label>
              <input
                type="text"
                name="rollingCommission.casino"
                value={formData.rollingCommission.casino || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                Binary
              </label>
              <input
                type="text"
                name="rollingCommission.binary"
                value={formData.rollingCommission.binary || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
                Sportbook
              </label>
              <input
                type="text"
                name="rollingCommission.sportbook"
                value={formData.rollingCommission.sportbook || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-1/3 capitalize text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1 ">
                Bookmaker
              </label>
              <input
                type="text"
                name="rollingCommission.bookmaker"
                value={formData.rollingCommission.bookmaker || 0}
                onChange={handleChange}
                className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <label className="w-full md:w-1/3 text-left md:text-left font-custom text-[13px] font-semibold text-[#333] md:mb-0 mb-1">
            Master Password<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative w-full md:w-2/3">
            <input
              type={showMasterPassword ? "text" : "password"}
              name="masterPassword"
              value={formData.masterPassword}
              // pattern="^(?=.*[a-z])(?=.*[A-Z]).{2,}$"
              placeholder="MasterPassword.."
              onChange={handleChange}
              className="w-full h-8 p-2 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700 text-[13px]"
              required
            />
            <span
              onClick={() => setShowMasterPassword(!showMasterPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showMasterPassword ? (
                <IoEyeOff size={20} />
              ) : (
                <IoEye size={20} />
              )}
            </span>
          </div>
        </div>
        {formErrors.masterPassword && (
          <div className="text-red-500 ml-1">{formErrors.masterPassword}</div>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`px-7 py-2 text-white rounded mb-2 ${
              isFormValid
                ? "bg-gradient-seablue hover:bg-gradient-seablue"
                : "bg-gray-400 cursor-not-allowed"
            } ${
              isSubmitting || !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Create"}
          </button>
        </div>
      </form>

      <ToastContainer autoClose={2000} draggable={true} />
    </div>
  );
};
