

const UserHistoryModal = ({selectedUser, showUser, setShowUser}) => {

  const handleClose = ()=> {
    setShowUser(false)
  }

  console.log({selectedUser})

  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${showUser ? 'flex' : 'hidden'}`} style={{backdropFilter: 'blur(4px)'}}>
        <div className="w-full md:mt-0 sm:max-w-[500px] xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e)=> {e.stopPropagation()}} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">Parent List</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm relative">
              <div className="overflow-y-auto w-full">
                <table className="w-full">
                  <tbody>
                    {
                      selectedUser?.levelUsers?.length ? 
                        selectedUser?.levelUsers?.map(item => (
                          <tr key={item?._id}>
                            <td className="font-semibold p-2 border text-nowrap text-center">
                              {item?.name} <span className="uppercase">({item?.roleName})</span>
                            </td>
                          </tr>
                        ))
                      : ''
                    }
                    <tr>
                      <td className="font-semibold p-2 border text-nowrap text-center">
                        {selectedUser?.userDetails?.name} <span className="uppercase">({selectedUser?.userDetails?.roleName})</span>
                      </td>
                    </tr>
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

export default UserHistoryModal