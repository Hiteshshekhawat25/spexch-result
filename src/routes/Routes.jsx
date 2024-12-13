import React from "react"; // Add this import
import { Route, Routes } from "react-router-dom";
import { ROUTES_CONST } from "../Constant/routesConstant";
import Login from "../AuthModal/Login";
import Layout from "../Layout";
import ProtectedRoutes from "./Protected/ProtectedRoutes";

const RoutesComp = ({ socket }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES_CONST.login} element={<Login />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES_CONST.dashboard}
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.masterdownlineList}
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      />

      {/* 404 Not Found
      <Route
        path="*"
        element={
          <div>
            <h1>404 - Not Found</h1>
          </div>
        }
      /> */}
    </Routes>
  );
};

export default RoutesComp;
