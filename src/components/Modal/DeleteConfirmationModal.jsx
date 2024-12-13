import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { deleteUser, resetDeleteState } from "../../Store/Slice/deleteSlice";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userId }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.delete);

  const handleDelete = () => {
    dispatch(deleteUser(userId));
  };

  useEffect(() => {
    if (success) {
      onConfirm(); // Callback to parent to refresh data
      dispatch(resetDeleteState()); // Reset state after successful deletion
      onClose(); // Close the modal
    }
  }, [success, dispatch, onConfirm, onClose]);

  useEffect(() => {
    if (error) {
      // Clear the error message after 5 seconds to avoid permanent display
      const timer = setTimeout(() => dispatch(resetDeleteState()), 5000);
      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [error, dispatch]);

  if (!isOpen) return null;

  // Handle error rendering
  const errorMessage = error ? (typeof error === 'object' ? error.message : error) : '';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Confirmation</h3>
          <button onClick={onClose} className="text-white">
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700">Are you sure you want to delete?</p>
          <h2>Are you sure you want to delete user with ID: {userId}?</h2>
          {loading && <p className="text-blue-500 text-sm mt-2">Deleting...</p>}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
        <div className="flex justify-end p-4 space-x-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
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


// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MdClose } from "react-icons/md";
// import { deleteUser, resetDeleteState } from "../../Store/deleteSlice";


// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userId }) => {
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.delete);

//   const handleDelete = () => {
//     dispatch(deleteUser(userId));
//   };

//   React.useEffect(() => {
//     if (success) {
//       onConfirm(); // Callback for parent component to refresh data
//       dispatch(resetDeleteState()); // Reset state after successful deletion
//       onClose(); // Close the modal
//     }
//   }, [success, dispatch, onConfirm, onClose]);
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg shadow-lg w-1/3">
//         <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-lg">
//           <h3 className="text-lg font-semibold">Confirmation</h3>
//           <button onClick={onClose} className="text-white">
//             <MdClose size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           <p className="text-sm text-gray-700">Are you sure you want to delete?</p>
//           {loading && <p className="text-blue-500 text-sm mt-2">Deleting...</p>}
//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         </div>
//         <div className="flex justify-end p-4 space-x-4">
//         <button
//             onClick={handleDelete}
//             disabled={loading}
//             className={`px-4 py-2 text-white rounded-md ${
//               loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
//             }`}
//           >
//             Yes
//           </button>
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmationModal;

// import React from "react";
// import { MdClose } from "react-icons/md";

// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg shadow-lg w-1/3">
//         <div className="flex justify-between items-center bg-black text-white p-4 rounded-t-lg">
//           <h3 className="text-lg font-semibold">Confirmation</h3>
//           <button onClick={onClose} className="text-white">
//             <MdClose size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           <p className="text-sm text-gray-700">Are you sure you want to delete?</p>
//         </div>
//         <div className="flex justify-end p-4 space-x-4">
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-blue text-white rounded-md hover:bg-red-700"
//           >
//             Yes
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmationModal;
