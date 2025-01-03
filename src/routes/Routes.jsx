import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES_CONST } from "../Constant/routesConstant";
import Login from "../AuthModal/Login";
import Layout from "../Layout";
import LayoutHeader from "../LayoutHeader";
import ProtectedRoutes from "./Protected/ProtectedRoutes";

import DownlineList from "../components/DownlineList/DownlineList";
import CreateNewMatch from "../components/Matches/CreateNewMatch";
import CreateManualMatch from "../components/Matches/CreateManualMatch";
import SuperAdminForm from "../SuperAdmin/SuperAdminComponents/SuperAdminForm/SuperAdminForm";
import AllMatches from "../components/Matches/AllMatches";
import { AddMasterForm } from "../components/Forms/AddMasterForm";
import TransferMatchCoins from "../components/Matches/TransferMatchCoins";
import PendingLiability from "../components/Matches/PendingLiability";
import CoinLog from "../components/Matches/CoinLog";
import MatchOddsBets from "../components/Matches/MatchOddsBets";
import TossMatchList from "../components/Matches/TossMatchList";
import MultipleSession from "../components/Matches/MultipleSession";
import AllSessionList from "../components/Matches/AllSessionList";
import Banner from "../components/Matches/Banner";
import SessionPreBook from "../components/Matches/SessionPreBook";
import SessionResult from "../components/Matches/SessionResult";
import ProfitLoss from "../components/MyReport/ProfitLoss";
import BetList from "../components/BetList/BetList";
import MyAccount from "../components/MyAccount/MyAccount";
import EventProfitLoss  from "../components/MyReport/EventProfitLoss";
import Dashboard from "../components/Dashboard/dashboard";

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
              <DownlineList />
            </Layout>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.masterdownlineList}
        element={
          <ProtectedRoutes>
            <Layout>
              <DownlineList />
            </Layout>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.userDownLineList}
        element={
          <ProtectedRoutes>
            <Layout>
              <DownlineList />
            </Layout>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.CreateNewMatch}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <CreateNewMatch />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.CreateManualMatch}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <CreateManualMatch />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
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
        path={ROUTES_CONST.GlobalSettings}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <SuperAdminForm />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />

      <Route
        path={ROUTES_CONST.TransferMatchCoins}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <TransferMatchCoins />
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
        path={ROUTES_CONST.CoinLog}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <CoinLog />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.MatchOddsBets}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <MatchOddsBets />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.TossMatchList}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <TossMatchList />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />

      <Route
        path={ROUTES_CONST.MultipleSession}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <MultipleSession />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.AllSessionList}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <AllSessionList />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.Banner}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <Banner />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.SessionPreBook}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <SessionPreBook />
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
        path={ROUTES_CONST.ProfitLoss}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <ProfitLoss />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
       <Route
        path={ROUTES_CONST.EventProfitLoss}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <EventProfitLoss />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
       <Route
        path={ROUTES_CONST.EventProfitLoss}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <EventProfitLoss />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.BetList}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <BetList />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
        path={ROUTES_CONST.MyAccount}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <MyAccount />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
      <Route
       path={ROUTES_CONST.dashboardPage}
        element={
          <ProtectedRoutes>
            <LayoutHeader>
              <Dashboard />
            </LayoutHeader>
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};

export default RoutesComp;
