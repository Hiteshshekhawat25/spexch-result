import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchMarketBets } from "../../Store/Slice/marketBetsSlice";
import moment from "moment/moment";
import UserHistoryModal from "./UserHistoryModal";

const MarketBetModal = ({
  matchId,
  show,
  setShow,
  showUser,
  setShowUser,
  selectedUser,
  setSelectedUser,
}) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.marketBetList);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    dispatch(
      fetchMarketBets({
        matchId,
        page: currentPage,
        perPage: entriesToShow,
        search: searchTerm,
      })
    );
  }, [matchId, currentPage, entriesToShow, searchTerm, dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handlePageChange = (direction) => {
    if (direction === "first") setCurrentPage(1);
    else if (direction === "last")
      setCurrentPage(data?.pagination?.totalPages || 1);
    else if (direction === "prev" && currentPage > 1)
      setCurrentPage(currentPage - 1);
    else if (
      direction === "next" &&
      currentPage < (data?.pagination?.totalPages || 1)
    )
      setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${
          show ? "flex" : "hidden"
        }`}
        style={{ backdropFilter: "blur(4px)" }}
      >
        <div className="w-full md:mt-0 sm:max-w-[900px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border"
          >
            <div className="modal-header flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">View More Bets</div>
              <button onClick={handleClose}>
                <img
                  className="h-3 object-contain"
                  src="assets/img/closeIcon.png"
                  alt=""
                />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className="overflow-y-auto w-full">
                {/* Show Entries Dropdown */}
                <div className="flex justify-between">
                  <div className="rounded-md flex items-center w-full sm:w-auto p-2">
                    <label className="mr-2 text-sm font-medium">Show</label>
                    <select
                      value={entriesToShow}
                      onChange={handleEntriesChange}
                      className="border rounded px-2 py-1 text-sm sm:w-auto"
                    >
                      {[10, 25, 50, 100].map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))}
                    </select>
                    <label className="ml-2 text-sm font-medium">entries</label>
                  </div>
                  {/* Search Input */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                    <div className="flex w-full sm:flex-row sm:items-center sm:space-x-2">
                      <label className="text-sm p-1">Search:</label>
                      <div className="rounded-md w-full sm:w-28">
                        <input
                          id="search"
                          type="text"
                          className="border border-gray-400 rounded px-2 py-1 text-sm w-full"
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table */}
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        User Name
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        Nation
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        Amount
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        User Rate
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        Place Date
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        Match Date
                      </th>
                      <th className="font-semibold text-left p-2 border text-nowrap">
                        Game Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-7">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="text-center py-7">
                          Error: {error.message}
                        </td>
                      </tr>
                    ) : data?.data?.length ? (
                      data.data.map((item) => (
                        <tr
                          key={`exposure-${item?._id}`}
                          className={`${
                            item?.betType === "back" || item?.betType === "yes"
                              ? "bg-[#72bbef]"
                              : "bg-[#faa9ba]"
                          }`}
                        >
                          <td className="text-left p-2 border">
                            <div
                              className="font-semibold cursor-pointer underline"
                              onClick={() => {
                                setShowUser(true);
                                setSelectedUser(item);
                              }}
                            >
                              {item?.userDetails?.name}
                            </div>
                          </td>
                          <td className="text-left p-2 border text-nowrap">
                            {item?.marketName}
                          </td>
                          <td className="text-left p-2 border capitalize">
                            {item?.amount?.toFixed(0)}
                          </td>
                          <td className="text-left p-2 border">{item?.odds}</td>
                          <td className="text-left p-2 border text-nowrap">
                            {item?.createdAt
                              ? moment(item?.createdAt).format("LLL")
                              : ""}
                          </td>
                          <td className="text-left p-2 border text-nowrap">
                            {item?.marketStartTime
                              ? moment(item?.marketStartTime).format("LLL")
                              : ""}
                          </td>
                          <td className="text-left p-2 border">{item?.type}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-7">
                          No Bets Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex flex-col p-2 sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {data?.pagination?.totalChildrenCount === 0
                    ? 0
                    : (currentPage - 1) * entriesToShow + 1}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * entriesToShow,
                    data?.pagination?.totalChildrenCount || 0
                  )}{" "}
                  of {data?.pagination?.totalChildrenCount || 0} entries
                </div>
                <div className="flex space-x-2 sm:ml-auto">
                  <button
                    onClick={() => handlePageChange("first")}
                    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange("prev")}
                    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange("next")}
                    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                    disabled={
                      currentPage === (data?.pagination?.totalPages || 1)
                    }
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange("last")}
                    className="px-3 py-1 text-gray-600 rounded text-sm border border-gray-300"
                    disabled={
                      currentPage === (data?.pagination?.totalPages || 1)
                    }
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketBetModal;
