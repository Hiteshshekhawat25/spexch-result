import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { resetDeleteState } from "../../Store/Slice/deleteSlice";
import { deleteData, fetchDownlineData } from "../../Services/Downlinelistapi";
import { setDownlineData } from "../../Store/Slice/downlineSlice";
import { toast } from "react-toastify";
import { fetchRoles } from "../../Utils/LoginApi";
import { ClipLoader } from "react-spinners";
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  userId,
  currentPage,
  entriesToShow,
}) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.delete);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setApiError(null);

    try {
      // Delete the user
      await deleteData(`user/delete-user/${userId}`);
      toast.success("User deleted successfully.");

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const rolesArray = await fetchRoles(token);
      if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
        throw new Error("No roles found. Please check your configuration.");
      }

      const rolesData = rolesArray.map((role) => ({
        role_name: role.role_name,
        role_id: role._id,
      }));

      let roleId = null;

      if (location.pathname === "/admin/user-downline-list") {
        const userRole = rolesData.find((role) => role.role_name === "user");
        roleId = userRole ? userRole.role_id : rolesData[0].role_id;
      } else if (location.pathname === "/admin/master-downline-list") {
        const masterRole = rolesData.find(
          (role) => role.role_name === "master"
        );
        roleId = masterRole ? masterRole.role_id : rolesData[0].role_id;
      } else {
        throw new Error("Invalid location path. Unable to determine roleId.");
      }

      const result = await fetchDownlineData(
        currentPage,
        entriesToShow,
        roleId
      );
      if (result && result.data) {
        dispatch(setDownlineData(result.data));
      }

      dispatch(resetDeleteState());
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  if (!isOpen) return null;

  const errorMessage =
    apiError || (error && (typeof error === "object" ? error.message : error));

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 mt-16 ">
        {" "}
        {/* Add margin-top */}
        <div className="flex justify-between items-center bg-gradient-blue text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Confirmation</h3>
          <button onClick={onClose} className="text-white">
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6 items-centre justify-center">
          <p className="text-md text-gray-700 text-center">
            Are you sure you want to delete?
          </p>
          {loading && (
            <p className="text-blue-500 text-sm mt-2">
              <ClipLoader />
            </p>
          )}
          {errorMessage && (
            <p className="text-blue text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        <div className="flex justify-end p-4 space-x-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-blue hover:bg-blue"
            }`}
          >
            Yes
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
