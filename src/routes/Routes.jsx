import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES_CONST } from "../Constant/routesConstant";
import Login from "../AuthModal/Login";
import Layout from "../Layout";
import LayoutHeader from "../LayoutHeader"
import ProtectedRoutes from "./Protected/ProtectedRoutes";

import DownlineList from "../components/DownlineList/DownlineList";
import CreateNewMatch from "../components/Matches/CreateNewMatch";
import CreateManualMatch from "../components/Matches/CreateManualMatch";
import SuperAdminForm from "../SuperAdmin/SuperAdminComponents/SuperAdminForm/SuperAdminForm";
import AllMatches from "../components/Matches/AllMatches";

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
            <Layout>
              <DownlineList /> {/* Render specific component */}
            </Layout>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.masterdownlineList}
        element={
          <ProtectedRoutes>
            <Layout>
              <h1>Master Downline List</h1> {/* Replace with actual component */}
            </Layout>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.createnewmatch}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <CreateNewMatch /> {/* Render CreateNewMatch component */}
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.createmanualmatch}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <CreateManualMatch /> {/* Render CreateManualMatch component */}
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.allmatches}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <AllMatches /> {/* Render GlobalSettings component */}
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.globalsettings}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <SuperAdminForm /> {/* Render GlobalSettings component */}
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default RoutesComp;
