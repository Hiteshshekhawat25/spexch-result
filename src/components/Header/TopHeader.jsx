import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDataFailure,
  fetchUserDataStart,
  fetchUserDataSuccess,
} from "../../Store/Slice/userInfoSlice";
import { getUserData } from "../../Services/UserInfoApi";
import { useLocation } from "react-router-dom";
import spexec from "../../assets/spexchlogo.png";
import { FaSyncAlt } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const location = useLocation();

  const refreshData = () => {
    dispatch(fetchUserDataStart());
    getUserData()
      .then((data) => {
        console.log("Fetched user data:", data);
        dispatch(fetchUserDataSuccess(data));
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        dispatch(fetchUserDataFailure(err.message));
      });
  };

  useEffect(() => {
    refreshData();
  }, [dispatch, location.pathname]);

  useEffect(() => {
    console.log("Current userData:", userData);
  }, [userData]);

  return (
    <div className="w-full bg-gradient-blue text-white py-6 px-4 lg:px-32 flex justify-between items-center">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="text-xl font-bold flex-shrink-0">
          <img src={spexec} alt="Logo" height={80} width={80} />
        </div>
        <div className="lg:hidden flex items-center justify-end w-full">
          {loading ? (
            <div className="flex items-center">
              <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Loading...</span>
              <FaSyncAlt className="text-white animate-spin ml-1" />
            </div>
          ) : error ? (
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Error: {error}</span>
          ) : userData ? (
            <div className="flex items-center space-x-1">
              <span className="text-white text-sm font-bold px-1 rounded-md">
                {userData?.data?.username}
              </span>
              <span className="text-white px-1 py-0.5 rounded-md font-bold">
                IRP {new Intl.NumberFormat("en-IN").format(userData?.data?.openingBalance)}
              </span>
              <button
                onClick={refreshData}
                className="bg-darkgray text-white p-0.5 rounded-md hover:bg-gray-700"
                title="Refresh"
              >
                <MdRefresh />
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:flex-row items-center lg:space-x-2">
        {loading ? (
          <div className="flex items-center">
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Loading...</span>
            <FaSyncAlt className="text-white animate-spin ml-1" />
          </div>
        ) : error ? (
          <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Error: {error}</span>
        ) : userData ? (
          <>
            <div className="flex items-center space-x-1 mb-1 lg:mb-0">
              <span className="bg-darkgray text-white text-xs font-bold px-1 rounded-md">
                {userData?.data?.role_name?.toUpperCase()}
              </span>
              <span className="text-white text-sm font-bold px-1 rounded-md">
                {userData?.data?.username}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-white px-1 py-0.5 rounded-md font-bold">
                IRP {new Intl.NumberFormat("en-IN").format(userData?.data?.openingBalance)}
              </span>
              <button
                onClick={refreshData}
                className="bg-darkgray text-white p-0.5 rounded-md hover:bg-gray-700"
                title="Refresh"
              >
                <MdRefresh />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TopHeader;






