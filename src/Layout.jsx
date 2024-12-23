// import BalanceHeader from "./components/BalanceHeader/BalanceHeader";
// import DownlineList from "./components/DownlineList/DownlineList";
// import AddClientButton from "./components/Forms/AddClientButton";
// import MenuHeader from "./components/Header/MenuHeader";
// import TopHeader from "./components/Header/TopHeader";
// import React from "react";

// const Layout = ({ children }) => {
//   return (
//     <div>
//       <TopHeader />
//       <MenuHeader />
//       <div className="p-6">
//         <AddClientButton />
//         <div className="mb-6">
//           <BalanceHeader />
//         </div>
//         <div>{children}</div> {/* Dynamic content */}
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { Suspense } from "react";

// Lazily load components
const TopHeader = React.lazy(() => import("./components/Header/TopHeader"));
const MenuHeader = React.lazy(() => import("./components/Header/MenuHeader"));
const AddClientButton = React.lazy(() => import("./components/Forms/AddClientButton"));
const BalanceHeader = React.lazy(() => import("./components/BalanceHeader/BalanceHeader"));

const Layout = ({ children }) => {
  return (
    <div>
      {/* <Suspense fallback={<div>Loading Top Header...</div>}>
     
      </Suspense> */}
      <TopHeader />
      <Suspense fallback={<div>Loading Menu Header...</div>}>
        <MenuHeader />
      </Suspense>

      <div className="p-6">
        <Suspense fallback={<div>Loading Add Client Button...</div>}>
          <AddClientButton />
        </Suspense>

        <div className="mb-6">
          <Suspense fallback={<div>Loading Balance Header...</div>}>
            <BalanceHeader />
          </Suspense>
        </div>
        <div>{children}</div> 
      </div>
    </div>
  );
};

export default Layout;
