import React from 'react'
// import HighlightLoader from './loader/HighlightLoader'

function AnimatedLoader() {
  return (
    <>
    <div className=" flex pr-5 pl-2 sm:p-3  mx-auto rounded-md bg-white items-center w-[150px]  sm:w-[165px] h-28 sm:h-28">
    <div className="relative w-28  h-28 sm:h-32  rounded-md">
      <div className="absolute w-[28px] sm:w-8 h-[28px] sm:h-8 bg-gradient-green rounded-full animate-crossing1"></div>
      <div className="absolute w-[28px] sm:w-8 h-[28px] sm:h-8 bg-gradient-blue rounded-full animate-crossing2"></div>      
    <div className='mt-100 absolute bottom-0 sm:bottom-3 text-end w-full'>
      Loading...
    </div>
    </div>
  </div>
    </>
  )
}

export default AnimatedLoader
