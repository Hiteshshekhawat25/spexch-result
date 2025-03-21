import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getUserData } from "../../Services/Downlinelistapi";

const UserHierarchyModal = ({ userId, username, closeModal }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      console.log('userHeirarchyModal')
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
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[300px] mt-3 sm:mt-12">
        
        <div className="flex justify-between items-center bg-gradient-blue text-white text-lg font-custom font-semibold w-full p-2">
          <span>Parent List</span>
          <button onClick={closeModal} className="text-xl text-white hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        {!loading && !error && userData && (
          <div className="p-4">
            <table className="w-full border border-collapse border-gray-200">
              <tbody>
                <tr className="border-b border-cream-200">
                                    <td className="text-gray-700 p-2">{userData.username}</td>
                </tr>
             
              </tbody>
            </table>
          </div>
        )}

        {/* Loading/Error Messages */}
        {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
        {error && <p className="p-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UserHierarchyModal;




