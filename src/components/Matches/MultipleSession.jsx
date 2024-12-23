import React from 'react';

import { FaUser } from "react-icons/fa";


const MultipleSession= () => {
  return (
    <div className="w-full p-4 text-center">
      <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
      <FaUser />
        Multiple Session Same Name 
      </h2>
      <hr className="border-t border-gray-300 my-2" />
    </div>
  );
};

export default MultipleSession;