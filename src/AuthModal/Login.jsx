
import { useState,useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../Store/Slice/loginSlice";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../Utils/LoginApi";
import { useNavigate } from "react-router-dom";
import React from "react";
import { getUserData } from "../Services/UserInfoApi";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };


  // In your login component, or wherever the login process is handled
useEffect(() => {
  // Check if it's the user's first login by looking for `isFirstLogin` in localStorage
  if (localStorage.getItem("isFirstLogin") === null) {
    // If not found, it is the first time, set it to true
    localStorage.setItem("isFirstLogin", "true");
  }
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Start loading / login action
    dispatch(loginStart());
  
    try {
      const loginResponse = await loginUser(formData.username, formData.password);
      const { userId, token } = loginResponse?.data || {};
  
      if (!token || !userId) {
        throw new Error("Invalid login response from server");
      }
  
      // Store authentication details
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);
  
      // Fetch user data
      const userData = await getUserData();
      localStorage.setItem("userData", JSON.stringify(userData));
  
      // Log for debugging - Check if first login flag is set
      console.log("Checking isFirstLogin from localStorage:", localStorage.getItem("isFirstLogin"));
  
      // Check first-time login status
      const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";
  
      if (isFirstLogin) {
        console.log("First-time login detected, redirecting to change password...");
  
        // Set first-time login to false after redirecting
        localStorage.setItem("isFirstLogin", "false");
  
        // Dispatch login success and redirect to changePassword page
        dispatch(loginSuccess(loginResponse));
        navigate("/changePassword");
  
      } else {
        // Dispatch login success and redirect to dashboard
        dispatch(loginSuccess(loginResponse));
        navigate("/dashboardPage");
      }
  
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.error("Login failed:", error.message || "Unknown error");
  
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed!";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black p-6">
      <div className="w-full max-w-xl p-12 bg-gradient-black rounded-md shadow-2xl min-h-[450px]">
        <h1 className="text-3xl font-custom text-center text-white mb-6 mt-5">
          Spexch
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex justify-center mb-4">
            <input
              type="text"
              id="username"
              name="username"
              className="w-[250px] px-3 py-1.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <div className="absolute inset-y-0 right-[4%] sm:right-[4%] lg:right-[24%] flex items-center pr-3 text-gray-400">
              <FaUser color="black" />
            </div>
          </div>
          {!formData.username && (
            <p className="text-white text-sm w-[250px] sm:ml-[4%] lg:ml-[24%] text-left"style={{ marginTop: '-16px' }}>Please enter username</p>
          )}
          <div className="relative flex justify-center mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="w-[250px] px-3 py-1.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <div
              className="absolute inset-y-0 right-[4%] sm:right-[4%] lg:right-[24%] flex items-center pr-3 text-gray-400 cursor-pointer"
              onClick={handlePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
            </div>
          </div>
          {!formData.password && (
            <p className="text-white text-sm mt-0 w-[250px] sm:ml-[4%] lg:ml-[24%] text-left"style={{ marginTop: '-2px' }}>Please enter Password</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[250px] py-1.5 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-green hover:bg-gradient-green focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            
            >
              Login <IoLogOutOutline color="white" className="inline ml-0" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { IoLogOutOutline } from "react-icons/io5";
// import { toast } from "react-toastify";
// import {
//   loginStart,
//   loginSuccess,
//   loginFailure,
// } from "../Store/Slice/loginSlice";
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { loginUser } from "../Utils/LoginApi";
// import { useNavigate } from "react-router-dom";
// import React from "react";
// import { getUserData } from "../Services/UserInfoApi";
// import ClipLoader from "react-spinners/ClipLoader";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePasswordVisibility = () => {
//     setPasswordVisible((prev) => !prev);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(loginStart());
    

//     try {
//       const loginResponse = await loginUser(formData.username, formData.password);
//       const { userId, token } = loginResponse?.data || {};

//       // Store token and userId in localStorage
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("userId", userId);

//       // Fetch user data in parallel while navigating
//       const fetchUserData = getUserData().then((userData) => {
//         localStorage.setItem("userData", JSON.stringify(userData));
//       });

//       dispatch(loginSuccess(loginResponse));
//       navigate("/dashboardPage");

//       await fetchUserData; 
//     } catch (error) {
//       dispatch(loginFailure(error.message));
//       console.error("Login failed:", error.message || "Unknown error");
//       setMessage("Invalid username or password!");
//       const errorMessage =
//         error.response?.data?.message || error.message || "Login failed!";
//         console.log("errorMessage",errorMessage);
//       setMessage(errorMessage);
//       toast.error(errorMessage); // Show the error message in a toast

//     } 
//   };

  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-black p-6">
//       <div className="w-full max-w-xl p-12 bg-gradient-black rounded-md shadow-2xl min-h-[450px]">
//         <h1 className="text-3xl font-custom text-center text-white mb-6 mt-5">
//           Spexch
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative flex justify-center mb-4">
//             <input
//               type="text"
//               id="username"
//               name="username"
//               className="w-[250px] px-3 py-1.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Username"
//               required
//             />
//             <div className="absolute inset-y-0 right-[4%] sm:right-[4%] lg:right-[24%] flex items-center pr-3 text-gray-400">
//               <FaUser color="black" />
//             </div>
//           </div>
//           {!formData.username && (
//             <p className="text-white text-sm w-[250px] sm:ml-[4%] lg:ml-[24%] text-left"style={{ marginTop: '-16px' }}>Please enter username</p>
//           )}
//           <div className="relative flex justify-center mb-4">
//             <input
//               type={passwordVisible ? "text" : "password"}
//               id="password"
//               name="password"
//               className="w-[250px] px-3 py-1.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//             />
//             <div
//               className="absolute inset-y-0 right-[4%] sm:right-[4%] lg:right-[24%] flex items-center pr-3 text-gray-400 cursor-pointer"
//               onClick={handlePasswordVisibility}
//             >
//               {passwordVisible ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
//             </div>
//           </div>
//           {!formData.password && (
//             <p className="text-white text-sm mt-0 w-[250px] sm:ml-[4%] lg:ml-[24%] text-left"style={{ marginTop: '-2px' }}>Please enter Password</p>
//           )}
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="w-[250px] py-1.5 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-green hover:bg-gradient-green focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            
//             >
//               Login <IoLogOutOutline color="white" className="inline ml-0" />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
