import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

const AllMatches = () => {
  const dispatch = useDispatch();
  const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);
  const [sportsOptions, setSportsOptions] = useState([]);

  // Fetch sports from API
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getCreateNewMatchAPIAuth('admin/v1/games/getgames');
        if (response.status === 200) {
          setSportsOptions(response.data.data || []); // Adjust based on API response
          
          // Set default sport to "cricket" (assuming its id is known, for example, 1)
          const cricketSport = response.data.data.find((sport) => sport.name.toLowerCase() === 'cricket');
          if (cricketSport) {
            dispatch(setSport(cricketSport.id));  // Set default sport ID to cricket
          }
        }
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };
    fetchSports();
  }, [dispatch]);

  // Fetch matches based on the selected sport
  useEffect(() => {
    const fetchMatches = async () => {
      if (!sport) return; // Do not fetch if no sport is selected
      try {
        const response = await getCreateNewMatchAPIAuth(`admin/v1/match/getmatches?sportId=${sport}`);
        if (response.data?.data) {
          dispatch(setMatches(response.data.data));
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();  // Fetch matches whenever the sport changes
  }, [dispatch, sport]);

  // Handle search logic
  const handleSearch = () => {
    const searchQuery = searchTerm.toLowerCase();
    const filteredMatches = matches.filter((match) => {
      const eventId = match?.event?.id?.toString() || '';
      const matchId = match?.id?.toString() || '';
      return eventId.includes(searchQuery) || matchId.includes(searchQuery);
    });
    dispatch(setMatches(filteredMatches)); // Dispatch filtered matches
  };

  const handleStatusToggle = async (matchId, field, currentStatus) => {
    try {
      if (typeof currentStatus === 'undefined') {
        console.error('Current status is undefined for:', matchId, field);
        return;
      }

      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const payload = { field, status: updatedStatus };

      const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);

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
          <option value="">Select Sport</option>
          {sportsOptions?.length > 0 ? (
            sportsOptions.map((sportOption) => (
              <option key={sportOption.id} value={sportOption.id}>
                {sportOption.name}
              </option>
            ))
          ) : (
            <option value="">No Sports Available</option>
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
                <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
                <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active'}`}
                    onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
                  >
                    {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active'}`}
                    onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
                  >
                    {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active'}`}
                    onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
                  >
                    {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className={`p-2 rounded-full text-white bg-lightblue ${match.tossStatus === 'active'}`}
                    onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
                  >
                    {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button className="bg-blue-500 text-white p-2 rounded">Set Result</button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button className="bg-lightblue text-white p-2 rounded">View Result</button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button className="bg-lightblue text-white p-2 rounded">Add Market</button>
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button className="bg-lightblue text-white p-2 rounded">Delete Bets</button>
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
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
// import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);
//   const [sportsOptions, setSportsOptions] = useState([]);

//   // Fetch sports from API
//   useEffect(() => {
//     const fetchSports = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/games/getgames');
//         if (response.status === 200) {
//           setSportsOptions(response.data.data || []); // Adjust based on API response
//         }
//       } catch (error) {
//         console.error('Error fetching sports:', error);
//       }
//     };
//     fetchSports();
//   }, []);

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
  
//     // Ensure you are comparing valid values
//     const searchQuery = searchTerm.toLowerCase();
  
//     const filteredMatches = matches.filter((match) => {
//       // Check if the match has the necessary properties
//       const eventId = match?.event?.id?.toString() || ''; // Default to empty string if undefined
//       const matchId = match?.id?.toString() || ''; // Default to empty string if undefined
  
//       return (
//         eventId.includes(searchQuery) ||
//         matchId.includes(searchQuery)
//       );
//     });
  
//     // Update the state with filtered matches
//     dispatch(setMatches(filteredMatches));
//   };
  

//   const handleStatusToggle = async (matchId, field, currentStatus) => {
//     try {
//       if (typeof currentStatus === 'undefined') {
//         console.error('Current status is undefined for:', matchId, field);
//         return;
//       }

//       const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       const payload = {
//         field,
//         status: updatedStatus,
//       };

//       console.log(`Sending update for matchId: ${matchId}, field: ${field}, updated status: ${updatedStatus}`);

//       const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);

//       if (response.status === 200) {
//         console.log(`${field} status updated successfully.`);

//         // Directly update the match in Redux without refetching all matches
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

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data));
//           console.log(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       }
//     };

//     fetchMatches();
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={(e) => dispatch(setSport(e.target.value))}
//         >
//           <option value="">Select Sport</option>
//           {sportsOptions?.length > 0 ? (
//             sportsOptions.map((sportOption) => (
//               <option key={sportOption.id} value={sportOption.id}>
//                 {sportOption.name}
//               </option>
//             ))
//           ) : (
//             <option value="">No Sports Available</option>
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
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
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
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
//                   >
//                     {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
//                   >
//                     {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
//                   >
//                     {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.tossStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
//                   >
//                     {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-blue-500 text-white p-2 rounded">Set Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">View Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Add Market</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Delete Bets</button>
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
//       </table>
//     </div>
//   );
// };

// export default AllMatches;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
// import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);
//   const [sportsOptions, setSportsOptions] = useState([]);

//   // Fetch sports from API
//   useEffect(() => {
//     const fetchSports = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/games/getgames');
//         if (response.status === 200) {
//           setSportsOptions(response.data.data || []); // Adjust based on API response
//         }
//       } catch (error) {
//         console.error('Error fetching sports:', error);
//       }
//     };
//     fetchSports();
//   }, []);

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
//     // Implement your search functionality here (filtering or API call)
//   };

//   const handleStatusToggle = async (matchId, field, currentStatus) => {
//     try {
//       if (typeof currentStatus === 'undefined') {
//         console.error('Current status is undefined for:', matchId, field);
//         return;
//       }

//       const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       const payload = {
//         field,
//         status: updatedStatus,
//       };

//       console.log(`Sending update for matchId: ${matchId}, field: ${field}, updated status: ${updatedStatus}`);

//       const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);

//       if (response.status === 200) {
//         console.log(`${field} status updated successfully.`);

//         // Directly update the match in Redux without refetching all matches
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

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data));
//           console.log(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       }
//     };

//     fetchMatches();
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={(e) => dispatch(setSport(e.target.value))}
//         >
//           <option value="">Select Sport</option>
//           {sportsOptions?.length > 0 ? (
//             sportsOptions.map((sportOption) => (
//               <option key={sportOption.id} value={sportOption.id}>
//                 {sportOption.name}
//               </option>
//             ))
//           ) : (
//             <option value="">No Sports Available</option>
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
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
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
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active' }`}
//                     onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
//                   >
//                     {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active' }`}
//                     onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
//                   >
//                     {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
//                   >
//                     {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.tossStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
//                   >
//                     {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-blue-500 text-white p-2 rounded">Set Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">View Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Add Market</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Delete Bets</button>
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
//       </table>
//     </div>
//   );
// };

// export default AllMatches;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
// import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
//     // Implement your search functionality here (filtering or API call)
//   };

//   // const handleStatusToggle = async (matchId, field, currentStatus) => {
//   //   try {
//   //     if (typeof currentStatus === 'undefined') {
//   //       console.error('Current status is undefined for:', matchId, field);
//   //       return;
//   //     }
  
//   //     const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
//   //     const payload = {
//   //       field,
//   //       status: updatedStatus,
//   //     };
  
//   //     console.log(`Sending update for matchId: ${matchId}, field: ${field}, updated status: ${updatedStatus}`);
  
//   //     const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);
  
//   //     if (response.status === 200) {
//   //       console.log(`${field} status updated successfully.`);
//   //       // Fetch latest matches after successful update
//   //       const updatedMatchesResponse = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//   //       if (updatedMatchesResponse.data?.data) {
//   //         dispatch(setMatches(updatedMatchesResponse.data.data));
//   //       }
//   //     } else {
//   //       console.error(`Failed to update status for matchId: ${matchId}, field: ${field}`);
//   //     }
//   //   } catch (error) {
//   //     console.error(`Error updating ${field} status for matchId: ${matchId}:`, error);
//   //   }
//   // };
  
//   const handleStatusToggle = async (matchId, field, currentStatus) => {
//     try {
//       if (typeof currentStatus === 'undefined') {
//         console.error('Current status is undefined for:', matchId, field);
//         return;
//       }
  
//       const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       const payload = {
//         field,
//         status: updatedStatus,
//       };
  
//       console.log(`Sending update for matchId: ${matchId}, field: ${field}, updated status: ${updatedStatus}`);
  
//       const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);
  
//       if (response.status === 200) {
//         console.log(`${field} status updated successfully.`);
  
//         // Directly update the match in Redux without refetching all matches
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
  
//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data));
//           console.log(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       }
//     };

//     fetchMatches();
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={(e) => dispatch(setSport(e.target.value))}
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
//           onChange={(e) => dispatch(setSearchTerm(e.target.value))}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
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
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.oddsStatus === 'active' }`}
//                     onClick={() => handleStatusToggle(match._id, 'oddsStatus', match.oddsStatus)}
//                   >
//                     {match.oddsStatus === 'active' ? 'Odds Opened' : 'Odds Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.bookMakerStatus === 'active' }`}
//                     onClick={() => handleStatusToggle(match._id, 'bookMakerStatus', match.bookMakerStatus)}
//                   >
//                     {match.bookMakerStatus === 'active' ? 'Bookmaker Opened' : 'Bookmaker Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.sessionStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'sessionStatus', match.sessionStatus)}
//                   >
//                     {match.sessionStatus === 'active' ? 'Session Opened' : 'Session Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.tossStatus === 'active'}`}
//                     onClick={() => handleStatusToggle(match._id, 'tossStatus', match.tossStatus)}
//                   >
//                     {match.tossStatus === 'active' ? 'Toss Opened' : 'Toss Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-blue-500 text-white p-2 rounded">Set Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">View Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Add Market</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Delete Bets</button>
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
//       </table>
//     </div>
//   );
// };

// export default AllMatches;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSport, setSearchTerm, setMatches } from '../../Store/Slice/allMatchSlice';
// import { getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth } from '../../Services/Newmatchapi';

// const AllMatches = () => {
//   const dispatch = useDispatch();
//   const { sport, searchTerm, matches } = useSelector((state) => state.allMatch);

//   const handleSearch = () => {
//     console.log('Search triggered for:', searchTerm);
//     // Implement your search functionality here (filtering or API call)
//   };

//   const handleStatusToggle = async (matchId, field, currentStatus) => {
//     try {
//       if (typeof currentStatus === 'undefined') {
//         console.error('Current status is undefined for:', matchId, field);
//         return;
//       }

//       const updatedStatus = !currentStatus;
//       const payload = {
//         field,
//         status: updatedStatus,
//       };

//       console.log(`Sending update for matchId: ${matchId}, field: ${field}, updated status: ${updatedStatus}`);

//       const response = await putUpdateMatchAPIAuth(`admin/v1/match/updatematch/${matchId}`, payload);

//       if (response.status === 200) {
//         console.log(`${field} status updated successfully.`);
//         // Fetch latest matches after successful update
//         const updatedMatchesResponse = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//         if (updatedMatchesResponse.data?.data) {
//           dispatch(setMatches(updatedMatchesResponse.data.data));
//         }
//       } else {
//         console.error(`Failed to update status for matchId: ${matchId}, field: ${field}`);
//       }
//     } catch (error) {
//       console.error(`Error updating ${field} status for matchId: ${matchId}:`, error);
//     }
//   };

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth('admin/v1/match/getmatches');
//         if (response.data?.data) {
//           dispatch(setMatches(response.data.data));
//           console.log(response.data.data)
//         }
//       } catch (error) {
//         console.error('Error fetching matches:', error);
//       }
//     };

//     fetchMatches();
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="bg-gray-200 text-center py-2 mb-6">
//         <h1 className="text-2xl font-bold">ALL Matches</h1>
//       </div>

//       <div className="flex space-x-4 mb-6">
//         <select
//           className="border p-2 rounded"
//           value={sport}
//           onChange={(e) => dispatch(setSport(e.target.value))}
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
//           onChange={(e) => dispatch(setSearchTerm(e.target.value))}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-gray-400 text-black p-2 rounded"
//         >
//           Search OK
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
//                 <td className="px-4 py-2 border border-gray-300">{match.event?.name}</td>
//                 <td className="px-4 py-2 border border-gray-300">{new Date(match.event?.openDate).toLocaleString()}</td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.oddsStatusActive}`}
//                     onClick={() => handleStatusToggle(match.event?.id, 'oddsStatusActive', match.oddsStatusActive)}
//                   >
//                     {match.oddsStatusActive ? 'Odds Opened' : 'Odds Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.bookMakerStatusActive}`}
//                     onClick={() => handleStatusToggle(match.event?.id, 'bookMakerStatusActive', match.bookMakerStatusActive)}
//                   >
//                     {match.bookMakerStatusActive ? 'Bookmaker Opened' : 'Bookmaker Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.sessionStatusActive}`}
//                     onClick={() => handleStatusToggle(match.event?.id, 'sessionStatusActive', match.sessionStatusActive)}
//                   >
//                     {match.sessionStatusActive ? 'Session Opened' : 'Session Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button
//                     className={`p-2 rounded-full text-white bg-lightblue ${match.tossStatusActive}`}
//                     onClick={() => handleStatusToggle(match.event?.id, 'tossStatusActive', match.tossStatusActive)}
//                   >
//                     {match.tossStatusActive ? 'Toss Opened' : 'Toss Closed'}
//                   </button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-blue-500 text-white p-2 rounded">Set Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">View Result</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Add Market</button>
//                 </td>
//                 <td className="px-4 py-2 border border-gray-300">
//                   <button className="bg-lightblue text-white p-2 rounded">Delete Bets</button>
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
//       </table>
//     </div>
//   );
// };

// export default AllMatches;

