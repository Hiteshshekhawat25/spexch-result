import React from 'react'

function RevertModal({ showUser, setShowUser,setRemark,remark,handleDeleteBet,password,setPassword}) {
 


  const handleClose = () => {
    setShowUser(false)
  }


  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${showUser ? 'flex' : 'hidden'}`} style={{ backdropFilter: 'blur(4px)' }}>
        <div className="w-full md:mt-0 sm:max-w-[500px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e) => { e.stopPropagation() }} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header bg-gradient-blue text-white flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">Remark</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className=' mt-2 mx-2 flex justify-between'>
                <input
                value={password} 
                className='shadow border-1 w-full  max-w-[200px]  border-gray-800 outline-gray-400 rounded-md p-2  '
                placeholder='Password'
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button  className='bg-lightblue text-white px-5 py-2 rounded-md' onClick={handleDeleteBet}>
                    Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RevertModal
