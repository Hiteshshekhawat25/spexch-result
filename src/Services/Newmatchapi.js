import axios from "axios";
import { BASE_URL } from "../Constant/Api";

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


// import axios from "axios";
// import {  BASE_URL } from "../Constant/Api";

// // POST with Authorization for Create New Match
// export const createNewMatchAPIAuth = async (url, params) => {
//     const token = localStorage.getItem("authToken");
  
//     try {
//       const response = await axios.post(`${BASE_URL}/${url}`, params, {
//         headers: {
//           "Content-Type": "application/json; charset=utf-8",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response;
//     } catch (error) {
//       if (error.response?.data?.message === "Invalid token") {
//         localStorage.clear(); // Clear storage if token is invalid
//       }
//       throw error; // Re-throw the error for handling in the form
//     }
//   };
  
//   // GET with Authorization for Create New Match
//   export const getCreateNewMatchAPIAuth = async (url) => {
//     const token = localStorage.getItem("authToken");
  
//     try {
//       const response = await axios.get(`${BASE_URL}/${url}`, {
//         headers: {
//           "Content-Type": "application/json; charset=utf-8",
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response;
//     } catch (error) {
//       if (error.response?.data?.message === "Invalid token") {
//         localStorage.clear(); // Clear storage if token is invalid
//       }
//       throw error; // Re-throw the error for handling in the form
//     }
//   };
  
//   // POST with Authorization for Create New Manual Match
// // export const createNewManualMatchAPIAuth = async (url, params) => {
// //     const token = localStorage.getItem("authToken");
  
// //     try {
// //       const response = await axios.post(`${BASE_URL}/${url}`, params, {
// //         headers: {
// //           "Content-Type": "application/json; charset=utf-8",
// //           Accept: "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       return response;
// //     } catch (error) {
// //       if (error.response?.data?.message === "Invalid token") {
// //         localStorage.clear(); // Clear storage if token is invalid
// //       }
// //       throw error; // Re-throw the error for handling in the form
// //     }
// //   };
  
// //   // GET with Authorization for Create New Manual Match
// //   export const getCreateNewManualMatchAPIAuth = async (url) => {
// //     const token = localStorage.getItem("authToken");
  
// //     try {
// //       const response = await axios.get(`${BASE_URL}/${url}`, {
// //         headers: {
// //           "Content-Type": "application/json; charset=utf-8",
// //           Accept: "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       return response;
// //     } catch (error) {
// //       if (error.response?.data?.message === "Invalid token") {
// //         localStorage.clear(); // Clear storage if token is invalid
// //       }
// //       throw error; // Re-throw the error for handling in the form
// //     }
// //   };
  