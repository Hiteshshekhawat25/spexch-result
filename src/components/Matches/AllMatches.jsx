import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';
import { MdModeEdit } from "react-icons/md";
import { BiPlusMedical } from "react-icons/bi";
import { PiTelevisionBold } from "react-icons/pi";
import { FaEdit } from "react-icons/fa";
import EditStakeModal from '../Modal/EditStakeModal';
import EditMatchModal from '../Modal/EditMatchModal';
import ScoreModal from '../Modal/ScoreModal';
import { toast } from 'react-toastify';


const AllMatches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { sport, searchTerm, matches, totalMatches,totalPages } = useSelector((state) => state.allMatch);

  const [sportsOptions, setSportsOptions] = useState([]);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false); 
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false); 
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  


  // Fetch sports from API
  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await getCreateNewMatchAPIAuth('games/getgames');
        if (response.status === 200) {
          setSportsOptions(response.data.data || []);
          if (!sport) {
            const defaultSport = response.data.data.find((sport) => sport.gameId === '4');
            if (defaultSport) {
              dispatch(setSport(defaultSport.gameId));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching sports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, [dispatch, sport]);


  const handlePageChange = (action) => {
    switch (action) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        break;
      case 'next':
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        break;
      case 'last':
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
        `match/getmatchesviagameid/${sport}?page=${currentPage}&limit=${entriesToShow}&search=${searchTerm}`
      );

      if (response.data?.data) {
        dispatch(
          setMatches({
            matches: response.data.data,
            totalMatches: response.data.pagination.totalMatches, 
            totalPages: response.data.pagination.totalPages || Math.ceil(response.data.pagination.totalMatches / entriesToShow), 
          })
        );
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    const timer = setTimeout(() => {
      fetchMatches()
    }, 500);
    return ()=> clearTimeout(timer)
  }, [searchTerm])
  
  
useEffect(() => {
  fetchMatches();
}, [dispatch, sport, currentPage, entriesToShow]);

console.log("Matches",matches);

  const handleSportChange = (e) => {
    const selectedSport = e.target.value;
    dispatch(setSport(selectedSport));
  };

  const handleSearch = () => {
    const searchQuery = searchTerm.toLowerCase();
    const filteredMatches = matches.filter((match) => {
      const eventId = match?.event?.id?.toString() || '';
      const matchId = match?.id?.toString() || '';
      return eventId.includes(searchQuery) || matchId.includes(searchQuery);
    });
    dispatch(setMatches(filteredMatches));
  };

  const handleEntriesChange = (e) => {
    console.log("Entries per page changed:", e.target.value);
    setEntriesToShow(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusToggle = async (matchId, field, currentStatus) => {
    try {
      if (typeof currentStatus === 'undefined') {
        console.error('Current status is undefined for:', matchId, field);
        return;
      }

      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const payload = { field, status: updatedStatus };

      const response = await putUpdateMatchAPIAuth(`match/updatematch/${matchId}`, payload);

      console.log('>>>>>>>>>>>>>>>>>', response)

      if(response?.data?.success) {fetchMatches()}

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
      console.error(`Error updating ${field} status for matchId: ${matchId}:`, error);
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
    setIsMatchModalOpen(false);
    setIsScoreModalOpen(false); // Close the Score Modal
    setSelectedMatch(null);
  };

  const handleSetResult = (match)=> {
    if(match?.oddsResult === 1 && match?.bookMakerResult === 1) {
      toast.error('Odss and Bookmaker Results are already declared for this match')
      return
    } else {
      navigate(`/TransferMatchCoins/${match.eventId}`)
    }
  }

  return (
<div className="p-4">
  {isStakeModalOpen && <EditStakeModal onCancel={closeModals} match={selectedMatch} onSubmit={(data) => { console.log(data); closeModals(); }} />}
  {isMatchModalOpen && <EditMatchModal match={selectedMatch} onCancel={closeModals} />}
  {isScoreModalOpen && <ScoreModal match={selectedMatch} onCancel={closeModals} />} {/* Score Modal */}
  
  <div className="bg-gray-200 text-center py-2 mb-6">
    <h1 className="text-2xl font-bold">ALL Matches</h1>
  </div>

  <div className="flex space-x-4 mb-6">
    <select className="border p-2 rounded" value={sport} onChange={handleSportChange}>
      <option value="">Select Sport</option>
      {loading ? (
        <option value="">Loading...</option>
      ) : (
        sportsOptions?.length > 0 ? (
          sportsOptions.map((sportOption) => (
            <option key={sportOption.id} value={sportOption.gameId}>
              {sportOption.name}
            </option>
          ))
        ) : (
          <option value="">No Sports Available</option>
        )
      )}
    </select>

    <input
      type="text"
      className="border p-2 rounded w-1/3"
      // placeholder="Search by EventID, MatchID..."
      value={searchTerm}
      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    />

    <button onClick={handleSearch} className="bg-gray-200 text-black p-2 rounded">
      Search
    </button>
  </div>

  <div className="p-4 border border-gray-300 rounded-md bg-white">
    <div className="border border-gray-300 p-2 rounded-md mb-4">
      <label className="mr-2 text-sm font-medium">Show</label>
      <select value={entriesToShow} onChange={handleEntriesChange} className="border rounded px-2 py-1 text-sm">
        {[10, 25, 50, 100].map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
      <label className="ml-2 text-sm font-medium">entries</label>
    </div>

    {/* Table Container */}
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-black text-white text-nowrap">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Match Name</th>
            <th className="px-4 py-2">Open Date</th>
            <th className="px-4 py-2">Odds</th>
            <th className="px-4 py-2">BookMaker</th>
            <th className="px-4 py-2">Session</th>
            <th className="px-4 py-2">Toss</th>
            <th className="px-4 py-2">Set Result</th>
            <th className="px-4 py-2">Result</th>
            <th className="px-4 py-2">Add Market</th>
            <th className="px-4 py-2">Delete Bets</th>
          </tr>
        </thead>
        <tbody>
          {matches?.length > 0 ? (
            matches.map((match) => (
              <tr key={match?._id}>
                <td className="py-2 border border-gray-300 px-4">{match.event?.id}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex space-2 flex-col">
                    <div className="min-w-52 mb-1">
                      {match.event?.name}
                      {match?.inPlay ? <span className='ml-2 text-white text-nowrap bg-red-500 py-0.5 px-3 rounded-full text-xs font-medium'>In Play</span>: ''}
                    </div>
                    <div className="flex space-x-2">
                      <MdModeEdit onClick={() => openStakeModal(match)} className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7" />
                      <BiPlusMedical onClick={() => openScoreModal(match)} className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7" />
                      <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7" />
                      <FaEdit onClick={() => openMatchModal(match)} className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white hover:bg-green-500 ${match.oddsStatus === 'active' ? 'bg-lightblue' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
                  >
                    {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-2 rounded-full text-white hover:bg-green-500 ${match.bookMakerStatus === 'active' ? 'bg-lightblue' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
                  >
                    {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white  hover:bg-green-500 ${match.sessionStatus === 'active' ? 'bg-lightblue' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
                  >
                    {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white hover:bg-green-500 ${match.tossStatus === 'active' ? 'bg-lightblue' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
                  >
                    {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="space-y-2">
                    <button onClick={()=> handleSetResult(match)} className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block">
                      Set Result
                    </button>
                    <Link to={`/CoinLog`} className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block">
                      Coin Log
                    </Link>
                    <Link to={`/ResultLog`} className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block">
                      Result Log
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-300"></td>
                <td className="px-4 py-2 border border-gray-300"></td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="space-y-2">
                    <Link to={`/MatchOddsBets`} className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block">
                      Odds Bets
                    </Link>
                    <Link to={`/BookmakerBets`} className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block">
                      Bookmaker Bets
                    </Link>
                    <Link to={`/AllSessionList`} className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block">
                      Session Bets
                    </Link>
                    <Link to={`/TossBets`} className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block">
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

    <div className="flex justify-between py-4">
      <div>
        Showing {entriesToShow * (currentPage - 1) + 1} to{' '}
        {Math.min(entriesToShow * currentPage, totalMatches)} of {totalMatches} matches
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange('first')}
          className={`px-4 py-2 text-black ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange('prev')}
          className={`px-4 py-2 text-black ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange('next')}
          className={`px-4 py-2 text-black ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange('last')}
          className={`px-4 py-2 text-black ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default AllMatches;


