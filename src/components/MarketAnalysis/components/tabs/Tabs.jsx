import React from 'react'
import { useDispatch } from 'react-redux'

const Tabs = ({data, size, activeTab, setActiveTab, hasPadding, fancyTabs, highlightTab, casinoTab, inplayTab}) => {
  const dispatch = useDispatch()
  return (
    <div className={`flex overflow-y-auto max-lg:justify-start relative 
    ${inplayTab ? '!gap-0 border border-[#3B5160] sm:inline-flex rounded overflow-hidden' : ''} 
    ${highlightTab ? 'bg-gradient-green-hover max-lg:pt-2 px-2' : 'gap-2'} 
    ${fancyTabs ? 'sm:gap-2 gap-0': ''}
    ${hasPadding ? 'pb-1' : ''}`}>
      {
        data?.length ? 
          data?.map((item) => (
            <React.Fragment key={item?.value}>
              <div onClick={()=> setActiveTab(item?.value)} className={`
                ${inplayTab ? 'border border-[#3B5160] rounded-none max-sm:w-1/5 max-sm:h-7 max-sm:text-xs font-bold' : ''} 
                ${inplayTab && activeTab === item?.value ? 'bg-[#3B5160]' : ''} 
                ${casinoTab ? 'uppercase !text-sm !bg-transparent !px-2 !py-1 !font-bold !rounded-b-none !rounded-t-md' : ''}
                 ${casinoTab && activeTab === item?.value ? " !bg-gradient-blue" : ''} 
                 ${highlightTab ? 'flex items-center gap-2 max-lg:!text-sm max-lg:!h-8 max-lg:!bg-transparent max-lg:!px-2 max-lg:!py-1 max-lg:!font-bold max-lg:!rounded-b-none max-lg:!rounded-t-md lg:!h-5 lg:!bg-gradient lg:rounded-full lg:text-white lg:!text-xs lg:!font-bold' : ''} 
                 ${highlightTab && activeTab === item?.value ? 'lg:!bg-[#dddcd6] lg:!bg-none lg:!text-black lg:rounded-t lg:rounded-b-none max-lg:!bg-gradient-blue' : ''} 
              ${fancyTabs && item.value == activeTab ? 'bg-white !text-black text-[9px] !px-1 sm:px-3 !font-bold' : 'bg-transparent text-[9px] !px-1.5 !sm:px-3 sm:text-sm !text-black !font-bold !shadow-none'} 
                 py-1 px-5 rounded text-nowrap flex items-center justify-center cursor-pointer leading-normal text-xs lg:text-sm font-normal
                  ${size === 'sm' ? 'h-[22px] text-xs lg:text-sm' : ''} 
                  ${activeTab === item?.value ? 'bg-theme7 text-white' : ''}`}>
                {/* {
                  highlightTab ? 
                  item?.value === '4' ? 
                  <img className={`size-5 object-contain lg:hidden ${activeTab === item?.value ? 'invert' : ''}`} src="assets/img/cricket.png" alt="" />
                  : 
                  item?.value === '1' ? 
                  <img className={`size-5 object-contain lg:hidden ${activeTab === item?.value ? 'invert' : ''}`} src="assets/img/soccer.png" alt="" />
                  : 
                  item?.value === '2' ? 
                  <img className={`size-5 object-contain lg:hidden ${activeTab === item?.value ? 'invert' : ''}`} src="assets/img/tennis.png" alt="" />
                  : ''
                  : ''
                } */}
                {item?.title}
              </div>
            </React.Fragment>
          ))
        : ''
      }
    </div>
  )
}

export default Tabs