import BalanceHeader from "./components/BalanceHeader/BalanceHeader";
import MenuHeader from "./components/Header/MenuHeader";
import TopHeader from "./components/Header/TopHeader";
import AddClient from "./Pages/Add/AddClient";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <TopHeader />
      <MenuHeader />
      <div className="p-6">
        <AddClient /> {/* Static component */}
        <div className="mb-6">
          <BalanceHeader />
        </div>
        <div>{children}</div> {/* Dynamic content */}
      </div>
    </div>
  );
};

export default Layout;

// import BalanceHeader from "./components/BalanceHeader/BalanceHeader";
// import MenuHeader from "./components/Header/MenuHeader";
// import TopHeader from "./components/Header/TopHeader";
// import AddClient from "./Pages/Add/AddClient";
// import React from "react"; 

// const Layout = () => {
//   return (
//     <div>
//       <TopHeader />
//       <MenuHeader />
//       <div className="p-6">
//       <AddClient />
//         <div className="mb-6">
        
//           <BalanceHeader />
//         </div>
//         <div>
         
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;
