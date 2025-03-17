import { useEffect, useRef, useState } from "react"
import OddsSection from "./components/OddsSection"
import BookmakerSection from "./components/BookmakerSection"
import FancySection from "./components/FancySection"
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
// import { setMatchId } from "../../store/slices/betSlice/OpenBetsSlice"
// import { fetchTvUrl } from "../../store/slices/tvUrl/TvUrlSlice"
import MobileStream from "./components/MobileStream"
import { socket } from "../../Services/socket"
import { SOCKET_ROUTES } from "../../Constant/Api"
import MarketBetModal from "../marketBetModal/MarketBetModal"
import { fetchMarketBets } from "../../Store/Slice/marketBetsSlice"
import UserHistoryModal from "../marketBetModal/UserHistoryModal"
import BookModal from "../marketBetModal/BookModal"
import { fetchUserBook } from "../../Store/Slice/UserBookSlice"
import MarketListModal from "../marketBetModal/MarketListModal"
import { fetchmasterBook } from "../../Store/Slice/masterListSlice"
import TossSection from "../toss/TossSecttion"
import moment from "moment"
import { postInstance } from "../../Services/Newmatchapi"

const MarketAnalysisInner = () => {
  const [matchBetsData, setMatchBetsData] = useState({});
  const [showLiveStreaming, setShowLiveStreaming] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [showBetsModal, setShowBetsModal] = useState(false)
  const [activeOdds, setActiveOdds] = useState('all')
  const userDetails = useSelector((state) => state?.user?.userData?.data)
  const masterBook = useSelector((state) => state?.masterBook?.data)
  const [liveBets, setLiveBets] = useState(false)
  const [books, setbooks] = useState('');
  const infiniteLoadRef = useRef();
  const [marketListModal, setMarketListModal] = useState(false);
  const [type, setType] = useState('')
  const [partnershipBook, setPartnershipBook] = useState(false)
  const [betData, setBetData] = useState({
    stake: 0,
    matchId: '',
    selectionId: '',
    type: '',
    betType: '',
    odds: '',
    marketName: '',
    index: '',
    marketId: '',
  })
  const { gameId } = useParams()
  const dispatch = useDispatch()
  const openBets = useSelector(state => state?.openBets)
  const betList = useSelector(state => state?.marketBetList)
  const [checkbox,setCheckbox] = useState(false);
  const [loading,setLoading] = useState(false)
  const [loading2,setLoading2] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const iframeRef = useRef()
  const [searchTerm, setSearchTerm] = useState("");
  const intervalRef = useRef();
  const { data: backBets } = useSelector(state => state?.marketBetList)
  const [listData, setListData] = useState([]);
  const { data: userBooks } = useSelector(state => state?.userBookList)
  const [showUser, setShowUser] = useState(false)
  const socketRef = useRef();
  const [pages, setPages] = useState({
    userPage: 1,
    masterPage: 1,
    viewBet: 1
  })
  const [selectedUser, setSelectedUser] = useState({})
  const [search,setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [showUserBook, setShowUserBook] = useState(false)
  const [fanyBets, setFancyBets] = useState({})



  const check = (enteries) => {
    const [entry] = enteries
    const data = structuredClone(backBets?.data);
    if ((entry.isIntersecting == true) && (data?.length >= 10) ) {
      setPages((pre) => ({ ...pre, viewBet: pages.viewBet + 1 }))
    }
  }
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.mozRequestFullScreen) {
        iframeRef.current.mozRequestFullScreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
    }
  };

  // useEffect(() => {
  //   socket.connect()
  //   socket.emit(SOCKET_ROUTES.JOIN_MATCH, { matchId: gameId });

  //   const matchUpdateListener = (data) => {
  //     console.log({ data }, 'data')
  //     setMatchBetsData(data);
  //     setFancyBets(data)
  //   };
  //   socket.on(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);

  //   return () => {
  //     socket.off(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);
  //     socket.disconnect();
  //   };
  // }, [gameId]);


  useEffect(() => {
    if(!socket.connect().id){
      socket.connect();
    }

   socket.emit(SOCKET_ROUTES.JOIN_MATCH, { matchId: gameId });

  const matchUpdateListener = (data) => {
    setMatchBetsData(data);
    setFancyBets(data);
  };
  
  socket.on(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);

   const reconnectSocket = (el) => {
    // alert('Socket disconnected, attempting to reconnect...');
    if(!socket.connect().id){
    socket.connect();
    }
    socket.emit(SOCKET_ROUTES.JOIN_MATCH, { matchId: gameId })
    socket.on(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener)
  };
  
  // socket.on('disconnect', ()=>reconnectSocket("1"));
  
  const handleVisibilityChange = () => {
    if (document.visibilityState == 'visible') {
      reconnectSocket('4'); 
    }else{
      socket.disconnect()
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    socket.off('disconnect', ()=>reconnectSocket("2"));
    socket.disconnect();
    socket.off(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
     clearInterval(socketRef.current);
  };
}, [gameId]); 


  const [cached, setCached] = useState({});
  const [isCached, setIsCached] = useState(false);
  const [counter, setCounter] = useState(0);
  const [statusSuspend, setStatusSuspend] = useState('')
  const counterRef = useRef();

  useEffect(() => {
    if (fanyBets?.matchfancies?.length === 0) {
      if (counter >= 20) {
        setStatusSuspend('SUSPEND')
      }
      setIsCached(true);
    } else {
      if (fanyBets?.matchfancies?.length > 0) {
        setCached(fanyBets);
        setStatusSuspend('')
      }
      setIsCached(false);
    }
  }, [counter, fanyBets?.matchfancies])


  const arrayFunction=()=>{
    if(listData?.length > 0){
      return listData
    }else if(backBets?.data?.length > 0){
      return backBets?.data
    }else{
      return []
    }
  }

  useEffect(() => {
    if (fanyBets?.matchfancies?.length === 0 && counter < 60 && isCached) {
      counterRef.current = setInterval(() => {
        setCounter(prev => prev + 1)
      }, 1000)
      return () => clearInterval(counterRef.current)
    }
  }, [isCached]);

  // useEffect(() => {
  //   let timer ;
  //   if(gameId && liveBets && search == ''){
  //        timer = setInterval(() => {
  //         dispatch(fetchMarketBets({ page: pages.userPage,matchId: gameId,search}))
  //       }, 5000);
      
  //   }
  //   return ()=>clearInterval(timer)
  // }, [liveBets,gameId,pages.viewBet,search,backBets?.data?.length])

  useEffect(()=>{
    if(gameId){
      dispatch(fetchMarketBets({ page: pages.userPage,matchId: gameId,searchTerm,search}))
    }
  },[gameId,liveBets,searchTerm,search])

  useEffect(() => {
    if (showUserBook) {
      dispatch(fetchUserBook({ page: 1, limit: 100, type: type, matchId: gameId }))
    }
  }, [showUserBook])

  useEffect(() => {
    if (showUserBook) {
      let uid = userDetails?.role_name == 'super-admin' ? '' : userDetails?._id
      dispatch(fetchmasterBook({ page: 1, limit: 100, type: type, masterId: userId ? userId : uid  ,matchId : gameId}))
    }
  }, [showUserBook, userId])

  useEffect(() => {
    const total = backBets?.pagination?.totalChildrenCount
    if (backBets?.pagination?.totalPages > 1) {
      if (backBets?.data?.length && (listData?.length + backBets?.data?.length) <= total) {
        setListData([...listData, ...backBets?.data])
      }
    }
  }, [currentPage, backBets?.data?.length])

  const SetStakeLimit =async()=>{
    try{
      setLoading(true)
      const res = await postInstance(`/match/updatematchStake?matchId=${gameId}`,
        { maxStake:0,
        oddsOnly:checkbox
      })
      setLoading(false)
     }catch(error){
      setLoading(false)
     }
  }


  const RevertStakeLimit =async()=>{
    try{
      setLoading2(true)
      const res = await postInstance(`/match/restoreMatchStake?matchId=${gameId}`,
        { 
          oddsOnly:checkbox
      })
      setLoading2(false)
     }catch(error){
      setLoading2(false)
     }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(check, options)
    if (infiniteLoadRef.current) observer.observe(infiniteLoadRef.current)

    return () => {
      if (infiniteLoadRef.current) observer.unobserve(infiniteLoadRef.current)
    }
  }, [backBets?.data?.length,infiniteLoadRef.current])

  console.log(checkbox,'checkbox')
 
  return (
    <>
      <div className="grid lg:grid-cols-12 grid-cols-1 gap-4">
        <div className="lg:col-span-7 col-span-1">
          <div className="flex flex-col md:gap-6 gap-2">
            <div className="hidden flex items-center gap-2 p-2">
              <div onClick={() => setActiveOdds('all')} className={`${activeOdds === 'all' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>All</div>
              {
                matchBetsData && matchBetsData?.matchodds?.length ?
                  <div onClick={() => setActiveOdds('odds')} className={`${activeOdds === 'odds' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Match Odds</div>
                  : ''
              }
              {
                matchBetsData && matchBetsData?.bookmakersOdds?.length ?
                  <div onClick={() => setActiveOdds('bookmaker')} className={`${activeOdds === 'bookmaker' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Bookmaker</div>
                  : ''
              }
              {
                matchBetsData && matchBetsData?.matchfancies?.length ?
                  <div onClick={() => setActiveOdds('fancy')} className={`${activeOdds === 'fancy' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Fancy</div>
                  : ''
              }
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'odds') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && matchBetsData?.matchodds?.length ?
                  <OddsSection
                    matchBetsData={matchBetsData}
                    setBetData={setBetData}
                    betData={backBets?.data?.filter((item) => item?.type == 'odds')}
                    openBets={openBets}
                  />
                  : ''
              }
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'bookmaker') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && matchBetsData?.bookmakersOdds?.length ?
                  <BookmakerSection
                    matchBetsData={matchBetsData}
                    setBetData={setBetData}
                    betData={backBets?.data?.filter((item) => item?.type == "bookmakers")}
                    openBets={openBets?.data}
                  />
                  : ''
              }
            </div>
            <div>
            {matchBetsData && (matchBetsData?.tossMarket?.length &&  matchBetsData?.tossStatus !== 'inactive') && matchBetsData?.gameId == '4' ? (
            <div className="bg-green-200 my-4">
              <TossSection
                matchBetsData={matchBetsData}
                setBetData={setBetData}
                betData={backBets?.data?.filter((item) => item?.type == "toss")}
                openBets={openBets?.data}
              />
            </div>
          ) : (
            ""
          )}
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'fancy') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && cached?.matchfancies?.length ?
                  <FancySection
                    matchBetsData={cached}
                    setBetData={setBetData}
                    betData={backBets?.data?.filter((item) => item?.type == "fancy")}
                    openBets={openBets?.data}
                  />
                  : ''
              }
            </div>
         
          </div>
        </div>

        <div className="lg:col-span-5 col-span-1">

        <div className="mt-2 flex flex-col sm:flex-row justify-between items-center w-full gap-1 bg-gray-100 rounded-md  p-3">
          <p className="block items-center text-sm font-custom text-black">Set Maxstake</p>
          <div className="items-center flex  sm:flex-row justify-between gap-1 sm:gap-3">
           <label className=" flex items-center text-center text-nowrap  gap-3 text-xs w-full font-custom text-black">
            Only Odds
          <input 
          className=" mt-1"
          type="checkbox"
          checked={checkbox}  
          onChange={(e)=>setCheckbox(e.target.checked)}/>
           </label>
          {loading ? 
          <button 
          // onClick={SetStakeLimit}
          className=" text-white mt-2 text-center px-3 hover:bg-sky-700 bg-sky-900 p-1 text-xs rounded-md  w-full">
            Loading
            </button>
            :
          <button 
            onClick={SetStakeLimit}
            className=" text-white mt-2 text-center px-3 hover:bg-sky-700 bg-sky-900 p-1 text-xs rounded-md  w-full">
              Set Stake
              </button>
              }

              {loading2 ? 
              <button 
              // onClick={RevertStakeLimit}
              className=" text-white mt-2 text-nowrap text-center px-3 hover:bg-sky-700 bg-sky-900 p-1 text-xs rounded-md  w-full">
                Loading
                </button>
                :
              <button 
            onClick={RevertStakeLimit}
            className=" text-white mt-2 text-nowrap text-center px-3 hover:bg-sky-700 bg-sky-900 p-1 text-xs rounded-md  w-full">
              Revert Stake
              </button>
              }
          </div>
          </div>

          {
            matchBetsData && matchBetsData?.liveTv ?
              <>
                <div onClick={() => setShowLiveStreaming(!showLiveStreaming)} className="bg-gradient-blue text-white text-[12px] sm:text-[15px] p-[6px] sm:py-2 font-semibold px-2  rounded mb-2 cursor-pointer">Live Streaming</div>
                {
                  showLiveStreaming ?
                    <div className="w-full aspect-video bg-[#141435] overflow-hidden relative rounded mb-4">
                      <iframe
                        src={matchBetsData?.liveTv}
                        className="w-full h-full"
                        ref={iframeRef}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                      ></iframe>
                      <button
                        onClick={handleFullscreen}
                        className="absolute bottom-2 right-2 bg-black/70 text-white p-2 rounded-md"
                      >
                        {/* Square Bracket Fullscreen Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M16 4h4v4M4 16v4h4m12 0h-4v-4" />
                        </svg>
                      </button>
                    </div>
                    : ''
                }
              </>
              : ''
          }
          {
            matchBetsData && matchBetsData?.scoreUrl ?
              <>
                <div onClick={() => setShowScore(!showScore)} className="bg-gradient-blue text-white  text-[12px] sm:text-[15px] p-[5px] sm:py-2  font-semibold px-2  rounded mb-2 cursor-pointer">Score Card</div>
                {
                  showScore ?
                    <div className="w-full h-[145px] bg-[#141435] overflow-hidden rounded ">
                      <iframe src={matchBetsData?.scoreUrl} className="w-full h-full" frameBorder="0"></iframe>
                    </div>
                    : ''
                }
              </>
              : ''
          }
          <div>
            <div className="bg-gradient-blue text-white  text-[12px] sm:text-[15px] p-[5px] sm:py-2  font-semibold px-2  rounded mb:1 sm:mb-2 cursor-pointer">
              Book
            </div>
            <div className="flex justify-around bg-white p-1 px-2 gap-3 mb-1 sm:mb-4">
              <div className="bg-gradient-blue text-white text-center  text-[12px] sm:text-[15px] p-[5px] sm:py-2  font-semibold px-2  w-full rounded cursor-pointer"
                onClick={() => {
                  setbooks('master')
                  setMarketListModal(true)
                }}
              >
                Master Book
              </div>
              <div className="bg-gradient-blue text-white text-center  text-[12px] sm:text-[15px] p-[5px] sm:py-2  font-semibold w-full px-2  rounded cursor-pointer"
                onClick={() => {
                  setbooks('user')
                  setMarketListModal(true)
                }}
              >
                User Book
              </div>
            </div>
          </div>


          <div className="bg-gradient-blue sm:mt-0 mt-8 text-white text-[12px] sm:text-[15px] py-1 sm:py-2 font-semibold px-2  sm:gap-2 rounded mb-1 cursor-pointer flex justify-between">
            <div className="flex w-full ">
              <div className="flex w-full  gap-1.5 items-center">
                <label htmlFor="liveBets">Live Bets</label>
                <input type="checkbox" className="hidden" id="liveBets" checked={liveBets} onChange={() => {
                  setLiveBets(!liveBets)
                  setCurrentPage(1)
                  }} />
                <label className={`bg-white cursor-pointer h-[18px] w-[36px] rounded-[3px] flex relative before:absolute before:top-[2px] before:left-[2px] before:w-[calc(18px_-_4px)] before:h-[calc(100%_-_4px)] before:ease-in-out before:transition-all before:duration-300 before:rounded-[3px] before:shadow before:border before:border-gray-400 ${liveBets ? 'before:!left-[20px] before:bg-green-600 before:border-green-600' : ''}`} htmlFor="liveBets"></label>
              </div>
              <div className="flex gap-1.5 w-full items-center ml-4">
                <label htmlFor="partnership">Partnership Book</label>
                <input type="checkbox" className="hidden" id="partnership" checked={partnershipBook} onChange={() => setPartnershipBook(!partnershipBook)} />
                <label className={`bg-white cursor-pointer h-[18px] w-[36px] rounded-[3px] flex relative before:absolute before:top-[2px] before:left-[2px] before:w-[calc(18px_-_4px)] before:h-[calc(100%_-_4px)] before:ease-in-out before:transition-all before:duration-300 before:rounded-[3px] before:shadow before:border before:border-gray-400 ${partnershipBook ? 'before:!left-[20px] before:bg-green-600 before:border-green-600' : ''}`} htmlFor="partnership"></label>
              </div>
            </div>
            <div onClick={() => setShowBetsModal(true)} className=" text-[12px] sm:text-sm cursor-pointer w-[30%] sm:mt-0 mt-1.5 flex items-center justify-center">View More</div>
          </div>
          {
            liveBets &&( backBets?.data?.length || search !== '')?
              <div className="mt-2 bg-white">
                <div className="flex justify-end mt-3">
                  <input
                    placeholder="Search Bets..."
                    className="border text-[13px] font-bold text-sm p-1 px-2 rounded-md"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                    }}
                  />
                </div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-xs font-normal text-left p-2">Market Name</th>
                      <th className="text-xs font-normal text-left p-2">Odds</th>
                      <th className="text-xs font-normal text-left p-2">Stake</th>
                      <th className="text-xs font-normal text-left p-2">User Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      backBets?.data?.length > 0 ? 
                      backBets?.data?.map(item => (
                        <>
                        <tr className={`${(item?.betType === "back" || item?.betType === "yes") ? 'bg-[#d7e8f4a1]' : 'bg-[#f6e6ea92]'}`}>
                          <td className="text-[9px] px-5  " colSpan={12}>
                           Time: {moment(item?.createdAt).format('LLL')}
                          </td>
                        </tr>
                          <tr key={item?._id}>
                            <td className={` p-2 border-b border-b-black ${(item?.betType === "back" || item?.betType === "yes") ? 'bg-[#d7e8f4]' : 'bg-[#f6e6ea]'}`}>
                              <div className="flex items-center gap-2">
                                <div className={`h-5 rounded text-[11px] flex items-center justify-center w-10 capitalize font-medium ${(item?.betType === "back" || item?.betType === "yes") ? 'bg-theme5' : 'bg-theme6'}`}>{item?.betType}</div>
                                <div className="a">
                                  <div className="text-xs font-semibold">{item?.marketName}</div>
                                  <div className="uppercase text-[10px] text-gray-500 font-semibold">{item?.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className={`text-xs font-medium ${(item?.betType === "back" || item?.betType === "yes") ? 'bg-[#d7e8f4]' : 'bg-[#f6e6ea]'} p-2 border-b border-b-black`}>
                              {item?.type === "fancy" ? `${item?.fancyOdds}/` : ''}
                              {item?.odds}</td>
                            <td className={`text-xs font-medium ${(item?.betType === "back" || item?.betType === "yes") ? 'bg-[#d7e8f4]' : 'bg-[#f6e6ea]'} p-2 border-b border-b-black`}>{item?.amount?.toFixed(2)}</td>
                            <td className={`text-xs font-medium ${(item?.betType === "back" || item?.betType === "yes") ? 'bg-[#d7e8f4]' : 'bg-[#f6e6ea]'} p-2 border-b border-b-black underline`}>
                              <div className="cursor-pointer" onClick={() => {
                                setShowUser(true)
                                setSelectedUser(item)
                              }}>{item?.userDetails?.username}</div>
                            </td>
                          </tr>
                          </>
                        ))
                        : ''
                    }
                  </tbody>
                </table>
                <div ref={infiniteLoadRef} className="text-transparent">:</div>


              </div>
              : ''
          }
        </div>
      </div>
      {/* <MatchRulesModal/> */}
      <MarketBetModal 
      matchId={gameId} 
      show={showBetsModal}
       setShow={setShowBetsModal}
       setSearchTerm={setSearchTerm}
       searchTerm={searchTerm}
       setShowUser={setShowUser} 
       setSelectedUser={setSelectedUser} 
      //  matchId={gameId}
       />
      <UserHistoryModal showUser={showUser} setShowUser={setShowUser} selectedUser={selectedUser} />
      <MarketListModal
        showUser={marketListModal}
        setShowUser={setMarketListModal}
        setType={setType}
        setShowBookModal={setShowUserBook}
      />
      <BookModal
        showUser={showUserBook}
        setShowUser={setShowUserBook}
        matchBetsData={matchBetsData}
        userId={userId}
        type={type}
        setUserId={setUserId}
        book={books}
        userBookList={books == 'user' ? userBooks : masterBook}
      />
    </>
  )
}

export default MarketAnalysisInner