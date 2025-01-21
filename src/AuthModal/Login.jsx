
import { useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
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
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.login);
  const [userid, setUserId] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await loginUser(formData.username, formData.password);
      console.log("username", data?.data?.userId);
      const { userId, token } = data?.data || {};

      console.log("username", userId);

      // Save token and userId
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      // Save full user data
      const userData = await getUserData();
      localStorage.setItem("userData", JSON.stringify(userData));

      dispatch(loginSuccess(data));

      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboardPage"), 1500);
    } catch (error) {
      dispatch(loginFailure(error.message));
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed!";
        console.log("errorMessage",errorMessage);
      setMessage(errorMessage);
      toast.error(errorMessage); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black p-6">
      
      <div className="w-full max-w-xl p-12 bg-gradient-black rounded-md shadow-2xl min-h-[450px]"> 
        <h1 className="text-3xl font-custom text-center text-white mb-6 mt-5">
          <span className="text-white-500">Spexch</span>
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
    placeholder="Enter your username"
    required
  />
  <div className="absolute inset-y-0 right-[24%]  flex items-center pr-3 text-gray-400">
    <FaUser color="black" />
  </div>
</div>

<div className="relative flex justify-center mb-4"> {/* Reduced spacing with mb-4 */}
  <input
    type={passwordVisible ? "text" : "password"}
    id="password"
    name="password"
    className="w-[250px] px-3 py-1.5 mt-1 text-black rounded-md border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-10"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
    required
  />
  <div
    className="absolute inset-y-0 right-[24%]  flex items-center pr-3 text-gray-400 cursor-pointer"
    onClick={handlePasswordVisibility}
  >
    {passwordVisible ? <FaEyeSlash color="black" /> : <FaEye color="black" />}
  </div>
</div>

<div className="flex justify-center">
  <button
    type="submit"
    className={`w-[250px] py-1.5 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-green hover:bg-gradient-green focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={loading}
  >
    {loading ? (
      "Logging in..."
    ) : (
      <>
        Login <IoLogOutOutline color="white" className="inline ml-0" />
      </>
    )}
  </button>
</div>



        </form>
      </div>
    </div>
  );
};

export default Login;
