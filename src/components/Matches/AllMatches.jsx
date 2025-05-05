import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setSport,
  setSearchTerm,
  setMatches,
} from "../../Store/Slice/allMatchSlice";
import {
  getCreateNewMatchAPIAuth,
  putUpdateMatchAPIAuth,
} from "../../Services/Newmatchapi";
import { MdModeEdit } from "react-icons/md";
import { BiPlusMedical } from "react-icons/bi";
import { PiTelevisionBold } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import EditStakeModal from "../Modal/EditStakeModal";
import EditMatchModal from "../Modal/EditMatchModal";
import ScoreModal from "../Modal/ScoreModal";
import { toast } from "react-toastify";
import TossModal from "../Modal/TossModal";
import { ROUTES_CONST } from "../../Constant/routesConstant";
import SessionStakeModal from "../Modal/SessionStakeModal";

const AllMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sport, searchTerm, matches, totalMatches, totalPages } = useSelector(
    (state) => state.allMatch
  );

  const [sportsOptions, setSportsOptions] = useState([]);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [tossModal,setTossModal] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [sessionStakeModal,setSessionStakeModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [sortMatches,setSortMatches] = useState('new')
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sports from API
  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await getCreateNewMatchAPIAuth("games/getgames");
        if (response.status === 200) {
          setSportsOptions(response.data.data || []);
          if (!sport) {
            const defaultSport = response.data.data.find(
              (sport) => sport.gameId === "4"
            );
            if (defaultSport) {
              dispatch(setSport(defaultSport.gameId));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, [dispatch, sport]);

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

  const fetchMatches = async () => {
    if (!sport) return;
    setLoading(true);

    try {
      const response = await getCreateNewMatchAPIAuth(
        `match/getmatchesviagameid/${sport}?page=${currentPage}&limit=${entriesToShow}&search=${searchTerm}&matchStatus=${sortMatches}`
      );

      if (response.data?.data) {
        dispatch(
          setMatches({
            matches: response.data.data,
            totalMatches: response.data.pagination.totalMatches,
            totalPages:
              response.data.pagination.totalPages ||
              Math.ceil(response.data.pagination.totalMatches / entriesToShow),
          })
        );
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchMatches();
  }, [dispatch, sport, currentPage, entriesToShow,sortMatches]);

  console.log("Matches", matches);

  const handleSportChange = (e) => {
    const selectedSport = e.target.value;
    dispatch(setSport(selectedSport));
  };

  const handleSearch = () => {
    const searchQuery = searchTerm.toLowerCase();
    const filteredMatches = matches.filter((match) => {
      const eventId = match?.event?.id?.toString() || "";
      const matchId = match?.id?.toString() || "";
      return eventId.includes(searchQuery) || matchId.includes(searchQuery);
    });
    dispatch(setMatches(filteredMatches));
  };

  const handleEntriesChange = (e) => {
    console.log("Entries per page changed:", e.target.value);
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };


  const handleSortMatches=(e)=>{
    setSortMatches(e.target.value)
  }

  const handleStatusToggle = async (matchId, field, currentStatus) => {
    try {
      if (typeof currentStatus === "undefined") {
        console.error("Current status is undefined for:", matchId, field);
        return;
      }

      const updatedStatus = currentStatus === "active" ? "inactive" : "active";
      const payload = { field, status: updatedStatus };

      const response = await putUpdateMatchAPIAuth(
        `match/updatematch/${matchId}`,
        payload
      );

      console.log(">>>>>>>>>>>>>>>>>", response);

      if (response?.data?.success) {
        fetchMatches();
      }

      // if (response.status === 200) {
      //   dispatch(setMatches(
      //     matches.map((match) =>
      //       match._id === matchId ? { ...match, [field]: updatedStatus } : match
      //     )
      //   ));
      // } else {
      //   console.error(`Failed to update status for matchId: ${matchId}, field: ${field}`);
      // }
    } catch (error) {
      console.error(
        `Error updating ${field} status for matchId: ${matchId}:`,
        error
      );
    }
  };

  const openStakeModal = (match) => {
    setSelectedMatch(match);
    setIsStakeModalOpen(true);
  };

  const openMatchModal = (match) => {
    setSelectedMatch(match);
    setIsMatchModalOpen(true);
  };

  const openScoreModal = (match) => {
    setSelectedMatch(match); // Set the selected match for the Score Modal
    setIsScoreModalOpen(true); // Open the Score Modal
  };

  const closeModals = () => {
    setIsStakeModalOpen(false);
    setTossModal(false)
    setSessionStakeModal(false)
    setIsMatchModalOpen(false);
    setIsScoreModalOpen(false); // Close the Score Modal
    setSelectedMatch(null);
  };

  const handleSetResult = (match) => {
    if (match?.oddsResult === 1 && match?.bookMakerResult === 1) {
      toast.error(
        "Odss and Bookmaker Results are already declared for this match"
      );
      return;
    } else {
      navigate(`/TransferMatchCoins/${match.eventId}`);
    }
  };

  useEffect(() => {
    if (sessionStakeModal) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
},[sessionStakeModal])
  return (
    <div className="md:mx-0 mx-2 sm:mt-3 mt-2">
      {isStakeModalOpen && (
        <EditStakeModal
          onCancel={closeModals}
          fetchMatches={fetchMatches}
          match={selectedMatch}
          onSubmit={(data) => {
            console.log(data);
            closeModals();
          }}
        />
      )}
      {sessionStakeModal && 
      <div className="w-full h-lvh flex z-[500] items-start justify-center fixed top-0 left-0  shadow-lg bg-gray-500/50" style={{backdropFilter : 'blur(5px)'}}> 
      <SessionStakeModal onCancel={closeModals} match={selectedMatch}/>
      </div>
      }
      {isMatchModalOpen && (
        <EditMatchModal match={selectedMatch} onCancel={closeModals} />
      )}
      {isScoreModalOpen && (
        <ScoreModal match={selectedMatch} onCancel={closeModals} />
      )}{" "}
      {tossModal && (
      <TossModal match={selectedMatch} onCancel={closeModals}/>
      )}
      {/* Score Modal */}
      <div className="border border-gray-300 rounded-[5px] overflow-hidden bg-white">
        <h1 className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
          ALL Matches
        </h1>
        <div className="md:p-4 p-3">
          <div className="flex md:items-center md:flex-row flex-col max-md:gap-4 justify-between sm:mb-6 mb-4">
            <div className="grid md:grid-cols-5 sm:gap-3 gap-2.5 items-center">
              <select
                className="border px-2 py-2 w-full my-1 rounded outline-none text-[14px]"
                value={sport}
                onChange={handleSportChange}
              >
                <option value="">Select Sport</option>
                {loading ? (
                  <option value="">Loading...</option>
                ) : sportsOptions?.length > 0 ? (
                  sportsOptions.map((sportOption) => (
                    <option key={sportOption.gameId} value={sportOption.gameId}>
                      {sportOption.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Sports Available</option>
                )}
              </select>
              <input
                type="text"
                className="border p-2 h-10 rounded my-1 sm:my-0 outline-none text-[14px] w-full"
                // placeholder="Search by EventID, MatchID..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
              <div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-seablue leading-none text-white font-semibold text-sm px-5 py-3 rounded"
                >
                  Search
                </button>
              </div>
            </div>
            <select
              className="border p-2 w-full outline-none sm:w-auto h-10 text-sm border-gray-300 rounded"
              value={sortMatches}
              onChange={handleSortMatches}
            >
            {
                [{label:'Old Matches',value : 'old'},{label : 'New Matches', value : 'new'}].map((sportOption) => (
                  <option key={sportOption.label} value={sportOption.value}>
                    {sportOption.label}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="">
            <label className="mr-1 text-[13px] font-custom">Show</label>
            <select
              value={entriesToShow}
              onChange={handleEntriesChange}
              className="border rounded px-2 py-1 text-[13px]"
            >
              {[10, 25, 50, 100].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <label className="ml-1 text-[13px] font-custom">entries</label>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full text-center border-collapse border">
              <thead>
                <tr className="bg-gray-200 text-white text-nowrap">
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">ID</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Match Name</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Open Date</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Match Status</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Odds</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">BookMaker</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Session</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Toss</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Set Result</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Result</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Delete Bets</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-center">Revert Bets</th>
                </tr>
              </thead>
              <tbody>
                {matches?.length > 0 ? (
                  matches.map((match) => (
                    <tr key={match?._id}>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        {match.event?.id}
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <div className="flex space-2 flex-col">
                          <div className="min-w-52 mb-1">
                            {match.event?.name}
                            {match?.inPlay ? (
                              <span className="ml-2 text-white bg-red-500 py-0.5 px-3 rounded-full text-xs font-custom">
                                In Play
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <MdModeEdit
                              onClick={() => openStakeModal(match)}
                              className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
                            />
                            <BiPlusMedical
                              onClick={() => openScoreModal(match)}
                              className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7"
                            />
                            <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7" />
                            <FaEdit
                              onClick={() => openMatchModal(match)}
                              className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
                            />
                            <div className="p-[2px] h-7 text-center text-white font-bold w-7 rounded-full flex items-center justify-center bg-gradient-green2" 
                            onClick={()=>{
                              setTossModal(true)
                            setSelectedMatch(match)
                            }}
                            >
                              T
                            </div>
                            <div className="p-[2px] h-7 text-center text-white font-bold w-7 rounded-full flex items-center justify-center bg-gradient-green2" 
                            onClick={()=>{
                              setSessionStakeModal(true)
                            setSelectedMatch(match)
                            }}
                            >
                              S
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        {new Date(match.event?.openDate).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                            <button className={`py-1 px-3 rounded-full text-white hover:bg-green-500 ${
                            match.oddsStatus === "active"
                              ? "bg-lightblue"
                              : "bg-gray-400"
                          } whitespace-nowrap `}
                          onClick={() =>
                            handleStatusToggle(
                              match._id,
                              "matchStatus",
                              match.matchStatus
                            )
                          }>
                        {match?.matchStatus}
                            </button>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <button
                          className={`py-1 px-3 rounded-full text-white hover:bg-green-500 ${
                            match.oddsStatus === "active"
                              ? "bg-lightblue"
                              : "bg-gray-400"
                          } whitespace-nowrap`}
                          onClick={() =>
                            handleStatusToggle(
                              match._id,
                              "oddsStatus",
                              match.oddsStatus
                            )
                          }
                        >
                          {match.oddsStatus === "active"
                            ? "Odds Opened"
                            : "Odds Closed"}
                        </button>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <button
                          className={`py-1 px-2 rounded-full text-white hover:bg-green-500 ${
                            match.bookMakerStatus === "active"
                              ? "bg-lightblue"
                              : "bg-gray-400"
                          } whitespace-nowrap`}
                          onClick={() =>
                            handleStatusToggle(
                              match._id,
                              "bookMakerStatus",
                              match.bookMakerStatus
                            )
                          }
                        >
                          {match.bookMakerStatus === "active"
                            ? "Bookmaker Opened"
                            : "Bookmaker Closed"}
                        </button>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <button
                          className={`py-1 px-3 rounded-full text-white  hover:bg-green-500 ${
                            match.sessionStatus === "active"
                              ? "bg-lightblue"
                              : "bg-gray-400"
                          } whitespace-nowrap`}
                          onClick={() =>
                            handleStatusToggle(
                              match._id,
                              "sessionStatus",
                              match.sessionStatus
                            )
                          }
                        >
                          {match.sessionStatus === "active"
                            ? "Session Opened"
                            : "Session Closed"}
                        </button>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <button
                          className={`py-1 px-3 rounded-full text-white hover:bg-green-500 ${
                            match.tossStatus === "active"
                              ? "bg-lightblue"
                              : "bg-gray-400"
                          } whitespace-nowrap`}
                          onClick={() =>
                            handleStatusToggle(
                              match._id,
                              "tossStatus",
                              match.tossStatus
                            )
                          }
                        >
                          {match.tossStatus === "active"
                            ? "Toss Opened"
                            : "Toss Closed"}
                        </button>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleSetResult(match)}
                            className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
                          >
                            Set Result
                          </button>
                          <Link
                            to={`/CoinLog`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
                          >
                            Coin Log
                          </Link>
                          <Link
                            to={`/ResultLog`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
                          >
                            Result Log
                          </Link>
                          <Link
                            to={`/toss-result/${match.eventId}`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
                          >
                            Toss Result
                          </Link>
                        </div>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center"></td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                        <div className="space-y-2">
                          <Link
                            to={`/MatchOddsBets/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
                          >
                            Odds Bets
                          </Link>
                          <Link
                            to={`${ROUTES_CONST.BookmakerBet}/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
                          >
                            Bookmaker Bets
                          </Link>
                          <Link
                            to={`/AllSessionList/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
                          >
                            Session Bets
                          </Link>
                          <Link
                            to={`/toss-bet/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
                          >
                            Toss Bets
                          </Link>
                        </div>
                      </td>
                      <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-darkblack cursor-pointer text-center">
                      <div className="space-y-2">
                          <Link
                            to={`${ROUTES_CONST.MatchOddsRevertBets}/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue whitespace-nowrap inline-block"
                          >
                            Odds Bets
                          </Link>
                          <Link
                            to={`${ROUTES_CONST.BookmakerRevertBet}/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue whitespace-nowrap inline-block"
                          >
                            Bookmaker Bets
                          </Link>
                          <Link
                            to={`/AllSessionListRevert/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue whitespace-nowrap inline-block"
                          >
                            Session Bets
                          </Link>
                          <Link
                          to={`/toss-revert-bets/${match?._id}`}
                            className="py-1 px-3 rounded-full text-white bg-lightblue whitespace-nowrap inline-block"
                          >
                            Toss Bets
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:flex justify-between pt-4">
            <div className="text-[13px]">
              Showing {entriesToShow * (currentPage - 1) + 1} to{" "}
              {Math.min(entriesToShow * currentPage, totalMatches)} of{" "}
              {totalMatches} matches
            </div>
            <div className="flex sm:space-x-2">
              <button
                onClick={() => handlePageChange("first")}
                className={`px-3 py-2 text-[13px] text-black ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => handlePageChange("prev")}
                className={`px-3 py-2 text-[13px] text-black ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange("next")}
                className={`px-3 py-2 text-[13px] text-black ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange("last")}
                className={`px-3 py-2 text-[13px] text-black ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMatches;
