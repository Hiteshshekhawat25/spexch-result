import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5"; 
import { TbTriangleInvertedFilled } from "react-icons/tb"; 
import { useDispatch } from "react-redux"; // Import useDispatch from Redux
import {
  clearUserData,

} from "../../Store/Slice/userInfoSlice";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    dispatch(clearUserData());
    localStorage.clear();
    window.location.reload();
  };

  const menuItems = [
    { name: "Dashboard", link: "/dashboardPage" },
    {
      name: "Downline List",
      link: "#",
      subMenu: [
        { name: "User Downline List", link: "/user-downline-list" },
        { name: "Master DownLine List", link: "/master-downline-list" },
      ],
    },
    { name: "My Account", link: "/MyAccount" },
    {
      name: "My Report",
      link: "#",
      subMenu: [
        { name: "Event Profit/Loss", link: "/EventProfitLoss" },
        { name: "Downline Profit/Loss", link: "/ProfitLoss" },
      ],
    },
    { name: "BetList", link: "/BetList" },
    { name: "Market Analysis", link: "#" },
    {
      name: "Banking",
      link: "#",
      subMenu: [
        { name: "Deposit", link: "/deposit" },
        { name: "Withdraw", link: "/withdraw" },
      ],
    },
    { name: "Commission", link: "#" },
    { name: "Password History", link: "#" },
    { name: "Restore User", link: "#" },
    {
      name: "Logout",
      link: "#",
      onClick: handleLogout, // Attach logout handler here
    }, // Logout item
  ];

  if (userData && userData.data.role_name === "super-master") {
    menuItems.push(
      {
        name: "Matches",
        link: "#",
        subMenu: [
          { name: "Create New Match", link: "/CreateNewMatch" },
          { name: "Create Manual Match", link: "/CreateManualMatch" },
          { name: "All Matches", link: "/AllMatches" },
        ],
      },
      {
        name: "Global Settings",
        link: "/GlobalSettings",
      }
    );
  }

  return (
    <div className="bg-gradient-green text-black font-bold px-2">
      {/* Main Menu (now with horizontal scroll for small screens) */}
      <div className="lg:hidden overflow-x-auto whitespace-nowrap">
        <ul className="flex">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="text-sm py-2 px-4 border-l border-r border-gray-400"
            >
              <Link
                to={item.link}
                onClick={item.onClick || (() => setActiveMenu(item.name))}
                className={`block py-1 px-2 hover:bg-gradient-blue-hover border-b-2 border-transparent ${
                  activeMenu === item.name
                    ? "bg-gradient-blue-hover text-white"
                    : "hover:border-gradient-blue-hover hover:text-white"
                } ${item.name === "Logout" ? "pl-48" : ""}`}
              >
                {item.name}
                {item.subMenu && (
                  <TbTriangleInvertedFilled className="inline ml-2 size-2" />
                )}
                {item.name === "Logout" && (
                  <IoLogOutOutline className="inline ml-2" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Menu for Large Screens */}
      <ul className="hidden lg:flex justify-center lg:justify-start ml-24 mr-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative group border-l border-r border-gray-400 text-sm"
          >
            <Link
              to={item.link}
              onClick={item.onClick || (() => setActiveMenu(item.name))}
              className={`py-1 px-2 block hover:bg-gradient-blue-hover border-b-2 border-transparent ${
                activeMenu === item.name
                  ? "bg-gradient-blue-hover text-white"
                  : "hover:border-gradient-blue-hover hover:text-white"
              } ${item.name === "Logout" ? "pl-48" : ""}`}
            >
              {item.name}
              {item.subMenu && (
                <TbTriangleInvertedFilled className="inline ml-2 size-2" />
              )}
              {item.name === "Logout" && (
                <IoLogOutOutline className="inline ml-2" />
              )}
            </Link>
            {item.subMenu && (
              <ul className="absolute left-0 top-full hidden bg-gradient-blue-hover group-hover:block shadow-lg z-10 flex whitespace-nowrap">
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      to={subItem.link}
                      className="block px-4 py-2 hover:bg-gradient-green text-white"
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuHeader;
