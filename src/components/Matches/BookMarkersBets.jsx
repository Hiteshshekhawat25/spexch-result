import React, { useEffect, useState } from "react";
import { ImBook } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions, selectSessions } from "../../Store/Slice/SessionSlice";
import { FaEdit } from "react-icons/fa";
import { getMatchList, RevertSessionCoins, transferSessionCoins, updateSessionResult } from "../../Services/Newmatchapi";
import { toast } from "react-toastify";
import SessionEditModal from "./SessionEditModal";
import { liabilityBook } from "../../Store/Slice/liabilitySlice";
import moment from "moment";
import RevertModal from "../marketBetModal/RevertModal";
import RemarkModal from "../marketBetModal/RemarkModal";
import { DeleteBet, RevertBet } from "../../Services/manageBetapi";

const BookMakersBets = () => {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state);
  const [editingRow, setEditingRow] = useState(null);
  const dataLiability = useSelector((state) => state.liability.data);
  const [tempResult, setTempResult] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [list,setList] = useState([])
  const [checkbox,setCheckbox] = useState([]);
  const [remarkModal2,setRemarkModal2] = useState(false);
  const [remarkModal,setRemarkModal] = useState(false);
  const [remark,setRemark] = useState('');
  const [password,setPassword] = useState('');
  const [selectedMatch, setSelectedMatch] = useState("");
  const [sortMatch,setSortMatch] = useState('new')
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    if (selectedMatch) {
      console.log('sortMatchsortMatchsortMatchsortMatchsortMatchsortMatchsortMatch')
      dispatch(fetchSessions(selectedMatch));
    }
  }, [dispatch, selectedMatch]);

  useEffect(() => {
    if (selectedMatch) {
      const match = matchList.find((match) => match._id === selectedMatch);
      const matchSessions = match?.Fancy?.Fancy || [];
      setFilteredSessions(matchSessions);
    } else {
      setFilteredSessions([]);
    }
  }, [selectedMatch, matchList]);

  const handleMatchChange = (e) => {
    setSelectedMatch(e.target.value);
  };


const handleCheckbox = (e)=>{
  if(e.target.checked){
    if(e.target.value == ''){
      const arr = dataLiability?.map((item)=> item?._id)
      setCheckbox(arr)
    }else{
      setCheckbox((pre)=>([...pre,e.target.value]))
    }
  }else{
    if(e.target.value == ''){
      setCheckbox([])
    }else{
    setCheckbox(checkbox?.filter((item)=>item !== e.target.value))
    }
  }
}

 

  const handleMatchSelectFocus = async () => {
     setMatchLoading(true);
    setMatchError("");
    try {
      const response = await getMatchList(sortMatch);
      setMatchList(response || []);
    } catch (error) {
      console.error("Error fetching match list:", error);
      setMatchError("Error fetching match list.");
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    handleMatchSelectFocus();
  }, [sortMatch]);


  useEffect(()=>{
    let status = location.pathname?.includes('/bookmaker-revert-bets') ? 'DELETED' : ''
    dispatch(
      liabilityBook({
       matchId : selectedMatch,
       type : 'bookmakers',
       status : status
      })
    )
  },[selectedSession,selectedMatch,remarkModal2,remarkModal,location.pathname])

 const handleRevertBet = async (item) => {
    try {
      const res = await RevertBet("user/revert-delete-bets", {
        betIds: checkbox?.length == 0 ? selectBet?._id : checkbox,
        matchId: selectedMatch,
        betDeletePassword : password
      });

      if (res?.data?.success) {
          setRemark("");
          setList([])
          setRemarkModal2(false);
          setPassword('')
          dispatch(
            liabilityBook({
             matchId : selectedMatch,
             type : 'bookmakers',
             status : ''
            })
          )
      }
      console.log({ res });
    } catch (error) {
      setRemarkModal2(false)
      console.log(error);
    }
  };


    const handleDeleteBet = async (item) => {
      setRemarkModal(true);
      if (remark !== "") {
        try {
          const res = await DeleteBet("user/delete-bets", {
            betIds: checkbox,
            matchId: selectedMatch,
            remark: remark,
            betDeletePassword : password
          });
          console.log({res})
          if (res?.data?.success) {
            setList([])
            dispatch(
              liabilityBook({
               matchId : selectedMatch,
               type : 'bookmakers',
                status : 'DELETED'
              })
            )
            setRemark("");
            setRemarkModal(false);
            setPassword('')
          }
          console.log({ res });
        } catch (error) {
          setRemarkModal(false);
          console.log({error});
        }
      }
    };


    
    console.log(list,dataLiability,'listlistlistlistlist')
  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Bookmakers Bets
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section with Select Match, Select Session, and Result */}
      <div className="sm:flex gap-6 mb-4">
        {/* Select Match Dropdown */}




        <div className="w-full sm:w-1/4">
          <label
            htmlFor="match"
            className="block text-md font-bold text-gray-700 mb-1 text-left"
          >
            Select Match
          </label>
          <select
            id="match"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
            // onFocus={handleMatchSelectFocus}
            onChange={handleMatchChange}
            value={selectedMatch}
            disabled={matchLoading}
          >
            <option value="">Select Match</option>
            {matchLoading ? (
              <option>Loading...</option> // Display loading text
            ) : matchError ? (
              <option>{matchError}</option> // Display error message
            ) : (
              matchList.map((match) => (
                <option key={match._id} value={match._id}>
                  {match.match} {match?.inPlay ? "(In Play)" : ""}
                </option>
              ))
            )}
          </select>
        </div>





        {/* Result Input and Submit Button */}

       {location?.pathname?.includes('/bookmaker-revert-bets') ? 
        <div className="w-full flex justify-end" onClick={()=>setRemarkModal2(true)}>
          <button disabled={checkbox?.length == 0 ? true : false} className="bg-lightblue disabled:bg-sky-300 py-2 max-w-32  mt-7 px-4 rounded-md text-white w-full font-medium">
            Revert Bets
            </button>
        </div>
        :
        <div className="w-full flex justify-end" onClick={()=>setRemarkModal(true)}>
          <button disabled={checkbox?.length == 0 ? true : false} className="bg-red-500 disabled:bg-red-200 py-2 max-w-32  mt-7 px-4 rounded-md text-white w-full font-medium">
            Delete Bets
            </button>
        </div>}
       
      </div>

      {/* Row Section with Search */}
      {/* <div className="flex gap-6 mb-4 w-1/2">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 w-full"
          />
        </div>

        <button className="px-6 py-2 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">
          Search
        </button>
      </div> */}

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-black text-white">
            <tr className="text-nowrap">
              <th  className="text-center items-center">
                <input
                value=''
                onChange={handleCheckbox}
                type="checkbox"
                />
              </th>
              <th className="px-4 py-2 text-center items-center">Match</th>
              <th className="px-4 py-2 text-center items-center">Session Name</th>
              {/* <th className="px-4 py-2 text-center items-center">Result</th> */}
              {/* <th className="px-4 py-2 text-center items-center">Edit/Update</th> */}
              <th className="px-4 py-2 text-center items-center">Market Type</th>
              <th className="px-4 py-2 text-center items-center">odds</th>
              <th className="px-4 py-2 text-center items-center">Type</th>
              {/* <th className="px-4 py-2 text-center items-center"></th> */}
              {/* <th className="px-4 py-2 text-center items-center">Coin Transferred</th> */}
              <th className="px-4 py-2 text-center items-center">Date</th>
              {/* <th className="px-4 py-2 text-left">Session Book</th> */}
              {/* <th className="px-4 py-2 text-left">Actions</th> */}
              {/* <th className="px-4 py-2 text-left">Coin Log</th>
              <th className="px-4 py-2 text-left">Result Log</th> */}
            </tr>
          </thead>
          <tbody>
            {selectedMatch ? (
              dataLiability?.length ? (
                dataLiability?.map((session, index) => (
                  <tr key={session?.marketId}>
                      <td className="px-4 text-center items-center border border-gray-400 py-2">
                        <input
                        checked={checkbox?.includes(session?._id)}
                        value={session?._id}
                        onChange={handleCheckbox}
                        type="checkbox"
                        />
                      </td>
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.event}</td>
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.selection}</td>
                      
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.type}</td>
                      {/* <td className="px-4 py-2">{session.coinTransferred}</td> */}
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.odds}</td>
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.betType}</td>
                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">
                   {moment(session?.createdAt)?.format('LLL')}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 border">
                    No data found
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-5 border">
                  Please Select Match
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RevertModal
        showUser={remarkModal2}
        setShowUser={setRemarkModal2}
        handleDeleteBet={handleRevertBet}
        password={password}
        setPassword={setPassword}
      />


    <RemarkModal
        showUser={remarkModal}
        remark={remark}
        handleDeleteBet={handleDeleteBet}
        setRemark={setRemark}
        setShowUser={setRemarkModal}
        password={password}
        setPassword={setPassword}
      />
     
    </div>
  );
};
export default BookMakersBets;
