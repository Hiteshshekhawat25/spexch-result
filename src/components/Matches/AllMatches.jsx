import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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


const AllMatches = () => {
  const dispatch = useDispatch();
  const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);
  const [sportsOptions, setSportsOptions] = useState([]);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false); 
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false); 
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch sports from API
  useEffect(() => {
    const fetchSports = async () => {
      setLoading(true);
      try {
        const response = await getCreateNewMatchAPIAuth('games/getgames');
        if (response.status === 200) {
          setSportsOptions(response.data.data || []);
          if (!sport) {
            const defaultSport = response.data.data.find((sport) => sport.gameId === '1');
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

  // Fetch matches based on the selected sport
  useEffect(() => {
    const fetchMatches = async () => {
      if (!sport) return;
      try {
        const response = await getCreateNewMatchAPIAuth(`match/getmatches?sportId=${sport}`);
        if (response.data?.data) {
          dispatch(setMatches(response.data.data));
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [dispatch, sport]);

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

  const handleStatusToggle = async (matchId, field, currentStatus) => {
    try {
      if (typeof currentStatus === 'undefined') {
        console.error('Current status is undefined for:', matchId, field);
        return;
      }

      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const payload = { field, status: updatedStatus };

      const response = await putUpdateMatchAPIAuth(`match/updatematch/${matchId}`, payload);

      if (response.status === 200) {
        dispatch(setMatches(
          matches.map((match) =>
            match._id === matchId ? { ...match, [field]: updatedStatus } : match
          )
        ));
      } else {
        console.error(`Failed to update status for matchId: ${matchId}, field: ${field}`);
      }
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

  return (
    <div className="p-6">
      {isStakeModalOpen && <EditStakeModal onCancel={closeModals} match={selectedMatch} onSubmit={(data) => { console.log(data); closeModals(); }} />}
      {isMatchModalOpen && <EditMatchModal match={selectedMatch} onCancel={closeModals} />}
      {isScoreModalOpen && <ScoreModal match={selectedMatch} onCancel={closeModals} />} {/* Score Modal */}
      <div className="bg-gray-200 text-center py-2 mb-6">
        <h1 className="text-2xl font-bold">ALL Matches</h1>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          className="border p-2 rounded"
          value={sport}
          onChange={handleSportChange}
        >
          <option value="">Select Sport</option>
          {loading ? (
            <option value="">Loading...</option>
          ) : (
            sportsOptions?.length > 0 ? (
              sportsOptions.map((sportOption) => (
                <option key={sportOption.id} value={sportOption.id}>
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
          placeholder="Search by EventID, MatchID..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />

        <button
          onClick={handleSearch}
          className="bg-gray-200 text-black p-2 rounded"
        >
          Search
        </button>
      </div>

      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-black text-white">
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
              <tr key={match._id}>
                <td className="px-4 py-2 border border-gray-300">{match.event?.id}</td>
                {/* <td className="px-4 py-2 border border-gray-300">{match.event?.name}
                  <MdModeEdit
                    onClick={() => openStakeModal(match)}
                    className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
                  />
                  <BiPlusMedical
                    onClick={() => openScoreModal(match)} // Open Score Modal
                    className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7"
                  />
                  <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7 " />
                  <FaEdit
                    onClick={() => openMatchModal(match)}
                    className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
                  />
                </td> */}
                <td className="px-4 py-2 border border-gray-300">
  <div className="flex space-x-2 items-center">
    {match.event?.name}
    <MdModeEdit
      onClick={() => openStakeModal(match)}
      className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
    />
    <BiPlusMedical
      onClick={() => openScoreModal(match)} 
      className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7"
    />
    <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7 " />
    <FaEdit
      onClick={() => openMatchModal(match)}
      className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
    />
  </div>
</td>

                <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
                  >
                    {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
                  >
                    {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
                  >
                    {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.tossStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
                    onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
                  >
                    {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                <div className="space-y-2">
  <Link
    to={`/TransferMatchCoins`} 
    className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
  >
    Set Result
  </Link>
  <Link
    to={`/CoinLog`} 
    className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
  >
    Coin Log
  </Link>
  <Link
    to={`/ResultLog`} // Replace with the correct route for Result Log
    className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
  >
    Result Log
  </Link>
</div>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                 
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  
                </td>
                <td className="px-4 py-2 border border-gray-300">
                <div className="space-y-2">
  <Link
    to={`/MatchOddsBets`} // Replace with the correct route for Odds Bets
    className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
  >
    Odds Bets
  </Link>
  <Link
    to={`/BookmakerBets`} // Replace with the correct route for Bookmaker Bets
    className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
  >
    Bookmaker Bets
  </Link>
  <Link
    to={`/AllSessionList`} // Replace with the correct route for Session Bets
    className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
  >
    Session Bets
  </Link>
  <Link
    to={`/TossBets`} // Replace with the correct route for Toss Bets
    className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
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
  );
};

export default AllMatches;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
// import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';
// import { MdModeEdit } from "react-icons/md";
// import { BiPlusMedical } from "react-icons/bi";
// import { PiTelevisionBold } from "react-icons/pi";
// import { FaEdit } from "react-icons/fa";
// import EditStakeModal from '../Modal/EditStakeModal';
// import EditMatchModal from '../Modal/EditMatchModal';
// import ScoreModal from '../Modal/ScoreModal';


// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);
//   const [sportsOptions, setSportsOptions] = useState([]);
//   const [isStakeModalOpen, setIsStakeModalOpen] = useState(false); 
//   const [isMatchModalOpen, setIsMatchModalOpen] = useState(false); 
//     const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
//   const [selectedMatch, setSelectedMatch] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1); // Default page is 1
// const [totalPages, setTotalPages] = useState(1); // Total pages

//   // Fetch sports from API
//   useEffect(() => {
//     const fetchSports = async () => {
//       setLoading(true);
//       try {
//         console.log(`Fetching sports with page: ${currentPage}`); // Log the current page
//         const response = await getCreateNewMatchAPIAuth(`match/getmatches?page=${currentPage}&limit=10`);
        
//         console.log("Sports API Response:", response); // Log the full response
  
//         if (response.status === 200) {
//           setSportsOptions(response.data.data || []);
//           console.log("Updated sports options:", response.data.data);
//           setTotalPages(response.data.totalPages || 1); // Assuming totalPages is returned from the API
//           console.log("Sports options:", response.data.data); // Log the sports options
  
//           if (!sport) {
//             const defaultSport = response.data.data.find((sport) => sport.gameId === '4');
//             if (defaultSport) {
//               dispatch(setSport(defaultSport.gameId));
//             }
//           }
//         } else {
//           console.error('Error: Sports API returned an unexpected status:', response.status); // Error logging for unexpected status
//         }
//       } catch (error) {
//         console.error('Error fetching sports:', error); // Log error if fetching sports fails
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchSports();
//   }, [dispatch, sport, currentPage]); // Use currentPage as dependency for pagination
  
//   // Fetch matches based on the selected sport
//   useEffect(() => {
//     const fetchMatches = async () => {
//       if (!sport) return;
  
//       try {
//         console.log(`Fetching matches for sportId: ${sport} with page: ${currentPage}`); // Log the selected sport and current page
//         const response = await getCreateNewMatchAPIAuth(`match/getmatches?sportId=${sport}&page=${currentPage}&limit=10`);
  
//         console.log("Matches API Response:", response); // Log the full response
  
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data));
//           setTotalPages(response.data.totalPages || 1); // Assuming totalPages is returned from the API
//           console.log("Fetched matches:", response.data.data); // Log the match data
//         } else {
//           console.error('Error: Matches API returned no data'); // Log if no data is returned
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error); // Log error if fetching matches fails
//       }
//     };
  
//     fetchMatches();
//   }, [dispatch, sport, currentPage]); // Use currentPage as dependency for pagination
  

//   const handleSportChange = (e) => {
//     const selectedSport = e.target.value;
//     dispatch(setSport(selectedSport));
//     setCurrentPage(1);
//   };


  

//   const handleSearch = () => {
//     const searchQuery = searchTerm.toLowerCase();
//     const filteredMatches = matches.filter((match) => {
//       const eventId = match?.event?.id?.toString() || '';
//       const matchId = match?.id?.toString() || '';
//       return eventId.includes(searchQuery) || matchId.includes(searchQuery);
//     });
//     dispatch(setMatches(filteredMatches));
//     setCurrentPage(1); 
//   };

//   const handleStatusToggle = async (matchId, field, currentStatus) => {
//     try {
//       if (typeof currentStatus === 'undefined') {
//         console.error('Current status is undefined for:', matchId, field);
//         return;
//       }

//       const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       const payload = { field, status: updatedStatus };

//       const response = await putUpdateMatchAPIAuth(`match/updatematch/${matchId}`, payload);

//       if (response.status === 200) {
//         dispatch(setMatches(
//           matches.map((match) =>
//             match._id === matchId ? { ...match, [field]: updatedStatus } : match
//           )
//         ));
//       } else {
//         console.error(`Failed to update status for matchId: ${matchId}, field: ${field}`);
//       }
//     } catch (error) {
//       console.error(`Error updating ${field} status for matchId: ${matchId}:`, error);
//     }
//   };

//   const openStakeModal = (match) => {
//     setSelectedMatch(match);
//     setIsStakeModalOpen(true);
//   };

//   const openMatchModal = (match) => {
//     setSelectedMatch(match);
//     setIsMatchModalOpen(true);
//   };

//   const openScoreModal = (match) => {
//     setSelectedMatch(match); // Set the selected match for the Score Modal
//     setIsScoreModalOpen(true); // Open the Score Modal
//   };

//   const closeModals = () => {
//     setIsStakeModalOpen(false);
//     setIsMatchModalOpen(false);
//     setIsScoreModalOpen(false); // Close the Score Modal
//     setSelectedMatch(null);
//   };

//   return (
//     <div className="p-6">
//       {isStakeModalOpen && <EditStakeModal onCancel={closeModals} match={selectedMatch} onSubmit={(data) => { console.log(data); closeModals(); }} />}
//       {isMatchModalOpen && <EditMatchModal match={selectedMatch} onCancel={closeModals} />}
//       {isScoreModalOpen && <ScoreModal match={selectedMatch} onCancel={closeModals} />} {/* Score Modal */}
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={handleSportChange}
//         >
//           <option value="">Select Sport</option>
//           {loading ? (
//             <option value="">Loading...</option>
//           ) : (
//             sportsOptions?.length > 0 ? (
//               sportsOptions.map((sportOption) => (
//                 <option key={sportOption.id} value={sportOption.id}>
//                   {sportOption.name}
//                 </option>
//               ))
//             ) : (
//               <option value="">No Sports Available</option>
//             )
//           )}
//         </select>

//         <input
//           type="text"
//           className="border p-2 rounded w-1/3"
//           placeholder="Search by EventID, MatchID..."
//           value={searchTerm}
//           onChange={(e) => dispatch(setSearchTerm(e.target.value))}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-gray-200 text-black p-2 rounded"
//         >
//           Search
//         </button>
//       </div>

//       <table className="table-auto w-full border-collapse border">
//         <thead>
//           <tr className="bg-black text-white">
//             <th className="px-4 py-2">ID</th>
//             <th className="px-4 py-2">Match Name</th>
//             <th className="px-4 py-2">Open Date</th>
//             <th className="px-4 py-2">Odds</th>
//             <th className="px-4 py-2">BookMaker</th>
//             <th className="px-4 py-2">Session</th>
//             <th className="px-4 py-2">Toss</th>
//             <th className="px-4 py-2">Set Result</th>
//             <th className="px-4 py-2">Result</th>
//             <th className="px-4 py-2">Add Market</th>
//             <th className="px-4 py-2">Delete Bets</th>
//           </tr>
//         </thead>
//         <tbody>
//           {matches?.length > 0 ? (
//             matches.map((match) => (
//               <tr key={match._id}>
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.id}</td>
//                 {/* <td className="px-4 py-2 border border-gray-300">{match.event?.name}
//                   <MdModeEdit
//                     onClick={() => openStakeModal(match)}
//                     className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
//                   />
//                   <BiPlusMedical
//                     onClick={() => openScoreModal(match)} // Open Score Modal
//                     className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7"
//                   />
//                   <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7 " />
//                   <FaEdit
//                     onClick={() => openMatchModal(match)}
//                     className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
//                   />
//                 </td> */}
//                 <td className="px-4 py-2 border border-gray-300">
//   <div className="flex space-x-2 items-center">
//     {match.event?.name}
//     <MdModeEdit
//       onClick={() => openStakeModal(match)}
//       className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
//     />
//     <BiPlusMedical
//       onClick={() => openScoreModal(match)} 
//       className="text-white bg-LightGreen p-1 rounded-full cursor-pointer size-7"
//     />
//     <PiTelevisionBold className="text-yellow-400 cursor-pointer size-7 " />
//     <FaEdit
//       onClick={() => openMatchModal(match)}
//       className="text-white bg-lightblue p-1 rounded-full cursor-pointer size-7"
//     />
//   </div>
// </td>

//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
//                     onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
//                   >
//                     {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
//                     onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
//                   >
//                     {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
//                     onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
//                   >
//                     {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`py-1 px-3 rounded-full text-white bg-lightblue ${match.tossStatus === 'active' ? 'bg-blue-500' : 'bg-gray-400'} whitespace-nowrap`}
//                     onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
//                   >
//                     {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                 <div className="space-y-2">
//   <Link
//     to={`/TransferMatchCoins`} 
//     className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
//   >
//     Set Result
//   </Link>
//   <Link
//     to={`/CoinLog`} 
//     className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
//   >
//     Coin Log
//   </Link>
//   <Link
//     to={`/ResultLog`} // Replace with the correct route for Result Log
//     className="py-1 px-3 rounded-full text-white bg-lightblue bg-blue-500 whitespace-nowrap inline-block"
//   >
//     Result Log
//   </Link>
// </div>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
                 
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
                  
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                 <div className="space-y-2">
//   <Link
//     to={`/MatchOddsBets`} // Replace with the correct route for Odds Bets
//     className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
//   >
//     Odds Bets
//   </Link>
//   <Link
//     to={`/BookmakerBets`} // Replace with the correct route for Bookmaker Bets
//     className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
//   >
//     Bookmaker Bets
//   </Link>
//   <Link
//     to={`/AllSessionList`} // Replace with the correct route for Session Bets
//     className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
//   >
//     Session Bets
//   </Link>
//   <Link
//     to={`/TossBets`} // Replace with the correct route for Toss Bets
//     className="py-1 px-3 rounded-full text-white bg-amber whitespace-nowrap inline-block"
//   >
//     Toss Bets
//   </Link>
// </div>

//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="11" className="text-center py-4">
//                 No matches found.
//               </td>
//             </tr>
//           )}
//         </tbody>

//         <div className="pagination-controls">
//   <button
//     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//     disabled={currentPage === 1}
//   >
//     Previous
//   </button>
//   <span>
//     Page {currentPage} of {totalPages}
//   </span>
//   <button
//     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//     disabled={currentPage === totalPages}
//   >
//     Next
//   </button>
// </div>

//       </table>

//     </div>
//   );
// };

// export default AllMatches;


