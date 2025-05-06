import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES_CONST } from "../Constant/routesConstant";
import Login from "../AuthModal/Login";
import LayoutHeader from "../LayoutHeader";
import ProtectedRoutes from "./Protected/ProtectedRoutes";
import SportsBookResult from "../components/Matches/SportBookResult";
import AllMatches from "../components/Matches/AllMatches";
import PendingLiability from "../components/Matches/PendingLiability";
import SessionResult from "../components/Matches/SessionResult";
import PasswordHistory from "../components/PasswordHistory/Passwordhistory";
import ChangePassword from "../components/ChangePassword/ChangePassword";
import Libility from "../components/libility/Libility";

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
