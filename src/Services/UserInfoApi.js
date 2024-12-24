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
