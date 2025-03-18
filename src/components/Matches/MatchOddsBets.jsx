import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ImBook } from 'react-icons/im';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useParams, useSearchParams } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import { liabilityBook } from '../../Store/Slice/liabilitySlice';
import RevertModal from '../marketBetModal/RevertModal';
import RemarkModal from '../marketBetModal/RemarkModal';
import { DeleteBet, RevertBet } from '../../Services/manageBetapi';

const MatchOddsBets = () => {
  const [betList, setBetList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
   const [remarkModal2,setRemarkModal2] = useState(false);
    const [remarkModal,setRemarkModal] = useState(false);

    const [remark,setRemark] = useState('');
    const [password,setPassword] = useState('');
  const [search, setSearch] = useState('')
  const {matchId} = useParams()
  const [selectedBets, setSelectedBets] = useState([])

  console.log('selectedBets', selectedBets)


  const getBetList = async () => {

      const token = localStorage.getItem("authToken");
      try {
        let status = location?.pathname?.includes('/MatchOddsRevertBets') ? 'DELETED' : 'ACTIVE'
        const response = await axios.get(`${BASE_URL}/user/get-pending-liability-list?matchId=${matchId}&type=odds&limit=10&page=${page}&search=${search}&deleteStatus=${status}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response",response);
        if(response?.data?.success) {
          setBetList(response?.data?.data)
          setTotalPage(response?.data?.pagination?.totalPages)
        }
      } catch (error) {
        // Handle specific token expiry case
        if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
          localStorage.clear();
          alert("Session expired. Please log in again.");
        }
        // Handle other API errors
        toast.error(error?.response?.data?.message)
        console.error("API error:", error);
        // throw new Error(error.response?.data?.message || "An error occurred, please try again.");
      }
    };

    useEffect(()=> {
      if(matchId) {
        getBetList()
      }
    }, [matchId, page])

    const handleSelectBet = (id)=> {
      if(selectedBets?.includes(id)) {
        const myArr = selectedBets?.filter((ele) => ele !== id);
        setSelectedBets(myArr)
      } else {
        setSelectedBets([...selectedBets, id])
      }
    }

    const handleSelectAllBets = ()=> {
      if(selectedBets?.length === betList?.length) {
        setSelectedBets([])
      } else {
        const allIds = betList?.map(item => item?._id)
        setSelectedBets(allIds)
      }
    }

  

      const handleRevertBet = async (item) => {
          try {
            const res = await RevertBet("user/revert-delete-bets", {
              betIds: selectedBets,
              matchId: matchId,
              betDeletePassword : 'Admin1234'
            });
      
            if (res?.data?.success) {
                setRemark("");
                getBetList()
                // setList([])
                setRemarkModal2(false);
                setPassword('')
              
                
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
                  betIds: selectedBets,
                  matchId: matchId,
                  remark: remark,
                  betDeletePassword : password
                });
                console.log({res})
                if (res?.data?.success) {
                  // setList([])
                  getBetList()
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
      

      console.log({betList},'function')

  return (
    <div className="w-full p-4">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <ImBook />
          Match Odds Bets
        </h2>
        <hr className="border-t border-gray-300 my-2" />
      </div>

      {/* Row Section */}
      <div className="md:flex items-center gap-4 mb-4">
        {/* Delete Button */}
     {location?.pathname?.includes('/MatchOddsRevertBets')
     ?
     <button onClick={handleRevertBet} className="px-6 py-2 my-2 bg-lightblue text-white font-semibold rounded hover:bg-red-600">
          Revert All Odds Bets
        </button>
     :  
      <button onClick={handleDeleteBet} className="px-6 py-2 my-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600">
          Delete All Odds Bets
        </button>
        }

        {/* Input Box */}
        <input
        type="text"
        name='search'
        autoComplete='search'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          // placeholder="Enter search term"
          className="px-4 py-2 border my-2 border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Find Button */}
        <button onClick={()=> {
          setPage(1)
          getBetList()
        }} className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600">
          Find
        </button>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-gray-300" />

      <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-black text-white text-nowrap text-left">
            <th className="px-4 py-2">
              <input type="checkbox"  onChange={handleSelectAllBets}/>
            </th>
            <th className="px-4 py-2 text-center items-center">Match</th>
              <th className="px-4 py-2 text-center items-center">Session Name</th>
              <th className="px-4 py-2 text-center items-center">Username</th>
              <th className="px-4 py-2 text-center items-center">Amount</th>

              {/* <th className="px-4 py-2 text-center items-center">Edit/Update</th> */}
              <th className="px-4 py-2 text-center items-center">Market Type</th>
              <th className="px-4 py-2 text-center items-center">odds</th>
              <th className="px-4 py-2 text-center items-center">Type</th>
              {/* <th className="px-4 py-2 text-center items-center"></th> */}
              {/* <th className="px-4 py-2 text-center items-center">Coin Transferred</th> */}
              <th className="px-4 py-2 text-center items-center">Date</th>
          </tr>
        </thead>
        <tbody>
          {betList?.length > 0 ? (
            betList.map((session) => (
              <tr key={session?._id}>
                <td className="py-2 border border-gray-300 px-4">
                  <input checked={selectedBets?.includes(session?._id)} onChange={()=>handleSelectBet(session?._id)} type="checkbox" />
                </td>
                 <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.event}</td>
                                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.selection}</td>
                                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.username}</td>
                                      <td className="px-4 py-2 text-center items-center border border-gray-400 ">{session.amount?.toFixed(2)}</td>

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
              <td colSpan="11" className="text-center py-4">
                No Bets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="pt-4">
      <Pagination totalPages={totalPage} pageNo={page} setPageNo={setPage}/>
    </div>
   {location?.pathname?.includes('/MatchOddsRevertBets') 
   ? 
    <button onClick={handleRevertBet} className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-red-600 mt-4">
          Revert Selected Match Odds Bets
        </button> 
        : 
        <button onClick={handleDeleteBet} className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mt-4">
          Delete Selected Match Odds Bets
        </button> 
        }


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

export default MatchOddsBets;
