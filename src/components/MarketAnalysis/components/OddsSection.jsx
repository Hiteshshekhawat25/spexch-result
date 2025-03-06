import React, { useEffect, useState } from 'react'
// import PlaceBet from '../../../components/placeBet/PlaceBet'
import { formatNumber } from '../../../Utils/formatNumber'
import { returnStatus } from "../../../Utils/returnStatus";
import { v4 as uuidv4 } from 'uuid';
import SportsHeading from '../../sportsHeading/SportsHeading';

const OddsSection = ({matchBetsData, betData, setBetData, openBets}) => {
  const [previous, setPrevious] = useState({})
  const [blink, setBlink] = useState(false)
  const [profit, setProfit] = useState(0)

  useEffect(() => {
    setBlink(true);
    let timeout = setTimeout(() => {
      setBlink(false);
      setPrevious(matchBetsData?.matchodds)
    }, 300);

    return () => {
      clearTimeout(timeout);
    }
  }, [matchBetsData])//eslint-disable-line

  useEffect(()=> {
    if(betData?.odds && betData?.stake) {
      if(betData?.betType === 'back') {
        setProfit((betData?.odds * betData?.stake) - betData?.stake);
      } else {
        setProfit(betData?.stake * (betData?.odds - 1))
      }
    }
  }, [betData?.odds, betData?.stake])




  const handleBetData = (item, elem, type, index)=> {
    setBetData(prev => ({
      ...prev,
      matchId : matchBetsData?._id,  
      selectionId : item?.selectionId, 
      type : 'odds', 
      betType : type,
      odds: elem?.price,
      index : index,
      marketName : item?.runnerName,
      marketId : matchBetsData?.marketId
    }))
  }


  const returnExposerAmount = (sid) => {
    let total = 0;
    let wintotal = 0;
    let amounttotal = 0;
    // if (openBets?.length > 0) {
      const marketData = betData?.filter((item) => item?.type === 'odds');
      for (let i = 0; i < marketData?.length; i++) {
        if (marketData?.[i]?.selectionId == sid) {
          console.log(marketData?.[i]?.potentialWin,'marketData?.[i]?.potentialWin')
          if (marketData?.[i]?.betType === "back") {
            wintotal -= marketData?.[i]?.potentialWin
          } else {
            wintotal += marketData?.[i]?.amount
          }
        } else {
          console.log(marketData?.[i]?.amount,'marketData?.[i]?.amount')
          if (marketData?.[i]?.betType === "back") {
            amounttotal += marketData?.[i]?.amount
          } else {
            amounttotal -= marketData?.[i]?.potentialWin
          }
        }
      }
      console.log(wintotal , amounttotal,'wintotal + amounttotal55555555555555')
      total = wintotal + amounttotal
      return total
    // }
  }





  console.log(betData,'matchBetsData123')

  return (
    <>
      <div className=" bg-white shadow-md overflow-hidden rounded-md">
        <div className="flex align-center justify-between bg-white pr-2 flex-wrap">
          <SportsHeading title={'Match Odds'}/>
          
          <div className="text-xs  flex gap-1 items-center">
            Matched 
            <span className="font-semibold">€ 170.5 K</span>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-[#7e97a7]">
          <div className="md:w-[calc(5rem_*_6)] flex justify-end pt-2 max-md:flex-row-reverse">
            <div className="flex">
              <div className="flex items-center justify-center text-xs font-bold py-1 w-[4rem] sm:w-[5rem] bg-[#72bbef] rounded-tl-lg">Back</div>
              <div className="flex items-center justify-center  text-xs font-bold py-1 w-[4rem] sm:w-[5rem] bg-[#faa9ba] rounded-tr-lg">Lay</div>
            </div>
            <div className="w-[calc(5rem_*_2)] p-1">
              <div className="flex items-center justify-center gap-1 bg-[#bed5d8] text-[0.625rem] font-medium h-5 px-3 rounded-sm">
                <span>Min/Max</span>
                <span>100-1000</span>
              </div>
            </div>
          </div>
        </div>
        {
          matchBetsData?.matchodds?.length ? matchBetsData?.matchodds?.sort((a,b)=>a.runnerName?.localeCompare(b?.runnerName))?.map((item,pIndex) => {
              let exposerval = returnExposerAmount(item?.selectionId)?.toFixed(0)
              let p1 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName !== item?.runnerName )?.[0]
              let p2 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.runnerName )?.[0]
              let price = (p2?.totalPotentialWin ?  p2?.totalPotentialWin : 0) -(p1?.totalAmount ? p1?.totalAmount : 0) 

              console.log(item?.selectionId,'priceOdds')
            if (item?.runnerName) return (
            <React.Fragment key={`${item?.selectionId}`}>
              <div className="flex items-center justify-between border-t border-[#7e97a7]">
                <div className="md:px-4 px-3">
                  <div className="text-xs font-semibold">{item?.runnerName}</div>
                  <div className={`text-[0.625rem] font-semibold ${returnExposerAmount(item?.selectionId) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {returnExposerAmount(item?.selectionId)?.toFixed(0)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-semibold">
                      {
                        betData?.type === 'odds' ?
                        exposerval ? <>
                            <span >
                              {betData?.selectionId === item?.selectionId ? (
                                <>
                                  {betData?.stake && (betData?.betType === "back" ?
                                    <span className={(Number(exposerval) + Number(profit?.toFixed(0))) > 0 ? "text-green-700" : "text-red-700"} >
                                      {Number(exposerval) + Number(profit?.toFixed(0))}
                                    </span> :
                                    <span className={(Number(exposerval) - Number(profit?.toFixed(0))) > 0 ? "text-green-700" : "text-red-700"} >
                                      {Number(exposerval) - Number(profit?.toFixed(0))}
                                    </span>)}
                                </>
                              ) : (
                                <>
                                  {betData?.stake && (betData?.betType === "back" ?
                                    <span className={(Number(exposerval) - Number(betData?.stake)) > 0 ? "text-green-700" : "text-red-700"} >
                                      {(Number(exposerval) - Number(betData?.stake))?.toFixed(0)}
                                    </span> :
                                    <span className={(Number(exposerval) + Number(betData?.stake)) > 0 ? "text-green-700" : "text-red-700"} >
                                      {(Number(exposerval) + Number(betData?.stake))?.toFixed(0)}
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
                                    ? `- ${betData?.stake?.toFixed(0)}`
                                    : `+ ${betData?.stake?.toFixed(0)}`)}
                                </span>
                              )}
                            </span>
                        </> : ''
                      }
                  </div>
                  <div className={`flex relative overflow-hidden group ${item?.status !== "ACTIVE" ? 'active' : ''}`}>
                    <div className="flex justify-center overfl">
                    {
                      item?.ex?.availableToBack?.length
                        ? [...item.ex.availableToBack].reverse().map((elem, index) => {
                            const reversedPrevious = previous?.[pIndex]?.ex?.availableToBack
                              ? [...previous[pIndex].ex.availableToBack].reverse()
                              : [];

                            const previousPrice = reversedPrevious?.[index]?.price;
                            const isBlinking = blink && previous?.length && previousPrice !== elem?.price;

                            return (
                              <div
                                // key={elem?.price}
                                key={uuidv4()}
                                onClick={()=> {
                                  // if(index === 2) {
                                    handleBetData(item, elem, 'back', index)
                                  // } else return
                                }}
                                className={`${
                                  isBlinking ? 'blink !bg-yellow-100' : ''
                                } h-[2.625rem] w-[4rem] sm:w-[5rem]  flex flex-col items-center justify-center max-md:first:hidden max-md:[&:nth-child(2)]:hidden max-md:[&:nth-child(5)]:hidden max-md:last:hidden ${
                                  (betData?.selectionId === item?.selectionId && betData?.betType === 'back' && betData?.index === index) ? 'active' : ''
                                } ${
                                  index === 0
                                    ? 'bg-[#d7e8f4] cursor-pointer [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                    : index === 1
                                    ? 'bg-[#b7d5eb] cursor-pointer [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                    : index === 2
                                    ? 'bg-[#72bbef] cursor-pointer [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                    : ''
                                }`}
                              >
                                <div className="text-xs font-bold text-[#212529]">{elem?.price}</div>
                                <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(elem?.size).toFixed(2))}</div>
                              </div>
                            );
                          })
                        : ''
                    }
                    {
                      item?.ex?.availableToLay?.length
                        ? item?.ex?.availableToLay.map((elem, index) => {
                            const previousLay = previous?.[pIndex]?.ex?.availableToLay?.[index];
                            const isBlinking =
                              blink && previousLay?.price !== elem?.price;
                            return (
                              <div
                                // key={elem?.price}
                                key={uuidv4()}
                                onClick={()=> {
                                  // if(index === 0) {
                                    handleBetData(item, elem, 'lay', index)
                                  // } else return
                                }}
                                className={`${isBlinking ? 'blink !bg-yellow-100' : ''} 
                                            h-[2.625rem] w-[4rem] sm:w-[5rem]  flex flex-col items-center justify-center 
                                            max-md:first:hidden max-md:[&:nth-child(2)]:hidden 
                                            max-md:[&:nth-child(5)]:hidden max-md:last:hidden 
                                            ${(betData?.selectionId === item?.selectionId && betData?.betType === 'lay' && betData?.index === index) ? 'active' : ''} 
                                            ${
                                              index === 0
                                                ? 'bg-[#faa9ba] cursor-pointer [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                                : index === 1
                                                ? 'bg-[#efd3d9] cursor-pointer [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                                : index === 2
                                                ? 'bg-[#f6e6ea] cursor-pointer [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white'
                                                : ''
                                            }`}
                              >
                                <div className="text-xs font-bold text-[#212529]">{elem?.price}</div>
                                <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(elem?.size).toFixed(2))}</div>
                              </div>
                            );
                          })
                        : ''
                    }
                    </div>
                    <div className="absolute top-0 left-0 size-full hidden uppercase group-[&.active]:flex items-center justify-center bg-black/40 text-xs text-gray-100 font-medium leading-[inherit] z-10">
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
          ) }) : ''
        }
      </div>
    </>
  )
}

export default OddsSection