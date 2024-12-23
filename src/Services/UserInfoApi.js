// src/Utils/getUserData.js

import axios from "axios";
import { BASE_URL } from "../Constant/Api";

// Function to fetch user data based on userId from localStorage
export const getUserData = async () => {
  const userId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("authToken");

  if (!userId || !token) {
    throw new Error("User ID or token is missing");
  }

  try {
    const response = await axios.get(`${BASE_URL}/user/get-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    
    // Return the response data
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
