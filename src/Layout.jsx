import BalanceHeader from "./components/BalanceHeader/BalanceHeader";
import DownlineList from "./components/DownlineList/DownlineList";
import MenuHeader from "./components/Header/MenuHeader";
import TopHeader from "./components/Header/TopHeader";
import AddClient from "./Pages/Add/AddClient";

const Layout = () => {
  return (
    <div>
      <TopHeader />
      <MenuHeader />
      <div className="p-6">
      <AddClient />
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
