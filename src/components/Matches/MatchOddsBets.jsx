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
    <div className="md:mx-0 mx-2 border border-gray-300 rounded-[5px] overflow-hidden bg-white">
      {/* Title Section */}
      <div className="bg-gradient-seablue text-white font-custom font-semibold text-[14px] p-2">
        Match Odds Bets
      </div>
      <div className="md:p-4 p-3">
        {/* Row Section */}
        <div className="flex items-center sm:flex-row flex-col gap-4">
          {/* Delete Button */}
          {location?.pathname?.includes('/MatchOddsRevertBets')
          ?
          <button onClick={handleRevertBet} className="px-6 py-2 sm:w-auto w-full bg-lightblue text-sm text-white font-semibold rounded hover:bg-red-600">
              Revert All Odds Bets
          </button>
          :  
          <button onClick={handleDeleteBet} className="px-6 py-2 sm:w-auto w-full bg-red-500 text-sm text-white font-semibold rounded hover:bg-red-600">
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
            className="px-2 text-[14px] py-2 sm:w-auto w-full border border-gray-300 rounded outline-none"
          />

          {/* Find Button */}
          <button onClick={()=> {
            setPage(1)
            getBetList()
          }} className="px-6 py-2 sm:w-auto w-full bg-gradient-seablue text-sm text-white font-semibold rounded hover:bg-blue-600">
            Find
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200 text-white ">
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">
                  <input type="checkbox"  onChange={handleSelectAllBets}/>
                </th>
                <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Match</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Session Name</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Username</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Amount</th>

                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Edit/Update</th> */}
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Market Type</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">odds</th>
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Type</th>
                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente"></th> */}
                  {/* <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Coin Transferred</th> */}
                  <th className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-black cursor-pointer text-cente">Date</th>
              </tr>
            </thead>
            <tbody>
              {betList?.length > 0 ? (
                betList.map((session) => (
                  <tr key={session?._id}>
                    <td className="py-2 border border-gray-300 px-4">
                      <input checked={selectedBets?.includes(session?._id)} onChange={()=>handleSelectBet(session?._id)} type="checkbox" />
                    </td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.event}</td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.selection}</td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.username}</td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.amount?.toFixed(2)}</td>

                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.type}</td>
                    {/* <td className="px-4 py-2">{session.coinTransferred}</td> */}
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.odds}</td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">{session.betType}</td>
                    <td className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
                      {moment(session?.createdAt)?.format('LLL')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="border border-gray-300 sm:px-3 px-2 py-2 text-[13px] text-nowrap text-darkblack cursor-pointer text-center">
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
        <button onClick={handleDeleteBet} className="px-6 py-2 text-sm bg-red-500 text-white font-semibold rounded hover:bg-red-600 mt-5">
          Delete Selected Match Odds Bets
        </button> 
        }

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

export default MatchOddsBets;
