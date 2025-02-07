import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfileData,
  selectProfileStatus,
  selectProfileError,
  updateProfile,
  setProfileLoading,
  setProfileError,
  setRollingCommission,
  setAgentRollingCommission,
} from "../../Store/Slice/profileSlice";
import { FaEye, FaRegEdit, FaEdit } from "react-icons/fa";
import { getUserData } from "../../Services/Downlinelistapi";
import RollingCommisionModal from "../Modal/RollingCommisionModal";
import AgentRollingCommisionModal from "../Modal/AgentRollingCommisionModal";
import ChangePasswordModal from "../Modal/ChangePasswordModal";
import EditRollingCommissionModal from "../Modal/EditRollingCommisionModal";
import EditCommissionModal from "../Modal/EditCommisionModal";
import EditExposureLimitModal from "../Modal/EditExposureLimitModal";
import { ClipLoader } from "react-spinners";

const MyProfile = ({ Userid, Role }) => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfileData);
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);

  const [isRollingModalOpen, setIsRollingModalOpen] = useState(false);
  const [isAgentRollingModalOpen, setIsAgentRollingModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isEditRollingModalOpen, setIsEditRollingModalOpen] = useState(false);
  const [isEditExposureLimitModalOpen, setIsEditExposureLimitModalOpen] =
    useState(false);
  const [isEditCommissionModalOpen, setIsEditCommissionModalOpen] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalData, setModalData] = useState(null);

  console.log("Userid passed to MyProfile:", Userid);
  console.log("Role", Role);

  const ID = Userid || JSON.parse(localStorage.getItem("userData"))?.data?._id;
  console.log("Final ID being used:", ID);

  useEffect(() => {
    if (Userid) {
      console.log("Setting profile to loading...");
      dispatch(setProfileLoading());
  
      const fetchProfileData = async () => {
        try {
          const response = await getUserData(`user/get-user/${Userid}`);
          console.log("API Response:", response.data);
          console.log("response for commission", response);
          dispatch(updateProfile(response.data.data));
          dispatch(setRollingCommission(response.data.rollingCommission));
          dispatch(
            setAgentRollingCommission({
              username: response.data.data.username,
              commissionRates: response.data.agentRollingCommission,
            })
          );
  
          setModalData(response.data.data);
        } catch (error) {
          console.error("Fetch Profile Error:", error);
          dispatch(
            setProfileError(error.message || "Failed to fetch profile data")
          );
        }
      };
  
      fetchProfileData();
    }
  }, [Userid, dispatch]);

  if (profileStatus === "loading") {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  // if (profileStatus === "failed") {
  //   return <div>Error: {profileError}</div>;
  // }

  // Open Rolling Commission modal
  const handleOpenRollingModal = () => {
    if (modalData) {
      setIsRollingModalOpen(true);
    }
  };

  const handleOpenEditRollingModal = () => {
    if (modalData) {
      console.log("Edit button clicked!");
      setIsEditRollingModalOpen(true);
    }
  };

  const handleOpenEditExposureModal = () => {
    if (modalData) {
      console.log("Edit button clicked!");
      setIsEditExposureLimitModalOpen(true);
    }
  };

  const handleOpenEditCommissionModal = (id) => {
    setSelectedUserId(id);
    if (modalData) {
      console.log("Edit button clicked!");
      setIsEditCommissionModalOpen(true);
    }
  };

  const handleOpenAgentRollingModal = () => {
    if (modalData) {
      setIsAgentRollingModalOpen(true);
    }
  };

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  return (
    <div className="border border-gray-400 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-seablue text-white py-1.5 px-2 rounded-t-lg">
        <h1 className="text-md font-custom font-semibold">Account Details</h1>
      </div>

      {/* Profile Details */}
      <div className="mt-4 text-sm">
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Name</span>
          <span className="text-left ml-4">{profile.name}</span>
        </div>
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Commission</span>
          <span className="text-left ml-4">{profile.commission}%</span>
          {Userid && (
            <span className="text-left ml-4 flex items-center">
              <FaEdit
                className="ml-2 text-blue cursor-pointer"
                onClick={() => handleOpenEditCommissionModal(Userid)}
              />
            </span>
          )}
        </div>
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Rolling Commission</span>
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
        {Role !== "user" && (
          <div className="flex border-b py-3 px-4">
            <span className="font-custom w-48">Agent Rolling Commission</span>
            <span className="text-left ml-4 flex items-center">
              <FaEye
                className="ml-2 text-blue cursor-pointer"
                onClick={handleOpenAgentRollingModal}
              />
            </span>
          </div>
        )}
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Currency</span>
          <span className="text-left ml-4">IRP{profile.currency}</span>
        </div>

        {Role === "user" && (
          <div className="flex border-b py-3 px-4">
            <span className="font-custom w-48">Exposure Limit</span>
            <span className="text-left ml-4">{profile.exposureLimit}</span>
            <FaRegEdit
              className="text-blue cursor-pointer"
              onClick={handleOpenEditExposureModal}
            />
          </div>
        )}
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Partnership</span>
          <span className="text-left ml-4">{profile.partnership}</span>
        </div>
        <div className="flex border-b py-3 px-4">
          <span className="font-custom w-48">Mobile Number</span>
          <span className="text-left ml-4">{profile.mobileNumber}</span>
        </div>
        <div className="flex py-3 px-4">
          <span className="font-custom w-48">Password</span>
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
          username={modalData.username}
          commissionRates={modalData.rollingCommission}
          onCancel={() => setIsRollingModalOpen(false)}
        />
      )}

      {isAgentRollingModalOpen && modalData && (
        <AgentRollingCommisionModal
          username={modalData.username}
          commissionRates={modalData.agentRollingCommission}
          onCancel={() => setIsAgentRollingModalOpen(false)}
        />
      )}

      {isEditRollingModalOpen && modalData && (
        <EditRollingCommissionModal
          username={modalData.username}
          userId={ID}
          onCancel={() => setIsEditRollingModalOpen(false)}
          onSubmit={(updatedData) => {
            console.log("Updated Rolling Commission Data:", updatedData);
            setIsEditRollingModalOpen(false);
          }}
        />
      )}

      {isEditCommissionModalOpen && modalData && (
        <EditCommissionModal
          username={modalData.username}
          // userId={ID}
          userId={selectedUserId}
          onCancel={() => setIsEditCommissionModalOpen(false)}
          onSubmit={(updatedData) => {
            console.log("Updated Rolling Commission Data:", updatedData);
            setIsEditCommissionModalOpen(false);
          }}
        />
      )}

      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          userId={Userid}
          onCancel={() => setIsChangePasswordModalOpen(false)}
        />
      )}
      {isEditExposureLimitModalOpen && modalData && (
        <EditExposureLimitModal
          username={modalData.username}
          currentExposureLimit={modalData.exposureLimit}
          userId={ID}
          onCancel={() => setIsEditExposureLimitModalOpen(false)}
          onSubmit={(updatedData) => {
            console.log("Updated Exposure Data:", updatedData);
            setIsEditCommissionModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MyProfile;
