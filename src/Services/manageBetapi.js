import axios from "axios";
import { BASE_URL } from "../Constant/Api";
import { toast } from "react-toastify";


export const DeleteBet  = async (url,data) => {
    const token = localStorage.getItem("authToken");
  
    try {
      const response = await axios.post(`${BASE_URL}/${url}`,
        data
      , {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
        localStorage.clear(); 
        toast.error("Session expired. Please log in again.");
      }
      console.error("API error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "An error occurred, please try again.");
    }
  };


  export const RevertBet  = async (url,data) => {
    const token = localStorage.getItem("authToken");
  
    try {
      const response = await axios.post(`${BASE_URL}/${url}`,
        data
      , {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
        localStorage.clear(); 
        toast.error("Session expired. Please log in again.");
      }
      console.error("API error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "An error occurred, please try again.");
    }
  };