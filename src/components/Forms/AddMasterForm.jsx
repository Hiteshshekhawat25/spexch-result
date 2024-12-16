import React, { useEffect, useState } from "react";
import { fetchRoles, saveClientApi } from "../../Utils/LoginApi";
import { BASE_URL } from "../../Constant/Api";
import { toast, ToastContainer } from "react-toastify";

export const AddMasterForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "",
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

  // Validation
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
      role: roleId, // Pass role_id here
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
        `${BASE_URL}/admin/v1/user/create-user`,
        submitData,
        token
      );

      if (response.data.success) {
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
        toast.success(response?.data?.message || "Master created Successfully");
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to save master.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while saving the master."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Master</h2>
      <form onSubmit={handleSubmit}>
        <table className="w-full">
          <tbody>
            {/* Username */}
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
                {errors.username && (
                  <div className="text-red-500 text-sm">{errors.username}</div>
                )}
              </td>
            </tr>

            {/* Name */}
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
                {errors.username && (
                  <div className="text-red-500 text-sm">{errors.username}</div>
                )}
              </td>
            </tr>

            {/* Account Type */}
            <tr>
              <td className="text-left py-2 font-semibold">Account Type</td>
              <td>
                {/* <select
                  name="role"
                  value={formData.role || ""}
                  onChange={(e) => {
                    handleChange(e);
                    handleRoleSelection(e.target.value);
                  }}
                  className="w-full p-2 border rounded"
                >c{console.log(formData)}
                  <option value="" disabled>
                    Select Role
                  </option>
                  {role?.map(({ role_id, role_name }, index) => (
                    <option key={index} value={role_id}>
                      {role_name}
                    </option>
                  ))}
                </select> */}
                <select
                  name="role"
                  value={formData.role || ""}
                  onChange={(e) => {
                    handleChange(e);
                    handleRoleSelection(e.target.value); // Pass the selected role_id
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {console.log("roles",role)}
                  {role?.map(({ _id, role_name }, index) => (
                    <option key={index} value={_id}>
                      {" "}
                      {/* Pass role_id as value */}
                      {role_name}
                      {console.log(_id)}
                    </option>
                  ))}
                </select>

                {errors.role && (
                  <div className="text-red-500 text-sm">{errors.role}</div>
                )}
              </td>
            </tr>

            {/* Commission */}
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
                {errors.commission && (
                  <div className="text-red-500 text-sm">
                    {errors.commission}
                  </div>
                )}
              </td>
            </tr>

            {/* Opening Balance */}
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
                {errors.openingBalance && (
                  <div className="text-red-500 text-sm">
                    {errors.openingBalance}
                  </div>
                )}
              </td>
            </tr>

            {/* Credit Reference */}
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
                {errors.creditReference && (
                  <div className="text-red-500 text-sm">
                    {errors.creditReference}
                  </div>
                )}
              </td>
            </tr>

            {/* Mobile Number */}
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
                {errors.mobileNumber && (
                  <div className="text-red-500 text-sm">
                    {errors.mobileNumber}
                  </div>
                )}
              </td>
            </tr>

            {/* Partnership */}
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
                {errors.partnership && (
                  <div className="text-red-500 text-sm">
                    {errors.partnership}
                  </div>
                )}
              </td>
            </tr>

            {/* Password */}
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
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}
              </td>
            </tr>

            {/* Confirm Password */}
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
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </div>
                )}
              </td>
            </tr>

            {/* Rolling Commission Checkbox */}
            <tr>
              <td colSpan="2" className="py-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="rollingCommissionChecked"
                    checked={formData.rollingCommissionChecked}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Rolling Commission
                </label>
              </td>
            </tr>

            {/* Rolling Commission Fields */}
            {formData.rollingCommissionChecked && (
              <tr>
                <td colSpan="2">
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
                      <label className="w-1/3">sportbook</label>
                      <input
                        type="number"
                        name="rollingCommission.sportbook"
                        value={formData.rollingCommission.sportbook || 0}
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
                </td>
              </tr>
            )}

            {/* Agent Rolling Commission Checkbox */}
            <tr>
              <td colSpan="2" className="py-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="agentRollingCommissionChecked"
                    checked={formData.agentRollingCommissionChecked}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Agent Rolling Commission
                </label>
              </td>
            </tr>

            {/* Agent Rolling Commission Fields */}
            {formData.agentRollingCommissionChecked && (
              <tr>
                <td colSpan="2">
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
                      <label className="w-1/3">Sportbook</label>
                      <input
                        type="number"
                        name="agentRollingCommission.sportbook"
                        value={formData.agentRollingCommission.sportbook || 0}
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
                </td>
              </tr>
            )}

            {/* Master Password */}
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
                {errors.masterPassword && (
                  <div className="text-red-500 text-sm">
                    {errors.masterPassword}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="w-full py-2 bg-NavyBlue text-white rounded mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer autoClose={2000} draggable={true} />
    </div>
  );
};
