// src/utils/api.js

import { BASE_URL } from "../Constant/Api";
import axios from 'axios';
// import { toast } from 'react-toastify';

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

export const saveClientApi = async (endpoint, body, token, role) => {
  console.log("body", body);
  try {
    const res = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
      },
    });
    // console.log("Res", res);

    if (res.data.success === false) {
      toast.error(res.data.message, {
        autoClose: 2000,
      });


      return res;

    }
    return res;

  } catch (error) {
    console.log(error);
  }
};

// APi for fetching roles
export const fetchRoles = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/v1/user/get-role`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Return the roles data if the request is successful
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw new Error(error.message || "Failed to fetch roles.");
  }
};

//get user details by id
export const fetchUserDetails = async (token, userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/v1/user/get-user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data.data)

    // Return the user details if the request is successful
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error(error.message || "Failed to fetch user details.");
  }
};

//get api to update game Action
