import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserData,
  fetchUserDataFailure,
  fetchUserDataStart,
  fetchUserDataSuccess,
} from "../../Store/Slice/userInfoSlice";
import { getUserData } from "../../Services/UserInfoApi";
import { Link, useLocation } from "react-router-dom";
import spexec from "../../assets/spexchlogo.png";
import { ROUTES_CONST } from "../../Constant/routesConstant";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const location = useLocation();
  console.log("userData", userData);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserDataStart());
      try {
        const data = await getUserData();
        console.log("user ka data", data);
        dispatch(fetchUserDataSuccess(data));
      } catch (err) {
        dispatch(fetchUserDataFailure(err.message));
      }
    };

    fetchData();
  }, [dispatch, location.pathname]);

  return (
    <div className="w-full bg-gradient-blue text-white py-6 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        {/* <Link to={ROUTES_CONST.dashboard}> */}
          <div className="text-xl font-bold ml-8 top-0">
            <img src={spexec} alt="Logo" height={120} width={100} />
          </div>
        {/* </Link> */}
      </div>
      <div className="flex items-center space-x-4">
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>Error: {error}</span>
        ) : userData ? (
          <>
            <span>{userData?.data?.name}</span>
            <span>IRP {userData?.data?.openingBalance}</span>
            <button
              className="hover:underline"
              onClick={() => {
                dispatch(clearUserData());
                localStorage.clear();
                window.location.reload();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <span>Logged out</span>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
