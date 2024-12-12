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

// Ensure you have this dependency for toast notifications

//  export const saveClientApi = async (endpoint, body, token) => {
//   try {
//     // Send the request using axios
//     const res = await axios.post(endpoint, body, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Ensure response data is available and check for success
//     if (res.data && res.data.success === false) {
//       toast.error(res.data.message || 'Something went wrong.', {
//         autoClose: 2000,
//       });
//       return { success: false, message: res.data.message || 'Unknown error' }; // Return a custom error response
//     }

//     return res; // Return the successful response
//   } catch (error) {
//     console.error('API call error:', error);
//     toast.error('Something went wrong. Please try again later.', {
//       autoClose: 2000,
//     });
//     // Provide a custom error response
//     return { success: false, message: error.message || 'An error occurred' };
//   }
// };

export const saveClientApi = async (endpoint, body, token) => {
  console.log("body",body);
  try {
    const res = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
console.log("Res",res);

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