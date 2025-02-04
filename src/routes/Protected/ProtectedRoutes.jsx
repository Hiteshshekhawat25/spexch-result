// import { Navigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";

// const ProtectedRoutes = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("authToken");

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoutes;
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");
  // const accessToken = isAuthenticated?.donation ? JSON.parse(isAuthenticated.donation).accessToken : null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;
