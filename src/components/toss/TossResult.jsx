import React, { useEffect, useState } from 'react'
import { ImBook } from 'react-icons/im';
import { useParams } from 'react-router-dom';
import { getSingleMatch } from '../../Services/Newmatchapi';
import axios from 'axios';
import { BASE_URL } from '../../Constant/Api';
import { toast } from 'react-toastify';

function TossResult() {


    const { matchId } = useParams();
    const [loading,setLoading] = useState(false)
    const [marketData, setMarketData] = useState([])
    const [formValue, setFormValue] = useState({
      selectionId: '',
      bookmakerId: ''
    })
  
    useEffect(() => {
      const selectedId = marketData?.[0]?.market?.length && marketData?.[0]?.market?.filter(item => item?.status === "WINNER")?.[0]?.selectionId;
  
      console.log('selectedIdselectedIdselectedId', selectedId)
      setFormValue(prev => ({
        ...prev,
        selectionId: selectedId
      }))
    }, [marketData])
  
    const getMatchDetails = async () => {
      try {
        const res = await getSingleMatch(matchId)
        if (res?.data?.success) {
          setMarketData(res?.data?.data)
        }
      } catch (error) {
        console.log('errr', error)
      }
    }
    useEffect(() => {
      if (matchId) {
        getMatchDetails()
      }
    }, [matchId])
  
    const handleTossWinnerDeclare = async () => {
      if (!formValue?.selectionId) {
        toast.error('Please select match status')
        return
      }
      const token = localStorage.getItem("authToken");
      const body = {
        matchId: marketData?.[0]?._id,
        selectionId: formValue?.selectionId === 'ABANDONED' ? '' : formValue?.selectionId === 'TIE' ? '' : Number(formValue?.selectionId),
        status: formValue?.selectionId === 'ABANDONED' ? 'ABANDONED' : formValue?.selectionId === 'TIE' ? 'TIE' : 'WINNER'
      }
      try {
        const response = await axios.post(`${BASE_URL}/user/update-toss-result-status/`, body, {
          headers: {
  
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", response);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          getMatchDetails()
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
    
  
  
  
    const handleTossTransferCoin = async () => {
      if (marketData?.[0]?.tossResult === 0) {
        toast.error('Please declare the result first')
        return
      }
      const token = localStorage.getItem("authToken");
      const body = {
        matchId: marketData?.[0]?._id,
        // selectionId : formValue?.selectionId === 'ABANDONED' ? '' : formValue?.selectionId === 'TIE' ? '' :  Number(formValue?.selectionId),
        // status : formValue?.selectionId === 'ABANDONED' ? 'ABANDONED' : formValue?.selectionId === 'TIE' ? 'TIE' : 'WINNER'
      }
      setLoading(true)
      setTimeout(async()=>{
        try {
          const response = await axios.post(`${BASE_URL}/user/transfer-toss-coin/`, body, {
            headers: {
    
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("response", response);
          if (response?.data?.success) {
            setLoading(false)
            toast.success(response?.data?.message);
            getMatchDetails()
          }
        } catch (error) {
          setLoading(false)
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
      },3000)
    };




    const handleTossRevertCoin = async () => {
        if (marketData?.[0]?.tossResult === 0) {
          toast.error('Please declare the result first')
          return
        }
        const token = localStorage.getItem("authToken");
        const body = {
          matchId: marketData?.[0]?._id,
          // selectionId : formValue?.selectionId === 'ABANDONED' ? '' : formValue?.selectionId === 'TIE' ? '' :  Number(formValue?.selectionId),
          // status : formValue?.selectionId === 'ABANDONED' ? 'ABANDONED' : formValue?.selectionId === 'TIE' ? 'TIE' : 'WINNER'
        }
        setLoading(true)
        setTimeout(async()=>{
          try {
            const response = await axios.post(`${BASE_URL}/user/rollback-toss-coin/`, body, {
              headers: {
      
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("response", response);
            if (response?.data?.success) {
              setLoading(false)
              toast.success(response?.data?.message);
              getMatchDetails()
            }
          } catch (error) {
            setLoading(false)
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
        },3000)
      };
  
  

  return (
   <div className="w-full p-4">
         {/* Title Section */}
         <div className="text-center mb-4">
           <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
             <ImBook />
             Transfer Toss Coins
           </h2>
           <hr className="border-t border-gray-300 my-2" />
         </div>
   
         {/* Row Section */}
         <div className="flex items-center justify-between mb-4">
           {/* Dropdown */}
           <div className="flex-1">
             <select
               value={formValue?.selectionId}
               disabled={marketData?.[0]?.transferredTossCoin === 1}
               onChange={(e) => setFormValue(prev => ({ ...prev, selectionId: e.target.value }))}
               className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300">
               <option value="" selected disabled>Select Status</option>
               {
                 marketData?.[0]?.tossMarket?.length ?
                   marketData?.[0]?.tossMarket?.map(item => (
                     <option key={item?.selectionId} value={item?.selectionId}>{item?.runnerName}</option>
                   ))
                   : ''
               }
               <option value="ABANDONED">Abandon</option>
               <option value="TIE">Tie</option>
             </select>
           </div>
   
           {/* Button */}
           <div className="mx-4">
             <button 
             disabled={marketData?.[0]?.transferredTossCoin === 1} 
             onClick={handleTossWinnerDeclare} className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-600" >
               {marketData?.[0]?.oddsResult === 1 ? 'Re-Declare' : 'Declare Winner'}
             </button>
           </div>
   
           {/* Transfer Coins */}
           <div className="flex-1 text-right">
             {marketData?.[0]?.transferredTossCoin == 1 && marketData?.[0]?.tossResult == 1 ?
             loading ?   
              <button className="px-6 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-600 disabled:bg-gray-300 disabled:pointer-events-none disabled:text-gray-600"
                // onClick={handleTossRevertCoin}
                >
                 Loading...
               </button>:
               <button className="px-6 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-600 disabled:bg-gray-300 disabled:pointer-events-none disabled:text-gray-600"
               onClick={handleTossRevertCoin}
               >
                Revert Coins
              </button>
               :
               loading ?   
               <button className="px-6 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-600 disabled:bg-gray-300 disabled:pointer-events-none disabled:text-gray-600"
                 // onClick={handleTossRevertCoin}
                 >
                  Loading...
                </button>:
               <button disabled={marketData?.[0]?.tossResult === 0 || marketData?.[0]?.transferredTossCoin === 1} onClick={handleTossTransferCoin} className="px-6 py-2 bg-lightblue text-white font-semibold rounded hover:bg-green-600 disabled:bg-gray-300 disabled:pointer-events-none disabled:text-gray-600">
   
                 {marketData?.[0]?.transferredTossCoin === 1 ? "Coins Transferred Successfully" : 'Transfer Coins'}
               </button>
             }
           </div>
         </div>
   
         {/* Divider Line */}
         <hr className="border-t border-gray-300 mb-4" />
   
      
       </div>
  )
}

export default TossResult
