import React, { useState, useEffect } from "react";
import { FaSortUp, FaSortDown, FaEdit, FaEye } from "react-icons/fa";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiArrowUpDownFill } from "react-icons/ri";
import { MdSettings, MdDelete } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { BsBuildingFillLock } from "react-icons/bs";
import CreditEditReferenceModal from "../Modal/CreditEditReferanceModal";
const DownlineList = () => {
  const [data, setData] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [isModalOpen, setIsModalOpen] = useState(false); // State for opening the modal
  const [selectedUser, setSelectedUser] = useState(null); // State for storing selected user data

  useEffect(() => {
    // Generate dummy data
    const dummyData = Array.from({ length: 50 }, (_, index) => ({
      username: `User${index + 1}`,
      creditRef: `CR${index + 1}`,
      partnership: Math.floor(Math.random() * 100),
      balance: Math.random() * 10000,
      exposure: Math.random() * 5000,
      availableBalance: Math.random() * 8000,
      refPL: Math.random() * 2000,
      status: index % 2 === 0 ? "Active" : "Inactive",
    }));
    setData(dummyData);
  }, []);

  // Filter data based on the search term
  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Custom sorting for username (case-insensitive)
      if (sortConfig.key === "username") {
        return sortConfig.direction === "ascending"
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }

      // Custom sorting for creditRef (handle numbers within strings)
      if (sortConfig.key === "creditRef") {
        const extractNumber = (val) => parseInt(val.replace(/\D/g, ""), 10) || 0;
        const numA = extractNumber(aValue);
        const numB = extractNumber(bValue);

        if (numA !== numB) {
          return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
        }
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Default sorting for numbers or strings
      if (typeof aValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesToShow,
    currentPage * entriesToShow
  );

  const totalPages = Math.ceil(filteredData.length / entriesToShow);

  // Event handlers
  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handlePageChange = (direction) => {
    if (direction === "first") setCurrentPage(1);
    else if (direction === "last") setCurrentPage(totalPages);
    else if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key && prev.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" }
    );
  };

  const handleEditClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true);   // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null);  // Clear selected user data
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Show</label>
          <select
            value={entriesToShow}
            onChange={handleEntriesChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          <label className="ml-2 text-sm font-medium">entries</label>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="border border-gray-300">
          <tr className="bg-gray-300">
            {[
              { key: "username", label: "Username" },
              { key: "creditRef", label: "CreditRef" },
              { key: "partnership", label: "Partnership" },
              { key: "balance", label: "Balance" },
              { key: "exposure", label: "Exposure" },
              { key: "availableBalance", label: "Avail. Bal" },
              { key: "refPL", label: "Ref. P/L" },
              { key: "status", label: "Status" },
            ].map(({ key, label }) => (
              <th
                key={key}
                className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <div className="flex justify-between items-center">
                  {label}
                  <div className="flex flex-col items-center space-y-1 ml-2">
                    <FaSortUp
                      className={`${
                        sortConfig.key === key && sortConfig.direction === "ascending"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    />
                    <FaSortDown
                      className={`${
                        sortConfig.key === key && sortConfig.direction === "descending"
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </th>
            ))}
            <th className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="border border-gray-300 bg-white">
              <td className="px-4 py-3 text-sm">{item.username}</td>
              <td className="px-4 py-3 text-sm text-blue-900">
                {item.creditRef}
                <div className="ml-2 inline-flex space-x-2">
                <FaEdit
                    className="text-blue cursor-pointer"
                    onClick={() => handleEditClick(item)} // Trigger modal on click
                  />
                  <FaEye className="text-blue cursor-pointer" />
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{item.partnership}%</td>
              <td className="px-4 py-3 text-sm">{item.balance.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-blue-900">
                {item.exposure.toFixed(2)}
                <div className="ml-2 inline-flex space-x-2">
                  <FaEye className="text-blue cursor-pointer" />
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{item.availableBalance.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm">{item.refPL.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm">{item.status}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <AiFillDollarCircle className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <RiArrowUpDownFill className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <MdSettings className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <FaUserAlt className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <BsBuildingFillLock className="text-darkgray" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-400 rounded-md bg-gray-200">
                    <MdDelete className="text-" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          {entriesToShow * (currentPage - 1) + 1} to{" "}
          {Math.min(entriesToShow * currentPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange("first")}
            className="px-3 py-1 text-gray-600 rounded text-sm"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange("prev")}
            className="px-3 py-1 text-gray-600 rounded text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange("next")}
            className="px-3 py-1 text-gray-600 rounded text-sm"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange("last")}
            className="px-3 py-1 text-gray-600 rounded text-sm"
          >
            Last
          </button>
        </div>
      </div>


{isModalOpen && selectedUser && (
  <CreditEditReferenceModal
    isOpen={isModalOpen}
    onClose={handleModalClose} // This will be triggered when the cancel button is clicked
    username={selectedUser.username}
    currentCreditRef={selectedUser.creditRef}
  />
)}

    </div>
  );
};

export default DownlineList;

// import React, { useState, useEffect } from "react";
// import { FaSortUp, FaSortDown } from "react-icons/fa";

// const DownlineList = () => {
//   const [data, setData] = useState([]);
//   const [entriesToShow, setEntriesToShow] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

//   useEffect(() => {
//     // Generate dummy data
//     const dummyData = Array.from({ length: 50 }, (_, index) => ({
//       username: `User${index + 1}`,
//       creditRef: `CR${index + 1}`,
//       partnership: Math.floor(Math.random() * 100),
//       balance: Math.random() * 10000,
//       exposure: Math.random() * 5000,
//       availableBalance: Math.random() * 8000,
//       refPL: Math.random() * 2000,
//       status: index % 2 === 0 ? "Active" : "Inactive",
//     }));
//     setData(dummyData);
//   }, []);

//   // Filter data based on the search term
//   const filteredData = data.filter((item) =>
//     item.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Sorting logic
//   const sortedData = React.useMemo(() => {
//     if (!sortConfig.key) return filteredData;

//     const sorted = [...filteredData].sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       // Custom sorting for username (case-insensitive)
//       if (sortConfig.key === "username") {
//         return sortConfig.direction === "ascending"
//           ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
//           : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
//       }

//       // Custom sorting for creditRef (handle numbers within strings)
//       if (sortConfig.key === "creditRef") {
//         const extractNumber = (val) => parseInt(val.replace(/\D/g, ""), 10) || 0;
//         const numA = extractNumber(aValue);
//         const numB = extractNumber(bValue);

//         if (numA !== numB) {
//           return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
//         }
//         return sortConfig.direction === "ascending"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }

//       // Default sorting for numbers or strings
//       if (typeof aValue === "number") {
//         return sortConfig.direction === "ascending"
//           ? aValue - bValue
//           : bValue - aValue;
//       }
//       return sortConfig.direction === "ascending"
//         ? aValue.localeCompare(bValue)
//         : bValue.localeCompare(aValue);
//     });

//     return sorted;
//   }, [filteredData, sortConfig]);

//   // Paginate data
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * entriesToShow,
//     currentPage * entriesToShow
//   );

//   const totalPages = Math.ceil(filteredData.length / entriesToShow);

//   // Event handlers
//   const handleEntriesChange = (e) => {
//     setEntriesToShow(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);

//   const handlePageChange = (direction) => {
//     if (direction === "first") setCurrentPage(1);
//     else if (direction === "last") setCurrentPage(totalPages);
//     else if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
//     else if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handleSort = (key) => {
//     setSortConfig((prev) =>
//       prev.key === key && prev.direction === "ascending"
//         ? { key, direction: "descending" }
//         : { key, direction: "ascending" }
//     );
//   };

//   return (
//     <div className="p-4 border border-gray-300 rounded-md bg-white">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <label className="mr-2 text-sm font-medium">Show</label>
//           <select
//             value={entriesToShow}
//             onChange={handleEntriesChange}
//             className="border rounded px-2 py-1 text-sm"
//           >
//             {[10, 25, 50, 100].map((number) => (
//               <option key={number} value={number}>
//                 {number}
//               </option>
//             ))}
//           </select>
//           <label className="ml-2 text-sm font-medium">entries</label>
//         </div>
//         <div>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//       </div>

//       <table className="w-full table-auto border-collapse border border-gray-300">
//         <thead className="border border-gray-300">
//           <tr className="bg-gray-300">
//             {[
//               { key: "username", label: "Username" },
//               { key: "creditRef", label: "CreditRef" },
//               { key: "partnership", label: "Partnership" },
//               { key: "balance", label: "Balance" },
//               { key: "exposure", label: "Exposure" },
//               { key: "availableBalance", label: "Avail. Bal" },
//               { key: "refPL", label: "Ref. P/L" },
//               { key: "status", label: "Status" },
//             ].map(({ key, label }) => (
//               <th
//                 key={key}
//                 className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black cursor-pointer"
//                 onClick={() => handleSort(key)}
//               >
//                 <div className="flex justify-between items-center">
//                   {label}
//                   <div className="flex flex-col items-center space-y-0 ml-1">
//                     <FaSortUp
//                       className={`${
//                         sortConfig.key === key && sortConfig.direction === "ascending"
//                           ? "text-black"
//                           : "text-gray-400"
//                       }`}
//                     />
//                     <FaSortDown
//                       className={`${
//                         sortConfig.key === key && sortConfig.direction === "descending"
//                           ? "text-black"
//                           : "text-gray-400"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </th>
//             ))}
//             <th className="border border-gray-300 text-left px-4 py-3 text-sm font-medium text-black">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((item, index) => (
//             <tr key={index} className="border border-gray-300 bg-white">
//               <td className="px-4 py-3 text-sm">{item.username}</td>
//               <td className="px-4 py-3 text-sm">{item.creditRef}</td>
//               <td className="px-4 py-3 text-sm">{item.partnership}%</td>
//               <td className="px-4 py-3 text-sm">{item.balance.toFixed(2)}</td>
//               <td className="px-4 py-3 text-sm">{item.exposure.toFixed(2)}</td>
//               <td className="px-4 py-3 text-sm">{item.availableBalance.toFixed(2)}</td>
//               <td className="px-4 py-3 text-sm">{item.refPL.toFixed(2)}</td>
//               <td className="px-4 py-3 text-sm">{item.status}</td>
//               <td className="px-4 py-3 text-sm">
//                 <button className="text-blue-500">Action</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center mt-4">
//         <span className="text-sm">
//           Showing {Math.min((currentPage - 1) * entriesToShow + 1, filteredData.length)} to{" "}
//           {Math.min(currentPage * entriesToShow, filteredData.length)} of {filteredData.length} entries
//         </span>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => handlePageChange("first")}
//             className="px-3 py-1 text-gray-600 rounded text-sm"
//           >
//             First
//           </button>
//           <button
//             onClick={() => handlePageChange("prev")}
//             className="px-3 py-1 text-gray-600 rounded text-sm"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => handlePageChange("next")}
//             className="px-3 py-1 text-gray-600 rounded text-sm"
//           >
//             Next
//           </button>
//           <button
//             onClick={() => handlePageChange("last")}
//             className="px-3 py-1 text-gray-600 rounded text-sm"
//           >
//             Last
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DownlineList;








