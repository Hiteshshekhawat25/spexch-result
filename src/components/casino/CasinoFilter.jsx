import React from 'react'

function CasinoFilter({
    
}) {
  return (
    <div className='p-3 grid grid-cols-10 gap-3 bg-white shadow-md'>
        <div className='col-span-2'>
            <input
            className='outline-none w-full rounded-md shadow-md px-3 py-2 '
            value=''
            placeholder='Search'
            />
        </div>
        <div>
            <button
            className='bg-gradient-blue text-white font-bold p-2 rounded-md'
            >
                Filter Data
            </button>
        </div>
    </div>
  )
}

export default CasinoFilter
