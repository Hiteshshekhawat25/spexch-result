// src/Utils/getUserData.js

import axios from "axios";
import { BASE_URL } from "../Constant/Api";

export const getUserDatabyId = async (userId) => {
  // const userId = localStorage.getItem("userId");
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
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


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
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


export const putUserPassword = async (url, params) => {
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


export const changeUserPassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Auth token is missing. Please log in again.");
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/user/change-password`,
      {
        currentPassword,
        newPassword,
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
    if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
      localStorage.clear();
      alert("Session expired. Please log in again.");
    }
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to change password. Please try again.");
  }
};


export const putEditRollingCommission = async (url, params) => {
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