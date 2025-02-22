import React, { useState } from 'react'
import SportsHeading from '../../components/sportsHeading/SportsHeading'
// import PlaceBet from '../../../components/placeBet/PlaceBet'

function TossSection({matchBetsData,setBetData,betData,openBets}) {
    const [selectionId,setSelectionId] = useState('')


    const returnExposerAmount = (sid) => {
      let total = 0;
      let wintotal = 0;
      let amounttotal = 0;
      if (betData?.length > 0) {
        const marketData = betData?.filter((item) => item?.type === 'toss');
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
  

    const handleBetData = (item, elem, type, index,i)=> {
      setSelectionId(item?.selectionId)
  
      setBetData(prev => ({
        ...prev,
        matchId : matchBetsData?._id,  
        selectionId : item?.selectionId, 
        type : 'toss', 
        betType : 'back',
        odds : elem?.odds,
        index : i ,
        marketName : item?.runnerName,
        marketId : matchBetsData?.marketId,
        // max: matchBetsData?.oddsMaxStake,
        // min: matchBetsData?.oddsMinStake
      }))
    }
    
    console.log({matchBetsData},'TossSection')
  return (
    <div>
        <div className="flex align-center justify-between bg-white pr-2 flex-wrap">
          <SportsHeading title={'Which Team Will Win The Toss'}/>
          <div className=" text-[13px] hidden sm:text-sm md:text-xs  sm:flex gap-1 items-center">
            Matched 
            <span className="font-semibold">€ 170.5 K</span>
          </div>
        </div>
        <div className='flex py-1'>
            {matchBetsData?.tossMarket?.map((item,index)=>(
            <div 
            className={`bg-gradient-to-${index == 1 ? 'r' : 'l'} flex max-h-[75.5px] max-w-[460.5px]  flex-col justify-center items-center p-3  from-green-100 w-full to-green-300`} 
            onClick={()=>{
              handleBetData(item, item)
            }}
            >
               <p className='font-bold text-[12px]'> {item.runnerName}</p>
                <div className='flex flex-col border max-h-[42.5px] max-w-[125px] border-white px-6 md:px-12 py-1 bg-green-300'>
                <p className='font-bold text-[12px]'> {item.odds}</p>
                <small className='text-[12px] '>{item.price}M</small>
                </div>
                <small className={`${returnExposerAmount(item?.selectionId) < 0 ? 'text-red-500' : 'text-green-800'} font-bold`}>{returnExposerAmount(item?.selectionId)}</small>
            </div>
            ))}
        
        </div>
          
    </div>
  )
}

export default TossSection


