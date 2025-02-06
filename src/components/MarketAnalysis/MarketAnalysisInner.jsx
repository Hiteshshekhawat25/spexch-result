import { useEffect, useState } from "react"
import OddsSection from "./components/OddsSection"
import BookmakerSection from "./components/BookmakerSection"
import FancySection from "./components/FancySection"
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
// import { setMatchId } from "../../store/slices/betSlice/OpenBetsSlice"
// import { fetchTvUrl } from "../../store/slices/tvUrl/TvUrlSlice"
import MobileStream from "./components/MobileStream"
import { socket } from "../../Services/socket"
import { BASE_URL, SOCKET_ROUTES } from "../../Constant/Api"
import MarketBetModal from "../marketBetModal/MarketBetModal"
import { fetchMarketBets } from "../../Store/Slice/marketBetsSlice"
import UserHistoryModal from "../marketBetModal/UserHistoryModal"
import BookModal from "../marketBetModal/BookModal"
import { fetchUserBook } from "../../Store/Slice/UserBookSlice"
import MarketListModal from "../marketBetModal/MarketListModal"
import axios from "axios"

const MarketAnalysisInner = () => {
  const [matchBetsData, setMatchBetsData] = useState({});
  const [showLiveStreaming, setShowLiveStreaming] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [showBetsModal, setShowBetsModal] = useState(false)
  const [activeOdds, setActiveOdds] = useState('all')
  const [liveBets, setLiveBets] = useState(false)
  const [books,setbooks] = useState('');
  const [marketListModal,setMarketListModal] = useState(false);
  const [type,setType] = useState('')
  const [partnershipBook, setPartnershipBook] = useState(false)
  const [betData, setBetData] = useState({
    stake : 0, 
    matchId : '',  
    selectionId : '', 
    type : '', 
    betType : '',
    odds: '',
    marketName: '',
    index : '',
    marketId : '',
  })
  const {gameId} = useParams()
  const dispatch = useDispatch()
  const openBets = useSelector(state => state?.betList)
  const {data : backBets} = useSelector(state => state?.marketBetList)
  const {data : userBooks} = useSelector(state => state?.userBookList)
  const [page,setPage] = useState(1)
    const [showUser, setShowUser] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [betList,setBetList] = useState([]);
    const [showUserBook,setShowUserBook] = useState(false)

    const getBetList = async () => {

      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(`${BASE_URL}/user/get-odds-bet-list?matchId=${gameId}&limit=10&page=${page}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response",response);
        if(response?.data?.success) {
          setBetList(response?.data?.data)
          // setTotalPage(response?.data?.pagination?.totalPages)
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


    useEffect(()=>{
      getBetList()
    },[])

      useEffect(() => {
        socket.connect()
        socket.emit(SOCKET_ROUTES.JOIN_MATCH, { matchId: gameId });

        const matchUpdateListener = (data) => {
          console.log({data},'data')
          setMatchBetsData(data);
        };
        socket.on(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);

        return () => {
          socket.off(SOCKET_ROUTES.MATCH_UPDATE, matchUpdateListener);
          socket.disconnect();
        };
      }, [gameId]);

      console.log('backBetsbackBets', backBets?.data)

        useEffect(()=> {
          if(liveBets) {
            dispatch(fetchMarketBets(gameId))
          }
        },[liveBets])

        

        useEffect(()=> {
          if(showUserBook) {
            dispatch(fetchUserBook({page : 1,limit : 100,type : type,matchId : gameId}))
          }
        },[showUserBook])

        console.log({openBets},'function')

  return (
    <>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <div className="pb-6">
            <div className="hidden flex items-center gap-2 p-2">
              <div onClick={()=> setActiveOdds('all')} className={`${activeOdds === 'all' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>All</div>
              {
                matchBetsData && matchBetsData?.matchodds?.length ? 
                  <div onClick={()=> setActiveOdds('odds')} className={`${activeOdds === 'odds' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Match Odds</div>
                : ''
              }
              {
                matchBetsData && matchBetsData?.bookmakersOdds?.length ?
                  <div onClick={()=> setActiveOdds('bookmaker')} className={`${activeOdds === 'bookmaker' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Bookmaker</div>
                : ''
              }
              {
                matchBetsData && matchBetsData?.matchfancies?.length ?
                  <div onClick={()=> setActiveOdds('fancy')} className={`${activeOdds === 'fancy' ? 'active' : ''} cursor-pointer flex items-center justify-center text-sm font-bold bg-gradient text-white h-10 px-3 rounded-[50px] border border-[#000000] [&.active]:bg-gradient-green`}>Fancy</div>
                : ''
              }
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'odds') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && matchBetsData?.matchodds?.length ? 
                  <OddsSection matchBetsData={matchBetsData} setBetData={setBetData} betData={betData} betList={betList} openBets={openBets?.data}/>
                : ''
              }
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'bookmaker') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && matchBetsData?.bookmakersOdds?.length ?
                  <BookmakerSection matchBetsData={matchBetsData} setBetData={setBetData} betData={betData} openBets={openBets?.data}/>
                : ''
              }
            </div>
            <div className={`${(activeOdds === 'all' || activeOdds === 'fancy') ? '' : 'max-lg:hidden'}`}>
              {
                matchBetsData && matchBetsData?.matchfancies?.length ?
                  <FancySection matchBetsData={matchBetsData} setBetData={setBetData} betData={betData} openBets={openBets?.data}/> 
                  : ''
              }
            </div>
        </div>
      </div>
      <div className="col-span-4">
          {
            matchBetsData && matchBetsData?.liveTv ? 
            <>
              <div onClick={()=> setShowLiveStreaming(!showLiveStreaming)} className="bg-gradient-blue text-white text-sm font-semibold px-2 py-1 rounded mb-1 cursor-pointer">Live Streaming</div>
              {
                showLiveStreaming ? 
                  <div className="w-full aspect-video bg-[#141435] overflow-hidden rounded mb-4">
                    <iframe src={matchBetsData?.liveTv} className="w-full h-full" frameBorder="0"></iframe>
                  </div>
                : ''
              }
            </>
            : ''
          }
          {
            matchBetsData && matchBetsData?.scoreUrl ? 
            <>
              <div onClick={()=> setShowScore(!showScore)} className="bg-gradient-blue text-white text-sm font-semibold px-2 py-1 rounded mb-1 cursor-pointer">Score Card</div>
              {
                showScore ? 
                  <div className="w-full h-[200px] bg-[#141435] overflow-hidden rounded ">
                    <iframe src={matchBetsData?.scoreUrl} className="w-full h-full" frameBorder="0"></iframe>
                  </div>
                : ''
              }
            </>
            : ''
          }
          <div>
            <div className="bg-gradient-blue text-white text-sm font-semibold px-2 py-1 rounded mb-1 cursor-pointer">
              Book
            </div>
            <div className="flex justify-around gap-5">
              <div className="bg-gradient-blue text-white text-center text-sm font-semibold px-2 py-1 w-full rounded mb-1 cursor-pointer"
               onClick={()=>{
                setbooks('master')
                setMarketListModal(true)
                }}
              >
                Master Book
              </div>
              <div className="bg-gradient-blue text-white text-center text-sm font-semibold w-full px-2 py-1 rounded mb-1 cursor-pointer" 
              onClick={()=>{
                setbooks('user')
                setMarketListModal(true)
                }}
                >
                User Book
              </div>
            </div>
          </div>


          <div className="bg-gradient-blue text-white text-sm font-semibold px-2 py-1 rounded mb-1 cursor-pointer flex justify-between">
            <div className="flex">
              <div className="flex gap-1.5 items-center">
                <label htmlFor="liveBets">Live Bets</label>
                <input type="checkbox" className="hidden" id="liveBets" checked={liveBets} onChange={()=>setLiveBets(!liveBets)}/>
                <label className={`bg-white cursor-pointer h-[18px] w-[36px] rounded-[3px] flex relative before:absolute before:top-[2px] before:left-[2px] before:w-[calc(18px_-_4px)] before:h-[calc(100%_-_4px)] before:ease-in-out before:transition-all before:duration-300 before:rounded-[3px] before:shadow before:border before:border-gray-400 ${liveBets ? 'before:left-[20px] before:bg-green-600 before:border-green-600' : ''}`} htmlFor="liveBets"></label>
              </div>
              <div className="flex gap-1.5 items-center ml-4">
                <label htmlFor="partnership">Partnership Book</label>
                <input type="checkbox" className="hidden" id="partnership" checked={partnershipBook} onChange={()=>setPartnershipBook(!partnershipBook)}/>
                <label className={`bg-white cursor-pointer h-[18px] w-[36px] rounded-[3px] flex relative before:absolute before:top-[2px] before:left-[2px] before:w-[calc(18px_-_4px)] before:h-[calc(100%_-_4px)] before:ease-in-out before:transition-all before:duration-300 before:rounded-[3px] before:shadow before:border before:border-gray-400 ${partnershipBook ? 'before:left-[20px] before:bg-green-600 before:border-green-600' : ''}`} htmlFor="partnership"></label>
              </div>
            </div>
            <div onClick={()=> setShowBetsModal(true)} className="text-xs cursor-pointer">View More</div>
          </div>
          {
              liveBets && backBets?.data?.length ? 
                <div className="mt-2">
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
                        backBets?.data?.length ? 
                        backBets?.data?.map(item => (
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
                              <div className="cursor-pointer" onClick={()=> {
                                  setShowUser(true)
                                  setSelectedUser(item)
                                }}>{item?.userDetails?.name}</div>
                            </td>
                          </tr>
                        ))
                        : ''
                      }
                    </tbody>
                  </table>
                </div>
              : ''
            }
      </div>
    </div>
      {/* <MatchRulesModal/> */}
      <MarketBetModal matchId={gameId} show={showBetsModal} setShow={setShowBetsModal} setShowUser={setShowUser} setSelectedUser={setSelectedUser}/>
      <UserHistoryModal showUser={showUser} setShowUser={setShowUser} selectedUser={selectedUser}/>
      <MarketListModal 
      showUser={marketListModal} 
      setShowUser={setMarketListModal} 
      setType={setType}
      setShowBookModal={setShowUserBook}
      />
      <BookModal 
      showUser={showUserBook} 
      type={type}
      setShowUser={setShowUserBook} 
      matchBetsData={matchBetsData} 
      book={books} 
      userBookList={userBooks}
      />
    </>
  )
}

export default MarketAnalysisInner