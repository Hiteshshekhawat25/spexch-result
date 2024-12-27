import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileStatus, selectProfileError, updateProfile, setProfileLoading, setProfileError, setRollingCommission, setAgentRollingCommission } from '../../Store/Slice/profileSlice';
import { FaEye, FaRegEdit } from 'react-icons/fa';
import { getUserData } from '../../Services/Downlinelistapi'; // Adjust the import path if needed
import RollingCommisionModal from '../Modal/RollingCommisionModal';
import AgentRollingCommisionModal from '../Modal/AgentRollingCommisionModal';
import ChangePasswordModal from '../Modal/ChangePasswordModal'; // Import the change password modal

const MyProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfileData);
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);

  // State to control modal visibility and data
  const [isRollingModalOpen, setIsRollingModalOpen] = useState(false);
  const [isAgentRollingModalOpen, setIsAgentRollingModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // State for change password modal
  const [modalData, setModalData] = useState(null);

  const userData = JSON.parse(localStorage.getItem('userData'));
  const userId = userData?.data?._id;

  useEffect(() => {
    if (profileStatus === 'idle') {
      console.log('Setting profile to loading...');
      dispatch(setProfileLoading());

      const fetchProfileData = async () => {
        try {
          // Pass userId as a URL parameter
          const response = await getUserData(`user/get-user/${userId}`);
          console.log('API Response:', response.data);

          // Store the profile data in Redux and the modalData state
          dispatch(updateProfile(response.data.data));

          // Dispatch the rolling and agent rolling commission data to Redux
          dispatch(setRollingCommission(response.data.rollingCommission));
          dispatch(setAgentRollingCommission({
            username: response.data.data.name,
            commissionRates: response.data.agentRollingCommission,
          }));

          setModalData(response.data.data); // Store the entire response data for modals
        } catch (error) {
          console.error('Fetch Profile Error:', error);
          dispatch(setProfileError(error.message || 'Failed to fetch profile data'));
        }
      };

      fetchProfileData();
    }
  }, [profileStatus, dispatch, userId]); // Add userId as a dependency

  // Handle loading and error states
  if (profileStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (profileStatus === 'failed') {
    return <div>Error: {profileError}</div>;
  }

  // Open Rolling Commission modal
  const handleOpenRollingModal = () => {
    if (modalData) {
      setIsRollingModalOpen(true);
    }
  };

  // Open Agent Rolling Commission modal
  const handleOpenAgentRollingModal = () => {
    if (modalData) {
      setIsAgentRollingModalOpen(true);
    }
  };

  // Open Change Password modal
  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  return (
    <div className="border border-gray-400 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-blue text-white py-3 px-4 rounded-t-lg">
        <h1 className="text-xl font-semibold">Account Details</h1>
      </div>

      {/* Profile Details */}
      <table className="w-full border-collapse mt-4 text-sm text-left">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Name</td>
            <td className="py-2 px-4">{profile.name}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Commission</td>
            <td className="py-2 px-4">{profile.commission}%</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Rolling Commission</td>
            <td className="py-2 px-4">
              <FaEye 
                className="ml-2 text-blue cursor-pointer" 
                onClick={handleOpenRollingModal} 
              />
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Agent Rolling Commission</td>
            <td className="py-2 px-4 flex items-center">
              <FaEye 
                className="ml-2 text-blue cursor-pointer" 
                onClick={handleOpenAgentRollingModal} 
              />
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Currency</td>
            <td className="py-2 px-4">{profile.currency}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Partnership</td>
            <td className="py-2 px-4">{profile.partnership}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Mobile Number</td>
            <td className="py-2 px-4">{profile.mobileNumber}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Password</td>
            <td className="py-2 px-4">
              ******** 
              <FaRegEdit 
                className="ml-2 text-blue cursor-pointer" 
                onClick={handleOpenChangePasswordModal}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modals */}
      {isRollingModalOpen && modalData && (
        <RollingCommisionModal
          username={modalData.name}
          commissionRates={modalData.rollingCommission}
          onCancel={() => setIsRollingModalOpen(false)}
        />
      )}

      {isAgentRollingModalOpen && modalData && (
        <AgentRollingCommisionModal
          username={modalData.name}
          commissionRates={modalData.agentRollingCommission}
          onCancel={() => setIsAgentRollingModalOpen(false)}
        />
      )}

      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          onCancel={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyProfile;





// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectProfileData, selectProfileStatus, selectProfileError, updateProfile, setProfileLoading, setProfileError } from '../../Store/Slice/profileSlice';
// import { FaEye } from 'react-icons/fa';
// import { getUserData } from '../../Services/Downlinelistapi'; // Adjust the import path if needed

// const MyProfile = () => {
//   const dispatch = useDispatch();
//   const profile = useSelector(selectProfileData);
//   const profileStatus = useSelector(selectProfileStatus);
//   const profileError = useSelector(selectProfileError);
// useEffect(() => {
//   if (profileStatus === 'idle') {
//     console.log('Setting profile to loading...');
//     dispatch(setProfileLoading());

//     const fetchProfileData = async () => {
//       try {
//         const response = await getUserData('user/user-profile-summary');
//         console.log('API Response:', response.data);
//         dispatch(updateProfile(response.data.data));
//       } catch (error) {
//         console.error('Fetch Profile Error:', error);
//         dispatch(setProfileError(error.message || 'Failed to fetch profile data'));
//       }
//     };

//     fetchProfileData();
//   }
// }, [profileStatus, dispatch]);


//   // Handle loading and error states
//   if (profileStatus === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (profileStatus === 'failed') {
//     return <div>Error: {profileError}</div>;
//   }

//   return (
//     <div className="border border-gray-400 rounded-lg bg-white shadow-sm">
//       {/* Header */}
//       <div className="bg-gradient-blue text-white py-3 px-4 rounded-t-lg">
//         <h1 className="text-xl font-semibold">Account Details</h1>
//       </div>

//       {/* Profile Details */}
//       <table className="w-full border-collapse mt-4 text-sm text-left">
//         <tbody>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Name</td>
//             <td className="py-2 px-4">{profile.name}</td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Commission</td>
//             <td className="py-2 px-4">{profile.commission}%</td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Rolling Commission</td>
//             <td className="py-2 px-4"><FaEye className="ml-2 text-blue cursor-pointer" /></td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Agent Rolling Commission</td>
//             <td className="py-2 px-4 flex items-center">
//               <FaEye className="ml-2 text-blue cursor-pointer" />
//             </td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Currency</td>
//             <td className="py-2 px-4">{profile.currency}</td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Partnership</td>
//             <td className="py-2 px-4">{profile.partnership}</td>
//           </tr>
//           <tr className="border-b">
//             <td className="py-2 px-4 font-medium">Mobile Number</td>
//             <td className="py-2 px-4">{profile.mobileNumber}</td>
//           </tr>
//           <tr>
//             <td className="py-2 px-4 font-medium">Password</td>
//             <td className="py-2 px-4">******</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MyProfile;

