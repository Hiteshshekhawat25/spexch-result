import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";

// Lazily load components
const TopHeader = React.lazy(() => import("./components/Header/TopHeader"));
const MenuHeader = React.lazy(() => import("./components/Header/MenuHeader"));
const AddClientButton = React.lazy(() =>
  import("./components/Forms/AddClientButton")
);
const BalanceHeader = React.lazy(() =>
  import("./components/BalanceHeader/BalanceHeader")
);

const Layout = ({ children }) => {
  return (
    <div>
      <TopHeader />
      <Suspense
        fallback={
          <div>
            <ClipLoader />
          </div>
        }
      >
        <MenuHeader />
      </Suspense>

      <div className="p-6">
        <Suspense
          fallback={
            <div>
              <ClipLoader />
            </div>
          }
        >
          <AddClientButton />
        </Suspense>

        <div className="mb-6">
          <Suspense
            fallback={
              <div>
                <ClipLoader />
              </div>
            }
          >
            <BalanceHeader />
          </Suspense>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
