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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white p-2 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mt-0">
        {/* Close Icon */}
        <div className="bg-gray-200 p-3 rounded-t-lg flex justify-between items-center">
          {/* <div className="flex justify-between items-center border-b pb-3 mt-4"> */}
          <h2 className="text-gray-700 text-xl font-custom font-semibold">Toss odds</h2>
          {/* </div> */}
          <IoClose
            onClick={onCancel}
            className="cursor-pointer text-gray-700 text-2xl"
          />
        </div>

        {/* Edit Match Heading */}

        {/* Form */}
          {
          formData?.length > 0 ?

          formData?.sort((a,b)=>a.runnerName?.localeCompare(b?.runnerName))?.map((item) => {

            return (
              <div>
                <label className="block text-sm my-1 font-custom font-medium text-black">
                  {item?.runnerName}
                </label>
                <input
                  type="text"
                  value={item.odds}
                  onChange={(e)=>handleChange(e,item)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>)

          })
          :
          <div className='text-center font-bold'>
            Loading...
            </div>
        }

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
      </div>
    </div>
  )
}

export default TossModal
