import { useState } from "react";
import { Link } from "react-router-dom";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);

 /* static data */
  const menuItems = [
    { name: "Dashboard", link: "#" },
    {
      name: "Downline List",
      link: "#",
      subMenu: ["Downline List", "Master Downline List"],
    },
    { name: "My Account", link: "#" },
    {
      name: "My Report",
      link: "#",
      subMenu: ["Daily Report", "Monthly Report"],
    },
    { name: "BetList", link: "#" },
    { name: "Market Analysis", link: "#" },
    {
      name: "Banking",
      link: "#",
      subMenu: ["Deposit", "Withdraw"],
    },
    { name: "Commission", link: "#" },
    { name: "Password History", link: "#" },
    { name: "Restore User", link: "#" },
    { name: "User Report", link: "#" },
    { name: "Logout", link: "#" },
  ];

  return (
    <div className="bg-LightGreen text-white px-6 ">
      <ul className="flex space-x px-8">
        {menuItems.map((item, index) => (
          <li key={index} className="relative group border-l border-r border-customGray">
            <Link
              to={item.link}
              onClick={() => setActiveMenu(item.name)}
              className={`py-2 px-3 block hover:bg-NavyBlue border-b-2 border-transparent ${
                activeMenu === item.name
                  ? "bg-NavyBlue text-white"
                  : "hover:border-NavyBlue"
              }`}
            >
              {item.name}
            </Link>
            {item.subMenu && (
              <ul className="absolute left-0 top-full hidden bg-NavyBlue group-hover:block shadow-lg z-10">
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a href="#" className="block px-2 py-1 hover:bg-NavyBlue">
                      {subItem}
                    </a>
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
