import React, { useEffect, useState } from 'react';
import MyProfile from './MyProfile';
import AccountStatement from './AccountStatement';
import ActivityLog from './ActivityLog';

const MyAccount = () => {
  const [selectedPage, setSelectedPage] = useState('myProfile'); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally, perform any setup or fetch actions here
  }, []);


  useEffect(() => {
    if (loading) {
      // Simulate loading time (1 second) before switching the page
      const timer = setTimeout(() => {
        setLoading(false); // Set loading to false after the simulated delay
      }, 300); // Adjust this delay based on your actual content load time

      // Clean up the timer on component unmount or when the loading state changes
      return () => clearTimeout(timer);
    }
  }, [loading]); // This effect runs every time the `loading` state changes

  const handleSelection = (page) => {
    setLoading(true);
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
     {loading ? (

<div className="flex justify-center items-center h-64">
  <div className="relative w-48 h-48">
    
    <div className="absolute w-8 h-8 bg-gradient-green rounded-full animate-crossing1"></div>
   
    <div className="absolute w-8 h-8 bg-gradient-blue rounded-full animate-crossing2"></div>
    
    <div className="absolute bottom-[-40px] w-full text-center text-xl font-semibold text-black">
      Loading...
    </div>
  </div>
 
 
</div>
) : (
  <>
      <div className="w-full sm:w-1/4 border border-gray-400 mx-4 sm:mx-8 bg-white max-h-[calc(3.5*2.6rem)] sm:max-h-[calc(3.5*2.6rem)] overflow-hidden">
  <h2 className="text-sm text-white bg-gradient-seablue font-bold py-2 px-4">
    My Account
  </h2>
  
  <div className="w-full border-collapse">
    <div
      className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
        selectedPage === 'myProfile' ? 'font-bold bg-bluehover' : ''
      }`}
      onClick={() => handleSelection('myProfile')}
    >
      <div className="flex justify-between py-2 px-4 text-sm">
        <span>My Profile</span>
      </div>
    </div>
    
    <div
      className={`cursor-pointer text-left border-b border-gray-300 hover:bg-lime ${
        selectedPage === 'accountStatement' ? 'font-bold bg-bluehover' : ''
      }`}
      onClick={() => handleSelection('accountStatement')}
    >
      <div className="flex justify-between py-2 px-4 text-sm">
        <span>Account Statement</span>
      </div>
    </div>
    
    <div
      className={`cursor-pointer text-left border-gray-300 hover:bg-lime ${
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









      <div className="w-3/4">
        {content}
      </div>
      </>
)}
    
    </div>
    
  );
};

export default MyAccount;
