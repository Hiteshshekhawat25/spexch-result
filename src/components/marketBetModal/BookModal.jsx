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
    
  function mergeBetsByUserAndMarket(data) {
    const mergedData = {};

    console.log({data},'data')
    data.forEach(bet => {
        const { username, market, stake, profitLoss,role_name ,_id,potentialWin, selectionId} = bet;

        console.log(potentialWin,'potentialWinpotentialWinpotentialWin')
        // If the user doesn't exist in mergedData, create an entry
        if (!mergedData[username]) {
            mergedData[username] = {};
        }

        // If the market doesn't exist for this user, create an entry for it
        if (!mergedData[username][market]) {
          mergedData[username][market] = {
            totalStake: 0,
            totalProfitLoss: 0
          };
        }
        
        // Sum the stake and profitLoss for the combined user and market
        mergedData[username][market].role = role_name;
        mergedData[username][market].selectionId = selectionId;
        mergedData[username][market]._id = _id;
        mergedData[username][market].totalStake += stake;
        mergedData[username][market].totalProfitLoss += potentialWin;
      });
      
      // Convert the merged data into an array of objects

      return Object.keys(mergedData).map(username => {
        const markets = mergedData[username];
        const marketData = Object.keys(markets).map(market =>({
            market,
            totalStake: markets[market].totalStake,
            role : markets[market].role,
            _id :  markets[market]._id,
            selectionId :  markets[market].selectionId,
            totalProfitLoss: markets[market].totalProfitLoss
          }));
        
        return {
            username,
            markets: marketData
        };
    });
}

  useEffect(() => {
    if(userBookList?.length > 0){
      const list =   mergeBetsByUserAndMarket(userBookList)
      setListData(list)
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
                               {item?.market?.[0]?.market == matchBetsData?.matchodds?.[0]?.runnerName ? returnExposerAmount(item?.markets?.[0]?.selectionId) : returnExposerAmount(item?.markets?.[1]?.selectionId)}
                                    
                                {/* {type == 'odds' ? 
                                  item?.totalStakes
 
                                }
                                 ? item?.markets?.[0]?.totalStakes : '-' : matchBetsData?.bookmakersOdds?.[0]?.selectionName == item?.markets?.[0]?.market ? item?.markets?.[0]?.totalStake : '-'} */}
                              </td>
                              <td className={`font-semibold p-2 border text-nowrap text-center ${ returnExposerAmount(item?.markets?.[1]?.selectionId) < 0 ? 'text-red-600' : 'text-green-500'}`}>
                              {(item?.markets?.[0]?.market ==  matchBetsData?.matchodds?.[0]?.runnerName ) || (item?.markets?.[0]?.market ==  matchBetsData?.matchodds?.[1]?.runnerName)
                                 || (matchBetsData?.bookmakersOdds?.[1]?.selectionName  == item?.markets?.[1]?.market )
                                  ? 
                                  returnExposerAmount(item?.markets?.[1]?.selectionId) ? returnExposerAmount(item?.markets?.[1]?.selectionId)  : '0.00'
                                  :
                                  ( item?.markets?.[0]?.market ==  matchBetsData?.matchodds?.[1]?.runnerName) || (matchBetsData?.bookmakersOdds?.[1]?.selectionName  == item?.markets?.[0]?.market) 
                                  ? 
                                  returnExposerAmount(item?.markets?.[1]?.selectionId)
                                   ?
                                   returnExposerAmount(item?.markets?.[1]?.selectionId)  : '0.00'
                                    :'0.00'
                                     }
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
