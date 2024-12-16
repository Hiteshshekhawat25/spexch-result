import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { resetDeleteState } from "../../Store/Slice/deleteSlice"; // Keep the reset action
import { deleteData } from "../../Services/Downlinelistapi";
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userId }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.delete); // Keep using Redux for `resetDeleteState`
  const [loading, setLoading] = React.useState(false); // Local state for loading
  const [apiError, setApiError] = React.useState(null); // Local state for error

  const handleDelete = async () => {
    setLoading(true);
    setApiError(null); // Clear any previous error

    try {
      await deleteData(`admin/v1/user/delete-user/${userId}`); // Call API
      setLoading(false);
      onConfirm(); // Trigger parent refresh
      dispatch(resetDeleteState()); // Reset Redux state if necessary
      onClose(); // Close the modal
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setApiError(errorMessage); // Set local error
    }
  };

  React.useEffect(() => {
    if (apiError) {
      // Automatically clear the error message after 5 seconds
      const timer = setTimeout(() => setApiError(null), 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [apiError]);

  if (!isOpen) return null;

  // Handle error rendering
  const errorMessage = apiError || (error && (typeof error === "object" ? error.message : error));

  return (
       <div className="fixed inset-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
  <div className="bg-white rounded-lg shadow-lg w-1/3 mt-16 "> {/* Add margin-top */}
    <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-lg">
      <h3 className="text-lg font-semibold">Confirmation</h3>
      <button onClick={onClose} className="text-white">
        <MdClose size={24} />
      </button>
    </div>
    <div className="p-6 items-centre justify-center">
      <p className="text-md text-gray-700 text-center">Are you sure you want to delete?</p>
      {loading && <p className="text-blue-500 text-sm mt-2">Deleting...</p>}
      {errorMessage && <p className="text-blue text-sm mt-2">{errorMessage}</p>}
    </div>
    <div className="flex justify-end p-4 space-x-4">
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-400" : "bg-blue hover:bg-blue"}`}
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

