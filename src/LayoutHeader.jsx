
import MenuHeader from "./components/Header/MenuHeader";
import TopHeader from "./components/Header/TopHeader";

import React from "react";

const LayoutHeader = ({ children }) => {
  return (
    <div>
      <TopHeader />
      <MenuHeader />
      <div className="p-6">
        </div>
        <div>{children}</div> {/* Dynamic content */}
      </div>
  );
};

export default LayoutHeader;
