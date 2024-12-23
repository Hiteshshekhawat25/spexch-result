import axios from "axios";
import { BASE_URL } from "../../Constant/Api";

// Helper function to handle invalid token and user feedback
const handleInvalidToken = () => {
  localStorage.clear(); // Clear storage if token is invalid
  alert("Your session has expired. Please log in again.");
};

// POST with Authorization
export const globalsettingsPostAPIAuth = async (url, params = {}) => {
  const token = localStorage.getItem("authToken");
  console.log(token);

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.post(`${BASE_URL}/${url}`, params, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response?.data?.message === "Invalid token") {
      handleInvalidToken(); // Clear storage and inform the user
    }
    console.error("POST Error:", error); // Logging the error
    throw error; // Re-throw the error for handling in the form
  }
};

// GET with Authorization
export const globalsettingsGetAPIAuth = async (url, params = {}) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/${url}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params, // Pass query parameters if needed
    });
    return response;
  } catch (error) {
    if (error.response?.data?.message === "Invalid token") {
      handleInvalidToken(); // Clear storage and inform the user
    }
    console.error("GET Error:", error); // Logging the error
    throw error; // Re-throw the error for handling in the component
  }
};

// PUT with Authorization
export const globalsettingsPutAPIAuth = async (url, params = {}) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.put(`${BASE_URL}/${url}`, params, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response?.data?.message === "Invalid token") {
      handleInvalidToken(); // Clear storage and inform the user
    }
    console.error("PUT Error:", error); // Logging the error
    throw error; // Re-throw the error for handling in the form
  }
};

