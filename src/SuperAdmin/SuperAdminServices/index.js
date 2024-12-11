import axios from "axios";
import {  BASE_URL } from "../../Constant/Api";

// POST with Authorization
export const globalsettingsPostAPIAuth = async (url, params) => {
  const token = localStorage.getItem("authToken");

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
      localStorage.clear(); // Clear storage if token is invalid
    }
    throw error; // Re-throw the error for handling in the form
  }
};

export const globalsettingsPutAPIAuth = async (url, params) => {
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
      if (error.response?.data?.message === "Invalid token") {
        localStorage.clear(); // Clear storage if token is invalid
      }
      throw error; // Re-throw the error for handling in the form
    }
  };