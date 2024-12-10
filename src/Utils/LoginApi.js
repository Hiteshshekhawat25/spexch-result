// src/utils/api.js

import { BASE_URL } from "../Constant/Api";  // Ensure BASE_URL is imported correctly

// Function to perform the login API call
export const loginUser = async (username, password) => {
  try {
    // Ensure the URL is correctly interpolated
    const response = await fetch(`${BASE_URL}/admin/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Send the data as a JSON string
    });

    // Check if the response status is okay (status 200-299)
    if (!response.ok) {
      // Optionally log the response for debugging
      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || 'Invalid username or password');
    }

    // Parse the successful response
    const data = await response.json();
    return data; // Returns user data if successful

  } catch (error) {
    // Log the error to the console for debugging
    console.error("Login error:", error);

    // Rethrow the error to be handled by the caller
    throw error;
  }
};

export const saveClientApi = async (clientData) => {
  try {
    const response = await fetch(`${BASE_URL}admin/v1/user/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      // Handle non-JSON errors (e.g., network errors or unexpected responses)
      let errorMessage = 'Something went wrong. Please try again later.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error("Non-JSON error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    return await response.json(); // Return the parsed response data

  } catch (error) {
    console.error("API call error:", error.message || error);
    throw error; // Rethrow for the caller to handle
  }
};
