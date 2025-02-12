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
    // return <Navigate to="/dashboardPage" replace />;
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-black p-6">
      <div className="w-full max-w-xl py-12 bg-gradient-black rounded-md shadow-2xl min-h-[450px]">
        <h1 className="text-3xl font-custom text-center text-white mb-6 mt-5">
          Spexch
        </h1>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative flex justify-center mb-4 px-2">
            <input
              type="text"
              id="username"
              name="username"
              className="w-[300px] px-2 py-2.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
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
            <p
              className="text-white text-sm w-[300px] sm:ml-[4%] lg:ml-[24%] text-left"
              style={{ marginTop: "-16px" }}
            >
              Please enter username
            </p>
          )}
          <div className="relative flex justify-center mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="w-[250px] px-3 py-2.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <div
              className="absolute inset-y-0 right-[4%] sm:right-[4%] lg:right-[24%] flex items-center pr-3 text-gray-400 cursor-pointer"
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
              className="text-white text-sm mt-0 w-[250px] sm:ml-[4%] lg:ml-[24%] text-left"
              style={{ marginTop: "-2px" }}
            >
              Please enter Password
            </p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[250px] py-2.5 text-white font-bold rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-green hover:bg-gradient-green focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 text-lg"
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
