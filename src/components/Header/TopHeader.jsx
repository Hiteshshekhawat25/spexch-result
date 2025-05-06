import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDataFailure,
  fetchUserDataStart,
  fetchUserDataSuccess,
} from "../../Store/Slice/userInfoSlice";
import { getUserData } from "../../Services/UserInfoApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import spexec from "../../assets/spexchlogo.png";
import { FaSyncAlt } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const location = useLocation();
  const userLogRef = useRef();
  const navigate = useNavigate();

  const refreshData = () => {
    dispatch(fetchUserDataStart());
    getUserData()
      .then((data) => {
        console.error("Error fetching user data: Header", { data });
        if (data?.status == 403 || data?.status == 401) {
          localStorage.clear();
          navigate("/");
        }
        if (data && data.data) {
          dispatch(fetchUserDataSuccess(data));
        } else {
          dispatch(fetchUserDataFailure("Invalid data format"));
        }
      })
      .catch((err) => {
        console.error("Error fetching user data: Header", { err });
        dispatch(fetchUserDataFailure(err.message));
      });
  };

  useEffect(() => {
    if (
      !userData ||
      !userData.data ||
      Object.keys(userData.data).length === 0
    ) {
      if(userData){
        userLogRef.current = setInterval(()=>{
          refreshData()
        },30000);
      }else{
        refreshData()
      }
    }

    return ()=>clearInterval(userLogRef.current)
  }, [dispatch, location.pathname]);

  return (
    <div className="w-full bg-[#560572] text-white md:py-[19px] py-4 md:px-4 px-3 lg:px-[35px] flex justify-between items-center">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="text-xl font-bold flex-shrink-0 md:h-[40px] h-[35px]">
          <Link to="/">
            <img src={spexec} alt="Logo" className="h-full" />
          </Link>
        </div>
        <div className="lg:hidden flex flex-col items-end space-y-1">
          { error ? (
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">
              Error: {error}
            </span>
          ) : userData ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center space-x-1">
                <span className="bg-[linear-gradient(180deg,_#2e2e2e,_#282828_42%,_#2e2e2e)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] text-white text-[10px] font-custom py-[2px] px-1 rounded">
                  {userData?.data?.role_name?.toUpperCase()}
                </span>
                <span className="text-white text-[13px]  font-custom font-bold px-1 rounded-md">
                  {userData?.data?.username}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white rounded-md font-custom font-bold md:text-[16px] text-[14px]">
                  IRP{" "}
                  {new Intl.NumberFormat("en-IN").format(
                    userData?.data?.totalBalance
                  )}
                </span>
                <button
                  onClick={refreshData}
                  className="bg-[linear-gradient(180deg,_#2e2e2e,_#282828_42%,_#2e2e2e)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] text-white p-1 rounded-[2px] hover:bg-gray-700"
                  title="Refresh"
                >
                  <FaArrowRotateLeft />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="hidden lg:flex flex-col lg:flex-row items-center gap-3">
        {loading ? (
          <div className="flex items-center">
            <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">
              Loading...
            </span>
            <FaSyncAlt className="text-white animate-spin ml-1" />
          </div>
        ) : error ? (
          <span className="bg-gray-800 text-white px-1 py-0.5 rounded-md">
            Error: {error}
          </span>
        ) : userData ? (
          <>
            <div className="flex items-center gap-1 mb-1 lg:mb-0">
              <span className="bg-[linear-gradient(180deg,_#2e2e2e,_#282828_42%,_#2e2e2e)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] text-[10px] font-custom py-0.5 px-1 rounded-md">
                {userData?.data?.role_name?.toUpperCase()}
              </span>
              <span className="text-white text-[13px] font-custom font-bold px-1 rounded-md">
                {userData?.data?.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white rounded-md font-custom font-bold text-[13px]">
                IRP{" "}
                {new Intl.NumberFormat("en-IN").format(
                  userData?.data?.totalBalance
                )}
              </span>
              <button
                onClick={refreshData}
                className="bg-[linear-gradient(180deg,_#2e2e2e,_#282828_42%,_#2e2e2e)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]  text-white p-1 rounded-[2px] hover:bg-gray-700"
                title="Refresh"
              >
                <FaArrowRotateLeft />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TopHeader;
