import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfileData, selectProfileStatus, selectProfileError, updateProfile, setProfileLoading, setProfileError } from '../../Store/Slice/profileSlice';
import { FaEye } from 'react-icons/fa';
import { getUserData } from '../../Services/Downlinelistapi'; // Adjust the import path if needed

const MyProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfileData);
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);
useEffect(() => {
  if (profileStatus === 'idle') {
    console.log('Setting profile to loading...');
    dispatch(setProfileLoading());

    const fetchProfileData = async () => {
      try {
        const response = await getUserData('user/user-profile-summary');
        console.log('API Response:', response.data);
        dispatch(updateProfile(response.data.data));
      } catch (error) {
        console.error('Fetch Profile Error:', error);
        dispatch(setProfileError(error.message || 'Failed to fetch profile data'));
      }
    };

    fetchProfileData();
  }
}, [profileStatus, dispatch]);


  // Handle loading and error states
  if (profileStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (profileStatus === 'failed') {
    return <div>Error: {profileError}</div>;
  }

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
            <td className="py-2 px-4"><FaEye className="ml-2 text-blue cursor-pointer" /></td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium">Agent Rolling Commission</td>
            <td className="py-2 px-4 flex items-center">
              <FaEye className="ml-2 text-blue cursor-pointer" />
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
            <td className="py-2 px-4">******</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyProfile;

