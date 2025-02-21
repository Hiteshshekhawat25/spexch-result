import React, { useState } from "react";
import {  IoEye, IoEyeOff } from 'react-icons/io5';
import {
  fetchDownlineData,
  performTransactionDownline,
} from "../../Services/Downlinelistapi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setDownlineData } from "../../Store/Slice/downlineSlice";
import { fetchRoles } from "../../Utils/LoginApi";


const DepositModal = ({
  isOpen,
  onClose,
  userId,
  currentPage,
  entriesToShow,
  user,
}) => {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const { userData, error } = useSelector((state) => state.user);
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();

  const token = localStorage.getItem("authToken");
  console.log("userdata", userData);
  const totalBalance = useSelector((state) => state.balance.totalBalance); 
  console.log(totalBalance)

  if (!isOpen) return null;

  const resetState = () => {
    setAmount("");
    setRemark("");
    setPassword("");
  };
  const handleTransaction = async (type) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid transaction amount greater than 0.");
        setLoading(false);
        return;
      }

      const requestData = {
        userId,
        amount: parseFloat(amount),
        password,
        description: remark,
      };

      const response = await performTransactionDownline(
        type,
        requestData,
        token
      );
      console.log("response", response);

      if (response.success) {
        toast.success(response.message || "Transaction Successful");

        const rolesArray = await fetchRoles(token);
        if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
          toast.warning("No roles found. Please check your configuration.");
          setLoading(false);
          return;
        }

        const rolesData = rolesArray.map((role) => ({
          role_name: role.role_name,
          role_id: role._id,
        }));
        setRoles(rolesData);

        let roleId = null;
        if (location.pathname === "/admin/user-downline-list") {
          const userRole = rolesData.find((role) => role.role_name === "user");
          roleId = userRole ? userRole.role_id : rolesData[0].role_id;
        } else if (location.pathname === "/admin/master-downline-list") {
          const masterRole = rolesData.find(
            (role) => role.role_name === "master"
          );
          roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
        } else {
          toast.warning("Invalid location path. Unable to determine action.");
          setLoading(false);
          return;
        }

        console.log("roleId:", roleId);

       
        const result = await fetchDownlineData(
          currentPage,
          entriesToShow,
          roleId
        );

        console.log("result", result);
        if (result && result.data) {
          dispatch(setDownlineData(result.data));
          resetState(); 
          onClose(); 
        } else {
          toast.warning("Unable to fetch updated downline data.");
        }
      } else {
        toast.error(response.message || "Transaction Failed");
      }
    } catch (err) {
      console.error("Error processing transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white rounded-md w-[500px] mt-12 sm:w-[90%] md:w-[500px]">
      {/* Modal Header */}
      <div className="flex justify-between items-center bg-gradient-blue text-white text-sm font-custom font-semibold w-full">
        <span>Banking - MasterBalance:{totalBalance}</span>
        <button
          onClick={() => {
            resetState();
            onClose();
          }}
          className="cursor-pointer text-white text-2xl"
        >
          &times;
        </button>
      </div>
  
     
      <form className="space-y-4 p-5">
        
        <div className="flex justify-between">
          <div className="font-custom font-bold">
            <span
              className="bg-green-500 text-white px-1 py-1 mr-1 rounded font-custom font-bold text-xs"
              
            >
              {user.role_name.toUpperCase()}
            </span>
            {user.username}
          </div>
          <div>
            Client Bal:{" "}
            <span className="font-custom font-bold">
              {new Intl.NumberFormat("en-IN").format(user.totalBalance || 0)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
            Balance
          </label>
          <div className="w-2/3 flex items-center space-x-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || !isNaN(value)) {
                  setAmount(value); // Set the amount as string to handle input
                }
               
              }}
              className="w-full p-2 border border-whiteGray rounded-md text-gray-700"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
            Remark
          </label>
          <div className="w-2/3 flex items-center space-x-2">
           <input
      type="text"
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
      placeholder="Remark.."
      className="w-full p-2 border border-whiteGray rounded-md text-gray-700"
    />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="block text-sm font-custom font-medium text-gray-700 w-1/3">
            Your Password
          </label>
          <div className="relative w-2/3">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-whiteGray rounded-md text-gray-700"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </span>
            </div>
        </div>
  
        {/* Transaction Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleTransaction("deposit")}
            disabled={loading || !amount || !password}
            className={`py-2 px-6 rounded-lg text-white font-bold hover:bg-green-600 focus:outline-none ${
              loading || !amount || !password
                ? "bg-green-500 bg-opacity-50 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Processing..." : "Deposit"}
          </button>
          <button
            type="button"
            onClick={() => handleTransaction("withdraw")}
            disabled={loading || !amount || !password}
            className={`py-2 px-6 rounded-lg text-white font-bold hover:bg-red-600 focus:outline-none ${
              loading || !amount || !password
                ? "bg-red-500 bg-opacity-50 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default DepositModal;
