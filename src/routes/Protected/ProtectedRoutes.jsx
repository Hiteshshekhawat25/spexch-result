import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");
  console.log("isAuthentictaced",isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;