import PropTypes from "prop-types";
import { useState } from "react";

const CommonForm = ({ formType, formTitle, onSubmit }) => {
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
    rollingCommission: false,
    fancy: "",
    matka: "",
    casino: "",
    binary: "",
    sportbook: "",
    bookmaker: "",
    masterPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Enforce positive values for number inputs
    if (type === "number" && value < 0) {
      return; // Prevent updating with negative values
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg text-center"
    >
      <h2 className="text-xl font-bold mb-2">{formTitle}</h2>

      {/* Input Fields */}
      {[
        { label: "Username", name: "username", type: "text", required: true },
        { label: "Name", name: "name", type: "text", required: true },
        {
          label: "Commission (%)",
          name: "commission",
          type: "number",
          required: true,
        },
        {
          label: "Opening Balance",
          name: "openingBalance",
          type: "number",
          required: true,
        },
        { label: "Credit Reference", name: "creditReference", type: "number" },
        {
          label: "Mobile Number",
          name: "mobileNumber",
          type: "text",
          required: true,
        },
        { label: "Exposure Limit", name: "exposureLimit", type: "number" },
        {
          label: "Password",
          name: "password",
          type: "password",
          required: true,
        },
        {
          label: "Confirm Password",
          name: "confirmPassword",
          type: "password",
          required: true,
        },
      ].map((field) => (
        <div key={field.name} className="mb-4 flex items-center">
          <label
            className="w-2/4 text-sm font-medium text-right pr-4"
            htmlFor={field.name}
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            className="w-2/3 p-2 border border-gray-300 rounded"
            onChange={handleChange}
            value={formData[field.name] ?? ""} 
            required={field.required}
            min={field.type === "number" ? 0 : undefined} // Enforce positive numbers for number fields
          />
        </div>
      ))}

      {/* Rolling Commission Checkbox */}
      <div className="mb-4 flex items-center">
        <label
          className="w-2/4 text-sm font-medium text-right pr-4"
          htmlFor="rollingCommission"
        >
          Rolling Commission
        </label>
        <input
          type="checkbox"
          id="rollingCommission"
          name="rollingCommission"
          className="mr-2"
          onChange={handleChange}
          checked={formData?.rollingCommission ?? false}
        />
      </div>

      {/* Additional Fields for Rolling Commission */}
      {formData?.rollingCommission &&
        ["Fancy", "Matka", "Casino", "Binary", "Sportbook", "Bookmaker"].map(
          (field) => (
            <div key={field} className="mb-4 flex items-center">
              <label
                className="w-2/4 text-sm font-medium text-right pr-4"
                htmlFor={field.toLowerCase()}
              >
                {field}
              </label>
              <input
                type="number"
                id={field.toLowerCase()}
                name={field.toLowerCase()}
                className="w-2/3 p-2 border border-gray-300 rounded"
                onChange={handleChange}
                value={formData?.[field.toLowerCase()] ?? ""} // Optional chaining for accessing dynamic field values
                min="0" // Enforce positive numbers for these fields
              />
            </div>
          )
        )}

      {/* Master Password */}
      <div className="mb-4 flex items-center">
        <label
          className="w-2/4 text-sm font-medium text-right pr-4"
          htmlFor="masterPassword"
        >
          Master Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="masterPassword"
          name="masterPassword"
          className="w-2/3 p-2 border border-gray-300 rounded"
          onChange={handleChange}
          value={formData?.masterPassword ?? ""} // Optional chaining for master password value
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-4 py-2 bg-NavyBlue text-white rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

CommonForm.propTypes = {
  formType: PropTypes.string.isRequired,
  formTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CommonForm;
