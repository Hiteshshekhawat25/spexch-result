import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActivityLogs,
  setActivityLogs,
  setActivityLogsLoading,
  setActivityLogsError,
} from "../../Store/Slice/activityLogSlice";
import { getUserData } from "../../Services/Downlinelistapi";
import { ClipLoader } from "react-spinners";

const ActivityLog = ({ Userid }) => {
  const dispatch = useDispatch();
  const logs = useSelector(selectActivityLogs);
  const activityLogsStatus = useSelector((state) => state.activityLog.status);
  const activityLogsError = useSelector((state) => state.activityLog.error);
  const totalRecords = useSelector((state) => state.activityLog.totalRecords);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const totalPages = Math.ceil(totalRecords / entriesToShow);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.data?._id;

  // useEffect(() => {
  //   if (Userid) {
  //     dispatch(setActivityLogsLoading());
  //     const fetchActivityLogs = async () => {
  //       try {
  //         const response = await getUserData(
  //           `user/login-activity/${Userid}?page=${currentPage}&limit=${entriesToShow}`
  //         );
  //         dispatch(
  //           setActivityLogs({
  //             logs: response.data.data,
  //             totalRecords: response.data.pagination.totalRecords,
  //             totalPages:
  //               response.data.pagination.totalPages ||
  //               Math.ceil(
  //                 response.data.pagination.totalRecords / entriesToShow
  //               ),
  //           })
  //         );
  //       } catch (error) {
  //         dispatch(
  //           setActivityLogsError(
  //             error.message || "Failed to fetch activity logs"
  //           )
  //         );
  //       }
  //     };

  //     fetchActivityLogs();
  //   }
  // }, [Userid, currentPage, entriesToShow, dispatch]);
  console.log("Userid", logs);
  console.log("userId", userId);
  useEffect(() => {
    const id = Userid || userId;

    if (id) {
      dispatch(setActivityLogsLoading());
      const fetchActivityLogs = async () => {
        try {
          const response = await getUserData(
            `user/login-activity/${id}?page=${currentPage}&limit=${entriesToShow}`
          );
          dispatch(
            setActivityLogs({
              logs: response.data.data || 0,
              totalRecords: response.data.pagination.totalRecords || 0,
              totalPages:
                response.data.pagination.totalPages ||
                Math.ceil(
                  response.data.pagination.totalRecords / entriesToShow
                ),
            })
          );
        } catch (error) {
          dispatch(
            setActivityLogsError(
              error.message || "Failed to fetch activity logs"
            )
          );
        }
      };

      fetchActivityLogs();
    }
  }, [Userid, userId, currentPage, entriesToShow, dispatch]);
  const handleEntriesChange = (event) => {
    setEntriesToShow(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (action) => {
    switch (action) {
      case "first":
        setCurrentPage(1);
        break;
      case "prev":
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        break;
      case "next":
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        break;
      case "last":
        setCurrentPage(totalPages);
        break;
      default:
        break;
    }
  };

  if (activityLogsStatus === "loading") {
    return (
      <div>
        <ClipLoader />
      </div>
    );
  }

  if (activityLogsStatus === "failed") {
    return <div>Error: {activityLogsError}</div>;
  }
  const formatDateTime = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="border border-gray-400 rounded-[5px] bg-white shadow-sm overflow-hidden">
      <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
        Activity Log
      </h1>
      <div className="p-4">
        <div className="rounded-md mb-4 flex flex-col sm:flex-row sm:items-center">
          <label className="mr-2 text-sm font-medium">Show</label>
          <select
            value={entriesToShow}
            onChange={handleEntriesChange}
            className="border rounded px-2 py-1 text-sm w-full sm:w-auto mb-2 sm:mb-0"
          >
            {[10, 25, 50, 100].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          <label className="ml-2 text-sm font-medium">entries</label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">
                  Login Date & Time
                </th>
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">
                  Login Status
                </th>
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">
                  IP Address
                </th>
                {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">
                  ISP
                </th> */}
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">
                  City/State/Country
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100 text-center">
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                    {formatDateTime(log.loginDateTime)}
                  </td>
                  <td
                    className={`sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack font-semibold ${
                      log.loginStatus === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {log.loginStatus === "active"
                      ? "Logged in successfully"
                      : "Logged in failed"}
                  </td>
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                    {log.ipAddress}
                  </td>
                  {/* <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                    {log.isp}
                  </td> */}
                  <td className="sm:px-3 px-2 py-2 text-[13px] text-nowrap border border-gray-300 text-darkblack">
                    {log.city}/{log.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 flex-col sm:flex-row">
          {/* Showing entries text */}
          <div className="text-[13px] text-gray-600 mb-2 sm:mb-0">
            Showing{" "}
            {totalRecords === 0 ? 0 : (currentPage - 1) * entriesToShow + 1} to{" "}
            {Math.min(currentPage * entriesToShow, totalRecords)} of{" "}
            {totalRecords} entries
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex space-x-2">
              {/* First Button */}
              <button
                onClick={() => handlePageChange("first")}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                First
              </button>

              {/* Previous Button */}
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                          currentPage === page
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-3 py-1 text-sm">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>

              {/* Last Button */}
              <button
                onClick={() => handlePageChange("last")}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
