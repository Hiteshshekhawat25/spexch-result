import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiResetLeftLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { AddClientForm } from "../../components/Forms/AddClientForm";
import { AddMasterForm } from "./AddMasterForm";

const AddClientButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Local state for dialog visibility
  const location = useLocation();
  const modalRef = useRef(null);

  // Function to handle opening the dialog
  const handleOpenDialog = () => setIsDialogOpen(true);

  // Function to handle closing the dialog
  const handleCloseDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Close modal if click occurs outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseDialog();
      }
    };

    // Add event listener to the document to detect clicks outside modal
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount or when modal state changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  // Determine button text and form based on the current route
  const buttonText = location.pathname === "/master-downline-list" ? "Add Master" : "Add Client";

  // Conditionally render the form based on the route
  const renderForm = location.pathname === "/master-downline-list" ? (
    <AddMasterForm closeModal={handleCloseDialog} />
  ) : (
    <AddClientForm closeModal={handleCloseDialog} />
  );

  return (
    <div className="flex justify-end items-center gap-2 mb-2">
      {location.pathname === "/master-downline-list" ? (
        <button
          onClick={handleOpenDialog}
          className="py-2 px-4 h-12 bg-white text-black rounded border border-black flex items-center gap-2 hover:bg-gray-200"
        >
          <AiOutlineUserAdd />
          {buttonText}
        </button>
      ) : (
        <button
          onClick={handleOpenDialog}
          className="py-2 px-4 h-12 bg-white text-black rounded border border-black flex items-center gap-2 hover:bg-gray-200"
        >
          <AiOutlineUserAdd />
          {buttonText}
        </button>
      )}

      <button className="py-2 px-4 h-12 bg-white text-black rounded border border-black flex items-center gap-2 hover:bg-gray-200">
        <RiResetLeftLine />
        Reset
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto w-full max-w-md"
          >
            {renderForm}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClientButton;
