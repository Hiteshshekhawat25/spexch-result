import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetForm } from "../../../Store/SuperAdminFormSlice";
import { globalsettingsPostAPIAuth } from "../../SuperAdminServices"

const SuperAdminForm = () => {
  const formData = useSelector((state) => state.superAdminForm);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the shared API utility for form submission
      const response = await globalsettingsPostAPIAuth("admin/v1/admin/createGlobalSettings", formData);

      if (response.status === 200) {
        alert("Form submitted successfully!");
        dispatch(resetForm()); // Reset form after successful submission
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded"
    >
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="col-span-1">
            <label className="block text-gray-700 text-lg  font-bold mb-2 capitalize ">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => alert("Place Bet Allow Only In InPlay Mode")}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Place Bet Allow Only In InPlay Mode
        </button>
      </div>
    </form>
  );
};

export default SuperAdminForm;
