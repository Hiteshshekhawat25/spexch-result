import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { getInstance, postInstance } from '../../Services/Newmatchapi';
import { toast } from 'react-toastify';

function TossModal({ match, onCancel }) {

  const [formData, setFormData] = useState([])

  const handleChange = (e,itm) => {
    let obj = formData.filter((item)=>item?.runnerName == itm?.runnerName)?.[0]
    let arr = formData.filter((item)=>item?.runnerName !== itm?.runnerName)?.[0]
    if (!isNaN(e.target.value) && (obj.runnerName == itm.runnerName)) {
      obj.odds = e.target.value
      console.log(obj.odds)
    
      setFormData([arr,obj].sort((a,b)=>a.runnerName?.localeCompare(b.runnerName)))
    }
  }

  const getTossMarket = async () => {
    try {
      const res = await getInstance(`/user/get-toss-market?matchId=${match?._id}`)
      console.log(res?.data?.data, 'resresres')
      let t1 = res?.data?.data?.filter((item) => item.runnerName == match?.match?.split(' v ')?.[0])
      let t2 = res?.data?.data?.filter((item) => item.runnerName !== match?.match?.split(' v ')?.[0])

      console.log({ t1, t2 }, 't1t2')
      setFormData(res?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getTossMarket()
  }, [])

  const handleSubmit = async () => {
    try {
      const res = await postInstance('/user/update-toss-market',{
      tossMarket : formData,
      matchId : match?._id
      }
    )
    console.log(res)
    toast?.success(res?.data?.message)
    getTossMarket()
    onCancel()
    } catch (error) {
      console.log(error)
    }
  }

  console.log(match, 'matchmatch')

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg sm:mt-6 mt-3 shadow-lg w-[96%] md:w-3/4 lg:w-1/2">
        <div className="flex justify-between items-center rounded-t-lg bg-gradient-blue text-white text-[15px] font-custom font-semibold w-full px-3 py-2">
          <h2>Toss odds</h2>
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-white text-2xl"
          />
        </div>
        <div className="sm:p-4 p-3 overflow-y-auto h-full">
          
          <div className='flex flex-col gap-2'>
            {
              formData?.length > 0 ?

              formData?.sort((a,b)=>a.runnerName?.localeCompare(b?.runnerName))?.map((item) => {

                return (
                  <div className='flex flex-col '>
                    <label className="block text-sm my-1 font-custom font-medium text-black">
                      {item?.runnerName}
                    </label>
                    <input
                      type="text"
                      value={item.odds}
                      onChange={(e)=>handleChange(e,item)}
                      className="w-full p-2 border border-gray-300 rounded-md outline-none"
                    />
                  </div>
                )
              })
              :
              <div className='text-center font-bold'>
                Loading...
              </div>
            }
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gradient-seablue font-semibold text-sm text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TossModal
