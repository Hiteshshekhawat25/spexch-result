import { useState } from "react"; // Removed useRef import
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../Store/loginSlice";
import { FaUser, FaLock } from "react-icons/fa";
import { loginUser } from "../Utils/LoginApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For success or error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await loginUser(formData.username, formData.password);

      // Saving the token in localStorage
      localStorage.setItem("authToken", data.data.token);

      dispatch(loginSuccess(data));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500); // Redirect after
    } catch (error) {
      dispatch(loginFailure(error.message));

      setMessage("Invalid username or password!"); // Show error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-customGray via-black to-black p-6">
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-3xl font-extrabold text-center text-white mb-6">
          <span className="text-orange-500">Spexch</span> Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username input */}
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 mt-1 text-black rounded-lg border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-12"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            <div className="absolute right-4 top-2/3 transform -translate-y-1/2 text-gray-400">
              <FaUser />
            </div>
          </div>

          {/* Password input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 mt-1 text-black rounded-lg border border-gray-600 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none pr-12"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <div className="absolute right-4 top-2/3 transform -translate-y-1/2 text-gray-400">
              <FaLock />
            </div>
          </div>

          {/* Display error or success message */}
          {message && <p className="text-sm text-red-500">{message}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 bg-darkGreen hover:bg-LightGreen focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
