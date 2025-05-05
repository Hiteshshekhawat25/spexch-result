import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../Store/Slice/userInfoSlice";
import { ROUTES_CONST } from "../../Constant/routesConstant";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [subMenuStyles, setSubMenuStyles] = useState({});
  const dispatch = useDispatch();
  const menuRefs = useRef([]);
  const subMenuRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData"));


  const handleLogout = () => {
    dispatch(clearUserData());
    localStorage.clear();
    window.location.reload();
  };

  const menuItems = [
    { name: "Dashboard", link: "/dashboardPage" },
 
    // {
    //   name: "Logout",
    //   onClick: handleLogout,
    // },
  ];

  if (userData && userData.data.role_name === "super-admin") {
    menuItems.push(
      {
        name: "Matches",
        link: "#",
        subMenu: [
      
          { name: "All Matches", link: "/AllMatches" },
          { name: "Session Result", link: "/SessionResult" },
          { name: "SportBook Result", link: "/SportsBookResult" },
       
        ],
      },
      {
        name: "Liability",
        link: ROUTES_CONST.liabilty,
      },
     
      {
        name: "Logout",
        link: "#",
        onClick: handleLogout,
      }
    );
  } else {
    menuItems?.push({
      name: "Logout",
      link: "#",
      onClick: handleLogout,
    });
  }

  const menuWrapperRef = useRef(null);
  const toggleSubMenu = (name, index) => {
    if (activeSubMenu === name) {
      setTimeout(()=> {
        setActiveSubMenu(null);
        setSubMenuStyles({});

      }, 100)
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
    <div className="bg-gradient-to-b  from-[#FD8639] to-[#FD3C25] text-black font-bold">
      <div
        className=" overflow-x-auto whitespace-nowrap "
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For IE and Edge
        }}
        ref={menuWrapperRef}
      >
        <ul className="flex items-center">
          {menuItems.map((item, index) =>{
            return  (
            <li
              key={index}
              className="relative text-sm border-r border-gray-500"
              ref={(el) => (menuRefs.current[index] = el)}
            >
              {item.name === "Logout" ? (
                <button
                  onClick={item.onClick}
                  className="py-1 px-2 block border-b-0 bg-gradient-to-b  from-[#FD8639] to-[#FD3C25] text-black border-transparent hover:underline hover:decoration-black"
                >
                  {item.name}
                  <IoLogOutOutline className="inline ml-2" />
                </button>
              ) : (
                <Link
                  to={item.link}
                  onClick={() => {
                    setActiveMenu(item.link);
                    setActiveSubMenu('')
                    item.subMenu?.length > 0 && toggleSubMenu(item.name, index);
                  }}
                  className={` border-b-1 h-full flex items-center px-2 py-1.5 text-[13px] ${
                 ( item?.subMenu  ? 
                  location.pathname?.includes(item?.subMenu?.find((item)=>item?.link == location.pathname)?.link) 
                   : 
                   location.pathname?.includes(item.link))
                      ? "bg-[#F6A21E] text-white border-gradient-blue-hover"
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
          )})}
        </ul>

        {menuItems.map((item, index) =>{
          return(
         ( item.subMenu?.length > 0 && activeSubMenu === item.name) ? (
            <ul
              key={index}
              ref={subMenuRef}
              style={{
                ...subMenuStyles,
                left: subMenuStyles.left,
                minWidth: subMenuStyles.minWidth,
              }}
              className="absolute bg-[#560572] shadow-lg z-10 flex flex-col whitespace-nowrap"
            >
              {item.subMenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    to={subItem.link}
                    onClick={() => setActiveSubMenu(null)}
                    // onMouseEnter={() => {
                    //   item.subMenu && toggleSubMenu(item.name, index);
                    // }}
                    // onMouseLeave={() => {
                    //   setActiveSubMenu(null);
                    // }}
                    className="block px-4 xl:py-1 py-2 hover:bg-[#F6A21E] text-white w-auto text-[13px] lg:text-sm"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null)}
        )}
      </div>
      <div className="   hidden whitespace-nowrap">
        <ul className="flex justify-center lg:justify-start  text-lg ps-2 z-50">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative group border-r border-gray-500 text-[12.5px] text-nowrap leading-normal "
            >
              {item.name === "Logout" ? (
                <button
                  onClick={item.onClick}
                  className="py-1 px-1.5 ml-5 flex items-center h-full text-black border-transparent hover:border-gray-600 font-custom"
                >
                  {item.name}
                  <IoLogOutOutline className="inline ml-1 -mt-0.5" />
                </button>
              ) : (
                <Link
                  to={item.link}
                  onClick={() => setActiveMenu(item.name)}
                  className={`py-[6px] px-2 flex items-center leading-normal  font-custom h-full ${
                    activeMenu === item.name
                      ? "bg-gradient-blue-hover text-white border-gradient-blue-hover"
                      : "border-transparent hover:border-gray-600"
                  }`}
                >
                  {item.name}
                  {item.subMenu && (
                    <TbTriangleInvertedFilled className="inline ml-2 size-2 h-1.5" />
                  )}
                </Link>
              )}
              {item.subMenu && (
                <ul className="absolute left-0 top-full hidden bg-gradient-blue-hover group-hover:block shadow-lg z-10 whitespace-nowrap">
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        // onClick={() => setActiveSubMenu(null)}
                        onMouseEnter={() => {
                          item.subMenu && toggleSubMenu(item.name, index);
                        }}
                        onMouseLeave={() => {
                          // setActiveSubMenu(null);
                        }}
                        to={subItem.link}
                        className="block px-4 py-[6px] font-custom border-b border-gray-800 hover:bg-gradient-green text-white"
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
    </div>
  );
};

export default MenuHeader;
