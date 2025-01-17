import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../Store/Slice/userInfoSlice";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Manage submenu visibility
  const [subMenuStyles, setSubMenuStyles] = useState({}); // Store submenu position and width
  const dispatch = useDispatch();
  const menuRefs = useRef([]); // Store references to each menu item
  const subMenuRef = useRef(null); // Ref for the active submenu

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
        { name: "User Banking", link: "/user-banking" },
        { name: "Master Banking", link: "/master-banking" },
      ],
    },
    { name: "Commission", link: "#" },
    { name: "Password History", link: "/password-history" },
    { name: "Restore User", link: "#" },
    {
      name: "Logout",
      link: "#",
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

  
  // const toggleSubMenu = (name, index) => {
  //   if (activeSubMenu === name) {
  //     setActiveSubMenu(null);
  //     setSubMenuStyles({});
  //   } else {
  //     setActiveSubMenu(name);
      
  //     // Get the parent menu item
  //     const menuItem = menuRefs.current[index];
  //     if (menuItem) {
  //       const { offsetTop, offsetHeight, offsetLeft, offsetWidth } =
  //         menuItem.getBoundingClientRect();
        
        
  //       setSubMenuStyles({
  //         top: offsetTop + offsetHeight, 
  //         left: offsetLeft, 
  //         width: offsetWidth, 
  //       });
  //     }
  //   }
  // };
  

  const toggleSubMenu = (name, index) => {
    if (activeSubMenu === name) {
      setActiveSubMenu(null);
      setSubMenuStyles({});
    } else {
      setActiveSubMenu(name);
      
      // Get the parent menu item
      const menuItem = menuRefs.current[index];
      if (menuItem) {
        const { offsetTop, offsetHeight, offsetLeft, offsetWidth } =
          menuItem.getBoundingClientRect();
        
        // Adjust submenu position to be directly below the main menu
        setSubMenuStyles({
          top: offsetTop + offsetHeight + 4, // Add 4px or adjust as needed for spacing
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }
  };
  
  // Close submenu when clicking outside
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
      {/* Main Menu (horizontal scroll for small screens) */}
      <div className="lg:hidden overflow-x-auto whitespace-nowrap">
        <ul className="flex">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative text-sm py-2 px-4 border-l border-r border-gray-400"
              ref={(el) => (menuRefs.current[index] = el)} // Reference for each menu item
            >
              <Link
                to={item.link}
                onClick={() => {
                  setActiveMenu(item.name); // Change background on click
                  item.subMenu && toggleSubMenu(item.name, index); // Toggle submenu visibility
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
                {item.name === "Logout" && <IoLogOutOutline className="inline ml-2" />}
              </Link>
            </li>
          ))}
        </ul>
        {/* Submenus */}
        {menuItems.map((item, index) =>
          item.subMenu && activeSubMenu === item.name ? (
            <ul
              key={index}
              ref={subMenuRef} // Reference for submenu
              style={subMenuStyles} // Dynamically position submenu
              className="absolute bg-gradient-blue-hover shadow-lg z-10 flex flex-col whitespace-nowrap"
            >
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
          ) : null
        )}
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
              onClick={() => {
                setActiveMenu(item.name); // Change background on click
              }}
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
              {item.name === "Logout" && <IoLogOutOutline className="inline ml-2" />}
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





