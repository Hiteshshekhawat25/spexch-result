import React, { useEffect, useState } from "react"
// import PlaceBet from "../../../components/placeBet/PlaceBet"
import SportsHeading from '../../sportsHeading/SportsHeading';
import Tabs from "./tabs/Tabs"
import { formatNumber } from "../../../Utils/formatNumber"
// import BookFancyModal from "../../../components/bookFancyModal/BookFancyModal"
import { useDispatch } from "react-redux"
// import { openBookModal } from "../../../store/slices/modalSlice/modalSlice"
import { returnStatus } from "../../../Utils/returnStatus";
import BookFancyModal from "../../FancyModal/BookModalFancy";
import { getService } from '../../../Services/casinoServices';
import { useParams } from "react-router-dom";



const fancyTabsData = [
  { title: 'All', value: 'ALL' },
  { title: 'Fancy', value: 'fancy' },
  { title: 'Line Markets', value: 'line_markets' },
  { title: 'Ball by Ball', value: 'ball_by_ball' },
  { title: 'Meter Markets', value: 'meter_markets' },
  { title: 'Khado Markets', value: 'khado_markets' },
]



const FancySection = ({ matchBetsData, setBetData, betData, openBets }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [previous, setPrevious] = useState({});
  const [info , setInfo] = useState(false);
  const [i,setI] = useState();
  const { gameId } = useParams();
  const [bookData,setbookData] = useState([]);
  const [openBookModal,setOpenBookModal] = useState(false);
  const [blink, setBlink] = useState(false);
  const [fancyTabs, setFancyTabs] = useState([]);
  const [selectedFancy, setSelectedFancy] = useState('');
  const dispatch = useDispatch();

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



  // useEffect(() => {

  //   const categorySet = new Set();

  //   data?.forEach(obj => {
  //     categorySet?.add(obj?.catagory)
  //   })

  //   console.log({data:matchBetsData?.matchfancies},'categorySet')
  //   const categoriesArray = ["ALL", ...categorySet];
  //   const mappedCategoryArray = categoriesArray?.map(item => ({title : item, value : item}))

  //   if(mappedCategoryArray?.length !== fancyTabs?.length) {
  //     setActiveTab('ALL')
  //   }

  //   setFancyTabs(mappedCategoryArray)

  // }, [matchBetsData?.matchfancies])//eslint-disable-line



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

  const handleBetData = (item, type, odds) => {
    setBetData(prev => ({
      ...prev,
      matchId: matchBetsData?._id,
      selectionId: item?.marketId,
      type: 'fancy',
      betType: type,
      odds: odds,
      marketName: item?.marketName,
      marketId: matchBetsData?.marketId
    }))
  }

  const returnExposerAmount = (sid) => {
    let total = 0;
    let wintotal = 0;
    let amounttotal = 0;
    // if (openBets?.length > 0) {
      const marketData = betData?.filter((item) => item?.type === 'fancy');
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
    // }
  }


  const handleBookFancy = async(data) => {
    console.log(data,gameId,'matchIdselectionId')
    try{
      const res = await getService(`/user/get-fancy-bets?matchId=${gameId}&selectionId=${data?.marketId}`)
      setbookData(res?.data?.data)
      setOpenBookModal(true)
      console.log(res?.data?.data,'resresresresresresresres')
    }catch(error){
      console.log(error)
    }
  }

  console.log({ matchBetsData ,betData},'fancyprice')

  return (
    <>
      <div className="mt-2 bg-white">
        <div className="flex align-center justify-between bg-white pr-2">
          <div className="flex">
            <span className="hidden bg-[#067e8f] bg-[#e4550e]"></span>
            <SportsHeading title={"Fancy Bet"} background={'#067e8f'} fancyBet={true} img={'assets/img/greenShape.svg'} />
            <SportsHeading title={"Sportsbook"} background={'#e4550e'} extraClass={'rounded-tl-md'} fancyBet={true} img={'assets/img/orangeShape.svg'} />
          </div>
        </div>
        <div className="bg-gradient-green2 p-1 w-full flex items-center lg:justify-center">
          <div className=" p-1 rounded-md max-md:w-full overflow-auto">
            <Tabs data={fancyTabsData} size={'sm'} activeTab={activeTab} setActiveTab={setActiveTab} fancyTabs={true} />
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-[#7e97a7]">
          <div className="w-[calc(5rem_*_6)] flex justify-end pt-2 ">
            <div className="flex items-center justify-center text-xs font-semibold py-1 md:w-[5rem] w-[3rem] rounded-tl-lg bg-[#faa9ba]">No</div>
            <div className="flex items-center justify-center text-xs font-semibold py-1 md:w-[5rem] w-[3rem] rounded-tr-lg bg-[#72bbef]">Yes</div>
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
            console.log(betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName !== item?.marketName )?.[0],betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.marketName )?.[0],'betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.marketName )?.[0]')
              let p1 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName !== item?.marketName )?.[0]
              let p2 = betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.marketName )?.[0]
              let price = (p2?.totalPotentialWin ?  p2?.totalPotentialWin : 0) -(p1?.totalAmount ? p1?.totalAmount : 0) 


            if (item?.statusName === "VOIDED") return

            return (
              <React.Fragment key={item?.marketId}>
                <div className={`flex items-center justify-between border-t border-[#7e97a7] ${((activeTab !== "ALL") && (item?.catagory !== activeTab)) ? 'hidden' : ''}`}>
                  <div className="md:px-4 px-1">
                    <div className="text-xs font-semibold">{item?.marketName}</div>
                    <div className="text-[0.625rem] font-semibold text-red-600">{betData?.[0]?.betTypesGrouped?.filter((itm)=>itm?.marketName == item?.marketName )?.length ? returnExposerAmount(item?.marketId)?.toFixed(2) || 0 : 0}</div>
                  </div>
                  <div className="flex items-center ">
                    {/* <div className="md:hidden relative">
                     {info && pIndex == i ? 
                      <div className="" onClick={()=>{
                        setI('')
                        setInfo(false)
                        }}>
                      <svg _ngcontent-ng-c1703479958="" xmlns="http://www.w3.org/2000/svg" width="9" height="9">
                      <path _ngcontent-ng-c1703479958="" fill="currentColor" fill-rule="evenodd" d="M9 .912L5.412 4.5 9 8.088 8.088 9 4.5 5.412.912 9 0 8.088 3.588 4.5 0 .912.912 0 4.5 3.588 8.088 0z"></path>
                      </svg>
                      </div>
                      :
                      <img src="assets/img/info.png" className="brightness-0 md:h-5 h-4 md:mr-3 " alt=""
                       onClick={()=>{
                        setInfo(true)
                        setI(pIndex)
                      }}/>
                     }
                      {(info && i == pIndex) &&
                       <div className="absolute bg-gray-100 p-2 text-xs text-medium text-nowrap right-[115%]  rounded top-1/2 -translate-y-1/2 block md:hidden">
                        Min/Max : 100-1000
                      </div>}
                    </div> */}
                    <div className="">
                      <button variant="secondary" size="sm" className="flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-blue shadow hover:bg-gradient-blue-hover text-white h-8 rounded-md px-3 text-xs w-auto mr-3" onClick={() => {
                        handleBookFancy(item);
                        setSelectedFancy(item?.marketName)
                      }}>Book</button>
                    </div>
                    <div className={`flex relative overflow-hidden group ${item?.statusName !== "ACTIVE" ? 'active' : ''}`}>
                      <div className="flex">
                        <div
                          onClick={() => handleBetData(item, 'no', item?.oddsNo)}
                          className={`${(blink && previous?.length && isNoBlinking) ? 'blink !bg-yellow-100' : ''} 
                              ${(item?.marketId === betData?.selectionId && betData?.betType === 'no') ? 'active' : ''}
                              h-[2.625rem] md:w-[5rem] w-[3rem] flex flex-col items-center justify-center cursor-pointer  [&.active]:bg-[#f4496d] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white bg-[#faa9ba]`}>
                          <div className="text-xs font-semibold text-[#212529]">{item?.runsNo}</div>
                          <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(item?.oddsNo).toFixed(2))}</div>
                        </div>
                        <div
                          onClick={() => handleBetData(item, 'yes', item?.oddsYes)}
                          className={`${(blink && previous?.length && isYesBlinking) ? 'blink !bg-yellow-100' : ''} 
                            ${(item?.marketId === betData?.selectionId && betData?.betType === 'yes') ? 'active' : ''}
                              h-[2.625rem] md:w-[5rem] w-[3rem] flex flex-col items-center justify-center cursor-pointer  [&.active]:bg-[#1a8ee1] [&.active]:shadow-[inset_0_1px_3px_#0000007f] [&.active]:text-white bg-[#72bbef]`}>
                          <div className="text-xs font-semibold text-[#212529]">{item?.runsYes}</div>
                          <div className="text-[0.688rem] text-[#212529]">{formatNumber(Number(item?.oddsYes).toFixed(2))}</div>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 size-full items-center justify-center bg-black/20 text-xs text-gray-100 font-medium leading-[inherit] z-10 hidden group-[&.active]:flex">
                        {returnStatus(item?.statusName)}
                      </div>
                    </div>
                    <div className="w-[calc(5rem_*_2)] flex justify-center text-xs font-semibold max-md:hidden">
                      {matchBetsData?.sessionMinStake} - {matchBetsData?.sessionMaxStake}
                    </div>
                  </div>
                </div>
                {/* {
                betData?.selectionId === item?.marketId ? 
                <PlaceBet betData={betData} setBetData={setBetData}/> : ''
              } */}
              </React.Fragment>
            )
          }) : ''
        }
      </div>
      <BookFancyModal 
      selectedFancy={selectedFancy} 
      matchBetsData={matchBetsData} 
      bookData={bookData}
      openBets={betData} 
      show={openBookModal} 
      setShow={setOpenBookModal}/>
    </>
  )
}

export default FancySection