import React, { useEffect, useState } from "react"
// import PlaceBet from "../../../components/placeBet/PlaceBet"
import SportsHeading from '../../sportsHeading/SportsHeading';
import Tabs from "./tabs/Tabs"
import { formatNumber } from "../../../Utils/formatNumber"
// import BookFancyModal from "../../../components/bookFancyModal/BookFancyModal"
import { useDispatch } from "react-redux"
// import { openBookModal } from "../../../store/slices/modalSlice/modalSlice"
import { returnStatus } from "../../../Utils/returnStatus";

const FancySection = ({matchBetsData, setBetData, betData, openBets}) => {
  const [activeTab, setActiveTab] = useState('ALL')
  const [previous, setPrevious] = useState({})
  const [blink, setBlink] = useState(false)
  const [fancyTabs, setFancyTabs] = useState([])
  const [selectedFancy , setSelectedFancy] = useState('')
  const dispatch = useDispatch()

  // useEffect(()=> {
  //   const array = []
  //   if(openBets?.length) {
  //     const bookData = openBets?.filter((item) => item?.type === 'fancy')
  //     if(bookData?.length) {
  //       for (let i = 0; i < bookData.length; i++) {
  //         if(bookData[i]?.betType === 'lay' || bookData[i]?.betType === 'no' ) {
  //           console.log('**************************************', bookData[i]?.odds, bookData[i]?.type)
  //           const element = [
  //             {
  //               [Number(bookData[i]?.fancyOdds) - 5] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 4] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 3] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 2] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 1] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds)] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 1] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 2] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 3] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 4] : - bookData[i]?.potentialWin,
  //             }
  //           ];
  //           array.push(element?.[0])
  //         } else {
  //           const element = [
  //             {
  //               [Number(bookData[i]?.fancyOdds) - 5] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 4] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 3] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 2] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) - 1] : - bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds)] :  bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 1] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 2] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 3] : bookData[i]?.potentialWin,
  //               [Number(bookData[i]?.fancyOdds) + 4] : bookData[i]?.potentialWin,
  //             }
  //           ];
  //           array.push(element?.[0])
  //         }
  //       }
  //       if(array?.length) {
  //         const result = array?.reduce((acc, curr) => {
  //           Object.keys(curr).forEach(key => {
  //             acc[key] = (acc[key] || 0) + curr[key];
  //           });
  //           return acc;
  //         }, {});
  //         console.log('arrayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', result)
          
  //       }
  //     }
  //   }

  // }, [openBets])

  useEffect(() => {
    const data = structuredClone(matchBetsData?.matchfancies)
    const categorySet = new Set();

    data?.forEach(obj => {
      categorySet?.add(obj?.catagory)
    })

    const categoriesArray = ["ALL", ...categorySet];
    const mappedCategoryArray = categoriesArray?.map(item => ({title : item, value : item}))

    if(mappedCategoryArray?.length !== fancyTabs?.length) {
      setActiveTab('ALL')
    }

    setFancyTabs(mappedCategoryArray)

  }, [matchBetsData?.matchfancies])//eslint-disable-line

  
  
    useEffect(() => {
      setBlink(true);
      let timeout = setTimeout(() => {
        setBlink(false);
        setPrevious(matchBetsData?.matchfancies)
      }, 300);
  
      return () => {
        clearTimeout(timeout);
      }
    }, [matchBetsData])//eslint-disable-line

    const handleBetData = (item, type, odds)=> {
      setBetData(prev => ({
        ...prev,
        matchId : matchBetsData?._id,  
        selectionId : item?.marketId, 
        type : 'fancy', 
        betType : type,
        odds: odds,
        marketName : item?.marketName,
        marketId : matchBetsData?.marketId
      }))
    }

    const returnExposerAmount = (id) => {
      if (openBets?.length > 0) {
        let total = 0;
        const data = openBets?.filter((item) => item?.type === 'fancy')
        for (let i = 0; i < data?.length; i++) {
          if(data?.[i]?.selectionId === id) {
            if (data?.[i]?.betType === "back" || data?.[i]?.betType === "yes") {
              total += data?.[i]?.potentialWin
            } else if (data?.[i]?.betType === "lay" || data?.[i]?.betType === "no") {
              total -= data?.[i]?.potentialWin
            }
          }
        }
        if (total === 0) return 0.00
  
        else return (
          <span className={`backLayVal ${total > 0 ? 'blueVal' : 'pinkVal'}`}>{total?.toFixed(0)}</span>
        )
      }
    }

    const handleBookFancy = ()=> {
      // dispatch(openBookModal())
    }

  return (
    <>
      <div className="mt-5 bg-white">
        <div className="flex align-center justify-between bg-white pr-2">
          <div className="flex">
            <span className="hidden bg-[#067e8f] bg-[#e4550e]"></span>
            <SportsHeading title={"Fancy Bet"} background={'#067e8f'} fancyBet={true} img={'assets/img/greenShape.svg'}/>
            <SportsHeading title={"Sportsbook"} background={'#e4550e'} extraClass={'rounded-tl-md'} fancyBet={true} img={'assets/img/orangeShape.svg'}/>
          </div>
        </div>
        <div className="bg-gradient-green2 p-1 w-full flex items-center lg:justify-center">
          <div className="bg-[#ffffff80] p-1 rounded-md max-md:w-full">
            <Tabs data={fancyTabs} size={'sm'} activeTab={activeTab} setActiveTab={setActiveTab} fancyTabs={true}/>
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-[#7e97a7]">
          <div className="w-[calc(5rem_*_6)] flex justify-end pt-2 ">
            <div className="flex items-center justify-center text-xs font-semibold py-1 w-[5rem] rounded-tl-lg bg-[#faa9ba]">No</div>
            <div className="flex items-center justify-center text-xs font-semibold py-1 w-[5rem] rounded-tr-lg bg-[#72bbef]">Yes</div>
            <div className="w-[calc(5rem_*_2)] p-1 flex justify-center text-xs font-semibold max-md:hidden">
              Min/Max
            </div>
          </div>
        </div>
        {
          matchBetsData?.matchfancies?.length ? matchBetsData?.matchfancies?.map((item, pIndex) => {
            const previousOdds = previous?.[pIndex];
            const isYesBlinking = previousOdds?.runsYes !== item?.runsYes;
            const isNoBlinking = previousOdds?.runsNo !== item?.runsNo;

            if(item?.statusName === "VOIDED") return

            return (
            <React.Fragment key={item?.marketId}>
              <div className={`flex items-center justify-between border-t border-[#7e97a7] ${((activeTab !== "ALL") && (item?.catagory !== activeTab)) ? 'hidden' : ''}`}>
                <div className="px-0 sm:px-4 w-[34%]">
                  <div className="text-xs font-semibold">{item?.marketName}</div>
                  <div className="text-[0.625rem] font-semibold text-red-600">{returnExposerAmount(item?.marketId)}</div>
                </div>
                <div className="flex items-center ">
                  <div className="md:hidden relative">
                    <img src="assets/img/info.png" className="brightness-0 h-5 mr-3 peer" alt="" />
                    <div className="absolute bg-gray-100 p-2 text-xs text-medium text-nowrap right-[115%] peer-hover:block rounded top-1/2 -translate-y-1/2 hidden">
                      Min/Max : 100-1000
                    </div>
                  </div>
                  <div className="max-md:hidden">
                    <button variant="secondary" size="sm" className="flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-blue shadow hover:bg-gradient-blue-hover text-white h-8 rounded-md px-3 text-xs w-auto mr-3" onClick={()=> {
                      handleBookFancy();
                      setSelectedFancy(item?.marketId)
                    }}>Book</button>
                  </div>
                  <div className={`flex relative overflow-hidden group ${item?.statusName !== "ACTIVE" ? 'active' : ''}`}>
                    <div className="flex">
                          <div  
                            onClick={()=> handleBetData(item, 'no', item?.oddsNo)}
                            className={`${(blink && previous?.length && isNoBlinking) ? 'blink !bg-yellow-100' : ''} 
                              ${(item?.marketId === betData?.selectionId && betData?.betType === 'no') ? 'active' : ''}
                              h-[2.625rem] w-[5rem] flex flex-col items-center justify-center cursor-pointer  [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white bg-[#faa9ba]`}>
                            <div className="text-xs font-semibold text-[#212529]">{item?.runsNo}</div>
                            <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(item?.oddsNo).toFixed(2))}</div>
                          </div>
                          <div  
                            onClick={()=> handleBetData(item, 'yes', item?.oddsYes)}
                            className={`${(blink && previous?.length && isYesBlinking) ? 'blink !bg-yellow-100' : ''} 
                            ${(item?.marketId === betData?.selectionId && betData?.betType === 'yes') ? 'active' : ''}
                              h-[2.625rem] w-[5rem] flex flex-col items-center justify-center cursor-pointer  [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white bg-[#72bbef]`}>
                            <div className="text-xs font-semibold text-[#212529]">{item?.runsYes}</div>
                            <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(item?.oddsYes).toFixed(2))}</div>
                          </div>
                    </div>
                    <div className="absolute top-0 left-0 size-full items-center justify-center bg-black/20 text-xs text-gray-100 font-medium leading-[inherit] z-10 hidden group-[&.active]:flex">
                      {returnStatus(item?.statusName)}
                    </div>
                  </div>
                  <div className="w-[calc(5rem_*_2)] flex justify-center text-xs font-semibold max-md:hidden">
                    {item?.minSetting} - {item?.maxSetting}
                  </div>
                </div>
              </div>
              {/* {
                betData?.selectionId === item?.marketId ? 
                <PlaceBet betData={betData} setBetData={setBetData}/> : ''
              } */}
            </React.Fragment>
          )}) : ''
        }
      </div>
      {/* <BookFancyModal selectedFancy={selectedFancy} openBets={openBets}/> */}
    </>
  )
}

export default FancySection