import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES_CONST } from "../Constant/routesConstant.js";
import Login from "../AuthModal/Login.jsx";
import LayoutHeader from "../LayoutHeader.jsx";
import ProtectedRoutes from "./Protected/ProtectedRoutes.jsx";
import SportsBookResult from "../components/Matches/SportBookResult.jsx";
import AllMatches from "../components/Matches/AllMatches.jsx";
import PendingLiability from "../components/Matches/PendingLiability.jsx";
import SessionResult from "../components/Matches/SessionResult.jsx";
import PasswordHistory from "../components/PasswordHistory/PasswordHistory.jsx";
import ChangePassword from "../components/ChangePassword/ChangePassword.jsx";
import Libility from "../components/libility/Libility.jsx";

const RoutesComp = ({ socket }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES_CONST.login} element={<Login />} />

      {/* Protected Routes */}
     
      <Route
        path={ROUTES_CONST.AllMatches}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <AllMatches />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
     
      <Route
        path={ROUTES_CONST.liabilty}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <Libility />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />

<Route
        path={ROUTES_CONST.SportsBookResult}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <SportsBookResult />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />

      
      <Route
        path={ROUTES_CONST.PendingLiability}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <PendingLiability />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      
      <Route
        path={ROUTES_CONST.SessionResult}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <SessionResult />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      
    
      <Route
        path={ROUTES_CONST.passwordHistory}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <PasswordHistory />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />

      <Route
        path={ROUTES_CONST.changePassword}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <ChangePassword />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      
    </Routes>
  );
};

export default RoutesComp;
