import axios from "axios";
import { BASE_URL } from "../Constant/Api";
import { toast } from "react-toastify";


export const getBetlistData  = async (url) => {
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
      if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
        localStorage.clear(); 
        toast.error("Session expired. Please log in again.");
      }
      console.error("API error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "An error occurred, please try again.");
    }
  };
  