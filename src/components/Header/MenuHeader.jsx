
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../Store/Slice/userInfoSlice";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [subMenuStyles, setSubMenuStyles] = useState({});
  const dispatch = useDispatch();
  const menuRefs = useRef([]);
  const subMenuRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    console.log("logout Clicked");
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
        { name: "User Banking", link: "/user-banking" },
        { name: "Master Banking", link: "/master-banking" },
      ],
    },
    { name: "Commission", link: "#" },
    { name: "Password History", link: "/password-history" },
    { name: "Restore User", link: "#" },
    {
      name: "Logout",
      onClick: handleLogout, 
    },
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

 
  const menuWrapperRef = useRef(null); 
  const toggleSubMenu = (name, index) => {
    if (activeSubMenu === name) {
      setActiveSubMenu(null);
      setSubMenuStyles({});
    } else {
      setActiveSubMenu(name);
  
      const menuItem = menuRefs.current[index];
      if (menuItem && menuWrapperRef.current) {
        const { offsetTop, offsetHeight, offsetLeft } = menuItem;
        const scrollLeft = menuWrapperRef.current.scrollLeft;
  
        setSubMenuStyles({
          top: offsetTop + offsetHeight,
          left: offsetLeft - scrollLeft, 
          minWidth: 150, 
          position: "absolute",
          zIndex: 10,
        });
      }
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        subMenuRef.current &&
        !subMenuRef.current.contains(event.target) &&
        !menuRefs.current.some((ref) => ref && ref.contains(event.target))
      ) {
        setActiveSubMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gradient-green text-black font-bold px-2 relative">
      <div
  className="lg:hidden overflow-x-auto whitespace-nowrap"
  ref={menuWrapperRef} 
>
  <ul className="flex">
    {menuItems.map((item, index) => (
      <li
        key={index}
        className="relative text-sm border-l border-r border-gray-400"
        ref={(el) => (menuRefs.current[index] = el)}
      >
              {item.name === "Logout" ? (
                <button
                  onClick={item.onClick}
                  className="py-1 px-2  block border-b-2 bg-gradient-green text-black border-transparent hover:underline hover:decoration-black"
                >
                  {item.name}
                  <IoLogOutOutline className="inline ml-2" />
                </button>
              ) : (
                <Link
                  to={item.link}
                  onClick={() => {
                    setActiveMenu(item.name);
                    item.subMenu && toggleSubMenu(item.name, index);
                  }}
                  className={`py-1 px-2 block border-b-2 ${
                    activeMenu === item.name
                      ? "bg-gradient-blue-hover text-white border-gradient-blue-hover"
                      : "border-transparent hover:underline hover:decoration-black"
                  }`}
                >
                  {item.name}
                  {item.subMenu && (
                    <TbTriangleInvertedFilled className="inline ml-2 size-2" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {menuItems.map((item, index) =>
          item.subMenu && activeSubMenu === item.name ? (

            <ul
  key={index}
  ref={subMenuRef}
  style={{
    ...subMenuStyles, 
    left: subMenuStyles.left, 
    minWidth: subMenuStyles.minWidth 
  }}
  className="absolute bg-gradient-blue-hover shadow-lg z-10 flex flex-col whitespace-nowrap"
>

       
              {item.subMenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    to={subItem.link}
                    onClick={() => setActiveSubMenu(null)}

                    onMouseEnter={() => {
                      // On hover, show the submenu
                      item.subMenu && toggleSubMenu(item.name, index);
                    }}
                    onMouseLeave={() => {
                      // On hover out, hide the submenu
                      setActiveSubMenu(null);
                    }}
                    className="block px-4 py-2 hover:bg-gradient-green text-white w-auto text-xs lg:text-sm"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null
        )}
      </div>

      <ul className="hidden lg:flex justify-center lg:justify-start ml-24 mr-4 text-lg">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative group border-l border-r border-gray-400 text-sm"
          >
            {item.name === "Logout" ? (
              <button
                onClick={item.onClick}
                className="py-1 px-2 ml-24 block border-b-2 bg-gradient-green text-black border-transparent hover:border-gray-600"
              >
                {item.name}
                <IoLogOutOutline className="inline ml-2" />
              </button>
            ) : (
              <Link
                to={item.link}
                onClick={() => setActiveMenu(item.name)}
                className={`py-1 px-2 block border-b-2 ${
                  activeMenu === item.name
                    ? "bg-gradient-blue-hover text-white border-gradient-blue-hover"
                    : "border-transparent hover:border-gray-600"
                }`}
              >
                {item.name}
                {item.subMenu && (
                  <TbTriangleInvertedFilled className="inline ml-2 size-2" />
                )}
              </Link>
            )}
            {item.subMenu && (
              <ul className="absolute left-0 top-full hidden bg-gradient-blue-hover group-hover:block shadow-lg z-10 flex whitespace-nowrap">
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                    onClick={() => setActiveSubMenu(null)}
                    onMouseEnter={() => {
                      // On hover, show the submenu
                      item.subMenu && toggleSubMenu(item.name, index);
                    }}
                    onMouseLeave={() => {
                      // On hover out, hide the submenu
                      setActiveSubMenu(null);
                    }}
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


