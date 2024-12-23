import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserData,
  fetchUserDataFailure,
  fetchUserDataStart,
  fetchUserDataSuccess,
} from "../../Store/Slice/userInfoSlice";
import { getUserData } from "../../Services/UserInfoApi";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserDataStart());
      try {
        const data = await getUserData();
        dispatch(fetchUserDataSuccess(data));
      } catch (err) {
        dispatch(fetchUserDataFailure(err.message));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="w-full bg-NavyBlue text-white py-6 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold ml-8 pl-2">SPEXCH</div>
      </div>
      <div className="flex items-center space-x-4">
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>Error: {error}</span>
        ) : userData ? (
          <>
            <span>{userData?.data?.name}</span>
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
