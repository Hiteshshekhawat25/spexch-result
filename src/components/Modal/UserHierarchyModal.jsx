import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getUserHierarchyData } from "../../Services/Betlistapi"; // Import the API function

const UserHierarchyModal = ({ userId, closeModal }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // Exit early if no userId is provided

    const fetchUserData = async () => {
      try {
        setLoading(true); // Set loading to true before the request
        const response = await getUserHierarchyData(userId); // API call with userId
        console.log(response.data)
        setUserData(response.data); // Set user data from the API response
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError(error.message); // Set error message if there's an issue
        setLoading(false); // Set loading to false after error
      }
    };

    fetchUserData(); // Trigger API call when the modal opens
  }, [userId]); // Re-run the effect when userId changes

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            {loading
              ? "Loading..."
              : error
              ? `Error: ${error}`
              : `User Hierarchy for ${userData?.username || "Unknown"}`}
          </h1>
          <button onClick={closeModal} className="text-xl text-gray-500 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        {/* Show user data if available */}
        {!loading && !error && userData && (
          <div className="space-y-4">
            <p><strong>Full Name:</strong> {userData.fullName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Status:</strong> {userData.status}</p>
            <p><strong>Created At:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Active:</strong> {new Date(userData.lastActive).toLocaleDateString()}</p>
            {/* Add more fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHierarchyModal;

// import React from "react";
// import { FaTimes } from "react-icons/fa";

// const UserHierarchyModal = ({ userId, closeModal }) => {
//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold">{userId ? `User Hierarchy for ${userId}` : "Loading..."}</h1>
//           <button onClick={closeModal} className="text-xl text-gray-500 hover:text-gray-800">
//             <FaTimes />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserHierarchyModal;
