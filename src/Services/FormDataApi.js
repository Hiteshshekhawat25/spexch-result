// import axios from "axios";
// import { toast } from "react-toastify";

// export const saveClientApi = async (endpoint, body, token, role) => {
//     try {
//       const res = await axios.post(endpoint, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           role: role,
//         },
//       });
  
//       if (res.data.success === false) {
//         toast.error(res.data.message, {
//           autoClose: 2000,
//         });
  
  
//         return res;
  
//       }
//       return res;
  
//     } catch (error) {
//       console.log(error);
//     }
//   };
import axios from "axios";
import { toast } from "react-toastify";

export const saveClientApi = async (endpoint, body, token, role) => {
  const res = await axios.post(endpoint, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      role: role,
    },
  });

  console.log("res", res);
  
  // Handle success response
  if (res.data.success === true) {
    toast.success(res.data.message || "Operation successful", {
      autoClose: 2000,
    });
    return res;
  }

  // Handle failure response
  if (res.data.success === false) {
    toast.error(res.data.message || "Something went wrong", {
      autoClose: 2000,
    });
    return res;
  }

  // In case success flag is not true/false, display a general error
  toast.error("Unexpected error occurred.", {
    autoClose: 2000,
  });
  return res;
};

