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
      <div className="w-1/4 border border-gray-400 mr-8 ml-8 bg-white h-[calc(3.5*2.6rem)]"> 
    <h2 className="text-sm text-white bg-gradient-seablue font-bold py-2 px-4">
      My Account
    </h2>
    
    <div className="w-full border-collapse">
  <div
    className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${ // Added hover effect
      selectedPage === 'myProfile' ? 'font-bold bg-bluehover' : ''
    }`}
    onClick={() => handleSelection('myProfile')}
  >
    <div className="flex justify-between py-2 px-4 text-sm">
      <span>My Profile</span>
    </div>
  </div>
  
  <div
    className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${ // Added hover effect
      selectedPage === 'accountStatement' ? 'font-bold bg-bluehover' : ''
    }`}
    onClick={() => handleSelection('accountStatement')}
  >
    <div className="flex justify-between py-2 px-4 text-sm">
      <span>Account Statement</span>
    </div>
  </div>
  
  <div
    className={`cursor-pointer text-left border-gray-300 hover:bg-lime ${ // Added hover effect
      selectedPage === 'activityLog' ? 'font-bold bg-bluehover' : ''
    }`}
    onClick={() => handleSelection('activityLog')}
  >
    <div className="flex justify-between py-2 px-4 text-sm">
      <span>Activity Log</span>
    </div>
  </div>
</div>

  </div>





      {/* Content */}
      <div className="w-3/4">
        {content}
      </div>
    </div>
  );
};

export default MyAccount;
