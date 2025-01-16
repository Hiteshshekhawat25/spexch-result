import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileStatus, selectProfileError, updateProfile, setProfileLoading, setProfileError, setRollingCommission, setAgentRollingCommission } from '../../Store/Slice/profileSlice';
import { FaEye, FaRegEdit ,FaEdit} from 'react-icons/fa';
import { getUserData } from '../../Services/Downlinelistapi'; 
import RollingCommisionModal from '../Modal/RollingCommisionModal';
import AgentRollingCommisionModal from '../Modal/AgentRollingCommisionModal';
import ChangePasswordModal from '../Modal/ChangePasswordModal'; 
import EditRollingCommissionModal from '../Modal/EditRollingCommisionModal'; 

const MyProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfileData);
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);

  // State to control modal visibility and data
  const [isRollingModalOpen, setIsRollingModalOpen] = useState(false);
  const [isAgentRollingModalOpen, setIsAgentRollingModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); 
  const [isEditRollingModalOpen, setIsEditRollingModalOpen] = useState(false);
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

          
          dispatch(updateProfile(response.data.data));

          
          dispatch(setRollingCommission(response.data.rollingCommission));
          dispatch(setAgentRollingCommission({
            username: response.data.data.name,
            commissionRates: response.data.agentRollingCommission,
          }));

          setModalData(response.data.data); 
        } catch (error) {
          console.error('Fetch Profile Error:', error);
          dispatch(setProfileError(error.message || 'Failed to fetch profile data'));
        }
      };

      fetchProfileData();
    }
  }, [profileStatus, dispatch, userId]); 
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

  const handleOpenEditRollingModal = () => {
    if (modalData) {
      console.log("Edit button clicked!");
      setIsEditRollingModalOpen(true); // Open the edit rolling commission modal
    }
  };

  // const handleOpenRollingModal = () => {
    
  //     setIsRollingModalOpen(true);
    
  // };

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
  <div className="bg-gradient-seablue text-white py-3 px-4 rounded-t-lg">
    <h1 className="text-xl font-semibold">Account Details</h1>
  </div>

  {/* Profile Details */}
  <div className="mt-4 text-sm">
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Name</span>
      <span className="text-left ml-4">{profile.name}</span> 
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Commission</span>
      <span className="text-left ml-4">{profile.commission}%</span> 
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Rolling Commission</span>
      <span className="text-left ml-4 flex items-center">
        <FaEdit
              className="ml-2 text-blue cursor-pointer" 
              onClick={handleOpenEditRollingModal} 
            />
      </span>
      <span className="text-left ml-4 flex items-center">
        <FaEye 
          className="ml-2 text-blue cursor-pointer" 
          onClick={handleOpenRollingModal} 
        />
      </span>
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Agent Rolling Commission</span>
      <span className="text-left ml-4 flex items-center">
        <FaEye 
          className="ml-2 text-blue cursor-pointer" 
          onClick={handleOpenAgentRollingModal} 
        />
      </span>
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Currency</span>
      <span className="text-left ml-4">{profile.currency}</span> 
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Partnership</span>
      <span className="text-left ml-4">{profile.partnership}</span> 
    </div>
    <div className="flex border-b py-3 px-4">
      <span className="font-medium w-48">Mobile Number</span>
      <span className="text-left ml-4">{profile.mobileNumber}</span> 
    </div>
    <div className="flex py-3 px-4">
      <span className="font-medium w-48">Password</span>
      <span className="flex items-center ml-4">
  <span className="mr-2">********</span>
  <FaRegEdit 
    className="text-blue cursor-pointer" 
    onClick={handleOpenChangePasswordModal}
  />
</span>

    </div>
  </div>

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

{isEditRollingModalOpen && modalData && (
        <EditRollingCommissionModal
        userId={userId} 
          onCancel={() => setIsEditRollingModalOpen(false)}
          onSubmit={(updatedData) => {
            console.log("Updated Rolling Commission Data:", updatedData);
            setIsEditRollingModalOpen(false);
          }}
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
