import axios from "axios";
import { toast } from "react-toastify";

export const saveClientApi = async (endpoint, body, token, role) => {
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
    }
  };