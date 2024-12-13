import BalanceHeader from "./components/BalanceHeader/BalanceHeader";
import DownlineList from "./components/DownlineList/DownlineList";
import AddClientButton from "./components/Forms/AddClientButton";
import MenuHeader from "./components/Header/MenuHeader";
import TopHeader from "./components/Header/TopHeader";
import React from "react";

const Layout = () => {
  return (
    <div>
      <TopHeader />
      <MenuHeader />
      <div className="p-6">
        <AddClientButton />
        <div className="mb-6">
          <BalanceHeader />
        </div>
        <div>
          <DownlineList />
        </div>
      </div>
    </div>
  );
};

export default Layout;
