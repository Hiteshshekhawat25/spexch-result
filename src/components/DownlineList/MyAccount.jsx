import React, { useEffect, useState } from 'react';
import MyProfile from './MyProfile';
import AccountStatement from './AccountStatement';
import ActivityLog from './ActivityLog';

const MyAccount = () => {
  const [selectedPage, setSelectedPage] = useState('myProfile'); // Default to 'myProfile'

  useEffect(() => {
    // Optionally, perform any setup or fetch actions here
  }, []);

  const handleSelection = (page) => {
    setSelectedPage(page);
  };

  let content;
  switch (selectedPage) {
    case 'myProfile':
      content = <MyProfile />;
      break;
    case 'accountStatement':
      content = <AccountStatement />;
      break;
    case 'activityLog':
      content = <ActivityLog />;
      break;
    default:
      content = <MyProfile />;
  }

  return (
    <div className="flex justify-center mt-6">
      {/* Sidebar */}
      <div className="w-1/4 border border-gray-400 rounded-lg  mr-8 ml-4 bg-white">
        <h2 className="text-xl text-white bg-gradient-blue py-2 px-4 rounded-t-md">
          My Account
        </h2>
        <table className="w-full mt-2 border-collapse">
          <tbody>
            <tr
              className={`cursor-pointer text-center border border-gray-300 ${
                selectedPage === 'myProfile' ? 'font-bold bg-gray-200' : ''
              }`}
              onClick={() => handleSelection('myProfile')}
            >
              <td className="py-2 px-4">My Profile</td>
            </tr>
            <tr
              className={`cursor-pointer text-center border border-gray-300 ${
                selectedPage === 'accountStatement' ? 'font-bold bg-gray-200' : ''
              }`}
              onClick={() => handleSelection('accountStatement')}
            >
              <td className="py-2 px-4">Account Statement</td>
            </tr>
            <tr
              className={`cursor-pointer text-center border border-gray-300 ${
                selectedPage === 'activityLog' ? 'font-bold bg-gray-200' : ''
              }`}
              onClick={() => handleSelection('activityLog')}
            >
              <td className="py-2 px-4">Activity Log</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Content */}
      <div className="w-3/4 border border-gray-400 rounded-lg mr-4 bg-gray-100 shadow-sm">
        {content}
      </div>
    </div>
  );
};

export default MyAccount;
