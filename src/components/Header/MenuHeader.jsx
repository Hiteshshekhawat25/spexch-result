import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { fetchUserDetails } from "../../Utils/LoginApi";

const MenuHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState("");

  let userData = JSON.parse(localStorage.getItem('userData'));
  console.log(userData.data.role_name);

  /* static data */
  const menuItems = [
    { name: "Dashboard", link: "#" },
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
    { name: "User Report", link: "#" },
    { name: "Logout", link: "#" },
  ];

  if (userData && userData.data.role_name === "super-admin") {
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
        link: "/GlobalSettings" ,
      }
    );
  }

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserDetails(token, user.id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, token]);

  return (
    <div className="bg-gradient-green text-black font-bold text-sm px-6">
      <ul className="flex space-x px-8">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative group border-l border-r border-theme1"
            style={{ whiteSpace: "nowrap" }} // Prevent wrapping
          >
            <Link
              to={item.link}
              onClick={() => setActiveMenu(item.name)}
              className={`py-2 px-3 block hover:bg-gradient-blue-hover border-b-2 border-transparent ${
                activeMenu === item.name
                  ? "bg-gradient-blue-hover text-white"
                  : "hover:border-gradient-blue-hover hover:text-white"
              }`}
              style={{ display: "block", width: "100%" }} // Ensure full width for hover effect
            >
              {item.name}
            </Link>
            {item.subMenu && (
              <ul className="absolute left-0 top-full hidden bg-gradient-blue-hover group-hover:block shadow-lg z-10">
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      to={subItem.link}
                      className="block px-2 py-1 hover:bg-gradient-green hover:border-t-2 border-gradient-blue-hover text-white"
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

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import React from "react";
// import { fetchUserDetails } from "../../Utils/LoginApi";

// const MenuHeader = () => {
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [user, setUser] = useState("");

//   let userData = JSON.parse(localStorage.getItem('userData')); 
//   console.log(userData.data.role_name);

//   /* static data */
//   const menuItems = [
//     { name: "Dashboard", link: "#" },
//     {
//       name: "Downline List",
//       link: "#",
//       subMenu: [
//         { name: "User Downline List", link: "/user-downline-list" },
//         { name: "Master DownLine List", link: "/master-downline-list" },
//       ],
//     },
//     { name: "My Account", link: "/MyAccount" },
//     {
//       name: "My Report",
//       link: "#",
//       subMenu: [
//         { name: "Event Profit/Loss", link: "/EventProfitLoss" },
//         { name: "Downline Profit/Loss", link: "/ProfitLoss" },
//       ],
//     },
//     { name: "BetList", link: "/BetList" },
//     { name: "Market Analysis", link: "#" },
//     {
//       name: "Banking",
//       link: "#",
//       subMenu: [
//         { name: "Deposit", link: "/deposit" },
//         { name: "Withdraw", link: "/withdraw" },
//       ],
//     },
//     { name: "Commission", link: "#" },
//     { name: "Password History", link: "#" },
//     { name: "Restore User", link: "#" },
//     { name: "User Report", link: "#" },
//     { name: "Logout", link: "#" },
//   ];

//   if (userData && userData.data.role_name === "super-admin") {
//     menuItems.push(
//       {
//         name: "Matches",
//         link: "#",
//         subMenu: [
//           { name: "Create New Match", link: "/CreateNewMatch" },
//           { name: "Create Manual Match", link: "/CreateManualMatch" },
//           { name: "All Matches", link: "/AllMatches" },
//         ],
//       },
//       {
//         name: "Global Settings",
//         link: "/GlobalSettings" ,
//       }
//     );
//   }

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchUserDetails(token, user.id);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };

//     if (user) {
//       fetchData();
//     }
//   }, [user, token]);

//   return (
//     <div className="bg-LightGreen text-white px-6">
//       <ul className="flex space-x px-8">
//         {menuItems.map((item, index) => (
//           <li
//             key={index}
//             className="relative group border-l border-r border-customGray"
//           >
//             <Link
//               to={item.link}
//               onClick={() => setActiveMenu(item.name)}
//               className={`py-2 px-3 block hover:bg-NavyBlue border-b-2 border-transparent ${
//                 activeMenu === item.name
//                   ? "bg-NavyBlue text-white"
//                   : "hover:border-NavyBlue"
//               }`}
//             >
//               {item.name}
//             </Link>
//             {item.subMenu && (
//               <ul className="absolute left-0 top-full hidden bg-NavyBlue group-hover:block shadow-lg z-10">
//                 {item.subMenu.map((subItem, subIndex) => (
//                   <li key={subIndex}>
//                     <Link
//                       to={subItem.link}
//                       className="block px-2 py-1 hover:bg-LightGreen hover:border-t-2 border-NavyBlue"
//                     >
//                       {subItem.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MenuHeader;
