import { useState } from "react"
import { useSelector } from "react-redux";

const MobileStream = ({matchBetsData}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [activeOption, setActiveOption] = useState('score')
  const {data} = useSelector(state => state.tvUrl)

  return (
    <>
      <div onClick={()=> setShowOptions(!showOptions)} className="relative lg:hidden max-lg:text-center bg-gradient lg:bg-gradient-blue px-2 h-[35px] lg:h-[25px] text-white text-base lg:text-xs font-bold flex justify-center lg:justify-between items-center">
        <span className="max-lg:hidden">Live TV</span>
        <span className="lg:hidden">{matchBetsData?.gameId === "4" ? 'Cricket' : matchBetsData?.gameId === "1" ? 'Soccer' : matchBetsData?.gameId === "2" ? 'Tennis' : 'Live TV'}</span>          
        <div className="tvBlink absolute right-3 top-1/2 -translate-y-1/2">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M592 0H48A48 48 0 0 0 0 48v320a48 48 0 0 0 48 48h240v32H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H352v-32h240a48 48 0 0 0 48-48V48a48 48 0 0 0-48-48zm-16 352H64V64h512z"></path></svg>
        </div>
      </div>
      {
        showOptions ? 
          <>
            <div className="flex w-full">
              <div onClick={()=>setActiveOption('score')} className={`${activeOption === 'score' ? 'active' : ''} w-1/2 text-center h-8 flex items-center justify-center border-b border-transparent [&.active]:border-b-white bg-tab-bg text-white text-[13px] border-r border-r-[#666060]`}>Live Score</div>
              <div onClick={()=>setActiveOption('tv')} className={`${activeOption === 'tv' ? 'active' : ''} w-1/2 text-center h-8 flex items-center justify-center border-b border-transparent [&.active]:border-b-white bg-tab-bg text-white text-[13px]`}>Watch Live</div>
            </div>
            {
              activeOption === 'score' ?
              <div className="w-full aspect-video bg-[#141435]">
                <iframe src={matchBetsData?.scoreUrl} className="w-full h-full" frameBorder="0"></iframe>
              </div>
              :         
              <div className="w-full aspect-video bg-[#141435]">
                <iframe src={data} className="w-full h-full" frameBorder="0"></iframe>
              </div>
            }
          </>
        : ''
      }
    </>
  )
}

export default MobileStream