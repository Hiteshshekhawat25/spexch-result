import axios from "axios";
import { BASE_URL } from "../Constant/Api";


export const getBalanceData = async (url) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(`${BASE_URL}/${url}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
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
        "Content-Type": "application/json; charset=utf-8",
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

// POST with Authorization for Create New Match
export const createNewMatchAPIAuth = async (url, params) => {
  const token = localStorage.getItem("authToken");
  console.log("token",token)

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
        "Content-Type": "application/json; charset=utf-8",
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
        "Content-Type": "application/json; charset=utf-8",
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

// Api to get list of everyone in downline list
export const fetchDownlineData = async (token, currentPage, entriesToShow) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/v1/user/get-user`,
      {
        params: { page: currentPage, limit: entriesToShow },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : "Failed to fetch data");
  }
};


//api call to change status of accounts
export const updateUserStatus = async (userId, newStatus, password) => {
  const token = localStorage.getItem("authToken");
  console.log("token",token)

  try {
    const response = await axios.put(
      `${BASE_URL}/admin/v1/user/update-user-status`,
      {
        userId,
        newStatus,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

//to call withdraw or deposit api

export const performTransaction = async (transactionType, data, token) => {
  const apiUrl =
    transactionType === "deposit"
      ? `${BASE_URL}/admin/v1/user/deposit-amount`
      : `${BASE_URL}/admin/v1/user/withdraw-amount`;

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Return API response data
  } catch (error) {
    // Return error message
    throw error.response?.data?.message || "An error occurred while processing the transaction.";
  }
};
