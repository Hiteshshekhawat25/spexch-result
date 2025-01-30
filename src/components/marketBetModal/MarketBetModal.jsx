import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchMarketBets } from "../../Store/Slice/marketBetsSlice";
import moment from "moment/moment";
import Pagination from './../pagination/Pagination'
import UserHistoryModal from "./UserHistoryModal";

const MarketBetModal = ({matchId, show, setShow, showUser, setShowUser, selectedUser, setSelectedUser}) => {
  const dispatch = useDispatch()
  const {data} = useSelector(state => state?.marketBetList)

  const handleClose = ()=> {
    setShow(false)
  }

  useEffect(()=> {
    if(show) {
      dispatch(fetchMarketBets(matchId))
    }
  },[show])




  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${show ? 'flex' : 'hidden'}`} style={{backdropFilter: 'blur(4px)'}}>
        <div className="w-full md:mt-0 sm:max-w-[900px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e)=> {e.stopPropagation()}} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">View More Bets</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className="overflow-y-auto w-full">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="font-semibold text-left p-2 border text-nowrap">User Name</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">Nation</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">Amount</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">User Rate</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">Place Date</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">Match Date</th>
                      <th className="font-semibold text-left p-2 border text-nowrap">Game Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.data?.length ? 
                        data?.data?.map(item => (
                          <React.Fragment key={`exposure-${item?._id}`}>
                            <tr key={`exposure-${item?._id}`} className={`${(item?.betType === 'back' || item?.betType === 'yes') ? 'bg-[#72bbef]' : 'bg-[#faa9ba]'}`}>
                              <td className="text-left p-2 border">
                                <div className="font-semibold cursor-pointer underline" onClick={()=> {
                                  setShowUser(true)
                                  setSelectedUser(item)
                                }}>
                                  {item?.userDetails?.name}
                                </div>
                              </td>
                              <td className="text-left p-2 border text-nowrap">{item?.marketName}</td>
                              <td className="text-left p-2 border capitalize">{item?.amount?.toFixed(0)}</td>
                              <td className="text-left p-2 border">{item?.odds}</td>
                              <td className="text-left p-2 border text-nowrap">{item?.createdAt ? moment(item?.createdAt).format('LLL') : ''}</td>
                              <td className="text-left p-2 border text-nowrap">{item?.marketStartTime ? moment(item?.marketStartTime).format('LLL') : ''}</td>
                              <td className="text-left p-2 border">{item?.type}</td>
                            </tr>
                          </React.Fragment>
                        ))
                      : <tr>
                        <td colSpan={4} className="text-center py-7">No Bets Available</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                {
                  data?.data?.length ? 
                    <div className="text-xs sm:text-[13px] text-nowrap">Showing {((data?.pagination?.page - 1)*10 + 1) > 0 ? (data?.pagination?.page - 1)*10 + 1 : 0} to {((data?.pagination?.page - 1)*10 + 10) > 0 ? (((data?.pagination?.page - 1)*10 + 10) < data?.pagination?.totalChildrenCount ? (data?.pagination?.page - 1)*10 + 10 : data?.pagination?.totalChildrenCount) : 0} of {data?.pagination?.totalChildrenCount ? data?.pagination?.totalChildrenCount : 0} entries</div>
                  : ''
                }
                {
                  data?.pagination?.totalPages < 1 ? '' :
                <Pagination pageNo={data?.pagination?.pageNo} setPageNo={data?.pagination?.setPageNo} totalPages={data?.pagination?.totalPages}/>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MarketBetModal