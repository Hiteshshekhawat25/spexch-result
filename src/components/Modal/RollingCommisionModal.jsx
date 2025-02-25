import React from "react";
import { IoClose } from "react-icons/io5"; // Importing the close icon

const RollingCommisionModal = ({ username, onCancel, commissionRates }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[95%] sm:w-[500px] mt-20">
        {/* Header */}
        <div className="flex justify-between items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-semibold w-full p-2">
          <span>Rolling Commission </span>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>

        {/* Content */}
        <div className="md:p-5 p-4 space-y-4">
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
              className="flex justify-between items-center border border-gray-300 rounded-[5px] h-[35px] p-2"
            >
              <span className="text-[13px] font-custom text-gray-700 w-1/3">
                {category.label}
              </span>
              <span className="text-gray-800 text-[14px] font-custom w-2/3 text-right">
                {category.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RollingCommisionModal;
