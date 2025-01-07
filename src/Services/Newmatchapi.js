import axios from "axios";
import { BASE_URL } from "../Constant/Api";
import { toast } from "react-toastify";

// POST with Authorization for Create New Match
export const createNewMatchAPIAuth = async (url, params) => {
  const token = localStorage.getItem("authToken");
  console.log("token",token)

  try {
    const response = await axios.post(`${BASE_URL}/${url}`, params, {
      headers: {
       
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });
    return response;
    
   
  } catch (error) {
    // Handle specific token expiry case
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear(); // Clear localStorage if token is invalid
      alert("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
   
};

// GET with Authorization for Create New Match
export const getCreateNewMatchAPIAuth = async (url) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(`${BASE_URL}/${url}`, {
      headers: {
        
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    // Handle specific token expiry case
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear(); // Clear localStorage if token is invalid
      alert("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

export const putUpdateMatchAPIAuth = async (url, params) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.put(`${BASE_URL}/${url}`, params, {
      headers: {
        
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    // Handle specific token expiry case
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear(); // Clear localStorage if token is invalid
      alert("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};


export const deleteData = async (url) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.delete(`${BASE_URL}/${url}`, {
      headers: {
        
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    // Handle specific token expiry case
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear(); // Clear localStorage if token is invalid
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

// GET All Match List Api
export const getMatchList = async ( ) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(`${BASE_URL}/match/getAllMatchesSeries?page=1&limit=2`, {
      headers: {
        
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response",response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    // Handle specific token expiry case
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear();
      alert("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};


export const updateSessionResult = async (selectionId, result) => {
  try {
    const token = localStorage.getItem("authToken"); // Get the token from local storage
    const response = await fetch(`${BASE_URL}/user/update-session-result`, {
      method: "POST", // Use the correct HTTP method (PUT for updates)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the Authorization header
      },
      body: JSON.stringify({ selectionId, result }), // Pass selectionId and result
    });
    if (!response.ok) {
      throw new Error("Failed to update session result");
    }
    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error updating session result:", error);
    throw error;
  }
};
