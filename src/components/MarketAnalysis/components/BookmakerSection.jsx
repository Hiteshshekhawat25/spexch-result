import React, { useEffect, useState } from "react"
// import PlaceBet from "../../../components/placeBet/PlaceBet"
import SportsHeading from '../../sportsHeading/SportsHeading';
import { returnStatus } from "../../../Utils/returnStatus";
import { v4 as uuidv4 } from 'uuid';

const BookmakerSection = ({matchBetsData, setBetData, betData, openBets}) => {
    const [previous, setPrevious] = useState({})
    const [blink, setBlink] = useState(false)
  const [profit, setProfit] = useState(0)
  
    useEffect(() => {
      setBlink(true);
      let timeout = setTimeout(() => {
        setBlink(false);
        setPrevious(matchBetsData?.bookmakersOdds)
      }, 300);
  
      return () => {
        clearTimeout(timeout);
      }
    }, [matchBetsData])//eslint-disable-line

    useEffect(()=> {
      if(betData?.odds && betData?.stake) {
        setProfit((betData?.odds * betData?.stake) / 100)
      }
    }, [betData?.odds, betData?.stake])


    const handleBetData = (item, elem, type, odds, index)=> {
      setBetData(prev => ({
        ...prev,
        matchId : matchBetsData?._id,  
        selectionId : item?.selectionId, 
        type : 'bookmakers', 
        betType : type,
        odds: odds,
        index : index,
        marketName : item?.selectionName,
        marketId : matchBetsData?.marketId
      }))
    }

    const returnExposerAmount = (sid) => {
      let total = 0;
      let wintotal = 0;
      let amounttotal = 0;
      if (openBets?.length > 0) {
        const marketData = openBets?.filter((item) => item?.type === 'bookmakers');
        for (let i = 0; i < marketData?.length; i++) {
          if (marketData?.[i]?.selectionId == sid) {
            if (marketData?.[i]?.betType === "back") {
              wintotal += marketData?.[i]?.potentialWin
            } else {
              wintotal -= marketData?.[i]?.amount
            }
          } else {
            if (marketData?.[i]?.betType === "back") {
              amounttotal -= marketData?.[i]?.amount
            } else {
              amounttotal += marketData?.[i]?.potentialWin
            }
  
          }
        }
        total = wintotal + amounttotal
        return total
      }
    }

  return (
    <>
      <div className="bg-white shadow-md overflow-hidden rounded-md">
        <div className="flex align-center justify-between bg-white pr-2 flex-wrap gap-2 sm:pb-0 pb-2">
          <SportsHeading title={"Bookmaker "}/>
          <div className="text-xs flex gap-1 sm:pl-0 pl-2 items-center">
            Matched 
            <span className="font-semibold">€ 170.5 K</span>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-[#7e97a7] bg-[#faf8d8]">
          <div className="w-[calc(5rem_*_6)] flex justify-end pt-2 ">
          <div className="flex items-center justify-center text-xs font-semibold py-1 w-[3rem] sm:w-[5rem] rounded-tl-lg">Back</div>
          <div className="flex items-center justify-center text-xs font-semibold py-1 w-[3rem] sm:w-[5rem] rounded-tr-lg">Lay</div>
          <div className="w-[calc(5rem_*_2)] p-1 max-md:hidden"></div>
          </div>
        </div>
        {
          matchBetsData?.bookmakersOdds?.length ? matchBetsData?.bookmakersOdds?.sort((a,b)=>a.selectionName?.localeCompare(b?.selectionName))?.map((item, pIndex) => {
            let exposerval = returnExposerAmount(item?.selectionId)
            let p1 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName !== item?.selectionName )?.[0]
            let p2 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.selectionName )?.[0]
            let price =  (p2?.totalPotentialWin ?  p2?.totalPotentialWin : 0) -(p1?.totalAmount ? p1?.totalAmount : 0) 

            console.log((p1?.totalAmount ? p1?.totalAmount : 0) - (p2?.totalPotentialWin ?  p2?.totalPotentialWin : 0),'bookprice')
            return ( 
            <React.Fragment key={item?.selectionId}>
              <div className="flex items-center justify-between border-t border-[#7e97a7] bg-[#faf8d8]">
                <div className="md:px-4 px-3">
                  <div className="text-xs font-semibold">{item?.selectionName}</div>
                  <div className={`text-[0.625rem] font-semibold ${price > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {price?.toFixed(2) || '0'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold">
                        {
                          betData?.type === 'bookmakers' ?
                          exposerval ? <>
                              <span >
                                {betData?.selectionId === item?.selectionId ? (
                                  <>
                                    {betData?.stake && (betData?.betType === "back" ?
                                      <span className={(exposerval + Number(profit?.toFixed(0))) > 0 ? "text-green-700" : "text-red-700"} >
                                        {exposerval + Number(profit?.toFixed(0))}
                                      </span> :
                                      <span className={(exposerval - Number(profit?.toFixed(0))) > 0 ? "text-green-700" : "text-red-700"} >
                                        {exposerval - Number(profit?.toFixed(0))}
                                      </span>)}
                                  </>
                                ) : (
                                  <>
                                    {betData?.stake && (betData?.betType === "back" ?
                                      <span className={(exposerval - betData?.stake) > 0 ? "text-green-700" : "text-red-700"} >
                                        {exposerval - betData?.stake}
                                      </span> :
                                      <span className={(exposerval + betData?.stake) > 0 ? "text-green-700" : "text-red-700"} >
                                        {exposerval + betData?.stake}
                                      </span>)}
                                  </>
                                )}
                              </span>
                          </> : <>
                              <span >
                                {betData?.selectionId === item?.selectionId ? (
                                  <span className={betData?.betType === "back" ? "text-yellow-700" : "text-red-700"} >
                                    {betData?.stake && (betData?.betType === "back"
                                      ? `+ ${profit.toFixed(2)}`
                                      : `- ${profit?.toFixed(2)}`)}
                                  </span>
                                ) : (
                                  <span className={betData?.betType !== "back" ? "text-green-700" : "text-red-700"} >
                                    {betData?.stake && (betData?.betType === "back"
                                      ? `- ${betData?.stake}`
                                      : `+ ${betData?.stake}`)}
                                  </span>
                                )}
                              </span>
                          </> : ''
                        }
                  </div>
                  <div className={`flex relative overflow-hidden group ${item?.selectionStatus !== "ACTIVE" ? 'active' : ''}`}>
                    <div className="flex">
                      {
                        [1,2,3]?.map((elem, index) => { 
                          const previousOdds = previous?.[pIndex]?.backOdds;
                          const isBlinking = blink && previous?.length && previousOdds !== item?.backOdds;
                          return (
                          <div 
                            // key={`yyy-${elem}`} 
                            key={uuidv4()}
                            onClick={()=> {
                              if(index === 2) {
                                handleBetData(item, elem, 'back', item?.backOdds, index)
                              } else return
                            }}
                            className={`${(isBlinking && index === 2)?  'blink !bg-yellow-100' : ''} h-[2.625rem] w-[3rem] sm:w-[5rem] flex flex-col items-center justify-center max-md:first:hidden max-md:[&:nth-child(2)]:hidden max-md:[&:nth-child(5)]:hidden max-md:last:hidden  [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white
                              ${(betData?.selectionId === item?.selectionId && betData?.betType === 'back' && betData?.index === index) ? 'active' : ''} 
                              ${index === 0 ? 'bg-[#d7e8f4]' : 
                              index === 1 ? 'bg-[#b7d5eb]' :
                              index === 2 ? 'bg-[#72bbef] cursor-pointer relative before:absolute before:w-[90%] before:h-[90%] before:top-1/2 before:left-1/2 before:border before:border-white before:-translate-x-1/2 before:-translate-y-1/2 before:rounded' :
                              ''}`}>
                            <div className="text-xs font-bold text-[#212529]">{item?.backOdds}</div>
                            <div className="text-[0.688rem] text-[#212529]">100.42</div>
                          </div>
                        )})
                      }
                      {
                        [1,2,3]?.map((elem, index) => {
                          const previousOdds = previous?.[pIndex]?.layOdds;
                          const isBlinking = blink && previous?.length && previousOdds !== item?.layOdds;
                          return (
                          <div 
                            // key={`yyy-${elem}`} 
                            key={uuidv4()}
                            onClick={()=> {
                              if(index === 0) {
                                handleBetData(item, elem, 'lay', item?.layOdds, index)
                              } else return
                            }}
                            className={`${(isBlinking && index === 0)?  'blink !bg-yellow-100' : ''} h-[2.625rem] w-[3rem] sm:w-[5rem] flex flex-col items-center justify-center max-md:first:hidden max-md:[&:nth-child(2)]:hidden max-md:[&:nth-child(5)]:hidden max-md:last:hidden  [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white 
                              ${(betData?.selectionId === item?.selectionId && betData?.betType === 'lay' && betData?.index === index) ? 'active' : ''} 
                              ${index === 0 ? 'bg-[#faa9ba] cursor-pointer relative before:absolute before:w-[90%] before:h-[90%] before:top-1/2 before:left-1/2 before:border before:border-white before:-translate-x-1/2 before:-translate-y-1/2 before:rounded' 
                              : index === 1 ? 'bg-[#efd3d9]' 
                              : index === 2 ? 'bg-[#f6e6ea]' 
                              : ''}`}>
                            <div className="text-xs font-bold text-[#212529]">{item?.layOdds}</div>
                            <div className="text-[0.688rem] text-[#212529]">100.42</div>
                          </div>
                        )})
                      }
                    </div>
                    <div className="absolute top-0 left-0 size-full items-center justify-center bg-black/40 text-xs text-gray-100 font-medium leading-[inherit] z-10 hidden group-[&.active]:flex">
                      {returnStatus(item?.selectionStatus)}
                    </div>
                  </div>
                </div>
              </div>
              {/* {
                betData?.selectionId === item?.selectionId ? 
                <PlaceBet betData={betData} setBetData={setBetData}/> : ''
              } */}
            </React.Fragment>
          )}) : ''
        }
      </div>
    </>
  )
}

export default BookmakerSection