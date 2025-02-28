import { ClipLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MyProfile from "./MyProfile";
import AccountStatement from "./AccountStatement";
import ActivityLog from "./ActivityLog";
import EventProfitLoss from "../MyReport/EventProfitLoss";
import BetList from "../BetList/BetList";
import AnimatedLoader from "../MarketAnalysis/components/Animated";

const MyAccount = () => {
  const location = useLocation();
  const selectedUser = location.state?.selectedUser;
  const initialPage = location.state?.selectedPage || "myProfile";

  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const role_name = location.state?.selectedUser?.role_name;
  // console.log(role_name);

  const Userid = location.state?.selectedUser?._id;
  // console.log(Userid);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSelection = (page) => {
    // console.log("Page Selected:", page);
    setLoading(true);
    setSelectedPage(page);
  };

  let content;
  switch (selectedPage) {
    case "myProfile":
      content = <MyProfile key={Userid} Userid={Userid} Role={role_name} />;
      break;
    case "accountStatement":
      content = (
        <AccountStatement key={Userid} Userid={Userid} Role={role_name} />
      );
      break;
    case "activityLog":
      content = <ActivityLog Userid={Userid} />;
      break;
    case "bethistory":
      content = <BetList Userid={Userid} Role={role_name} />;
      break;
    case "profitLoss":
      content = <EventProfitLoss Userid={Userid} />;
      break;
    default:
      content = <MyProfile Userid={Userid} Role={role_name} />;
  }

  const containerHeight = selectedUser
    ? "max-h-[calc(5.3*2.6rem)]"
    : "max-h-[calc(3.5*2.6rem)]";

  return (
    <div className={`justify-center ${loading ?  `grid-cols-12` :`md:grid-cols-4 grid-cols-1 grid gap-5`}`}>
      {loading ? (
        <div className="flex justify-center mx-auto items-center h-64">
        <AnimatedLoader/>
        </div>
      ) : (
        <>
          <div className={`border border-gray-300 md:col-span-1 col-span-1 bg-white ${containerHeight} overflow-hidden`}
          >
            <h2 className="text-sm text-white bg-gradient-seablue font-custom font-bold py-2 px-2">
              My Account
            </h2>

            <div className="w-full border-collapse">
              <div
                className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                  selectedPage === "myProfile" ? "font-custom bg-bluehover" : ""
                }`}
                onClick={() => handleSelection("myProfile")}
              >
                <div className="flex sm:justify-between justify-center py-1.5 px-2 text-[13px] font-custom">
                  <span>My Profile</span>
                </div>
              </div>

              {selectedUser && role_name === "user" && (
                <>
                  <div
                    className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                      selectedPage === "bethistory"
                        ? "font-custom bg-bluehover"
                        : ""
                    }`}
                    onClick={() => handleSelection("bethistory")}
                  >
                    <div className="flex sm:justify-between justify-center py-1.5 px-2 text-[13px]">
                      <span>Bet History</span>
                    </div>
                  </div>
                  <div
                    className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                      selectedPage === "profitLoss"
                        ? "font-custom bg-bluehover"
                        : ""
                    }`}
                    onClick={() => handleSelection("profitLoss")}
                  >
                    <div className="flex sm:justify-between justify-center py-1.5 px-2 text-[13px]">
                      <span>Profit & Loss</span>
                    </div>
                  </div>
                </>
              )}

              <div
                className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                  selectedPage === "accountStatement"
                    ? "font-custom bg-bluehover"
                    : ""
                }`}
                onClick={() => handleSelection("accountStatement")}
              >
                <div className="flex sm:justify-between justify-center py-1.5 px-2 text-[13px] font-custom">
                  <span>Account Statement</span>
                </div>
              </div>

              <div
                className={`cursor-pointer text-left  border-b border-gray-300 hover:bg-lime ${
                  selectedPage === "activityLog"
                    ? "font-custom bg-bluehover"
                    : ""
                }`}
                onClick={() => handleSelection("activityLog")}
              >
                <div className="flex sm:justify-between justify-center py-1.5 px-2 text-[13px] font-custom">
                  <span>Activity Log</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 col-span-1">{content}</div>
        </>
      )}
    </div>
  );
};

export default MyAccount;
