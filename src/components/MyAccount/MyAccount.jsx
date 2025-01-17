import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import AccountStatement from "./AccountStatement";
import ActivityLog from "./ActivityLog";
import { ClipLoader } from "react-spinners";

const MyAccount = () => {
  const [selectedPage, setSelectedPage] = useState("myProfile");
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSelection = (page) => {
    setLoading(true);
    setSelectedPage(page);
  };

  let content;
  switch (selectedPage) {
    case "myProfile":
      content = <MyProfile />;
      break;
    case "accountStatement":
      content = <AccountStatement />;
      break;
    case "activityLog":
      content = <ActivityLog />;
      break;
    default:
      content = <MyProfile />;
  }

  return (
    <div className="md:flex sm:0 justify-center mt-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-48 h-48">
            <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>

            <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>

            <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
              <ClipLoader />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="sm:w-1/4 border border-gray-400 mx-4 sm:mx-8 bg-white max-h-[calc(3.5*2.6rem)] sm:max-h-[calc(3.5*2.6rem)] overflow-hidden mb-3">
            <h2 className="text-sm text-white bg-gradient-seablue font-bold py-2 px-4">
              My Account
            </h2>

            <div className="w-full border-collapse">
              <div
                className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                  selectedPage === "myProfile" ? "font-bold bg-bluehover" : ""
                }`}
                onClick={() => handleSelection("myProfile")}
              >
                <div className="flex justify-between py-2 px-4 text-sm">
                  <span>My Profile</span>
                </div>
              </div>

              <div
                className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
                  selectedPage === "accountStatement"
                    ? "font-bold bg-bluehover"
                    : ""
                }`}
                onClick={() => handleSelection("accountStatement")}
              >
                <div className="flex justify-between py-2 px-4 text-sm">
                  <span>Account Statement</span>
                </div>
              </div>

              <div
                className={`cursor-pointer text-left border-gray-300 hover:bg-lime ${
                  selectedPage === "activityLog" ? "font-bold bg-bluehover" : ""
                }`}
                onClick={() => handleSelection("activityLog")}
              >
                <div className="flex justify-between py-2 px-4 text-sm">
                  <span>Activity Log</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:w-3/4 md:w-full p-2">{content}</div>
        </>
      )}
    </div>
  );
};

export default MyAccount;
