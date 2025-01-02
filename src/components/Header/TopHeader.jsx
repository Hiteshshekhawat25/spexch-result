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
    <div className="w-full bg-gradient-blue text-white py-6 px-8 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-xl font-bold ml-12 top-0">
          <img src={spexec} alt="Logo" height={120} width={100} />
        </div>
      </div>
      <div className="flex items-center">
        {loading ? (
          <div className="flex items-center">
            <span className="bg-gray-800 text-white px-4 py-1 rounded-md">Loading...</span>
            <FaSyncAlt className="text-white animate-spin" />
          </div>
        ) : error ? (
          <span className="bg-gray-800 text-white px-4 py-1 rounded-md">Error: {error}</span>
        ) : userData ? (
          <div className="flex items-center">
            <span className="bg-darkgray text-white text-xs font-bold px-1  rounded-md">
            {userData?.data?.role_name?.toUpperCase()}
            </span>
            <span className="text-white text-sm font-bold px-1 py-1 rounded-md">
              {userData?.data?.username}
            </span>
            <span className="text-white px-4 py-1 rounded-md">{userData?.data?.openingBalance}</span>
            <button
              onClick={refreshData}
              className="bg-darkgray text-white p-1 rounded-md hover:bg-gray-700 mr-12"
              title="Refresh"
            >
              <MdRefresh />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopHeader;





// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearUserData,
//   fetchUserDataFailure,
//   fetchUserDataStart,
//   fetchUserDataSuccess,
// } from "../../Store/Slice/userInfoSlice";
// import { getUserData } from "../../Services/UserInfoApi";
// import { Link, useLocation } from "react-router-dom";
// import spexec from "../../assets/spexchlogo.png";
// import { ROUTES_CONST } from "../../Constant/routesConstant";

// const TopHeader = () => {
//   const dispatch = useDispatch();
//   const { userData, loading, error } = useSelector((state) => state.user);
//   const location = useLocation();
//   console.log("userData", userData);

//   useEffect(() => {
//     const fetchData = async () => {
//       dispatch(fetchUserDataStart());
//       try {
//         const data = await getUserData();
//         console.log("user ka data", data);
//         dispatch(fetchUserDataSuccess(data));
//       } catch (err) {
//         dispatch(fetchUserDataFailure(err.message));
//       }
//     };

//     fetchData();
//   }, [dispatch, location.pathname]);

//   return (
//     <div className="w-full bg-gradient-blue text-white py-6 px-6 flex justify-between items-center">
//       <div className="flex items-center space-x-6">
//         {/* <Link to={ROUTES_CONST.dashboard}> */}
//           <div className="text-xl font-bold ml-8 top-0">
//             <img src={spexec} alt="Logo" height={120} width={100} />
//           </div>
//         {/* </Link> */}
//       </div>
//       <div className="flex items-center space-x-4">
//         {loading ? (
//           <span>Loading...</span>
//         ) : error ? (
//           <span>Error: {error}</span>
//         ) : userData ? (
//           <>
//             <span>{userData?.data?.name}</span>
//             <span>IRP {userData?.data?.openingBalance}</span>
//             <button
//               className="hover:underline"
//               onClick={() => {
//                 dispatch(clearUserData());
//                 localStorage.clear();
//                 window.location.reload();
//               }}
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <span>Logged out</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TopHeader;
