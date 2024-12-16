import axios from "axios";
import { toast } from "react-toastify";

// APi for fetching roles
export const fetchRoles = async (endpoint, token, role) => {
    try {
      const res = await axios.get(endpoint, {
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
  
      // Return the roles data if the request is successful
      return res.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(error.message || "Failed to fetch roles", {
        autoClose: 2000,
      });
    }
  };