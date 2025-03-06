import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessions } from '../../Store/Slice/SessionSlice';
import { getMatchList, postInstance } from '../../Services/Newmatchapi';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

function SessionStakeModal({ match, onCancel }) {
    const { sessions, loading, error } = useSelector((state) => state);
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedMatch, setSelectedMatch] = useState('')
    const [stakes, setStakes] = useState({
        minStake: '',
        maxStake: ''
    })
    const [matchList, setMatchList] = useState([]);
    const [matchLoading, setMatchLoading] = useState(false)
    const dispatch = useDispatch();


    const handleChange = (e) => {
        const { name, value } = e.target;

        setStakes((pre) => ({ ...pre, [name]: value }))
    }

    const handleMatchSelectFocus = async () => {
        setMatchLoading(true);
        try {
            const response = await getMatchList();
            setMatchList(response || []);
        } catch (error) {
            console.error("Error fetching match list:", error);
        } finally {
            setMatchLoading(false);
        }
    };


    const handleMatchChange = (e) => {
        setSelectedMatch(e.target.value);
    };
    useEffect(() => {
        handleMatchSelectFocus();
    }, []);

    useEffect(() => {
        if (selectedMatch) {
            console.log('sortMatchsortMatchsortMatchsortMatchsortMatchsortMatchsortMatch')
            dispatch(fetchSessions(selectedMatch));
        }
    }, [dispatch, selectedMatch]);


    const handleSubmit = async () => {
        try {
            const res = await postInstance('/match/updateSessionStake', {
                maxStake: 100,
                matchId: match?._id,
                selectionId: selectedSession
            })

            console.log(res,'resresreresres')
        } catch (error) {
            // toast.error()
            console.log({error})
        }
    }
    return (
        <div className='max-w-fit bg-white w-full p-4 rounded-md z-10 '>


            <div className="overflow-y-auto bg-gray-200 p-3">
                <div className="flex justify-between">
                    <h2 className="text-gray-800 text-lg font-semibold">Sessions Stake</h2>
                    <IoClose
                        onClick={onCancel}
                        className="cursor-pointer text-gray-600 text-2xl"
                    />
                </div>
            </div>
            <div className='flex gap-3 px-5 py-3'>
                <div className="w-full">
                    <label
                        htmlFor="session"
                        className="block text-xs  text-gray-700 mb-1 text-left"
                    >
                        Select Session
                    </label>
                    <select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        id="session"
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                    >
                        <option value="">Select Session</option>
                        {sessions.sessions.filter((item) => !item.result).map((session, index) => {
                            console.log({ session }, 'session')
                            return (
                                <option key={index} value={session.marketId}>
                                    {session.marketName}
                                </option>
                            )
                        })}
                    </select>
                </div>
                {/* <div className="w-1/4">
                    <label
                        htmlFor="match"
                        className="block text-xs  text-gray-700 mb-1 text-left"
                    >
                        Select Match
                    </label>
                    <select
                        id="match"
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
                        // onFocus={handleMatchSelectFocus}
                        onChange={handleMatchChange}
                        value={selectedMatch}
                        disabled={matchLoading}
                    >
                        <option value="">Select Match</option>
                        {matchLoading ? (
                            <option>Loading...</option> // Display loading text
                        ) : (
                            matchList.map((match) => (
                                <option key={match._id} value={match._id}>
                                    {match.match} {match?.inPlay ? "(In Play)" : ""}
                                </option>
                            ))
                        )}
                    </select>
                </div> */}
            </div>
            <div className='flex justify-between gap-3 px-5 py-3'>
                <div className='flex flex-col w-full'>
                    <label className='block text-xs  text-gray-700 mb-1 text-left '>
                        Min Stake
                    </label>
                    <input
                    onChange={handleChange}
                    name='minStake'
                        className='border p-1 rounded  border-gray-400'
                        value={stakes?.minStake}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <label className='block text-xs  text-gray-700 mb-1 text-left '>
                        Max Stake
                    </label>
                    <input
                     name='maxStake'
                     onChange={handleChange}
                        className='border p-1 rounded border-gray-400'
                        value={stakes?.maxStake}
                    />
                </div>
            </div>
            <div className='w-full flex justify-end px-5'>
                <button className='bg-lightblue p-2 rounded-md text-white w-32' onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    )
}

export default SessionStakeModal