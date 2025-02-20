import React from 'react'

function SwitchButton({active,setActive}) {
  return (
    <div className='w-12 border-2  rounded-full '>
      <div className={`flex w-full ${active ? `bg-green-500 ` : ` bg-rose-500  `} rounded-full  p-[1px] ${active ? "justify-end" : "justify-start"}`} onClick={()=>setActive(!active)}>
        <div className={`bg-white p-2  top-[-2px] rounded-full w-5 h-5`}>

        </div>
      </div>
    </div>
  )
}

export default SwitchButton
