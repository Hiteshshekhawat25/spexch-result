import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getUserData } from "../../Services/Downlinelistapi"; // Import the API function

const UserHierarchyModal = ({ userId, childname, closeModal }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(userId);
    console.log(childname);
    if (!userId) return;
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserData(`user/get-user/${userId}`);
                 
        setUserData(response.data.data);
     
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold bg-blue text-white py-2 px-4 rounded">
            {childname} 
          </h1>
          <button onClick={closeModal} className="text-xl text-gray-500 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        {!loading && !error && userData && (
          <div className="space-y-4">
            <p>Username: {userData.username}</p>
            {/* You can add more details about the user here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHierarchyModal;

// import React, { useState, useEffect } from "react";
// import { FaTimes } from "react-icons/fa";
// import { getUserData } from "../../Services/Downlinelistapi"; // Import the API function

// const UserHierarchyModal = ({ userId, childname, closeModal }) => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log(userId)
//     console.log(childname)
//     if (!userId) return; 
//     const fetchUserData = async () => {
//       try {
//         setLoading(true); 
//         const response = await getUserData(`user/get-user/${userId}`);
                 
//         setUserData(response.data.data); 
     
//         setLoading(false); 
//       } catch (error) {
//         setError(error.message); 
//         setLoading(false); 
//       }
//     };

//     fetchUserData(); 
//   }, [userId]); 

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-semibold">
//             {loading
//               ? "Loading..."
//               : error
//               ? `Error: ${error}`
//               : `User Hierarchy for ${userData?.username || "Unknown"}`}
//           </h1>
//           <button onClick={closeModal} className="text-xl text-gray-500 hover:text-gray-800">
//             <FaTimes />
//           </button>
//         </div>

      
//         {!loading && !error && userData && (
//           <div className="space-y-4">
//             <p> {userData.username}</p>
            
           
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserHierarchyModal;

