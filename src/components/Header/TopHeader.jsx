import React, { useEffect, useState } from "react";

const TopHeader = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  return (
    <div className="w-full bg-NavyBlue text-white py-6 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold ml-8 pl-2">SPEXCH</div>
      </div>

      {/* User-specific section */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Display user-specific info, e.g., username */}
            {/* <span className="text-sm font-medium">Hello, {user?.data?.username}</span> */}
            {/* <span className="bg-LightGreen px-2 py-1 rounded text-sm">
              WHITE_LABEL
            </span> */}
            <span>{user?.data?.name}</span>
            {/* <span>IRP 0</span> */}
            <button
              className="hover:underline"
              onClick={() => {
                // Handle logout logic here, e.g., clearing localStorage
                localStorage.clear();
                window.location.reload(); // or navigate to login page
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <span>Loading...</span> // Display a loading message while user data is fetched
        )}
      </div>
    </div>
  );
};

export default TopHeader;
