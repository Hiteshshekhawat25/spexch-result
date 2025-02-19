import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

function TossModal({match,onCancel}) {

    const [formData,setFormData] = useState({
        odd1 : 0,
        odd2 : 0
    })

    const handleChange = (e)=>{
        const { name , value } = e.target;
        if(!isNaN(value)){
            setFormData((pre)=>({...pre,[name] : value}))
        }
    }

    const handleSubmit =()=>{

    }

    console.log(match,'matchmatch')

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
            <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            
            <div>
                <label  className="block text-sm my-1 font-custom font-medium text-black">
                  {match?.match?.split(' v ')?.[0]} 
                </label>
                <input
                  type="text"
                  name="odd1"
                  value={formData.odd1}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div >
                <label  className="block text-sm my-1 font-custom font-medium text-black">
                {match?.match?.split(' v ')?.[1]}
                </label>
                <input
                  type="text"
                  name="odd2"
                  value={formData.odd2}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-lightblue text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default TossModal
