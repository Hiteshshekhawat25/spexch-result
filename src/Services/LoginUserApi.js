
import axios from 'axios';
import { toast } from 'react-toastify';

export const loginUser = async (endpoint, username, password) => {
  try {
    const res = await axios.post(
      endpoint, 
      { username, password },  // Pass username and password as the request body
      {
        headers: {
          'Content-Type': 'application/json',  // Ensure the content type is JSON
        },
      }
    );

    if (res.data.success === false) {
      toast.error(res.data.message, {
        autoClose: 2000,
      });
      return res;
    }

    // Return the user data if login is successful
    return res.data;  // Contains the user data or token

  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message || "Failed to login", {
      autoClose: 2000,
    });
  }
};
