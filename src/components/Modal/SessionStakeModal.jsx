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
            console.log('sortMatchsortMatchsortMatchsortMatchsortMatchsortMatchsortMatch')
            dispatch(fetchSessions(match?._id));
    }, [dispatch]);


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


    console.log(sessions,'sessionssessions')
    return (
        <div className='relative bg-white rounded-lg sm:mt-6 mt-3 shadow-lg w-[96%] md:w-3/4 lg:w-1/3'>
            <div className="flex justify-between items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full px-3 py-2">
                <h2>Sessions Stake</h2>
                <IoClose
                onClick={onCancel}
                className="cursor-pointer text-white text-2xl"
                />
            </div>
            <div className="sm:p-4 p-3 overflow-y-auto h-full">
                <div className='flex gap-3'>
                    <div className="w-full">
                        <label
                            htmlFor="session"
                            className="block text-[14px] mb-1 text-left"
                        >
                            Select Session
                        </label>
                        <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            id="session"
                            className="px-2 py-2 text-[14px] border border-gray-300 rounded outline-none w-full"
                        >
                            <option value="">Select Session</option>
                            {sessions?.sessions?.filter((item) => !item.result).map((session, index) => {
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
                <div className='flex justify-between gap-3 py-3 sm:flex-row flex-col'>
                    <div className='flex flex-col w-full'>
                        <label className='block text-[14px] mb-1 text-left '>
                            Min Stake
                        </label>
                        <input
                        onChange={handleChange}
                        name='minStake'
                            className='border p-1.5 rounded text-[14px] outline-none border-gray-400'
                            value={stakes?.minStake}
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='block text-[14px] mb-1 text-left '>
                            Max Stake
                        </label>
                        <input
                        name='maxStake'
                        onChange={handleChange}
                            className='border p-1.5 rounded text-[14px] outline-none border-gray-400'
                            value={stakes?.maxStake}
                        />
                    </div>
                </div>
                <div className='w-full flex justify-end mt-2'>
                    <button className='bg-gradient-seablue font-semibold text-[14px] p-2 rounded-md text-white w-32' onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SessionStakeModal