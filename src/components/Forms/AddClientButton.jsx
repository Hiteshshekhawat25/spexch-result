import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiResetLeftLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { AddClientForm } from "../../components/Forms/AddClientForm";
import { AddMasterForm } from "./AddMasterForm";
import { FaUserPlus } from "react-icons/fa";

const AddClientButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const modalRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const roleName = userData?.data?.role_name;
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseDialog();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  const buttonText =
    location.pathname === "/master-downline-list" ? "Add Master" : "Add User";

  const renderForm =
    location.pathname === "/master-downline-list" ? (
      <AddMasterForm closeModal={handleCloseDialog} />
    ) : (
      <AddClientForm closeModal={handleCloseDialog} />
    );

  return (
    <div className="flex justify-end items-center gap-2 md:mb-6 mb-4">
      {(roleName === "white-level" ||
        roleName === "master" ||
        roleName === "super-admin" ||
        roleName === "sub-admin" ||
        roleName === "super") &&
        location.pathname === "/master-downline-list" && (
          <button
            onClick={handleOpenDialog}
            className="px-5 py-[5px] bg-[#fffefe] text-lightblack rounded border border-gray-400/70 flex items-center gap-2 hover:bg-gray-200 font-bold font-custom text-[12px]"
          >
            <FaUserPlus className="text-[16px]" />
            {buttonText}
          </button>
        )}

      {location.pathname !== "/master-downline-list" && (
        <button
          onClick={handleOpenDialog}
          className="px-5 py-[5px] bg-[#fffefe] text-lightblack rounded border border-gray-400/70 flex items-center gap-2 hover:bg-gray-200 font-bold font-custom text-[12px]"
        >
          <FaUserPlus className="text-[16px]" />
          {buttonText}
        </button>
      )}

      <button className="px-1.5 py-[5px] bg-[#fffefe] text-lightblack rounded border  border-gray-400/70 flex items-center gap-2 hover:bg-gray-200">
        <RiResetLeftLine />
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-0 px-2">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-h-[95vh] overflow-y-auto w-full max-w-lg"
          >
            {renderForm}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClientButton;
