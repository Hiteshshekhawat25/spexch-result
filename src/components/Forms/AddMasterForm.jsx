import React, { useEffect, useState } from "react";
import { fetchRoles, saveClientApi } from "../../Utils/LoginApi";
import { BASE_URL } from "../../Constant/Api";
import { toast } from "react-toastify";

export const AddMasterForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: " ",
    commission: 10,
    openingBalance: 0,
    creditReference: "",
    mobileNumber: "",
    partnership: 10,
    password: "",
    confirmPassword: "",
    rollingCommission: {
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      bookmaker: 0,
    },
    agentRollingCommission: {
      fancy: 0,
      matka: 0,
      casino: 0,
      binary: 0,
      sportsbook: 0,
      bookmaker: 0,
    },
    masterPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userRoleId, setUserRoleId] = useState(null); // Store the role ID for "user"

  // // Handle input changes
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   if (type === "checkbox") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: checked,
  //     }));
  //   } else if (
  //     name.includes("rollingDetails") ||
  //     name.includes("agentRollingDetails")
  //   ) {
  //     const [field, key] = name.split(".");
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [field]: {
  //         ...prevData[field],
  //         [key]: value,
  //       },
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (
      name.includes("rollingDetails") ||
      name.includes("agentRollingDetails")
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

  // Fetch token from localStorage and validate
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
        setToken(parsedToken || storedToken); // Use parsed or raw token
      } catch {
        setToken(storedToken); // Fall back to raw token
      }
    } else {
      setError("Token is missing. Please login again.");
    }
  }, []);

  // Fetch roles and extract user role ID
  useEffect(() => {
    if (token) {
      const fetchUserRoles = async () => {
        try {
          const rolesArray = await fetchRoles(token); // Fetch roles
          console.log("rolesArray", rolesArray);

          if (Array.isArray(rolesArray)) {
            // Map roles to an array of { role_name, role_id }
            const rolesData = rolesArray.map((role) => ({
              role_name: role.role_name,
              role_id: role._id,
            }));
            console.log("rolesData", rolesData);

            setRole(rolesData);
          } else {
            setError("Roles data is not an array.");
          }
        } catch (error) {
          setError(error.message || "Failed to fetch roles.");
        }
      };
      fetchUserRoles();
    }
  }, [token]);

  const handleRoleSelection = (roleId) => {
    setFormData((prevData) => ({
      ...prevData,
      role: roleId, // Set role_id in formData directly
    }));
  };

  // Handle form submission for both user and master creation
  const handleSubmit = async (e) => {
    console.log("formData", formData);
    e.preventDefault();

    if (!token) {
      setError("Token is missing. Please login again.");
      return;
    }

    // if (!userRoleId) {
    //   setError("User role ID is not available. Please try again later.");
    //   return;
    // }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    // Prepare form data
    const {
      confirmPassword,
      rollingCommission,
      agentRollingCommission,
      ...submitData
    } = formData;
    console.log("formDate", formData);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    // If rollingCommission is not checked, remove the rollingDetails fields
    if (!rollingCommission) {
      delete submitData.rollingDetails;
    }

    // If agentRollingCommission is not checked, remove the agentRollingDetails fields
    if (!agentRollingCommission) {
      delete submitData.agentRollingDetails;
    }

    // Add role ID to form data
    const dataWithRole = { ...submitData }; // role_id is already part of submitData

    console.log("datawithrole", dataWithRole);

    try {
      const response = await saveClientApi(
        `${BASE_URL}/admin/v1/user/create-user`,
        dataWithRole,
        token
        // userRoleId
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message || "Master saved successfully!"
        );
        toast.success("Master saved successfully", { autoClose: 2000 });
        closeModal(); // Close the modal on success
      } else {
        setError(response.data.message || "Failed to save master.");
        toast.error(
          response.data.message || "Error occurred while saving the master",
          { autoClose: 2000 }
        );
      }
    } catch (error) {
      setError(error.message || "An error occurred while saving the master.");
      toast.error("Error occurred while saving the master", {
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Client</h2>
      <form onSubmit={handleSubmit}>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-left py-2 font-semibold">Username</td>
              <td>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Name</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Account Type</td>
              <td>
                <select
                  name="role"
                  value={formData.role || ""}
                  onChange={(e) => {
                    handleChange(e);
                    handleRoleSelection(e.target.value);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {role?.map(({ role_id, role_name }, index) => (
                    <option key={index} value={role_id}>
                      {role_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Commission (%)</td>
              <td>
                <input
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Opening Balance</td>
              <td>
                <input
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Credit Reference</td>
              <td>
                <input
                  type="text"
                  name="creditReference"
                  value={formData.creditReference}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Mobile Number</td>
              <td>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Partnership</td>
              <td>
                <input
                  type="number"
                  name="partnership"
                  value={formData.partnership}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Password</td>
              <td>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td className="text-left py-2 font-semibold">Confirm Password</td>
              <td>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
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
            {formData.agentRollingCommission && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="w-1/3">Fancy</label>
                  <input
                    type="number"
                    name="agentRollingCommission.fancy"
                    value={formData.agentRollingCommission.fancy || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="w-1/3">Matka</label>
                  <input
                    type="number"
                    name="agentRollingCommission.matka"
                    value={formData.agentRollingCommission.matka || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="w-1/3">Casino</label>
                  <input
                    type="number"
                    name="agentRollingCommission.casino"
                    value={formData.agentRollingCommission.casino || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="w-1/3">Binary</label>
                  <input
                    type="number"
                    name="agentRollingCommission.binary"
                    value={formData.agentRollingCommission.binary || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="w-1/3">Sportsbook</label>
                  <input
                    type="number"
                    name="agentRollingCommission.sportsbook"
                    value={formData.agentRollingCommission.sportsbook || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
                <div className="flex justify-between">
                  <label className="w-1/3">Bookmaker</label>
                  <input
                    type="number"
                    name="agentRollingCommission.bookmaker"
                    value={formData.agentRollingCommission.bookmaker || 0}
                    onChange={handleChange}
                    className="w-2/3 border p-2"
                  />
                </div>
              </div>
            )}

            <tr>
              <td className="text-left py-2 font-semibold">Master Password</td>
              <td>
                <input
                  type="password"
                  name="masterPassword"
                  value={formData.masterPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="py-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 text-white ${
                    isSubmitting ? "bg-NavyBlue" : "bg-NavyBlue"
                  } rounded`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {error && (
        <div className="text-red-500 mt-2">
          <strong>{error}</strong>
        </div>
      )}

      {successMessage && (
        <div className="text-green-500 mt-2">
          <strong>{successMessage}</strong>
        </div>
      )}
    </div>
  );
};
