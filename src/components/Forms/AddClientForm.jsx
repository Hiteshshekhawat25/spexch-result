import { useState, useEffect } from 'react';
import { saveClientApi } from '../../Utils/LoginApi'; // Make sure the correct path is used for the import
import CommonForm from './CommonForm';
import { BASE_URL } from '../../Constant/Api';

const AddClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch the token from localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const parsedToken = JSON.parse(storedToken)?.donation?.accessToken;
      setToken(parsedToken);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    if (!token) {
      setError("Token is missing. Please login again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage("");

    const endpoint = `${BASE_URL}admin/v1/user/create-user`; // Example endpoint
    console.log("endpoint", endpoint);
    console.log("formData ", formData);

    try {
      // Call the saveClientApi function with dynamic endpoint, form data, and token
      const response = await saveClientApi(endpoint, formData, token);
      console.log("response", response);
      setSuccessMessage(response.data.message || "Client created successfully!"); // Handle success message
    } catch (error) {
      setError(error.message || "An error occurred while creating the client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Assuming you have a CommonForm component that accepts handleSubmit as a prop */}
      <CommonForm
        formType="client"
        formTitle="Add Client"
        onSubmit={handleSubmit}
      />
      {/* Feedback Messages */}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {successMessage && (
        <div className="text-lightGreen mt-4">{successMessage}</div>
      )}
    </div>
  );
};

export default AddClientForm;
