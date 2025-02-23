import React, { useEffect, useState } from 'react'
import { fetchUserBook } from '../../Store/Slice/UserBookSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function BookModal({ showUser, setShowUser, userBookList, matchBetsData, book, type ,userId,setUserId }) {

  const [betList, setBetList] = useState([]);
  const [listData,setListData] = useState([]);
  const {gameId} = useParams()
  const dispatch = useDispatch();
 

  const handleClose = () => {
    setShowUser(false)
    setUserId('')
  }


  const returnExposerAmount = (sid) => {
    let total = 0;
    let wintotal = 0;
    let amounttotal = 0;
    // if (openBets?.length > 0) {
      const marketData = userBookList;
      for (let i = 0; i < marketData?.length; i++) {
        if (marketData?.[i]?.selectionId == sid) {
          if (marketData?.[i]?.type === "back") {
            console.log(marketData?.[i]?.type,'marketData?.[i]?.selectionId1')
            wintotal += marketData?.[i]?.potentialWin
          } else {
            console.log(marketData?.[i]?.type,'marketData?.[i]?.selectionId2')
            wintotal -= marketData?.[i]?.amount
          }
        } else {
          if (marketData?.[i]?.type === "back") {
            console.log(marketData?.[i]?.type,'marketData?.[i]?.selectionId3')
            amounttotal -= marketData?.[i]?.amount
          } else {
            console.log(marketData?.[i]?.type,'marketData?.[i]?.selectionId4')
            amounttotal += marketData?.[i]?.potentialWin
          }
        }

        console.log(wintotal , amounttotal,'wintotal + amounttotal123444')
      }
      total = wintotal + amounttotal
      return total
    // }
  }


  const getUserList=()=>{
    dispatch(fetchUserBook({page : 1,limit : 100,type : type,matchId : gameId}))
  }
    
  function aggregateBetsByMarket(data) {
   const userMarketAggregates = {};

     data.forEach(bet => {
        const { userId, market, amount, potentialWin } = bet;
      const userMarketKey = `${userId}_${market}`;

           if (userMarketAggregates[userMarketKey]) {
            userMarketAggregates[userMarketKey].totalAmount2 += amount;
            userMarketAggregates[userMarketKey].totalPotential2 += potentialWin;
          } else {
              userMarketAggregates[userMarketKey] = {
                totalAmount2: amount,
                totalPotential2: potentialWin
            };
        }
    });

     return Object.keys(userMarketAggregates).map(key => {
        const [userId, market] = key.split('_');
        return {
            userId,
            market,
            totalAmount2: userMarketAggregates[key].totalAmount2,
            totalPotential2: userMarketAggregates[key].totalPotential2
        };
    });
}


useEffect(() => {
  if(userBookList?.length > 0){
      const aggregatedData = aggregateBetsByMarket(userBookList);
      console.log(aggregatedData,'aggregatedData');
      setListData(aggregatedData)
    }
  }, [userBookList])

  console.log({ listData}, 'listDatalistData')
  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${showUser ? 'flex' : 'hidden'}`} style={{ backdropFilter: 'blur(4px)' }}>
        <div className="w-full md:mt-0 sm:max-w-[500px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e) => { e.stopPropagation() }} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header bg-gradient-blue text-white flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">{book == 'user' ? 'USER Book' : 'MASTER Book'}</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className="overflow-y-auto w-full">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th>UserName</th>
                      <th>Role</th>
                      <th>{matchBetsData?.matchodds?.[0]?.runnerName  ? matchBetsData?.matchodds?.[0]?.runnerName : matchBetsData?.bookmakersOdds?.[0]?.selectionName}</th>
                      <th>{matchBetsData?.matchodds?.[1]?.runnerName ? matchBetsData?.matchodds?.[1]?.runnerName : matchBetsData?.bookmakersOdds?.[1]?.selectionName}</th>
                    </tr>
                    {
                      userBookList?.length ?
                        listData?.map(item => {
                          console.log(item?.market ,'listlist')

                          return (
                            <tr key={item?._id}>
                              <td className="font-semibold p-2 border text-nowrap text-center text-lightblue" 
                              onClick={()=>{
                                if(item?.markets?.[0]?.role == 'master'){
                                  setUserId(item?.markets?.[0]?._id)
                                }else {
                                  getUserList()
                                }
                                }
                                }>
                                {item?.username}
                              </td>
                              <td className="font-semibold p-2 border text-nowrap text-center">
                                {item?.markets?.[0]?.role == 'master' ? 'MASTER' : item?.markets?.[0]?.role == 'agent' ? 'AGENT' : 'USER'}
                              </td>
                              <td className={`font-semibold p-2 border text-nowrap text-center ${ returnExposerAmount(item?.markets?.[0]?.selectionId) < 0 ? 'text-red-600' : 'text-green-500'}`}>
                              {/* {matchBetsData?.matchodds?.[0]?.runnerName == item?.ma ? matchBetsData?.matchodds?.[0]?.runnerName : matchBetsData?.bookmakersOdds?.[0]?.selectionName} */}
                              </td>
                              <td className={`font-semibold p-2 border text-nowrap text-center ${ item?.totalPotentialWin < 0 ? 'text-red-600' : 'text-green-500'}`}>
                             {item?.totalPotentialWin}
                                </td>
                              
                            </tr>
                          )
                        })
                        : ''
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookModal
