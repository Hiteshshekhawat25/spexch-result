import React from 'react'

function CasinoFilter({
    
}) {
  return (
    <div className=' grid grid-cols-10 gap-3 '>
        <div className='col-span-6 sm:col-span-4 md:col-span-2'>
            <input
            className='outline-none w-full border border-gray-300 text-[14px] rounded-md px-3 py-2 '
            value=''
            placeholder='Search'
            />
        </div>
        <div className='col-span-4 sm:col-span-4 md:col-span-2'>
            <button
            className='bg-gradient-seablue text-white text-[14px] font-bold p-2 rounded-md'
            >
                Filter Data
            </button>
        </div>
    </div>
  )
}

export default CasinoFilter
