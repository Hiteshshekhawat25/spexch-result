import React, { useState, useEffect, useRef } from "react";
import { saveClientApi } from "../../Services/FormDataApi";
import { BASE_URL } from "../../Constant/Api";
import axios from "axios"; // For making API calls

export const AddClientForm = ({ closeModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [userRoleId, setUserRoleId] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
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
      bookmaker: 0,
    },
    masterPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    name: "",
    commission: "",
    openingBalance: "",
    creditReference: "",
    mobileNumber: "",
    exposureLimit: "",
    password: "",
    confirmPassword: "",
    masterPassword: "",
  });
  // const handleModalClose = () => {
  //   setIsModalOpen(false); // Close the modal
  //   // setSelectedUser(null); // Clear selected user data
  // };

  // const handleDeleteClick = (user) => {
  //   // setUserToDelete(user); // Directly calling the delete action (you wanted to avoid this)
  //   setIsModalOpen(true); // Open the delete confirmation modal
  // };


  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "Escape") {
  //       closeModal();
  //     }
  //   };

  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       console.log("close ")
  //       closeModal();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
      
  //     document.removeEventListener("keydown", handleKeyDown);
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [closeModal]);

  // Fetch token from localStorage
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

  // Fetch roles and extract user role ID
  useEffect(() => {
    if (token) {
      const fetchRoles = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/admin/v1/user/get-role`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const rolesArray = response.data.data;
          if (Array.isArray(rolesArray)) {
            const userRole = rolesArray.find(
              (role) => role.role_name === "user"
            );
            if (userRole) {
              setUserRoleId(userRole._id);
            } else {
              setError("User role not found.");
            }
          } else {
            setError("Roles data is not an array.");
          }
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
        rollingCommissionChecked: checked, // Toggle the checkbox state here
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
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
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

    // Convert rollingCommission values to numbers, ensuring empty fields are 0
    if (dataToSubmit.rollingCommissionChecked) {
      dataToSubmit.rollingCommission = Object.fromEntries(
        Object.entries(dataToSubmit.rollingCommission).map(([key, value]) => [
          key,
          value ? Number(value) : 0, // If empty, set to 0
        ])
      );
    }
    const dataWithAccountType = { ...dataToSubmit, role: userRoleId };

    try {
      const response = await saveClientApi(
        `${BASE_URL}/admin/v1/user/create-user`,
        dataWithAccountType,
        token
      );
      setSuccessMessage(
        response.data.message || "Client created successfully!"
      );
      closeModal();
    } catch (error) {
      setError(error.message || "An error occurred while creating the client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between">
          <label className="w-1/3">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.username && (
            <div className="text-red-500">{formErrors.username}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.name && (
            <div className="text-red-500">{formErrors.name}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Commission(%)</label>
          <input
            type="number"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.commission && (
            <div className="text-red-500">{formErrors.commission}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Opening Balance</label>
          <input
            type="number"
            name="openingBalance"
            value={formData.openingBalance}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.openingBalance && (
            <div className="text-red-500">{formErrors.openingBalance}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Credit Reference</label>
          <input
            type="number"
            name="creditReference"
            value={formData.creditReference}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.creditReference && (
            <div className="text-red-500">{formErrors.creditReference}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.mobileNumber && (
            <div className="text-red-500">{formErrors.mobileNumber}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Exposure Limit</label>
          <input
            type="number"
            name="exposureLimit"
            value={formData.exposureLimit}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.exposureLimit && (
            <div className="text-red-500">{formErrors.exposureLimit}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.password && (
            <div className="text-red-500">{formErrors.password}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.confirmPassword && (
            <div className="text-red-500">{formErrors.confirmPassword}</div>
          )}
        </div>
        <div className="flex justify-between">
          <label className="w-1/3">Master Password</label>
          <input
            type="password"
            name="masterPassword"
            value={formData.masterPassword}
            onChange={handleChange}
            className="w-2/3 border p-2"
            required
          />
          {formErrors.masterPassword && (
            <div className="text-red-500">{formErrors.masterPassword}</div>
          )}
        </div>
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
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="w-1/3">Fancy</label>
              <input
                type="number"
                name="rollingCommission.fancy"
                value={formData.rollingCommission.fancy || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3">Matka</label>
              <input
                type="number"
                name="rollingCommission.matka"
                value={formData.rollingCommission.matka || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3">Casino</label>
              <input
                type="number"
                name="rollingCommission.casino"
                value={formData.rollingCommission.casino || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3">Binary</label>
              <input
                type="number"
                name="rollingCommission.binary"
                value={formData.rollingCommission.binary || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3">Sportsbook</label>
              <input
                type="number"
                name="rollingCommission.sportsbook"
                value={formData.rollingCommission.sportsbook || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
            <div className="flex justify-between">
              <label className="w-1/3">Bookmaker</label>
              <input
                type="number"
                name="rollingCommission.bookmaker"
                value={formData.rollingCommission.bookmaker || 0}
                onChange={handleChange}
                className="w-2/3 border p-2"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-NavyBlue text-white p-2 mt-4"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {successMessage && (
          <div className="text-green-500 mt-4">{successMessage}</div>
        )}
      </form>
    </div>
  );
};
