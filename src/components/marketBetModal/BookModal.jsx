import React, { useEffect, useState } from 'react'

function BookModal({ showUser, setShowUser, userBookList, matchBetsData, book, type }) {

  const [betList, setBetList] = useState([]);

  const handleClose = () => {
    setShowUser(false)
  }


  const returnSortedArr = () => {
    let temp = []
  const uniq = userBookList?.map((item)=>{
    temp.push(item)
    let cond = temp?.filter((itm)=>item.userId !== itm.userId )
    console.log({temp},'function')
   
  })
  }

  useEffect(() => {
    returnSortedArr()
  }, [userBookList])

  console.log({ userBookList, betList }, 'item')
  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${showUser ? 'flex' : 'hidden'}`} style={{ backdropFilter: 'blur(4px)' }}>
        <div className="w-full md:mt-0 sm:max-w-[500px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e) => { e.stopPropagation() }} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header bg-gradient-blue text-white flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">{book == 'user' ? 'USER Book' : 'MASTER Book'}</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className="overflow-y-auto w-full">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th>UserName</th>
                      <th>Role</th>
                      <th>{type == 'odds' ? matchBetsData?.matchodds?.[0]?.runnerName : matchBetsData?.bookmakersOdds?.[0]?.selectionName}</th>
                      <th>{type == 'odds' ? matchBetsData?.matchodds?.[1]?.runnerName : matchBetsData?.bookmakersOdds?.[1]?.selectionName}</th>
                    </tr>
                    {
                      userBookList?.length ?
                        userBookList?.map(item => {
                          console.log(item.stake)

                          return (
                            <tr key={item?._id}>
                              <td className="font-semibold p-2 border text-nowrap text-center">
                                {item?.username}
                              </td>
                              <td className="font-semibold p-2 border text-nowrap text-center">
                                USER
                              </td>
                              <td className="font-semibold p-2 border text-nowrap text-center">
                                {type == 'odds' ? matchBetsData?.matchodds?.[0]?.runnerName == item?.market ? item?.stake : '-' : matchBetsData?.bookmakersOdds?.[0]?.selectionName == item?.selection ? item?.stake : '-'}
                              </td>
                              <td className="font-semibold p-2 border text-nowrap text-center">
                                {type == 'odds' ? matchBetsData?.matchodds?.[1]?.runnerName == item?.market ? item?.stake : '-' : matchBetsData?.bookmakersOdds?.[1]?.selectionName == item?.selection ? item?.stake : '-'}
                              </td>
                            </tr>
                          )
                        })
                        : ''
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookModal
