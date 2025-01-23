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
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5'; 

export const AddClientForm = ({ closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [userRoleId, setUserRoleId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showMasterPassword, setShowMasterPassword] = useState(false);

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
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      sportbook: 0,
      bookmaker: 0,
    },
    masterPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [formErrors, setFormErrors] = useState({});

  // Fetch token from localStorage
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

  // Fetch roles and extract user role ID
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
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.name) errors.name = "Name is required.";
    if (formData.commission < 0 || formData.commission > 100)
      errors.commission = "Commission must be between 0 and 100.";
    if (formData.openingBalance < 0)
      errors.openingBalance = "Opening balance must be a positive number.";
    if (formData.creditReference < 0)
      errors.creditReference = "Credit reference must be a positive number.";
    if (!/^\d{10}$/.test(formData.mobileNumber))
      errors.mobileNumber = "Mobile number must be 10 digits.";
    if (formData.exposureLimit < 0)
      errors.exposureLimit = "Exposure limit must be a positive number.";
    if (!formData.password) errors.password = "Password is required.";
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

      toast.success(response.data.message || "Client created successfully!");
      // window.location.reload();

      // setTimeout(() => {
      handleCloseModal();
      dispatch(setStartFetchData());
      // }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the client."
      );
      toast.error("Cannot create duplicate username");
    } finally {
      setIsSubmitting(false);

      // dispatch(
      //   fetchDownlineData({
      //   })
      // );
    }
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
      <h2 className=" flex text-white font-custom font-semibold mb-4 py-2 px-2 bg-gradient-blue">
        Add User
        <IoClose
                    onClick={closeModal}
                    className="cursor-pointer text-white text-2xl ml-auto"
                  />
      </h2>
      <form onSubmit={handleSubmit} className="space-y-2 px-6 ">
        <div className="w-full flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Username<span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username..."
            onChange={handleChange}
            // className="w-2/3 border p-1"
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.username && (
          <div className="text-red-500">{formErrors.username}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name..."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Commission(%)<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="commission"
            value={formData.commission}
            placeholder="Commission.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.commission && (
          <div className="text-red-500">{formErrors.commission}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Opening Balance<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="openingBalance"
            placeholder="OpeningBalance.."
            value={formData.openingBalance}
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.openingBalance && (
          <div className="text-red-500">{formErrors.openingBalance}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Credit Reference<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="creditReference"
            placeholder="CreditReference.."
            value={formData.creditReference}
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.creditReference && (
          <div className="text-red-500">{formErrors.creditReference}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Mobile Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            placeholder="Mobile Number.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.mobileNumber && (
          <div className="text-red-500">{formErrors.mobileNumber}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Exposure Limit<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="exposureLimit"
            value={formData.exposureLimit}
            placeholder="ExposureLimit.."
            onChange={handleChange}
            className="w-full md:w-2/3 h-8 p-2 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
        </div>
        {formErrors.exposureLimit && (
          <div className="text-red-500">{formErrors.exposureLimit}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Password<span className="text-red-500">*</span>
          </label>
          
          <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    placeholder="Password.."
    onChange={handleChange}
    className="w-full p-1 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
    required
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
  >
    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
  </span>
</div>

        </div>
        {formErrors.password && (
          <div className="text-red-500">{formErrors.password}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-sm font-medium">
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="ConfirmPassword.."
            onChange={handleChange}
            className="w-full p-1 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
           <span
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
  >
    {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
  </span>
          </div>
        </div>
        {formErrors.confirmPassword && (
          <div className="text-red-500">{formErrors.confirmPassword}</div>
        )}
        <div className="flex flex-col md:flex-row justify-between">
          <label className="w-full md:w-1/3 text-center md:text-left font-custom text-xm font-medium">
            Master Password<span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
          <input
            type="password"
            name="masterPassword"
            placeholder="MasterPassword.."
            value={formData.masterPassword}
            onChange={handleChange}
            className="w-full p-1 border border-lightGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
            required
          />
          <span
    onClick={() => setShowMasterPassword(!showMasterPassword)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
  >
    {showMasterPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
  </span>
  </div>
        </div>
        {formErrors.masterPassword && (
          <div className="text-red-500">{formErrors.masterPassword}</div>
        )}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="rollingCommissionChecked"
            checked={formData.rollingCommissionChecked}
            onChange={handleChange}
          />
          <label className="ml-2">Enable Rolling Commission</label>
        </div>

        {formData.rollingCommissionChecked && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">Fancy</label>
              <input
                type="text"
                name="rollingCommission.fancy"
                value={formData.rollingCommission.fancy}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">Matka</label>
              <input
                type="text"
                name="rollingCommission.matka"
                value={formData.rollingCommission.matka}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">Casino</label>
              <input
                type="text"
                name="rollingCommission.casino"
                value={formData.rollingCommission.casino}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">Binary</label>
              <input
                type="text"
                name="rollingCommission.binary"
                value={formData.rollingCommission.binary}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">
                Sportbook
              </label>
              <input
                type="text"
                name="rollingCommission.sportbook"
                value={formData.rollingCommission.sportbook}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3 text-left font-custom ">Bookmaker</label>
              <input
                type="text"
                name="rollingCommission.bookmaker"
                value={formData.rollingCommission.bookmaker}
                onChange={handleChange}
                className="w-2/3 p-1 border border-whiteGray rounded focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-ashGray text-white rounded mb-2"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      <ToastContainer autoClose={2000} draggable={true} />
    </div>
  );
};
