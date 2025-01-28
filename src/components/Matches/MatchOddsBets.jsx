import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ImBook } from 'react-icons/im';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useParams, useSearchParams } from 'react-router-dom';
import Pagination from '../pagination/Pagination';

const MatchOddsBets = () => {
  const [betList, setBetList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [search, setSearch] = useState('')
  const {matchId} = useParams()
  const [selectedBets, setSelectedBets] = useState([])

  console.log('selectedBets', selectedBets)


  const getBetList = async () => {

      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(`${BASE_URL}/user/get-odds-bet-list?matchId=${matchId}&limit=10&page=${page}&search=${search}`, {
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

    const handleDeleteAllBets = async ()=> {
      const token = localStorage.getItem("authToken");
      const body = {
        matchId   
      }
      try {
        const response = await axios.post(`${BASE_URL}/user/delete-odds-bets/`, body, {
          headers: {
            
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response",response);
        if(response?.data?.success) {
          toast.success(response?.data?.message);
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
    }

    const handleDeleteBets = async () => {
      if(!selectedBets?.length) {
        toast.error('Please select bets to delete')
        return
      }
        const token = localStorage.getItem("authToken");
        const body = {
          betIds : selectedBets
        }
        try {
          const response = await axios.post(`${BASE_URL}/user/delete-odds-bets/`, body, {
            headers: {
              
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("response",response);
          if(response?.data?.success) {
            toast.success(response?.data?.message);
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
      <div className="flex items-center gap-4 mb-4">
        {/* Delete Button */}
        <button onClick={handleDeleteAllBets} className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600">
          Delete All Odds Bets
        </button>

        {/* Input Box */}
        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          // placeholder="Enter search term"
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
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
            <th className="px-4 py-2">Bet Id</th>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">Rate</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Bet Type</th>
            <th className="px-4 py-2">Team Name</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {betList?.length > 0 ? (
            betList.map((item) => (
              <tr key={item?._id}>
                <td className="py-2 border border-gray-300 px-4">
                  <input checked={selectedBets?.includes(item?._id)} onChange={()=>handleSelectBet(item?._id)} type="checkbox" />
                </td>
                <td className="py-2 border border-gray-300 px-4">--</td>
                <td className="py-2 border border-gray-300 px-4">{item?.username}</td>
                <td className="py-2 border border-gray-300 px-4">{item?.oddsRequested}</td>
                <td className="py-2 border border-gray-300 px-4">{item?.stake?.toFixed(0)}</td>
                <td className="py-2 border border-gray-300 px-4 uppercase">{item?.betType}</td>
                <td className="py-2 border border-gray-300 px-4">{item?.market}</td>
                <td className="py-2 border border-gray-300 px-4">{moment(item?.createdAt).format('LLL')}</td>
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
    <button onClick={handleDeleteBets} className="px-6 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mt-4">
          Delete Selected Match Odds Bets
        </button>
    </div>
    
  );
};

export default MatchOddsBets;
