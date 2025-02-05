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
  console.log("userData",userData)

  const refreshData = () => {
    dispatch(fetchUserDataStart());
    getUserData()
      .then((data) => {
        if (data && data.data) {
          dispatch(fetchUserDataSuccess(data));
        } else {
          dispatch(fetchUserDataFailure("Invalid data format"));
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        dispatch(fetchUserDataFailure(err.message));
      });
  };

  useEffect(() => {
    if (!userData || !userData.data || Object.keys(userData.data).length === 0) {
      refreshData();
    }
  }, [dispatch, location.pathname]);

  return (
    <div className="w-full bg-gradient-blue text-white md:py-6 py-4 md:px-4 px-3 lg:px-[35px] flex justify-between items-center">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="text-xl font-bold flex-shrink-0 md:h-[40px] h-[30px]">
          <img src={spexec} alt="Logo" className="h-full" />
        </div>
        <div className="lg:hidden flex flex-col items-end space-y-1">
          {loading ? (
            <div className="flex items-center">
              <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Loading...</span>
              <FaSyncAlt className="text-white animate-spin ml-1" />
            </div>
          ) : error ? (
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Error: {error}</span>
          ) : userData ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center space-x-1">
                <span className="bg-gray-800 text-white text-[9px] font-custom py-1 px-2 rounded-md">
                  {userData?.data?.role_name?.toUpperCase()}
                </span>
                <span className="text-white md:text-sm text-[13px] font-custom font-bold px-1 rounded-md">
                  {userData?.data?.username}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white rounded-md font-custom font-bold md:text-[16px] text-[14px]">
                  IRP {new Intl.NumberFormat("en-IN").format(userData?.data?.openingBalance)}
                </span>
                <button
                  onClick={refreshData}
                  className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700"
                  title="Refresh"
                >
                  <MdRefresh />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:flex-row items-center gap-3">
        {loading ? (
          <div className="flex items-center">
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Loading...</span>
            <FaSyncAlt className="text-white animate-spin ml-1" />
          </div>
        ) : error ? (
          <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">Error: {error}</span>
        ) : userData ? (
          <>
            <div className="flex items-center gap-1 mb-1 lg:mb-0">
              <span className="bg-gray-800 text-white text-[10px] font-custom py-1 px-2 rounded-md">
                {userData?.data?.role_name?.toUpperCase()}
              </span>
              <span className="text-white md:text-sm text-[13px] font-custom font-bold px-1 rounded-md">
                {userData?.data?.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white rounded-md font-custom font-bold">
                IRP {new Intl.NumberFormat("en-IN").format(userData?.data?.openingBalance)}
              </span>
              <button
                onClick={refreshData}
                className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-700"
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






