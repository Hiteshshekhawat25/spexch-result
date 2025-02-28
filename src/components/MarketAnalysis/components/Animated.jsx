import React from 'react'
// import HighlightLoader from './loader/HighlightLoader'

function AnimatedLoader() {
  return (
    <>
    <div className=" flex pr-5 pl-2 sm:p-3  mx-auto rounded-md bg-white items-center w-44 sm:w-52 h-28 sm:h-32">
    <div className="relative w-32  h-28 sm:h-32  rounded-md">
      <div className="absolute w-8 sm:w-12 h-8 sm:h-12 bg-gradient-green rounded-full animate-crossing1"></div>
      <div className="absolute w-8 sm:w-12 h-8 sm:h-12 bg-gradient-blue rounded-full animate-crossing2"></div>      
    <div className='mt-100 absolute bottom-0 sm:bottom-3 text-end w-full'>
      Loading...
    </div>
    </div>
  </div>
    </>
  )
}

export default AnimatedLoader
