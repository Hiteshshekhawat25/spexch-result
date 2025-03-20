import { useState, useEffect } from "react";
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
import { Navigate, useNavigate } from "react-router-dom";
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
  const isAuthenticated = localStorage.getItem("authToken");

  if (isAuthenticated) {
    return <Navigate to="/dashboardPage" replace />;
  }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const loginResponse = await loginUser(
        formData.username,
        formData.password
      );
      const { userId, token, firstTime } = loginResponse?.data || {};
      console.log("login data", loginResponse);

      if (!token || !userId) {
        throw new Error("Invalid login response from server");
      }

      // Store authentication details
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      // Fetch user data
      const userData = await getUserData();
      localStorage.setItem("userData", JSON.stringify(userData));

      // Check first-time login status
      // const isFirstLogin = firstTime === "true";
      console.log("fIRSTTIME", firstTime);
      const isFirstLogin = firstTime === true;
      const NotFirstLogin = firstTime === false;
      console.log(isFirstLogin);
      console.log(NotFirstLogin);

      if (isFirstLogin) {
        console.log(
          "First-time login detected, redirecting to change password..."
        );

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
    <div className="flex sm:items-center justify-center min-h-screen bg-gradient-black md:p-6 sm:p-4 p-2.5">
      <div className="w-full max-w-xl sm:mt-0 mt-20 md:p-12 sm:p-8 p-4 bg-gradient-black rounded-md shadow-[0_5px_20px_rgba(0,0,0,0.5)] md:min-h-[450px]">
        <h1 className="text-3xl font-custom text-center text-white mb-6 mt-5">
          Spexch  
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:items-center">
          <div className="inline-flex flex-col">
            <div className="relative flex justify-center">
              <input
                type="text"
                id="username"
                name="username"
                className="sm:w-[250px] w-full px-3 py-1.5 md:h-[38px] h-[45px] md:text-[16px] text-[18px] text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
              <div className="absolute inset-y-0 right-[12px] flex items-center text-gray-400">
                <FaUser color="black" />
              </div>
            </div>
            {!formData.username && (
              <p className="text-white text-sm mt-0.5">
                Please enter username
              </p>
            )}
          </div>
          <div className="inline-flex flex-col">
            <div className="relative flex justify-center">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                className="sm:w-[250px] w-full px-3 py-1.5 md:h-[38px] h-[45px] md:text-[16px] text-[18px] mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <div
                className="absolute inset-y-0 right-[12px] flex items-center text-gray-400 cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {passwordVisible ? (
                  <FaEyeSlash color="black" />
                ) : (
                  <FaEye color="black" />
                )}
              </div>
            </div>
            {!formData.password && (
              <p
                className="text-white text-sm mt-0.5"
              >
                Please enter Password
              </p>
            )}
          </div>
          <div className="inline-flex justify-center mt-1">
            <button
              type="submit"
              className="sm:w-[250px] w-full py-1.5 md:h-[38px] h-[45px] md:text-[16px] text-[18px] text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-green hover:bg-gradient-green focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
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
