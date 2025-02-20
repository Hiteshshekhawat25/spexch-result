// src/utils/api.js

import { toast } from "react-toastify";
import { BASE_URL } from "../Constant/Api";
import axios from 'axios';
// import { toast } from 'react-toastify';

// Function to perform the login API call
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ username, password }),
      
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || 'Invalid username or password');
    }

    const data = await response.json();
    console.log("login user new",data);
    return data; 

  } catch (error) {
    console.error("Login error:", error);

    throw error;
  }
};

export const saveClientApi = async (endpoint, body, token, role) => {
  console.log("body", body);
  try {
    const res = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        role: role,
      },
    });

    if (res.data.success === false) {
      toast.error(res.data.message, {
        autoClose: 2000,
      });


      return res;

    }
    return res;

  } catch (error) {
    console.log(error);
    return error
  }
};

// APi for fetching roles
export const fetchRoles = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/get-role`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Return the roles data if the request is successful
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw new Error(error.message || "Failed to fetch roles.");
  }
};

//get user details by id
export const fetchUserDetails = async ( userId) => {
        const token = localStorage.getItem("authToken");
  
  try {
    const response = await axios.get(`${BASE_URL}/user/get-user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data.data)

    // Return the user details if the request is successful
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error(error.message || "Failed to fetch user details.");
  }
};

//get api to get all users of selected master
export const fetchallUsers = async ( userId) => {
  const token = localStorage.getItem("authToken");

try {
const response = await axios.get(`${BASE_URL}/user/get-user-hierarchy/${userId}?page=1&limit=3`, {
headers: { Authorization: `Bearer ${token}` },
});

if(response?.data?.pagination?.totalUsers === 0) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa aaa', response)
  toast.error("No users availabe for this user");
  return response.data.data
}

console.log('get-user-hierarchy', response?.data?.pagination?.totalUsers)

// Return the user details if the request is successful
return response.data.data;
} catch (error) {
console.error("Error fetching user details:", error);
throw new Error(error.message || "Failed to fetch user details.");
}
};
