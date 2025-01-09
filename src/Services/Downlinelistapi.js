import axios from "axios";
import { BASE_URL } from "../Constant/Api";
import { toast } from "react-toastify";


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
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

export const getAccountStatementData = async (url) => {
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
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

export const getUserData = async (url) => {
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
      toast.error("Session expired. Please log in again.");
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
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

// POST with Authorization for Create New Match
export const createNewMatchAPIAuth = async (url, params) => {
  const token = localStorage.getItem("authToken");
  console.log("token", token)

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
      toast.error("Session expired. Please log in again.");
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
      toast.error("Session expired. Please log in again.");
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
export const fetchDownlineData = async (currentPage, entriesToShow, roleId) => {
  try {
    const token = localStorage.getItem("authToken");
    const params = {
      page: currentPage,
      limit: entriesToShow,
    };

    if (roleId) {
      params.role = roleId;
    }

    const response = await axios.get(`${BASE_URL}/user/get-user`, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : "Failed to fetch data");
  }
};



//api call to change status of accounts
export const updateUserStatus = async (userId, newStatus, password) => {
  const token = localStorage.getItem("authToken");
  console.log("token", token)

  try {
    const response = await axios.put(
      `${BASE_URL}/user/update-user-status`,
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
    return response?.data?.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

//to call withdraw or deposit api

// export const performTransaction = async (transactionType, data, token) => {
//   const apiUrl =
//     transactionType === "deposit"
//       ? `${BASE_URL}/user/deposit-amount`
//       : `${BASE_URL}/user/withdraw-amount`;

//   try {
//     const response = await axios.post(apiUrl, data, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data; // Return API response data
//   } catch (error) {
//     // Return error message
//     throw error.response?.data?.message || "An error occurred while processing the transaction.";
//   }
// };
export const performTransaction = async (transactionType, data, token) => {
  const apiUrl =
    transactionType === "D"
      ? `${BASE_URL}/user/deposit-amount`
      : transactionType === "W"
      ? `${BASE_URL}/user/withdraw-amount`
      : null;

  if (!apiUrl) {
    throw new Error("Invalid transaction type.");
  }

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


//api to get sports list 
export const getGamesList = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/games/getgames`,
      {
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

// api to update game status 
export const updateGameStatus = async (token, userId, gameId, active) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/user-game-status`,
      {
        userId,
        gameId,
        active,
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
    throw new Error(
      error.response ? error.response.data.message : "Failed to update game status"
    );
  }
};

export const getGameActionStatus = async (token, userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/user-game-status${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Failed to update game status"
    );
  }
};


// GET with Authorization for Create New Match
export const searchDownline = async (url) => {
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
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

export const getProfitLossData = async (url) => {
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
      toast.error("Session expired. Please log in again.");
    }
    // Handle other API errors
    console.error("API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An error occurred, please try again.");
  }
};

export const fetchUsersByStatus = async (status) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(
      `${BASE_URL}/user/get-user?page=1&limit=10&status=${status}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("repsonse in filter",response)
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};