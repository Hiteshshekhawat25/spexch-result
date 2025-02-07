import { useDispatch } from "react-redux"
// import { openRulesModal } from "../../store/slices/modalSlice/modalSlice"

const SportsHeading = ({title, background, extraClass, fancyBet, img}) => {
  const dispatch = useDispatch()

  const handleOpenRulesModal = ()=> {
    // dispatch(openRulesModal())
  }
  return (
    <>
      <div className={`text-white text-xs font-semibold flex items-center sm:px-4 px-3 py-2 gap-1.5 rounded-tr-xl relative ${background ? `bg-[${background}]` : "bg-theme4"} ${extraClass} ${fancyBet ? 'mr-[0.65rem]' : ""}`}>
        {title}
        <img onClick={handleOpenRulesModal} className={`object-contain h-4 cursor-pointer relative z-20 ${img ? 'translate-x-[11px]' : ''}`} src="assets/img/info.png" alt="" />
        {
          fancyBet ? 
            <img src={img} alt="icon" className="h-8 absolute top-0 right-[-10px] z-10"/>
          :" "
        }
      </div>
    </>
  )
}

export default SportsHeading