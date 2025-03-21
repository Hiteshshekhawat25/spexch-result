import React from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon

const AgentRollingCommissionModal = ({ username, onCancel, commissionRates }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-md overflow-hidden sm:w-[500px] w-[96%] sm:mt-12 mt-3">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full p-2">
          <span>Agent Rolling Commission</span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Content */}
        <div className="sm:p-4 p-3 space-y-2">
          {[
            { label: "Fancy", value: commissionRates.fancy },
            { label: "Matka", value: commissionRates.matka },
            { label: "Casino", value: commissionRates.casino },
            { label: "Binary", value: commissionRates.binary },
            { label: "Bookmaker", value: commissionRates.bookmaker },
            { label: "SportBook", value: commissionRates.sportbook },
          ].map((category, index) => (
            <div
              key={index}
              className="flex items-center border border-black p-2"
            >
              <span className="text-[13px] font-custom font-semibold text-gray-700 w-1/4">
                {category.label}
              </span>
              <span className="text-gray-800 text-sm font-medium w-2/3">
                {category.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentRollingCommissionModal;
