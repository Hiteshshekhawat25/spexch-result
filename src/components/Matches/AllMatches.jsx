
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

const AllMatches = () => {
  const dispatch = useDispatch();
  const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);

  const handleSearch = () => {
    console.log('Search triggered for:', searchTerm);
    // Implement your search functionality here (filtering or API call)
  };

  const handleStatusToggle = async (matchId, field, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatestatus`, {
        matchId,
        field,
        status: updatedStatus,
      });

      if (response.status === 200) {
        console.log(`${field} status updated successfully.`);
        // Update the local state
        const updatedMatches = matches.map((match) =>
          match._id === matchId ? { ...match, [field]: updatedStatus } : match
        );
        dispatch(setMatches(updatedMatches));
      }
    } catch (error) {
      console.error(`Error updating ${field} status:`, error);
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
        if (response.data?.data) {
          dispatch(setMatches(response.data.data));
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="bg-gray-200 text-center py-2 mb-6">
        <h1 className="text-2xl font-bold">ALL Matches</h1>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          className="border p-2 rounded"
          value={sport}
          onChange={(e) => dispatch(setSport(e.target.value))}
        >
          <option value="">Select Game</option>
          <option value="game1">Game 1</option>
          <option value="game2">Game 2</option>
          <option value="game3">Game 3</option>
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
          className="bg-gray-400 text-black p-2 rounded"
        >
          Search OK
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
          </tr>
        </thead>
        <tbody>
          {matches?.length > 0 ? (
            matches.map((match) => (
              <tr key={match._id}>
                <td className="px-4 py-2 border border-gray-300">{match.event?.id}</td>
                <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
                <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white ${match.oddsStatusActive ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => handleStatusToggle(match._id, 'oddsStatusActive', match.oddsStatusActive)}
                  >
                    {match.oddsStatusActive ? 'Odds Opened' : 'Odds Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white ${match.bookMakerStatusActive ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => handleStatusToggle(match._id, 'bookMakerStatusActive', match.bookMakerStatusActive)}
                  >
                    {match.bookMakerStatusActive ? 'Bookmaker Opened' : 'Bookmaker Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white ${match.sessionStatusActive ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => handleStatusToggle(match._id, 'sessionStatusActive', match.sessionStatusActive)}
                  >
                    {match.sessionStatusActive ? 'Session Opened' : 'Session Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white ${match.tossStatusActive ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => handleStatusToggle(match._id, 'tossStatusActive', match.tossStatusActive)}
                  >
                    {match.tossStatusActive ? 'Toss Opened' : 'Toss Closed'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
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

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice'; // Import actions from the slice
// import { getCreateNewMatchAPIAuth } from '../../Services/Newmatchapi'; // API file import

// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch); // Access Redux state

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
//     // Implement your search functionality here (filtering or API call)
//   };

//   // Fetch matches data when the component mounts
//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches'); // Replace 'matches' with the correct API endpoint
//         console.log('Responses:', response);
//         // Assuming the data array is at response.data.data
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data)); // Update Redux state with fetched matches
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       }
//     };

//     fetchMatches();
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       {/* Heading Section */}
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={(e) => dispatch(setSport(e.target.value))} // Use Redux action to update sport
//         >
//           <option value="">Select Game</option>
//           <option value="game1">Game 1</option>
//           <option value="game2">Game 2</option>
//           <option value="game3">Game 3</option>
//         </select>

//         <input
//           type="text"
//           className="border p-2 rounded w-1/3"
//           placeholder="Search by EventID, MatchID..."
//           value={searchTerm}
//           onChange={(e) => dispatch(setSearchTerm(e.target.value))} // Use Redux action to update search term
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
//         </button>
//       </div>

//       {/* Matches Table */}
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
//             <th className="px-4 py-2">AddMarket</th>
//             <th className="px-4 py-2">DeleteBets</th>
//           </tr>
//         </thead>
//         <tbody>
//           {matches?.length > 0 ? (
//             matches.map((match) => (
//               <tr key={match._id}>
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.id}</td>
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <div className="bg-lightblue text-white p-2 rounded-full">
//                     {match.oddsStatusActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <div className="bg-lightblue text-white p-2 rounded-full">
//                     {match.bookMakerStatusActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <div className="bg-lightblue text-white p-2 rounded-full">
//                     {match.sessionStatusActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <div className="bg-lightblue text-white p-2 rounded-full">
//                     {match.tossStatusActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">{match.setResult}</td>
//                 <td className="px-4 py-2 border border-gray-300">{match.result}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="text-center py-4">
//                 No matches found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AllMatches;




// import React, { useState } from 'react';

// const AllMatches = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [game, setGame] = useState('');
//   const [matches, setMatches] = useState([
//     {
//       id: 1,
//       match: 'Match 1',
//       openDate: '2024-12-10',
//       odds: '2.5',
//       bookMaker: 'BookMaker A',
//       session: 'Session A',
//       toss: 'Team 1',
//       setResult: 'Not Set',
//       result: 'Pending',
//     },
//     {
//       id: 2,
//       match: 'Match 2',
//       openDate: '2024-12-11',
//       odds: '3.0',
//       bookMaker: 'BookMaker B',
//       session: 'Session B',
//       toss: 'Team 2',
//       setResult: 'Not Set',
//       result: 'Pending',
//     },
//     {
//       id: 3,
//       match: 'Match 3',
//       openDate: '2024-12-12',
//       odds: '1.8',
//       bookMaker: 'BookMaker C',
//       session: 'Session C',
//       toss: 'Team 1',
//       setResult: 'Not Set',
//       result: 'Pending',
//     },
//   ]);

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
//     // Add your search functionality here (filter or API call)
//   };

//   return (
//     <div className="p-6">
//       {/* Heading Section */}
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       {/* Search and Filter Section */}
//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={game}
//           onChange={(e) => setGame(e.target.value)}
//         >
//           <option value="">Select Game</option>
//           <option value="game1">Game 1</option>
//           <option value="game2">Game 2</option>
//           <option value="game3">Game 3</option>
//         </select>

//         <input
//           type="text"
//           className="border p-2 rounded w-1/3"
//           placeholder="Search by EventID, MatchID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
//         </button>
//       </div>

//       {/* Matches Table */}
//       <table className="table-auto w-full border-collapse border">
//         <thead>
//           <tr className="bg-black text-white">
//             <th className="px-4 py-2">ID</th>
//             <th className="px-4 py-2">Match</th>
//             <th className="px-4 py-2">OpenDate</th>
//             <th className="px-4 py-2">Match</th>
//             <th className="px-4 py-2">Odds</th>
//             <th className="px-4 py-2">BookMaker</th>
//             <th className="px-4 py-2">Session</th>
//             <th className="px-4 py-2">Toss</th>
//             <th className="px-4 py-2">SetResult</th>
//             <th className="px-4 py-2">Result</th>
//             <th className="px-4 py-2">Add Market</th>
//             <th className="px-4 py-2">Delete Bets</th>
//           </tr>
//         </thead>
//         <tbody>
//           {matches.map((match) => (
//             <tr key={match.id}>
//               <td className="px-4 py-2 border border-gray-300">{match.id}</td>
//               <td className="px-4 py-2 border border-gray-300">{match.match}</td>
//               <td className="px-4 py-2 border border-gray-300">{match.openDate}</td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <div className="bg-lightblue text-white p-2 rounded-full">
//                   {match.odds}
//                 </div>
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <div className="bg-lightblue text-white p-2 rounded-full">
//                   {match.bookMaker}
//                 </div>
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <div className="bg-lightblue text-white p-2 rounded-full">
//                   {match.session}
//                 </div>
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <div className="bg-lightblue text-white p-2 rounded-full">
//                   {match.toss}
//                 </div>
//               </td>
//               <td className="px-4 py-2 border border-gray-300">
//                 <div className="bg-lightblue text-white p-2 rounded-full">
//                   {match.setResult}
//                 </div>
//               </td>
//               <td className="px-4 py-2 border border-gray-300">{match.result}</td>
//               <td className="px-4 py-2 border border-gray-300">{match.toss}</td>
//               <td className="px-4 py-2 border border-gray-300">{match.setResult}</td>
//               <td className="px-4 py-2 border border-gray-300">{match.result}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AllMatches;

